<?php
  include_once "./audiostreamerlib.php";

  //  AudioStreamer, www.audiostreamer.org
  //  Copyright (C) <2013>  <Lieven Rottiers>
  //
  //  This program is free software: you can redistribute it and/or modify
  //  it under the terms of the GNU General Public License as published by
  //  the Free Software Foundation, either version 3 of the License, or
  //  (at your option) any later version.
  //
  //  This program is distributed in the hope that it will be useful,
  //  but WITHOUT ANY WARRANTY; without even the implied warranty of
  //  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //  GNU General Public License for more details.
  //
  //  You should have received a copy of the GNU General Public License
  //  along with this program.  If not, see <http://www.gnu.org/licenses/>.

  function contentTypeHeader($extension) {
    if ($extension == 'mp3') {
      header("Content-Type: audio/mpeg"); 
    } else {
      header("Content-Type: audio/".$extension);         
    }
  }
  
  function rangeDownload($file, $extension) {
    //
    // Credits for byte-range support goes to:
    //   http://www.techstruggles.com/mp3-streaming-for-apple-iphone-with-php-readfile-file_get_contents-fail/
    //   http://www.thomthom.net/blog/2007/09/php-resumable-download-server/
    //
    $fp = @fopen($file, 'rb');

    $size   = filesize($file); // File size
    $length = $size;           // Content length
    $start  = 0;               // Start byte
    $end    = $size - 1;       // End byte
    // Now that we've gotten so far without errors we send the accept range header
    /* At the moment we only support single ranges.
     * Multiple ranges requires some more work to ensure it works correctly
     * and comply with the specifications: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
     *
     * Multirange support annouces itself with:
     * header('Accept-Ranges: bytes');
     *
     * Multirange content must be sent with multipart/byteranges mediatype,
     * (mediatype = mimetype)
     * as well as a boundry header to indicate the various chunks of data.
     */
    header("Accept-Ranges: 0-$length");
    contentTypeHeader($extension); 
    // header('Accept-Ranges: bytes');
    // multipart/byteranges
    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
    if (isset($_SERVER['HTTP_RANGE'])) {

      $c_start = $start;
      $c_end   = $end;
      // Extract the range string
      list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
      // Make sure the client hasn't sent us a multibyte range
      if (strpos($range, ',') !== false) {

        // (?) Shoud this be issued here, or should the first
        // range be used? Or should the header be ignored and
        // we output the whole content?
        header('HTTP/1.1 416 Requested Range Not Satisfiable');
        header("Content-Range: bytes $start-$end/$size");
        // (?) Echo some info to the client?
        exit;
      }
      // If the range starts with an '-' we start from the beginning
      // If not, we forward the file pointer
      // And make sure to get the end byte if spesified
      if ($range == '-') {

        // The n-number of the last bytes is requested
        $c_start = $size - substr($range, 1);
      }
      else {

        $range  = explode('-', $range);
        $c_start = $range[0];
        $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
      }
      /* Check the range and make sure it's treated according to the specs.
       * http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
       */
      // End bytes can not be larger than $end.
      $c_end = ($c_end > $end) ? $end : $c_end;
      // Validate the requested range and return an error if it's not correct.
      if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {

        header('HTTP/1.1 416 Requested Range Not Satisfiable');
        header("Content-Range: bytes $start-$end/$size");
        // (?) Echo some info to the client?
        exit;
      }
      $start  = $c_start;
      $end    = $c_end;
      $length = $end - $start + 1; // Calculate new content length
      fseek($fp, $start);
      header('HTTP/1.1 206 Partial Content');
    }
    // Notify the client the byte range we'll be outputting
    header("Content-Range: bytes $start-$end/$size");
    header("Content-Length: $length");

    // Start buffered download
    $buffer = 1024 * 8;
    while(!feof($fp) && ($p = ftell($fp)) <= $end) {

      if ($p + $buffer > $end) {

        // In case we're only outputtin a chunk, make sure we don't
        // read past the length
        $buffer = $end - $p + 1;
      }
      set_time_limit(0); // Reset time limit for big files
      echo fread($fp, $buffer);
      flush(); // Free up memory. Otherwise large files will trigger PHP's memory limit.
    }

    fclose($fp);

  }  
  
  //default time limit of 30 seconds is too short for listening to long songs
  set_time_limit(360);
  //
  $id = $_GET["id"];
  $resampling = $_SESSION["ind_resampling"];
  $bitrate = $_SESSION["bitrate"];
  $normalizing = $_SESSION["ind_normalizing"];
  $http_range = isset($_SERVER['HTTP_RANGE']) ? $_SERVER['HTTP_RANGE'] : '';
  $file = '';
  $extension = '';
  $filesize = 0;
  $cmd = '';
  
  try {
    global $sdb;
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

    $sql = "select path, length_seconds, 
                   ifnull(nullif(song_gain,''), '-6.00 db') as song_gain, 
                   ifnull(nullif(album_gain,''), '-6.00 db') as album_gain,
                   extension                   
            from music where id = ".$id;
    foreach ($dbh->query($sql) as $row) {
      $file = $row['path'];
      $extension = $row['extension'];
    }   
    
    //insert a record in the log table
    $dbh->beginTransaction();
    $sql =  
        "insert into log(user, event, date, ip, http_range, path, album_artist, artist, album, song, extension)
         select '".$_SESSION["username"]."', 'STREAM', '".date('Y/m/d H:i:s')."', '".$_SERVER['REMOTE_ADDR']."', '".$http_range."', path, album_artist, artist, album, song, extension
         from music
         where id = ".$id;
    $dbh->exec($sql);
    //keep only the 2000 most recent records    
    $sql = "delete from log where id not in (select id from log order by id desc limit 2000)";
    $dbh->exec($sql);
    $dbh->commit();   
    
    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    echo '<br/>'.$e->getMessage();
  }  
  
  if (file_exists($file)) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {    
      //We are on Windows
      $windows = '1';
    } else {
      $windows = '0';
    }
  
    if ($resampling == '1') {
      if ($windows == '1') {    
        //Windows
        //if ffmpeg.exe or lame.exe file not exists in root directory then no resmapling
        //change relative path to absolute path
        $ffmpeg = "../ffmpeg.exe";
        $lame = "../lame.exe";
        $ffmpeg = realpath($ffmpeg);
        $lame = realpath($lame);
        //
        if ((!file_exists($ffmpeg)) || (!file_exists($lame))) {
          $resampling = '0';
        }
        //enclose the paths by quotes (in case path contains spaces...)
        $ffmpeg = "\"".$ffmpeg."\"";
        $lame = "\"".$lame."\"";
        //
      } else {
        //Linux
        //if ffmpeg or lame are not found on system then no resampling
        $ffmpeg = trim(shell_exec('type -P ffmpeg'));
        $lame = trim(shell_exec('type -P lame'));
        if ((empty($ffmpeg)) || (empty($lame))) {
          $resampling = '0';
        }
        $ffmpeg = "ffmpeg";
        $lame = "lame";                
      }
    }
    if ($resampling == '1') {
      //resample the file and read back the results
            
      //-vol makes adjustment to volume, 256 means no change in volume
      if ($normalizing == '1') {
        //calculate gain percentage
        //
        //if no gain is found in database then the default is -6db
        $gain = pow(10,str_replace(" db","",$row['song_gain'])/20);
      }
      else {
        $gain = 1;
      }

      $cmd = $ffmpeg." -i \"".$file."\" -vol ".round(256*$gain)." -f wav - | ".$lame." -b ".$bitrate." --noreplaygain - -";
      
      header("Accept-Ranges: none");
      header("Content-Type: audio/mpeg");
      header("Cache-Control: no-cache");
      header('Pragma: no-cache');
      
      ob_clean();
      flush();

      passthru($cmd);

      exit;
    }
    else {
      //No resampling, nothing, just throw the audio file...
      
      if (isset($_SERVER['HTTP_RANGE']))  { 
        //byte-range support
        rangeDownload($file, $extension);
        exit;
      } 
      else {      
        contentTypeHeader($extension);
        header('Content-Length: ' . filesize($file));
        header('Cache-Control: no-cache');
        header('Pragma: no-cache');

        ob_clean();
        flush();
        readfile($file);
        exit;
      }
    }
  }
?>

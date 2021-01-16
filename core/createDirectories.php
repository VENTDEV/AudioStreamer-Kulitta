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

?>   
<!doctype html>
<html class="iframe-style">
<head>
<title>AudioStreamer create directories</title>

<script type="text/javascript" src="./app/js/jquery-1.11.0.min.js"></script> 
<script type="text/javascript" src="./app/js/jquery-ui-1.10.4.custom.min.js"></script> 
<script type="text/javascript" src="./app/js/jquery.cookie.js"></script>
<script type="text/javascript" src="./app/js/AudioStreamer.js"></script>

</head>
<body class="iframe-style"><div class="top-spacer"></div>

<?php 
  $time_start = microtime(true);
  //general variabels
  $dir = $_SESSION["music_path"];
  $tree = array(); 
  //
  echo '<br/>Create directory structure in database for path '.$dir.'<br/>';
  //
  // Initialize getID3 engine
  require_once('./getid3/getid3/getid3.php');     
  $PageEncoding = 'UTF-8';    
  $getID3 = new getID3;
  $getID3->setOption(array('encoding' => $PageEncoding));   
  //
  // Ignore user aborts and allow the script
  // to run forever
  ignore_user_abort(true);
  set_time_limit(0);
  
  function getDirectory($hdir, &$id, $hparent_id, &$sql, $hlevel, PDO $dbh){       
    echo str_pad('<script type="text/javascript">$("#loopFolder").empty().append("'.utf8_encode_AS($hdir).'");</script>',4096);
    flush();
    // Directories to ignore when listing output. Many hosts 
    // will deny PHP access to the cgi-bin. 
    $ignore = array( 'cgi-bin', '.', '..' ); 
    $hlevel = $hlevel + 1;
    
    // Open the directory to the handle $dh 
    $dh = opendir( $hdir ); 

    if ( (false !== $dh) && (file_exists($hdir)) ) {    
      // Loop through the directory 
      while( false !== ( $file = readdir( $dh ) ) ){ 
        // Check that this file is not to be ignored 
        if( !in_array( $file, $ignore ) ){ 
          $id++; //counting 
          // Its a directory, so we need to keep reading down...     
          if( is_dir( "$hdir/$file" ) ){ 
            $sql =  
              "insert into music_temp(id, parent_id, path, filename, 
                                      created, is_dir, extension, level, file_modified, ind_getid3)
              values (".$id.",".$hparent_id.",'".str_replace("'", "''", $hdir."/".$file)."','".str_replace("'", "''", $file)."','"
              .date('Y/m/d H:i:s')."',1,'dir',".$hlevel.",'".date('Y/m/d H:i:s',filemtime($hdir.'/'.$file))."',1);";
            $dbh->exec($sql);
            
            getDirectory( $hdir.'/'.$file, $id, $id, $sql, $hlevel, $dbh); 
          }
          else {
            //find extension of the file
            $ext = '';
            if (strpos($file,'.') !== false) {
              $ext = strtolower(substr(strrchr($file, "."), 1));
            }
            
            $sql = 
              "insert into music_temp(id, parent_id, path, filename, 
                                      created, is_dir, extension, level, file_modified, ind_getid3)
              values (".$id.",".$hparent_id.",'".str_replace("'", "''", $hdir."/".$file)."','".str_replace("'", "''", $file)."','"
                       .date('Y/m/d H:i:s')."',0,'".$ext."',".$hlevel.",'".date('Y/m/d H:i:s',filemtime($hdir.'/'.$file))."',1);";
            $dbh->exec($sql);
      
            //if file is named "AudioStreamer.txt" the contents are placed in the field "link"
            //this will be used to place a link to the respective artist (concerning demo music and licences)
            if ($file=='AudioStreamer.txt') {
              $link = file_get_contents($hdir."/".$file);  
              $sql = "update music_temp set link = '".str_replace("'", "''", $link)."' where id = ".$hparent_id;
              $dbh->exec($sql);
            }              
          }
        }     
      } 
    }
    else{
      echo '<br/>Directory doesn\'t exist or you don\'t have read permissions.';
    }
    // Close the directory handle 
    closedir( $dh ); 
  }//end of function 
   
  function getID3Tags(&$sql, &$getID3, PDO $dbh, &$audioformats){       
    $sql = '';
    //looping inserted folder structure for music files
    $sqlFolder = "select id, path from music where ifnull(extension,'dummy') in (".$audioformats.") and ind_getid3 = 1";
    //
    $cnt = 0;
    $pct = 0;
    foreach ($dbh->query("SELECT COUNT(*) as count FROM (".$sqlFolder.") ") as $row) {
      $numRows = $row['count'];
    }      
    //    
    foreach ($dbh->query($sqlFolder) as $row) {
      $file = $row['path'];
      $cnt = $cnt + 1;
      $pct = round(($cnt/$numRows)*100);
      //
      echo str_pad('<script type="text/javascript">$("#loopID3").empty().append("'.$pct.'% : '.$cnt.' / '.$numRows.' : '.utf8_encode_AS($file).'");</script>',4096);  
      flush();

      $artist = '';
      $album = '';
      $album_artist = '';
      $title = '';
      $genre = '';
      $track = '';
      $length = '';
      $length_seconds = '';
      $song_gain = '';
      $album_gain = '';

      //get the id3 tags
      $ThisFileInfo = $getID3->analyze($file);   
      getid3_lib::CopyTagsToComments($ThisFileInfo);
      
      if (isset($ThisFileInfo['comments']['artist'][0])) {
        $artist = $ThisFileInfo['comments']['artist'][0];
      };   
      if (isset($ThisFileInfo['comments']['album'][0])) {
        $album = $ThisFileInfo['comments']['album'][0];
      };   
      if (isset($ThisFileInfo['comments']['band'][0])) {
        $album_artist = $ThisFileInfo['comments']['band'][0];
      };   
      if (isset($ThisFileInfo['comments']['album_artist'][0])) {
        $album_artist = $ThisFileInfo['comments']['album_artist'][0];
      };   
      if (isset($ThisFileInfo['comments']['title'][0])) {
        $title = $ThisFileInfo['comments']['title'][0];
      };   
      if (isset($ThisFileInfo['comments']['genre'][0])) {
        $genre = $ThisFileInfo['comments']['genre'][0];
      };   
      if (isset($ThisFileInfo['comments']['track'][0])) {
        $track = $ThisFileInfo['comments']['track'][0];
      };   
      if (isset($ThisFileInfo['playtime_string'])) {
        $length = $ThisFileInfo['playtime_string'];
      };   
      if (isset($ThisFileInfo['playtime_seconds'])) {
        $length_seconds = $ThisFileInfo['playtime_seconds'];
      };   
      //fetching replaygain info
      //if these replaygain values do not exist, try other tags (m4a)
      if (isset($ThisFileInfo['replay_gain']['track']['adjustment'])) {
        $song_gain = $ThisFileInfo['replay_gain']['track']['adjustment'];
      } else if (isset($ThisFileInfo['comments']['replaygain_track_gain'][0])) {
        $song_gain = $ThisFileInfo['comments']['replaygain_track_gain'][0];
      };   
      if (isset($ThisFileInfo['replay_gain']['album']['adjustment'])) {
        $album_gain = $ThisFileInfo['replay_gain']['album']['adjustment'];
      } else if (isset($ThisFileInfo['comments']['replaygain_album_gain'][0])) {
        $album_gain = $ThisFileInfo['comments']['replaygain_album_gain'][0];
      };   
      
//      if (isset($ThisFileInfo['comments']['text'])) {
//        foreach ($ThisFileInfo['comments']['text'] as $text) {
//          if (strtolower(substr($text,-3)) == ' db') {
//            if ($song_gain == '') {
//              $song_gain = $text;
//            }
//            else {
//              $album_gain = $text;
//            }
//          }
//        }
//      }

      $sql =  
        "update music
          set album_artist = '".str_replace("'", "''", $album_artist)."', 
              artist = '".str_replace("'", "''", $artist)."', 
              album = '".str_replace("'", "''", $album)."', 
              song = '".str_replace("'", "''", $title)."', 
              genre = '".str_replace("'", "''", $genre)."', 
              track = '".str_replace("'", "''", $track)."', 
              length = '".str_replace("'", "''", $length)."',
              length_seconds = '".str_replace("'", "''", $length_seconds)."',
              song_gain = '".str_replace("'", "''", $song_gain)."',
              album_gain = '".str_replace("'", "''", $album_gain)."'
          where id = ".$row['id'].";";
      $dbh->exec($sql);
    }
  }//end of function 

   //connect to SQLite database  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);     
       
    $id=0;
    $parent_id=0;
    $level=0;

    $dbh->beginTransaction();
    echo '<br/>Recursive looping of directory structure:';
    echo str_pad('<br/><span id="loopFolder" style="padding-left:10px">',4096);
    flush();
    $subtime_start = microtime(true);
    //create temp table music_temp
    $dbh->exec("create temp table music_temp as select * from music where 0=1");
    //
    $dir = preg_replace('/\;$/', '', $dir); //Remove semicolon at end if exists
    $array = explode(';', $dir); //split string into array seperated by ';'
    foreach($array as $dir) //loop over values
    {
      getDirectory($dir, $id, $parent_id, $sql, $level, $dbh);
    }
    //
    $subtime_end = microtime(true);
    $subtime = $subtime_end - $subtime_start;
    echo '</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(task completed in : '.number_format(($subtime), 0, '.', '').' seconds = '.number_format(($subtime/60), 0, '.', '').' minute(s))';
    //echo $sql;   
    $dbh->commit();

    //
    $dbh->beginTransaction();
    if ($_GET["ind_append"] == '1') {
      //if in append mode then get all unchanged getid3 file info and copy to temp table
      //and reset the getid3 flag
      echo '<br/><br/>Copying unchanged id3 tags';
      flush();
      $subtime_start = microtime(true);
      //create index in music_temp.id
      $sql = "create unique index music_temp_id on music_temp (id);";
      $dbh->exec($sql);
      //
      $sqlLoop = "select a.*, b.id as id_temp
                  from music a,
                       music_temp b              
                  where ifnull(a.extension,'dummy') in (".$audioformats.")
                    and a.path = b.path
                    and a.file_modified = b.file_modified
                 ";
      foreach ($dbh->query($sqlLoop) as $row) {
        $sql =  
          "update music_temp
            set album_artist = '".str_replace("'", "''", $row['album_artist'])."', 
                artist = '".str_replace("'", "''", $row['artist'])."', 
                album = '".str_replace("'", "''", $row['album'])."', 
                song = '".str_replace("'", "''", $row['song'])."', 
                genre = '".str_replace("'", "''", $row['genre'])."', 
                track = '".str_replace("'", "''", $row['track'])."', 
                length = '".str_replace("'", "''", $row['length'])."',
                length_seconds = '".str_replace("'", "''", $row['length_seconds'])."',
                song_gain = '".str_replace("'", "''", $row['song_gain'])."',
                album_gain = '".str_replace("'", "''", $row['album_gain'])."',
                ind_getid3 = 0,
                link = '".str_replace("'", "''", $row['link'])."'
            where id = ".$row['id_temp'].";";
        $dbh->exec($sql);
      }      
      $subtime_end = microtime(true);
      $subtime = $subtime_end - $subtime_start;
      echo '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(task completed in : '.number_format(($subtime), 0, '.', '').' seconds = '.number_format(($subtime/60), 0, '.', '').' minute(s))';
    }
    echo '<br/><br/>Deleting previous data.';
    $dbh->exec("delete from music");
    $dbh->exec("delete from genre");
    echo '<br/>Inserting new data.';
    $dbh->exec("insert into music select * from music_temp");
    $dbh->commit();  
    
    //only get id3 tags if option is enabled
    if ($_SESSION["ind_id3_tags"] == '1') {
      $dbh->beginTransaction();
      echo '<br/><br/>Looping directory structure and retrieving ID3 tags';
      echo str_pad('<br/><span id="loopID3" style="padding-left:10px">',4096);
      flush();
      $subtime_start = microtime(true);
      getID3Tags($sql, $getID3, $dbh, $audioformats);
      $subtime_end = microtime(true);
      $subtime = $subtime_end - $subtime_start;
      echo '</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(task completed in : '.number_format(($subtime), 0, '.', '').' seconds = '.number_format(($subtime/60), 0, '.', '').' minute(s))';
      //echo $sql;
      $dbh->commit();
      
      $dbh->beginTransaction();
      echo '<br/>Re-inserting genres.';
      $dbh->exec("insert into genre(genre) select distinct genre from music where nullif(genre,'') is not null");
      $dbh->commit();
    }
    
    //vacuum the database
    echo '<br/>Vacuum the database.';
    flush();
    $dbh->exec("vacuum;");
  
    //close connection
    $dbh = null;
    
    echo '<br/><br/>Directory structure (re)created succesfully.';  
    echo '<br/>Please refresh to see the changes.';
    echo '<br/><button type="button" onclick="parent.location.reload()">Refresh</button>';
  }
  catch(PDOException $e)
  {
    $dbh->rollBack();
    $dbh = null;
    echo '<br/>'.$e->getMessage();
  }  
  
  //
  $time_end = microtime(true);
  $time = $time_end - $time_start;
  echo '<br/>(total task time : '.number_format($time, 0, '.', '').' seconds = '.number_format(($time/60), 0, '.', '').' minute(s))<br/><br/>';
?> 
</body>
</html>

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
	
	
  $id = $_GET["id"];
  $resize = $_GET["resize"];
  $output = '';
  $mime = '';
  $data = '';
  $file = '';  
  $dummyPicture = './app/img/dummyPicture.gif';
  
  // Initialize getID3 engine
  require_once('./getid3/getid3/getid3.php');    
  $PageEncoding = 'UTF-8';    
  $getID3 = new getID3;
  $getID3->setOption(array('encoding' => $PageEncoding));

  try {
    //global $sdb;
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    
    $sql = "select path, parent_id, is_dir from music where id = ".$id;
    foreach ($dbh->query($sql) as $row) {
      $file = $row['path'];
    }   
    
    if ($row['is_dir'] == 1) {
      $file = "";
      $sql = "select path, parent_id, is_dir from music where extension in(".$audioformats.") and parent_id = ".$id." limit 1";
      foreach ($dbh->query($sql) as $row) {
        $file = $row['path'];
      }   
    }
    
    if (file_exists($file)) {   
      $ThisFileInfo = $getID3->analyze($file);   
      getid3_lib::CopyTagsToComments($ThisFileInfo);
      
      if (isset($ThisFileInfo['comments']['picture']['0']['image_mime'])) {
        $mime = $ThisFileInfo['comments']['picture']['0']['image_mime'];
      }
      else{
        $mime = 'image/jpeg'; 
      }
        
      if (isset($ThisFileInfo['comments']['picture']['0']['data'])) {
        $data = $ThisFileInfo['comments']['picture']['0']['data'];
      }
      else {
        //no image in tags, fetch 'folder.jpg' image from directory
        $sql = "select path from music where parent_id = ".$row['parent_id']." and extension in('jpg') and lower(filename) in ('folder.jpg','front.jpg')";
        foreach ($dbh->query($sql) as $row) {
          $handle = fopen($row['path'], "rb");
          $data = fread($handle, filesize($row['path']));
          fclose($handle);          
        }
      }
    }
      
    //if no album cover was found then dummy picture of 1 pixel is sent...
    if (empty($data)) {
      $handle = fopen($dummyPicture, "rb");
      $data = fread($handle, filesize($dummyPicture));
      fclose($handle);   
      //no resizing on the 1 pixel dummy picture
      $resize=0;
    }

    if ($resize == '1') {
      //album covers are resized
      $image = imagecreatefromstring($data);
      $width = imagesx($image);
      $height = imagesy($image);

      $newwidth = "100";
      $newheight = "100";
    
      //Load
      $thumb = imagecreatetruecolor($newwidth, $newheight);
    
      //Resize
      imagecopyresampled($thumb, $image, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

      //Output the image
      $mime = "image/jpeg";
      header("Content-Type: " . $mime); 
      header('Expires: 0');
      header('Cache-Control: max-age=3600, must-revalidate');
      header('Pragma: public');    
      imagejpeg($thumb);

      // Free up memory
      imagedestroy($image);
      imagedestroy($thumb);
    }
    else {
      //Send Cover
      //header('Content-Transfer-Encoding: binary');
      header("Content-Type: " . $mime); 
      header('Expires: 0');
      header('Cache-Control: max-age=3600, must-revalidate');
      header('Pragma: public');    
      echo $data;
    }  
    
    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  
  
  //echo $output;
  
  ?>
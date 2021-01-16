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
  $output = '';
  
  try {
    global $sdb;
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

    //fetch details of song
    $sql = "select * from music where id = ".$id;
    $output = $output.'<div class="top-spacer"></div>';
    $output = $output.'<table class="song-detail">';
    foreach ($dbh->query($sql) as $row) {
      $output = $output.'<tr><td>Album artist</td><td>'.htmlspecialchars($row['album_artist']).'</td></tr>';
      $output = $output.'<tr><td>Artist</td><td>'.htmlspecialchars($row['artist']).'</td></tr>';
      $output = $output.'<tr><td>Album</td><td>'.htmlspecialchars($row['album']).'</td></tr>';
      $output = $output.'<tr><td>Song</td><td>'.htmlspecialchars($row['song']).'</td></tr>';
      $output = $output.'<tr><td>Track</td><td>'.$row['track'].'</td></tr>';
      $output = $output.'<tr><td>Length</td><td>'.$row['length'].'</td></tr>';
      $output = $output.'<tr><td>Genre</td><td>'.htmlspecialchars($row['genre']).'</td></tr>';
      $output = $output.'<tr><td>Path</td><td>'.utf8_encode_AS($row['path']).'</td></tr>';
      $output = $output.'<tr><td>Created</td><td>'.$row['created'].'</td></tr>';
      $output = $output.'<tr><td>File modified</td><td>'.$row['file_modified'].'</td></tr>';
      $output = $output.'<tr><td>Seconds</td><td>'.$row['length_seconds'].'</td></tr>';
      $output = $output.'<tr><td>Track gain</td><td>'.$row['song_gain'].'</td></tr>';
      $output = $output.'<tr><td>Album gain</td><td>'.$row['album_gain'].'</td></tr>';
    }   
    $output = $output.'</table>';
    //$output = $output.'<img class="song-detail-cover" src="/getCover.php?id='.$id.'">';
    
    $output = $output.'<br /><div class="getID3" onClick="getID3('.$id.')"><div>getID3</div></div><div id="getID3"></div>';
    
    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br />'.$e->getMessage();
  }  

  echo $output;
?>

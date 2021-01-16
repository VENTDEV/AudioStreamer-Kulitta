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

  $output = '';
  $covers = '';
  $artist_dir = '';
  $id = $_GET["id"];
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);     

    //possible to add/play all
    $sql = "select id, filename, parent_id, link from music where id=".$id;
    foreach ($dbh->query($sql) as $row) {
      $artist_dir = utf8_encode_AS($row['filename']);
      $output = $output.'<ul id="directory"><li class="directory"><div class="add" onClick="addDirectories('.$row['id'].')"><div>add</div></div>'
                       .'<div class="play" onClick="clearPlaylist();addDirectories('.$row['id'].')"><div>play</div></div>'
                       .'<div class="action" onClick="actionWrap(this)"><div>action</div></div>'
                       .'<div>'.$artist_dir.'</div>';
      //if link field is not empty then show the link
      if (!empty($row['link'])) {
        //$output = $output.'<div class="license_link">'.utf8_encode_AS($row['link']).'</div>';
        $output = $output.'<div class="license_link">'.mb_convert_encoding($row['link'],'UTF-8',mb_detect_encoding($row['link'],['UTF-8','ISO-8859-1'])).'</div>';
      }      
      $output = $output.'</li>';
                       
      //$covers = $covers.'<img class="cover-album" src="./getCover.php?id='.$id.'&resize=1">';
      $covers = $covers.'<span href="./getCover.php?id='.$id.'&resize=0">'.
                        '<img class="cover-album" src="./getCover.php?id='.$id.'&resize=1" onClick="showImage(this)" title="zoom"></span>';
    }

    //show master to go back one level
    $sql = "select id, filename from music where id=".$row['parent_id'];
    foreach ($dbh->query($sql) as $row) {
       $output = '<div class="masterDirectory"><a href="#" onClick="getDirectory('.$row['id'].')"><div class="back"><div>show</div></div>'.utf8_encode_AS($row['filename']).'</a></div>'.$output;
    }

    $sql = "select id, filename, is_dir, song, album, artist, length, length_seconds from music where parent_id=".$id." and ifnull(extension,'dir') in ('dir',".$audioformats.") order by track, path collate nocase";
    foreach ($dbh->query($sql) as $row) {
      if ($row['is_dir'] == 1) {
        $output = $output.'<li><div class="add" onClick="addDirectories('.$row['id'].')"><div>add</div></div>'
                         .'<div class="play" onClick="clearPlaylist();addDirectories('.$row['id'].')"><div>play</div></div>'
                         .'<div class="action" onClick="actionWrap(this)"><div>action</div></div>'
                         .'<a href="#" onClick="getDirectory('.$row['id'].')" title="'.utf8_encode_AS($row['filename']).'">'.utf8_encode_AS($row['filename']).'</a></li>';
        $covers = $covers.'<a href="#" onClick="getDirectory('.$row['id'].')" title="'.$artist_dir.' - '.utf8_encode_AS($row['filename']).'"><img class="cover-album" src="./getCover.php?id='.$row['id'].'&resize=1"></a>';
      }
      else {
        if (!empty($row['song'])) {
          $playlist = $row['artist']." - ".$row['album']." - ".$row['song']." (".$row['length'].")";
          $playlist = htmlspecialchars($playlist);
          $song = $row['artist']." - ".$row['song']." (".$row['length'].")";
          $song = htmlspecialchars($song);
        }
        else {
          $playlist = utf8_encode_AS($row['filename']);
          $song = utf8_encode_AS($row['filename']);        
        }
        
        $output = $output.'<li><div class="add" onClick="addSong('.$row['id'].')"><div>add</div></div>'
                         .'<div class="play" onClick="clearPlaylist();addSong('.$row['id'].')"><div>play</div></div>'
                         .'<div class="info" onClick="getSongDetails('.$row['id'].')" title="'.$song.'"><div>info</div></div>'
                         .'<div class="action" onClick="actionWrap(this)"><div>action</div></div>'
                         .'<span>'.$song.'</span></li>';
      }
    }   
    $output = '<div class="top-spacer"></div>'.$output. '</ul>';
    $output = $output.$covers;
    
    //close connection
    $dbh = null;    
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  

  echo $output;
  //echo utf8_encode_AS($output);
  ?> 

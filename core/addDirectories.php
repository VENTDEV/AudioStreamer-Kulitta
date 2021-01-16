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
  $id = $_GET["id"];
  
  function addDirectory($hid, &$sdb, &$audioformats) {
    try {
      $dbh = new PDO("sqlite:".$sdb);
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);     
      $houtput = '';
      
      $sql = "select id, filename, is_dir, artist, album, song, length, length_seconds, ifnull(song_gain, album_gain) as replaygain from music where parent_id=".$hid." and ifnull(extension,'dir') in ('dir',".$audioformats.") order by track, path collate nocase";
      foreach ($dbh->query($sql) as $row) {
        if ($row['is_dir'] == 1) {
          $houtput = $houtput.addDirectory($row['id'], $sdb, $audioformats);
        }
        else {
          if (!empty($row['song'])) {
            $playlist = $row['artist']." - ".$row['album']." - ".$row['song']." (".$row['length'].")";
            $playlist = htmlspecialchars($playlist);
          }
          else {
            $playlist = utf8_encode_AS($row['filename']);
          }
          $houtput = $houtput.'<li><div onClick="deleteSong(this)" class="delete"><div>delete</div></div>'
                             .'<div title="move up-down" class="move"><div>move</div></div>'
                             .'<div class="action" onClick="actionWrap(this)"><div>action</div></div>'
                             .'<a href="#" onClick="playSong(this)" songId="'.$row['id'].'" mp3="./streammp3.php?PHPSESSID='.session_id().'&id='.$row['id'].'" dur="'.$row['length_seconds'].'" durformat="'.$row['length'].'" title="'.$playlist.'" replaygain="'.$row['replaygain'].'">'.$playlist.'</a></li>';      
        }
      }   
      //close connection
      $dbh = null;    
      
      return $houtput;
    }
    catch(PDOException $e)
    {
      $output = $output.'<br/>'.$e->getMessage();
    }  
  }
  
  $output = addDirectory($id, $sdb, $audioformats);

  echo $output;
  //echo utf8_encode_AS($output);
  ?> 

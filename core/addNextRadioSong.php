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
  //in case of resampling the current song, this takes a little longer
  set_time_limit(60);
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);     
    
    $sql = "select b.id, b.filename, b.artist, b.album, b.song, b.length, b.length_seconds, ifnull(b.song_gain, b.album_gain) as replaygain
            from music a,
                 music b
            where a.id=".$id." 
           ";

    if (strpos(",".$_SESSION["genre_radio"]."," , ",ALL,") === false){
      if ($_SESSION["genre_radio"] == "CURRENT"){
        //only current playing genre
        $sql = $sql."
                and ifnull(a.genre,'0') = ifnull(b.genre,'0')";
      } else {
        //one of the chosen genres
        $sql = $sql."  and ( b.genre in (select x.genre from genre x where x.id in (".str_replace("CURRENT,","",$_SESSION["genre_radio"]).")) ";
        
        //and (or current playing genre)
        if (strpos(",".$_SESSION["genre_radio"]."," , ",CURRENT,") !== false){
          $sql = $sql."
                  or ifnull(a.genre,'0') = ifnull(b.genre,'0')";
        }
        $sql = $sql."  ) ";
      }
    }
           
    $sql = $sql."
              and ifnull(b.extension,'dir') in (".$audioformats.")
            order by random()||b.id
            limit 1";
    
    foreach ($dbh->query($sql) as $row) {
      if (!empty($row['song'])) {
        $playlist = $row['artist']." - ".$row['album']." - ".$row['song']." (".$row['length'].")";
        $playlist = htmlspecialchars($playlist);
      }
      else {
        $playlist = utf8_encode_AS($row['filename']);
      }
      $output = $output.'<li><div onClick="deleteSong(this)" class="delete"><div>delete</div></div>'
                       .'<div title="move up-down" class="move"><div>move</div></div>'
                       .'<div class="action" onClick="actionWrap(this)"><div>action</div></div>'
                       .'<a href="#" onClick="playSong(this)" songId="'.$row['id'].'" mp3="./streammp3.php?PHPSESSID='.session_id().'&id='.$row['id'].'" dur="'.$row['length_seconds'].'" durformat="'.$row['length'].'" title="'.$playlist.'" replaygain="'.$row['replaygain'].'">'.$playlist.'</a></li>';      
    }   
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

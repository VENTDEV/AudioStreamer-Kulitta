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
  $genre = $_GET["genre"];
  $artist = $_GET["artist"];
  $album = $_GET["album"];
  $song = $_GET["song"];
  $path = $_GET["path"];
  $cnt = 0;
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 

    if ($genre == "undefined") {
      $genre = '';
    }
    if ($artist == "undefined") {
      $artist = '';
    }
    if ($album == "undefined") {
      $album = '';
    }
    if ($song == "undefined") {
      $song = '';
    }
    if ($path == "undefined") {
      $path = '';
    }
    
    $sql = "select a.id, a.parent_id, a.artist, a.album, a.song, a.path 
            from music a
            where ifnull(a.extension,'dir') in (".$audioformats.") ";
            

    if ($artist == "" && $album == "" && $song == "" && $path == "" && $genre == "") {
      $sql = $sql."
              and 1=2";
    }
    if ($genre != "") {
      $sql = $sql."
              and lower(a.genre) like '%'||lower('".$genre."')||'%'";
    }
    if ($artist != "") {
      $sql = $sql."
              and lower(a.artist) like '%'||lower('".$artist."')||'%'";
    }
    if ($album != "") {
      $sql = $sql."
              and lower(a.album) like '%'||lower('".$album."')||'%'";
    }
    if ($song!= "") {
      $sql = $sql."
              and lower(a.song) like '%'||lower('".$song."')||'%'";
    }
    if ($path != "") {
      $sql = $sql."
              and lower(a.path) like '%'||lower('".$path."')||'%'";
    }

    $sql = $sql."
      order by a.path collate nocase";

    //echo '<br/>'.$sql;
    $output = $output. '<ul id="treeSearch">';
    foreach ($dbh->query($sql) as $row) {
      $output = $output.'<li><a href="#" onClick="getDirectory('.$row['parent_id'].')" title="'.
                             utf8_encode_AS($row['path']).'">'.
                             htmlspecialchars($row['artist'].' - '.$row['album'].' - '.$row['song']).'</a></li>';
      $cnt = $cnt + 1;
    }   
    $output = $output. '</ul>';
   
    $output = '<div class="top-spacer"></div>'.
              'Searching shows a list of songs.'.
              '<br />(Fill in at least one field - artist, album, song, path or genre.)'.
              '<form action="" id="search-form" onSubmit="getSearch($(\'#api14 #genre\').val(),$(\'#api14 #artist\').val(),$(\'#api14 #album\').val(),$(\'#api14 #song\').val(),$(\'#api14 #path\').val(),$(\'#api14 #genre\').val());return false;">'.
              '<input type="text" id="artist" name="artist" placeholder="search in artist" value="'.$artist.'" />'.
              '<input type="text" id="album" name="album" placeholder="search in album" value="'.$album.'" />'.
              '<input type="text" id="song" name="song" placeholder="search in song" value="'.$song.'" />'.
              '<input type="text" id="path" name="path" placeholder="search in path" value="'.$path.'" />'.
              '<input type="text" id="genre" name="genre" placeholder="search in genre" value="'.$genre.'" />'.
              '<div class="search" onClick="getSearch($(\'#api14 #genre\').val(),$(\'#api14 #artist\').val(),$(\'#api14 #album\').val(),$(\'#api14 #song\').val(),$(\'#api14 #path\').val(),$(\'#api14 #genre\').val())"><div>search</div></div>'.
              '<div class="total">(Total songs: '.$cnt.')</div>'.
              '</form>'.
              $output;
     
    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  

  echo $output;

?> 

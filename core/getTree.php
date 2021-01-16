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

  $cnt = 0;
  
  try {
    global $sdb;
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    $output = '';
    
    $output = $output.'<ul id="tree">';
    //$sql = "select id, filename from music where level <= 1 and is_dir = 1 order by path collate nocase";
    $sql = "select id, filename from music where level <= 1 and is_dir = 1 order by filename collate nocase";
    foreach ($dbh->query($sql) as $row) {
      $output = $output.'<li><a href="#" onClick="getDirectory('.$row['id'].')" title="'.utf8_encode_AS($row['filename']).'">'.utf8_encode_AS($row['filename']).'</a></li>';
      $cnt = $cnt + 1;
    }   
    $output = $output. '</ul>';
    //include totals
    $output = '<div class="top-spacer"></div>'.
              '<input type="text" class="scrollfield" name="scrollfield" placeholder="scroll to" onKeyUp="scrollFocusWrap(this)" onClick="$(\'#scrollfield\').select()" value="">'. 
              '<div class="total">(Total folders: '.$cnt.')</div>'.$output;
    
    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  

  echo $output;

?> 
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
  $sort = $_GET["sort"];
  $cnt = 0;
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 

    if ($genre == "undefined") {
      $genre = 'all genres';
    }
    if ($sort == "undefined") {
      //$sort = 'a.path collate nocase';
      $sort = 'b.filename collate nocase';
    }
    else {
      $sort = 'a.file_modified desc';
    }
    
    $output = $output. '<ul id="tree">';
    $sql = "select a.id, a.filename as album, b.filename as artist, a.file_modified 
            from music a,
                 music b
            where a.parent_id = b.id
              and a.is_dir = 1";
            
    if ($genre != "all genres") {
      $sql = $sql."
              and exists (select 1
                          from music z
                          where a.id = z.parent_id 
                            and z.genre = '".$genre."')";
    }

    if ($sort != "") {
      $sql = $sql."
              order by ".$sort;
    }

    //echo '<br/>'.$sql;
    foreach ($dbh->query($sql) as $row) {
      $output = $output.'<li><a href="#" onClick="getDirectory('.$row['id'].')"';
      $output = $output.' title="'.utf8_encode_AS($row['artist']).' - '.utf8_encode_AS($row['album']);
      if ($sort != ""){
        $output = $output.' ('.$row['file_modified'].')';
      }
      $output = $output.'">'.utf8_encode_AS($row['artist']).' - '.utf8_encode_AS($row['album']).'</a></li>';
      $cnt = $cnt + 1;
    }   
    $output = $output. '</ul>';

    //create select list
    $select_list = '<select id="genre" name="genre" onChange="getAlbums($(\'#api7 #genre\').val(),$(\'#api7 #sort:checked\').val())"><option>all genres</option>';
    $sql = "select genre from genre order by genre collate nocase";
    foreach ($dbh->query($sql) as $row) {
      if ($genre==$row['genre']) {
        $select_list = $select_list.'<option selected>'.$row['genre'].'</option>';
      }
      else{
        $select_list = $select_list.'<option>'.$row['genre'].'</option>';
      }
    }   
    $select_list = $select_list. '</select>';
    
    //create input sort
    $input_sort = '<input type="checkbox" id="sort" name="sort" onClick="getAlbums($(\'#api7 #genre\').val(),$(\'#api7 #sort:checked\').val())" value="modified" title="Sort descending on date modified" ';
    if ($sort == "a.file_modified desc") {
      $input_sort = $input_sort.' checked';    
    }  
    $input_sort = $input_sort.'/>';    

    //include totals
    $output = '<div class="top-spacer"></div>'.
              '<input type="text" class="scrollfield" name="scrollfield" placeholder="scroll to" onKeyUp="scrollFocusWrap(this)" onClick="$(\'#scrollfield\').select()" value="">'.     
              '<form action="" id="search-form" onSubmit="getAlbums($(\'#api7 #genre\').val(),$(\'#api7 #sort:checked\').val());return false;">'.
              $select_list.
              $input_sort.
              '<div class="total">(Total albums: '.$cnt.')</div>'.
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
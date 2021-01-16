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

  $pmode = $_GET["pmode"];
  $search = $_GET["search"];
  $output = '';
  $cnt = 0;
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 

    if ($search == "undefined") {
      $search = '';
    }
   
    $output = $output. '<div class="top-spacer"></div>
      <div id="logging">
      Logging
      <div class="description">
      All HTTP requests to the streaming engine are logged.
      <br/>(Only the 2000 most recent records are kept.)
      </div>
      <br/><input type="text" id="search" name="search" placeholder="search in logging" value="'.$search.'" />
      <div class="search" onClick="manageLogging(1,\'search\',$(\'#api15 #search\').val())"><div>search</div></div>
      ';
   
    $sql = "select user, event, date, ip, http_range, path, album_artist, artist, album, song, extension
            from log ";

    if ($pmode != "search") {
      $sql = $sql."            
              where 1=2 ";
    } else {
      $sql = $sql."            
              where 1=1 ";
    }
    if (($pmode == "search") && ($search != "undefined") && ($search != "")) {
      $sql = $sql."            
              and lower(user||'#'||date||'#'||ip||'#'||ip||'#'||path||'#'||extension) like '%'||lower('".$search."')||'%'";
    }
                           
    $sql = $sql."
            order by id desc ";
            
    if ($pmode == "search") {    
      //headers
      $output = $output.'<table class="logging"><tr><th>date</th><th>IP</th><th>HTTP range</th><th>user</th><th>path</th><th>ext</th></tr>';
      //rows
      foreach ($dbh->query($sql) as $row) {
        //create rows
        $output = $output.
          '<tr>'.
            '<td row-title="date">'.$row['date'].'</td>'.
            '<td row-title="IP">'.$row['ip'].'</td>'.
            '<td row-title="HTTP range">'.$row['http_range'].'&nbsp;</td>'.
            '<td row-title="user">'.$row['user'].'</td>'.
            '<td row-title="path">'.utf8_encode_AS($row['path']).'</td>'.
            //'<td>'.$row['album_artist'].'</td>'.
            //'<td>'.$row['artist'].'</td>'.
            //'<td>'.$row['album'].'</td>'.
            //'<td>'.$row['song'].'</td>'.
            '<td row-title="ext">'.$row['extension'].'</td>'.
          '</tr>';
        $cnt = $cnt + 1;
      }   
      
      $output = $output.'</table></div><div>(Total records: '.$cnt.')</div>';
    }

    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  
  
  echo $output;
?>
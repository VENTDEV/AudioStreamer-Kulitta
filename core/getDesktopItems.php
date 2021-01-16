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
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 
    
    $output = $output.
      '<root>
          <status>SUCCESS</status>'.
          '<message>Desktop recalled</message>';

    $sql = "select b.folder
            from desktop a,
                 theme b
            where a.id = ".$_SESSION["desktopid"]."
              and a.theme = b.id";

    foreach ($dbh->query($sql) as $row) {
      //check if theme.css file exists
      //if not revert to the error.css
      if (file_exists('./app/themes/'.$row["folder"].'/theme.css')) {
        $output = $output.
          '<css>./app/themes/'.$row["folder"].'/theme.css</css>';        
        //check if theme.js file exists
        if (file_exists('./app/themes/'.$row["folder"].'/theme.js')) {
          $output = $output.
            '<js>./app/themes/'.$row["folder"].'/theme.js</js>';                
        }
      } else {
        $output = $output.
          '<css>./app/css/error.css</css>'.
          '<js>./app/js/error.js</js>';                
      }
    }
            
    $sql = "select item, style
            from desktop_item
            where desktop = ".$_SESSION["desktopid"];

    foreach ($dbh->query($sql) as $row) {
      $output = $output.
        '<desktopitem><item>'.$row["item"].'</item><style>'.$row["style"].'</style></desktopitem>';
    }

    $output = $output.'</root>';

    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  
  
  echo $output;
  ?>
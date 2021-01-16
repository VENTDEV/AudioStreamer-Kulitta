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
  $pmode = $_GET["pmode"];
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 
    
    if ($pmode == "R") {
      //Retrieve
      
      $output = $output. '<br><br>
        <div id="themes">
        Themes
        <div class="description">
        If you know something about html and css then you can create your own theme.
        <br>Copy a theme record, change the name and change the reference to the theme folder.
        (the theme folder(s) are found in the AudioStreamer directory under "./core/app/themes").
        <br>AudioStreamer links to the "theme.css" and "theme.js" file in the specified theme folder.
        <br>Just copy an existing theme folder and start modifying.
        <br>Enjoy...
        </div>
        <br>
        <div><a href="javascript:manageSettings();"><div title="refresh" class="refresh"><div>Refresh</div></div></a></div>
        <table class="theme">';
     
      $sql = "select id, name, css, js, folder
        from theme
        order by name, css, js";
      
      //headers
      $output = $output.'<tr><th width="1px"></th><th style="display:none">id</th><th>name</th><th>folder</th><th width="1px"></th><th width="1px"></th></tr>';

      //rows
      foreach ($dbh->query($sql) as $row) {
    
        //create input on id
        $input_id = '<input type="text" name="id" updId="id" disabled value="'.$row['id'].'" />';

        //create input on name
        $input_name = '<input type="text" name="name" updId="name" value="'.$row['name'].'" />';
        
        //create input on folder
        $input_folder = '<input type="text" name="folder" updId="folder" value="'.$row['folder'].'" />';

        //create rows
        $output = $output.
          '<tr>'.
            '<td><div title="delete" class="delete" onClick="themeDelete(this)"><div>delete</div></div></td>'.
            '<td style="display:none">'.$input_id.'</td>'.
            '<td row-title="name">'.$input_name.'</td>'.
            '<td row-title="folder">'.$input_folder.'</td>'.
            '<td><div title="copy" class="copy" onClick="themeCopy(this)"><div>copy</div></div></td>'.
            '<td><div title="save" class="update" onClick="themeUpdate(this)"><div>save</div></div></td>'.
          '</tr>';
      }   
      
      $output = $output.'</table></div><br>';
      
      //add script to handle the changed class
      $output = $output.
        '<script type="text/javascript">'.
        '$(function(){'.
        '  $("[updId]").change(function() {'.
        '        $(this).parent().addClass("changed"); '.
        '  });'.
        '});'.
        '</script>';

    }
    else if ($pmode == "U") {
      //Update
      $dbh->beginTransaction();
      
      $sql =  
        "update theme 
         set name = '".str_replace("'", "''", $_GET["name"])."',
             folder = '".str_replace("'", "''", $_GET["folder"])."'
         where id = ".$_GET["id"]."
        ;";
      $dbh->exec($sql);      
      
      $dbh->commit();

      //$output = $output. 'Update successfull';
      $output = $output. 'SUCCESS';
    }
    else if ($pmode == "C") {
      //Create or Copy
      $dbh->beginTransaction();
      
      $sql =  
        "insert into theme(name, folder)
         select name||(select seq + 1 from sqlite_sequence where name='theme'), folder
         from theme
        where id = ".$_GET["id"].";";
      $dbh->exec($sql);      

      $dbh->commit();

      //$output = $output. 'Copy successfull';
      $output = $output. 'SUCCESS';
    }
    else if ($pmode == "D") {
      //Delete
      $dbh->beginTransaction();

      //set reference to deleted theme to null in table desktop      
      $sql =  
        "update desktop
         set theme = null
         where theme = ".$_GET["id"];
      $dbh->exec($sql);      
      $sql =  
        "delete from theme
         where id = ".$_GET["id"];
      $dbh->exec($sql);      

      //check to see if at least 1 theme stays
      $sql = "select count(1) as total from theme";
      foreach ($dbh->query($sql) as $row) {
        if ($row['total'] == 0) {
          $output = $output. 'There must exist at least one theme.';          
        }
        else {
          $dbh->commit();

          //$output = $output. 'Delete successfull';
          $output = $output. 'SUCCESS';
        }
      }
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
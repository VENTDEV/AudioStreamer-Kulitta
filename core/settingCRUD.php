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
      
      $output = $output. '<div class="top-spacer"></div>
        <div id="settings">
        Settings
        <div class="description">
        Change some system settings of AudioStreamer.
        </div>
        <br>
        <div><a href="javascript:manageSettings();"><div title="refresh" class="refresh"><div>Refresh</div></div></a></div>
        <table class="setting">';
     
      $sql = "select param, value, description
              from param
              order by order_value
             ";
      
      //headers
      $output = $output.'<tr><th style="display:none"></th><th>parameter</th><th>value</th><th width="1px"></th></tr>';

      //rows
      foreach ($dbh->query($sql) as $row) {
    
        //create input on param
        $input_param = '<input type="text" name="param" updId="param" disabled value="'.$row['param'].'" />';

        //create input on value
        if (strpos($row['param'],"ind_") !== false) {
          //if name contains "IND_" then checkbox
          $input_value = '<input type="checkbox" name="value" updId="value" value="1"';
          if ($row['value'] == '1'){
            $input_value = $input_value.' checked';
          }
          $input_value = $input_value.' />';
        } else if ($row['param'] == 'genre_radio') {
          //create multiple select list on genres
          $input_value = '<select name="value" updId="value" multiple="multiple" size="10">';
          if (strpos(",".$row['value']."," , ",ALL,") !== false) {
            $input_value = $input_value.'<option selected value="ALL">--all genres--</option>';
          } else {
            $input_value = $input_value.'<option value="ALL">--all genres--</option>';
          }          
          if (strpos(",".$row['value']."," , ",CURRENT,") !== false){
            $input_value = $input_value.'<option selected value="CURRENT">--genre current playing song--</option>';
          } else {
            $input_value = $input_value.'<option value="CURRENT">--genre current playing song--</option>';
          }          
          $sql = "select id, genre from genre order by genre collate nocase";
          foreach ($dbh->query($sql) as $genre_row) {
            if (strpos(",".$row['value']."," , ",".$genre_row['id'].",") !== false){
              $input_value = $input_value.'<option selected value="'.$genre_row['id'].'">'.$genre_row['genre'].'</option>';
            } else{
              $input_value = $input_value.'<option value="'.$genre_row['id'].'">'.$genre_row['genre'].'</option>';
            }
          }   
          $input_value = $input_value. '</select>';
        } else {
          $input_value = '<input type="text" name="value" updId="value" value="'.$row['value'].'" />';
        }
        
        //create field on description
        $field_description = '<div>'.$row['description'].'</div>';

        //create rows
        $output = $output.
          '<tr>'.
            '<td style="display:none">'.$input_param.'</td>'.
            '<td row-title="parameter">'.$field_description.'</td>'.
            '<td row-title="value">'.$input_value.'</td>'.
            '<td><div title="save" class="update" onClick="settingUpdate(this)"><div>save</div></div></td>'.
          '</tr>';
      }   
      
      $output = $output.'</table></div>';

      //$output = $output. '<a href="javascript:createDirectories();"><div title="(re)create music database" class="create-directories"></div></a>';
      //$output = $output. '<br><input type="button" onClick="javascript:createDirectories();" value="(re)create music database">';
      
      //add script to handle the changed class
      $output = $output.
        '<script type="text/javascript">'.
        '$(function(){'.
        '  $("[updId]").change(function() {'.
        '        $(this).parent().addClass("changed"); '.
        '  });'.
        '});'.
        '</script>';
        
      //add button to access log screen
      $output = $output.
        '<br><br>Logging 
        <div class="description"> 
        View the history of the recently streamed songs. 
        <br><input type="button" onClick="javascript:manageLogging(1);" value="show logs"> 
        </div>
        ';
    }
    else if ($pmode == "U") {
      //Update
      $dbh->beginTransaction();
      
      $sql =  
        "update param 
         set value = '".str_replace("'", "''", $_GET["value"])."'
         where param = '".$_GET["param"]."'
        ;";
      $dbh->exec($sql);      
      
      $dbh->commit();
    
      ////if parameter is "port_no"
      ////then change the contents of the mongoose config file
      //if ($_GET["param"] == 'port_no' ) {
      //  $filename = 'mongoose.conf';
      //  //Stores each line into an array item
      //  $array = file($filename);
      //  //Function to return false when a line starts with 'listening_ports' or is empty
      //  function filter_start($item)
      //  {
      //    return (strpos($item, 'listening_ports') !== 0 && strpos($item, PHP_EOL) !== 0);
      //  }
      //  //Runs the array through the filter function
      //  $new_array = array_filter($array, 'filter_start');
      //  //Writes the changes back to the file
      //  //and appends the new port number
      //  file_put_contents($filename, implode($new_array).PHP_EOL.'listening_ports '.$_GET["value"]);
      //}
        
      //refetching setting parameters
      $sql = "select param, value from param";
      session_start();
      foreach ($dbh->query($sql) as $row) {
        $_SESSION[$row["param"]] = $row["value"];
        //$output = $output.$row["param"].'='.$_SESSION[$row["param"]];
      }         
      session_write_close();
      
      //$output = $output. 'Update successfull';
      $output = $output. 'SUCCESS';
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

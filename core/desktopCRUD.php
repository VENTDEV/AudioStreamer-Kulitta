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
  $action = '';
  $pmode = $_GET["pmode"];
  
  try {
    $dbh = new PDO("sqlite:".$sdb);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 
    
    if ($pmode == "R") {
      //Retrieve

      //create select list on desktops for current user
      //$select_desktop = '<select name="desktopchange" onclick="">';
      //$sql = "select a.id, a.user, a.name, a.ind_current
      //  from desktop a
      //  where a.user = ".$_SESSION["userid"].
      // " order by a.name, a.theme, a.id";
      //
      //foreach ($dbh->query($sql) as $desktop) {
      //  if ($desktop['ind_current']=='1') {
      //    $select_desktop = $select_desktop.'<option selected value="'.$desktop['id'].'">'.$desktop['name'].'</option>';
      //  }
      //  else{
      //    $select_desktop = $select_desktop.'<option value="'.$desktop['id'].'">'.$desktop['name'].'</option>';
      //  }
      //}   
      //$select_desktop = $select_desktop. '</select>';
      //
      //'<input type="button" onclick="javascript:recallDesktop(1);" value="recall current desktop">'

      
      $output = $output. '<div class="top-spacer"></div>
        <div id="desktops">
        Desktops
        <div class="description">
        Here you can change your current desktop to another one.
        <br>According to the browser you\'re using, changes to the current desktop will be immediatly visible (Chrome, Firefox)
        or you have to refresh the page (Internet Explorer).
        <br>
        <br>The desktop defines the position, height, width, ... of the different screens.
        <br>The theme defines the colors, look and functionality of the desktop.
        </div>
        <br>
        <div>
        <a href="javascript:manageDesktops($(\'#api12 #ind_all_users:checked\').val());"><div title="refresh" class="refresh"><div>Refresh</div></div></a>
          &nbsp;&nbsp;&nbsp;show all users<input type="checkbox" id="ind_all_users" name="ind_all_users" value="1" 
          onChange="manageDesktops($(\'#api12 #ind_all_users:checked\').val());"';

      if (isset($_GET['ind_all_users'])){
        if ($_GET['ind_all_users'] == '1'){
          $output = $output.' checked';
        }
      }
      $output = $output.        
        '/>
        </div>
        <table class="desktop">';
     
      $sql = "select a.id, a.user, a.name, a.theme, a.ind_current
        from desktop a,
             user b
        where a.user = b.id";
      
      //show only desktops for curent user if (no admin) or (search indicator says only current user)
      if (($_SESSION["ind_admin"] != '1') || ($_GET['ind_all_users'] != '1')) {
        $sql = $sql." and a.user = ".$_SESSION["userid"];
      }

      $sql = $sql." order by b.name, a.name, a.theme, a.id";
      
      //headers
      $output = $output.'<tr><th width="1px"></th><th style="display:none">id</th><th>user</th><th>desktop</th><th>theme</th><th>current</th><th width="1px"></th><th width="1px"></th></tr>';

      //rows
      foreach ($dbh->query($sql) as $row) {
        //create select list on theme
        $select_theme = '<select name="theme" updId="theme">';
        $sql = "select id, name from theme order by name";
        foreach ($dbh->query($sql) as $theme) {
          if ($theme['id']==$row['theme']) {
            $select_theme = $select_theme.'<option selected value="'.$theme['id'].'">'.$theme['name'].'</option>';
          }
          else{
            $select_theme = $select_theme.'<option value="'.$theme['id'].'">'.$theme['name'].'</option>';
          }
        }   
        //if theme is deleted then its updated to null
        if ($row['theme']=="") {
          $select_theme = $select_theme.'<option selected value="null"></option>';
        }
        $select_theme = $select_theme. '</select>';

        //create select list on user
        $select_user = '<select name="user" updId="user">';
        $sql = "select id, name from user";
        //show only curent user if (no admin) or (search indicator says only current user)
        if (($_SESSION["ind_admin"] != '1') || ($_GET['ind_all_users'] != '1')) {
          $sql = $sql." where id = ".$_SESSION["userid"];
        }
        $sql = $sql." order by name";
        foreach ($dbh->query($sql) as $user) {
          if ($user['id']==$row['user']) {
            $select_user = $select_user.'<option selected value="'.$user['id'].'">'.$user['name'].'</option>';
          }
          else{
            $select_user = $select_user.'<option value="'.$user['id'].'">'.$user['name'].'</option>';
          }
        }   
        $select_user = $select_user. '</select>';
        
        //create input on id
        $input_id = '<input type="text" name="id" updId="id" disabled value="'.$row['id'].'" />';

        //create input on name
        $input_name = '<input type="text" name="name" updId="name" value="'.$row['name'].'" />';

        //create input on ind_current
        $input_ind_current = '<input type="checkbox" name="ind_current" updId="ind_current" value="1"';
        if ($row['ind_current'] == '1'){
          $input_ind_current = $input_ind_current.' checked';
        }
        $input_ind_current = $input_ind_current.' />';
        
        //create rows
        $output = $output.
          '<tr>';

        //don't show delete if user is not alowed to change desktops
        if ($_SESSION["ind_desktop"] == '1') {
          $output = $output.
            '<td><div title="delete" class="delete" onClick="desktopDelete(this,$(\'#api12 #ind_all_users:checked\').val())"><div>delete</div></div></td>';        
        } else {
          $output = $output.
            '<td></td>';        
        }

        $output = $output.          
            '<td style="display:none">'.$input_id.'</td>'.
            '<td row-title="user">'.$select_user.'</td>'.
            '<td row-title="desktop">'.$input_name.'</td>'.
            '<td row-title="theme">'.$select_theme.'</td>'.
            '<td row-title="current">'.$input_ind_current.'</td>';

        //don't show copy/create if user is not alowed to change desktops
        if ($_SESSION["ind_desktop"] == '1') {
          $output = $output.
            '<td><div title="copy" class="copy" onClick="desktopCopy(this,$(\'#api12 #ind_all_users:checked\').val())"><div>copy</div></div></td>';
        } else {
          $output = $output.
            '<td></td>';        
        }
        $output = $output.          
            '<td><div title="save" class="update" onClick="desktopUpdate(this,$(\'#api12 #ind_all_users:checked\').val())"><div>save</div></div></td>'.
          '</tr>';
      }   
      
      $output = $output.'</table><br /></div>';
      
      //
      //add some theme info
      //loop theme directories for file theme.txt
      $output = $output.'<div id="themeInfo">
        Theme info
        <div class="description">
        Some more info per theme if available.
        <br />(This can also be found in the corresponding theme folder in file theme.txt)
        </div>
        <br />
        <table class="theme-info">';
     
      $sql = "select a.name, a.folder
        from theme a
        order by a.name";
      //headers
      $output = $output.'<tr><th>theme</th><th>info</th></tr>';
      //rows
      foreach ($dbh->query($sql) as $row) {
        // if a file named "theme.txt" exists in this theme folder then show the content
        if (file_exists( "./app/themes/".$row['folder']."/theme.txt" )) {
          $output = $output.          
            '<tr><td row-title="theme">'.$row['name'].'</td>'.
                                              '<td row-title="info">'.file_get_contents("./app/themes/".$row['folder']."/theme.txt").'</td></tr>';
        }
      }   
      $output = $output.'</table><br /></div>';
      
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
        "update desktop 
        set user = ".$_GET["user"].",
        name = '".str_replace("'", "''", $_GET["name"])."',
        theme = ".$_GET["theme"].",
        ind_current = '".$_GET["ind_current"]."'
                               where id = ".$_GET["id"];
      $dbh->exec($sql);      

      //there must exist at least one desktop per user
      $sql = "select b.name 
              from user b 
              where not exists(select 1
                               from desktop a
                               where a.user = b.id);";
      foreach ($dbh->query($sql) as $row) {
      }
      if (!empty($row['name'])) {         
          $output = $output. '<root>'.
            '<status>ERROR</status>'.
            '<action>'.
            '  alert("You must have at least 1 desktop for user: '.$row['name'].'");'.
            '</action>'.
            '</root>';          
      }
      else {
        //if current is changed/updated then update all the others to not current
        if ($_GET["ind_current"] == '1') {
          $sql =  
            "update desktop 
            set ind_current = 0 
            where user = ".$_GET["user"]."
            and id != ".$_GET["id"];
          $dbh->exec($sql);      
          
          //if current user then change the dektop and change the theme
          if ($_SESSION["userid"] == $_GET["user"]){
            //change curent desktop id session variable
            session_start();
            $_SESSION["desktopid"] = $_GET["id"];
            session_write_close();
            //change desktop and theme
            $action = 'recallDesktop(1);';
          }
        }
        
        $dbh->commit();
        
        $output = $output. 
          '<root>'.
          '<status>SUCCESS</status>'.
          '<action>'.$action.'</action>'.
          '</root>';
      }
    }
    else if ($pmode == "C") {
      //Create or Copy
      $dbh->beginTransaction();
      
      $sql =  
        "insert into desktop(user, name, theme, ind_current)
         select user, name||(select seq + 1 from sqlite_sequence where name='desktop'), theme, ind_current
         from desktop
        where id = ".$_GET["id"].";";
      $dbh->exec($sql);      
      $sql =  
        "insert into desktop_item(item, desktop, style)
         select item, (select seq from sqlite_sequence where name='desktop'), style
         from desktop_item
        where desktop = ".$_GET["id"].";";
      $dbh->exec($sql);      
      
      $dbh->commit();

      //$output = $output. 'Copy successfull';
      $output = $output. 'SUCCESS';
     
    }
    else if ($pmode == "D") {
      //Delete
      $dbh->beginTransaction();

      //there must exist at least one desktop per user
      $sql = "select count(1) as total from desktop where user = '".$_GET["user"]."'";
      foreach ($dbh->query($sql) as $row) {
        if ($row['total'] == 1) {
          $output = $output. 'You cannot delete all desktops for a user.';          
        }
        else {
          $sql =  
            "delete from desktop_item
             where desktop = ".$_GET["id"].";";
          $dbh->exec($sql);      
          $sql =  
            "delete from desktop
             where id = ".$_GET["id"].";";
          $dbh->exec($sql);      
          
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
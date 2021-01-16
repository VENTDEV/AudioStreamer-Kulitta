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
        <div id="users">
        Users
        <div class="description">
        Manage the AudioStreamer users.
        <br>If you check the "admin" box, then that user is also administrator.
        <br>The following is only accesible for administrators: 
        <br>- Manage users (this screen)
        <br>- Manage desktops of other users
        <br>- Manage settings
        <br>If you check the "desktop" box, then that user can also save and create desktops.
        </div>
        <br>
        <div><a href="javascript:manageUsers();"><div title="refresh" class="refresh"><div>Refresh</div></div></a></div>
        <table class="user">';
     
      $sql = "select id, name, password, ind_admin, ind_desktop 
        from user
        order by name";
      //where user = '".$_SESSION["username"]."'".
      
      //headers
      $output = $output.'<tr><th width="1px"></th><th style="display:none">id</th><th>user</th><th>reset password</th><th>admin</th><th>desktop</th><th width="1px"></th><th width="1px"></th></tr>';

      //rows
      foreach ($dbh->query($sql) as $row) {
    
        //create input on id
        $input_id = '<input type="text" name="id" updId="id" disabled style="width: 50px" value="'.$row['id'].'" />';

        //create input on name
        $input_name = '<input type="text" name="name" updId="name" value="'.$row['name'].'" />';
        
        //create input on reset password
        //$input_password = '<input type="password" name="password" updId="password" value="'.$row['password'].'" />';
        $input_password = '<input type="text" name="password" updId="password" value="" />';

        //create input on ind_admin
        $input_ind_admin = '<input type="checkbox" name="ind_admin" updId="ind_admin" value="1"';
        if ($row['ind_admin'] == '1'){
          $input_ind_admin = $input_ind_admin.' checked';
        }
        $input_ind_admin = $input_ind_admin.' />';

        //create input on ind_desktop
        $input_ind_desktop = '<input type="checkbox" name="ind_desktop" updId="ind_desktop" value="1"';
        if ($row['ind_desktop'] == '1'){
          $input_ind_desktop = $input_ind_desktop.' checked';
        }
        $input_ind_desktop = $input_ind_desktop.' />';

        //create rows
        $output = $output.
          '<tr>'.
            '<td><div title="delete" class="delete" onClick="userDelete(this)"><div>delete</div></div></td>'.
            '<td style="display:none">'.$input_id.'</td>'.
            '<td row-title="user">'.$input_name.'</td>'.
            '<td row-title="reset password">'.$input_password.'</td>'.
            '<td row-title="admin">'.$input_ind_admin.'</td>'.
            '<td row-title="desktop">'.$input_ind_desktop.'</td>'.
            '<td><div title="copy" class="copy" onClick="userCopy(this)"><div>copy</div></div></td>'.
            '<td><div title="save" class="update" onClick="userUpdate(this)"><div>save</div></div></td>'.
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
        "update user 
         set name = '".str_replace("'", "''", $_GET["name"])."',
             ind_admin = '".$_GET["ind_admin"]."',
             ind_desktop = '".$_GET["ind_desktop"]."'
         where id = ".$_GET["id"]."
        ;";
      $dbh->exec($sql);      
      
      //if password is reset, then update the password
      if (!empty($_GET["password"])) {
        $sql =  
          "update user 
           set password = '".str_replace("'", "''", $_GET["password"])."'
           where id = ".$_GET["id"]."
          ;";
        $dbh->exec($sql);      
      }

      //there must exist at least one user with admin option
      $sql = "select count(1) as total from user where ind_admin = 1";
      foreach ($dbh->query($sql) as $row) {
        if ($row['total'] == 0) {
          $output = $output. 'There must exist at least one user with admin option.';          
        }
        else {
          $dbh->commit();

          //$output = $output. 'Update successfull';
          $output = $output. 'SUCCESS';
        }
      }
     
    }
    else if ($pmode == "C") {
      //Create or Copy
      $dbh->beginTransaction();
      
      $sql =  
        "insert into user(name, password, ind_admin, ind_desktop)
         select name||(select seq + 1 from sqlite_sequence where name='user'), password, ind_admin, ind_desktop
         from user
        where id = ".$_GET["id"].";";
      $dbh->exec($sql);      

      //looping desktops for user
      $sql = 
        "select id
         from desktop
        where user = ".$_GET["id"];
      foreach ($dbh->query($sql) as $row) {
        //inserting desktop
        $sql =  
          "insert into desktop(user, name, theme, ind_current)
          select (select seq from sqlite_sequence where name='user'), name, theme, ind_current
          from desktop
          where id = ".$row["id"];
        $dbh->exec($sql);      
        //inserting desktop items
        $sql =  
          "insert into desktop_item(item, desktop, style)
          select item, (select seq from sqlite_sequence where name='desktop'), style
          from desktop_item
          where desktop = ".$row["id"];
        $dbh->exec($sql);      
      }
        
      $dbh->commit();

      //$output = $output. 'Copy successfull';
      $output = $output. 'SUCCESS';
     
    }
    else if ($pmode == "D") {
      //Delete
      $dbh->beginTransaction();

      //check to see if at least 1 admin stays
      
      $sql =  
        "delete from desktop_item
         where desktop in (select id from desktop where user = ".$_GET["id"].");";
      $dbh->exec($sql);      
      $sql =  
        "delete from desktop
         where user = ".$_GET["id"].";";
      $dbh->exec($sql);      
      $sql =  
        "delete from user
         where id = ".$_GET["id"].";";
      $dbh->exec($sql);      

      $sql = "select count(1) as total from user where ind_admin = 1";
      foreach ($dbh->query($sql) as $row) {
        if ($row['total'] == 0) {
          $output = $output. 'There must exist at least one user with admin option.';          
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

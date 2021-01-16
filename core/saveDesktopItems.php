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
    
    $dbh->beginTransaction();
    if ($_POST["type"] == "save") {
			$sql = "delete from desktop_item where desktop = ".$_SESSION["desktopid"]." ;";
			$sql = $sql.str_replace("INSERT", "insert into desktop_item(desktop, item, style) values (".$_SESSION["desktopid"].",'", $_POST["cmd"]);
			$dbh->exec($sql);      

			$output = 'Desktop saved';
    }
    else if ($_POST["type"] == "saveAs") {

			$sql = "insert into desktop(user, name, theme, ind_current)
         select user, '".str_replace("'", "''", $_POST["name"])."', theme, 1
         from desktop
        where id = ".$_SESSION["desktopid"].";";
			$sql = $sql.str_replace("INSERT", "insert into desktop_item(desktop, item, style) values ((select seq from sqlite_sequence where name='desktop'),'", $_POST["cmd"]);
			$dbh->exec($sql);      

			//fetch current desktop
			$sql = "select seq from sqlite_sequence where name='desktop'";
      foreach ($dbh->query($sql) as $row) {
			  //do nothing
				$sql = "";
			}
			
			//current is changed so update all the others to not current
			$sql =  
				"update desktop 
				set ind_current = 0 
				where user = ".$_SESSION["userid"]."
				and id != ".$row['seq'];
			$dbh->exec($sql);      
				
			//change curent desktop id session variable
			session_start();
			$_SESSION["desktopid"] = $row['seq'];
			session_write_close();
			
			$output = 'New desktop saved';
		}
		
    $dbh->commit();
		
    $output = $output;

    //close connection
    $dbh = null;
  }
  catch(PDOException $e)
  {
    $output = $output.'<br/>'.$e->getMessage();
  }  
  
  echo $output;
  ?>
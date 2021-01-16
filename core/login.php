<?php 
  session_start();
  session_destroy();
  session_start();

  include_once "./password.php";

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
  

  //database connection and AudioStreamer version
  //also change this in audiostreamerlib.php
  $version = "3.2";
  $sdb = "../sqlite/audiostreamer.db";
  $dbh = new PDO("sqlite:".$sdb);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); 
  $error = '';
  $output = '';
  
  //check for new version of AudioStreamer
  $new_version = file_get_contents("http://www.audiostreamer.org/version/version.txt");
  if (($new_version) && ($new_version != $version)) {
    $new_version = 'Current version '.$version.
                   '<br/>Version '.$new_version.' available'.
                   '<br/><a href="https://www.audiostreamer.org" target="_blank">https://www.audiostreamer.org</a>';
  } else {
    $new_version = '';  
  }

  if (!empty($_GET) || !empty($_POST)) { 
    if (!empty($_POST["username"])) {
      $_SESSION["username"] = $_POST["username"]; 
    } else if (!empty($_GET["username"])) {
      $_SESSION["username"] = $_GET["username"]; 
    } else {
      $_SESSION["username"] = ''; 
    }
    if (!empty($_POST["password"])) {
      $_SESSION["password"] = $_POST["password"]; 
    } else if (!empty($_GET["password"])) {
      $_SESSION["password"] = $_GET["password"]; 
    } else {
      $_SESSION["password"] = ''; 
    }
    //
    //check if working with the password file
    //and thus checking username and password
    //
    if (!empty($start_password)) {
      $username = $start_username;
      $password = $start_password;
      $_SESSION["userid"] = "";
      $_SESSION["ind_admin"] = "1";
    }
    else {
      $username="";
      $password="";
      $sql = "select id, name, password, ind_admin, ind_desktop from user where name='".$_SESSION["username"]."'";
      foreach ($dbh->query($sql) as $row) {
        $username = $row["name"];
        $password = $row["password"];
        $_SESSION["userid"] = $row["id"];
        $_SESSION["ind_admin"] = $row["ind_admin"];
        $_SESSION["ind_desktop"] = $row["ind_desktop"];
      }   
    }

    if (empty($_SESSION["username"])) { 
      $error = 'User must be specified. Try again.'; 
      session_destroy(); 
    }
    else if (empty($_SESSION["password"])) { 
      $error = 'Password must be specified. Try again.'; 
      session_destroy(); 
    }
    else if ($_SESSION["username"]!=$username) { 
      $error = 'Wrong user. Login Failed. Try again.'; 
      session_destroy(); 
    }
    else if ($_SESSION["password"]!=$password) { 
      $error = 'Wrong password. Login Failed. Try again.'; 
      session_destroy(); 
    }
    else { 
      //fetching current desktop
      $sql = "select a.id, b.folder from desktop a, theme b where a.ind_current = 1 and a.user='".$_SESSION["userid"]."' and a.theme = b.id";
      foreach ($dbh->query($sql) as $row) {
        $_SESSION["desktopid"] = $row["id"];
        $_SESSION["desktopcss"] = './app/themes/'.$row["folder"].'/theme.css';
      }   
      //fetching setting parameters
      $sql = "select param, value from param";
      foreach ($dbh->query($sql) as $row) {
        $_SESSION[$row["param"]] = $row["value"];
      }   
      header("Location: ./index.php"); 
      header('Content-Length: 0');
      exit;
    }
  }
  //close connection
  $dbh = null;
    
  //
  $output = '
<!doctype html>
<html>
<head>
<title>AudioStreamer Login</title>

<link rel="stylesheet" type="text/css" href="./app/css/login.css" /> 
<link rel="shortcut icon" href="./favicon.ico" />
<!-- for ios 7 style, multi-resolution icon of 152x152 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="apple-touch-icon" sizes="152x152" href="./apple-touch-icon-152x152.png">
<!-- for Chrome on Android, multi-resolution icon of 196x196 and manifest file -->
<link rel="shortcut icon" sizes="196x196" href="./icon196.png">
<link rel="manifest" href="./manifest.json">
  
<script type="text/javascript" src="./app/js/jquery-1.11.0.min.js"></script> 
<script type="text/javascript" src="./app/js/jquery-ui-1.10.4.custom.min.js"></script> 

<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
  <div id="content">
    <div id="login">
  ';

  $output = $output.'      
      <div class="title">AudioStreamer</div>
      <form method=post action="login.php" id="formlogin"> 
        <div class="username">Username</div>
        <div><input name="username" type="text" autofocus placeholder="username"></div>
        <div class="password">Password</div>
        <div><input name="password" type="password" placeholder="password"></div>
        <div class="logindiv" onclick="$(\'#formlogin\').submit()">Login</div>
      </form> 
      <div class="messages">';
  //    
  if ($error) {
  $output = $output.'      
        <div class="error"><span>'.$error.'</span></div>';
  }
  if ($new_version) {
    $output = $output.'      
        <div class="version"><span>'.$new_version.'</span></div>';
  }
  //
  $output = $output.'       
      </div>
    </div>
  </div>
  <script type="text/javascript">
  $(document).ready(function(){
    $("#formlogin").keyup(function(event){
      if(event.keyCode == 13) {
        //Enter keypress event.
        $("#formlogin").submit();
      }
    });  
  });  
  </script>  
</body>
</html>
';

  echo $output;
?>

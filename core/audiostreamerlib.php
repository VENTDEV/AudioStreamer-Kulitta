<?php 
  session_start();
  session_write_close();

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

  //
  //BE ABSOLUTELY CERTAIN that your php file does not contain any \r, \n, 
  //or white spaces before the and after the php signs 
  //otherwise outputting an image file will NOT work eg getCover.php
  //

  //check if user is logged in
  if(!isset($_SESSION["username"]) || !isset($_SESSION["password"])) {
    //not logged in
    //redirect to login page
    header("Location: ./login.php");
    header('Content-Length: 0');
    exit;
  }
  
  //database connection and AudioStreamer version
  //also change this in login.php
  $version = "3.2";
  $sdb = "../sqlite/audiostreamer.db";
  //supported audio formats
  $audioformats = "'aac','ac3','aiff','aif','m4a','ape','flac','m4a','m4b','mp2','mp3','mp4','mpa','mpc','ogg','opus','tta','wv','wav','wma'";
  //general utf8_encode function for AudioStreamer
  function utf8_encode_AS($string) {
    //return mb_convert_encoding($string,'UTF-8',mb_detect_encoding($string,['UTF-8','ISO-8859-1']));
    return htmlspecialchars( mb_convert_encoding($string,'UTF-8',mb_detect_encoding($string,['UTF-8','ISO-8859-1'])) );
  }
 ?>

<?php 
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
  //This file serves as a means to be abble to login if you forgot your password(s) 
  //(passwords are stored in the database and not easy to view)
  //Just type a password between the quotes in the last line 
  //And you should be able to login with specified username and password
  // 
  //Once you are logged in again, reset your password(s).
  //It's adviced to blank out the password in this file again.
	//Otherwise you won't have all the functionalities
	//(some are user related and won't work eg:desktops)
  //
  $start_username = "admin";
  $start_password = "";
?>
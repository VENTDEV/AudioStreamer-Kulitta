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
  
?>
<!doctype html>
<html>
<head>
<title>AudioStreamer</title>

<link rel="shortcut icon" href="./favicon.ico" />
<!-- for ios 7 style, multi-resolution icon of 152x152 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="apple-touch-icon" sizes="152x152" href="./apple-touch-icon-152x152.png">
<!-- for Chrome on Android, multi-resolution icon of 196x196 and manifest file -->
<link rel="shortcut icon" sizes="196x196" href="./icon196.png">
<link rel="manifest" href="./manifest.json">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<?php
  //add current css
    echo '<link id="themecss" rel="stylesheet" href="'.$_SESSION["desktopcss"].'" type="text/css" />';
?>
  
<script type="text/javascript" src="./app/js/jquery-1.11.0.min.js"></script> 
<script type="text/javascript" src="./app/js/jquery-ui-1.10.4.custom.min.js"></script> 
<script type="text/javascript" src="./app/js/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="./app/js/jquery.cookie.js"></script>
<script type="text/javascript" src="./app/js/AudioStreamer.js"></script>
<script type="text/javascript" src="./app/js/rainbowvis.js"></script>

</head>
<body>
  <div id="content">
    <div id="drag6" class="drag">
      <div class="handler"><div class="grab"></div><span>Player</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api6" class="api"><div class="top-spacer"></div>
        <div id="jquery_jplayer_1" class="jp-jplayer">
          <audio id="jp_audio_0"></audio>        
        </div>
        <div class="jp-audio">
          <div id="jp_interface_1" class="jp-interface">
            <div class="jp-previous"><div>previous</div></div>
            <div class="jp-play"><div>play</div></div><div class="jp-pause"><div>pause</div></div>
            <div class="jp-next"><div>next</div></div>
            <div class="jp-progress"><div class="jp-current-time"></div><div class="jp-duration"></div>
              <div class="jp-bar">
                <div class="jp-play-bar"></div>
                <div class="jp-seek-bar"></div>
                <div class="jp-buffer-bar"></div>
              </div>
            </div>
            <div class="jp-progress-title">&nbsp;</div>
            <div class="jp-mute"><div>mute</div></div><div class="jp-unmute"><div>unmute</div></div>
            <div class="jp-volume-bar">
              <div class="jp-volume-bar-value"></div>
            </div>      
          </div>
        </div>
      </div>
    </div>     
    <div id="drag17" class="drag">
      <div class="handler"><div class="grab"></div><span>Menu</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api17" class="api"><div class="top-spacer"></div>
        <div title="menu" class="view-menu"><div>Menu</div></div>
      </div>
    </div>
    <div id="drag1" class="drag">
      <div class="handler"><div class="grab"></div><span>[<?php echo $_SESSION["username"]; ?>]</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api1" class="api"><div class="top-spacer"></div>
        <div title="player" class="showPlayer"><div>Now Playing</div></div>
        <div title="folders" class="showTree view-current"><div>Folders</div></div>
        <div title="albums" class="showAlbums"><div>Albums</div></div>
        <div title="search" class="showSearch"><div>Search</div></div>
        <div title="album - song details" class="view-albums"><div>Details</div></div>
        <div title="song info" class="view-song-info"><div>Song info</div></div>
        <div title="playlist" class="view-playlist"><div>Playlist</div></div>
        <div title="now playing album art" class="view-now-playing"><div>Cover Art</div></div>
<?php
  //Visuals only visible if enabled
  if ($_SESSION["ind_web_audio_api"] == '1') {
    echo '<div title="visualisations" class="freq-spectrum"><div>Visuals</div></div>';
  }
?>
<?php
  //Desktops only visible for checked desktop indicators
  if ($_SESSION["ind_desktop"] == '1') {
    echo '<div title="save desktop" class="desktop-save"><div>Save</div></div>';
    echo '<div title="save desktop as ..." class="desktop-save-as"><div>Save as</div></div>';
    echo '<div title="manage desktops" class="desktop-manage"><div>Desktops</div></div>';
  }
?>
<?php
  //users and settings only visible for admin(s)
  //logging and (re)create database only visible for admin(s)
  if ($_SESSION["ind_admin"] == '1') {
    echo '<div title="manage users" class="users"><div>Users</div></div>';
    echo '<div title="manage settings" class="settings"><div>Settings</div></div>';
    echo '<div title="logging" class="view-logging"><div>Logging</div></div>';
    echo '<div title="(re)create music database" class="view-create-database"><div>(Re)Create db</div></div>';
  }
?>
        <div title="about AudioStreamer" class="about-AudioStreamer"><div>About</div></div>
        <div title="logout" class="logout"><div>Logout</div></div>
      </div>
    </div>
    <div id="drag3" class="drag">
      <div class="handler"><div class="grab"></div><span>Folders</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api3" class="api"><div class="top-spacer"></div></div>
    </div> 
    <div id="drag7" class="drag">
      <div class="handler"><div class="grab"></div><span>Albums</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api7" class="api"><div class="top-spacer"></div></div>
    </div> 
    <div id="drag14" class="drag">
      <div class="handler"><div class="grab"></div><span>Search</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api14" class="api"><div class="top-spacer"></div></div>
    </div> 
    <div id="drag2" class="drag">
      <div class="handler"><div class="grab"></div><span>Album - Song details</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api2" class="api"><div class="top-spacer"></div></div>
    </div> 
    <div id="drag5" class="drag">
      <div class="handler"><div class="grab"></div><span>Playlist</span>
        <div class="radio-playlist"><div>radio</div></div>
        <div class="shuffle-playlist"><div>shuffle</div></div>
        <div class="clear-playlist"><div>clear</div></div>
        <div class="action" onClick="actionWrap(this)"><div>action</div></div>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api5" class="api"><div class="top-spacer"></div>
        <ul id="playlistSortable"></ul>
      </div>
    </div> 
    <div id="drag4" class="drag">
      <div class="handler"><div class="grab"></div><span>Now Playing</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api4" class="api"><div class="top-spacer"></div></div>
    </div> 
    <div id="drag8" class="drag">
      <div class="handler"><div class="grab"></div><span>Song info</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api8" class="api"><div class="top-spacer"></div></div>
    </div> 
<?php
  //users and settings only visible for admin(s)
  //logging and (re)create database only visible for admin(s)
  if ($_SESSION["ind_admin"] == '1') {
    echo '    <div id="drag9" class="drag">';
    echo '      <div class="handler"><div class="grab"></div><span>(re)Create music database</span>';
    echo '        <div class="close-popup" title="close"><div>close</div></div>';
    echo '      </div>';
    echo '      <div id="api9" class="api"><div class="top-spacer"></div></div>';
    echo '    </div>';
  }
?>
    <div id="drag10" class="drag">
      <div class="handler"><div class="grab"></div><span>About AudioStreamer</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api10" class="api"><div class="top-spacer"></div></div>
    </div> 
<?php
  //users and settings only visible for admin(s)
  //logging and (re)create database only visible for admin(s)
  if ($_SESSION["ind_admin"] == '1') {
    echo '    <div id="drag11" class="drag">';
    echo '      <div class="handler"><div class="grab"></div><span>Manage users</span>';
    echo '        <div class="close-popup" title="close"><div>close</div></div>';
    echo '      </div>';
    echo '      <div id="api11" class="api"><div class="top-spacer"></div></div>';
    echo '    </div> ';
    echo '    <div id="drag13" class="drag">';
    echo '      <div class="handler"><div class="grab"></div><span>Manage settings</span>';
    echo '        <div class="close-popup" title="close"><div>close</div></div>';
    echo '      </div>';
    echo '      <div id="api13" class="api"><div class="top-spacer"></div></div>';
    echo '    </div>';
  }
?>    
    <div id="drag12" class="drag">
      <div class="handler"><div class="grab"></div><span>Manage desktops</span>
        <div class="close-popup" title="close"><div>close</div></div>
      </div>
      <div id="api12" class="api"><div class="top-spacer"></div></div>
    </div> 
<?php
  //users and settings only visible for admin(s)
  //logging and (re)create database only visible for admin(s)
  if ($_SESSION["ind_admin"] == '1') {
    echo '    <div id="drag15" class="drag">';
    echo '      <div class="handler"><div class="grab"></div><span>View logging history</span>';
    echo '        <div class="close-popup" title="close"><div>close</div></div>';
    echo '      </div>';
    echo '      <div id="api15" class="api"><div class="top-spacer"></div></div>';
    echo '    </div> ';
  }
?>    
<?php
  //Visuals only visible if enabled
  if ($_SESSION["ind_web_audio_api"] == '1') {
    echo '    <div id="drag16" class="drag">';
    echo '      <div class="handler"><div class="grab"></div><span>Visualisation(s)</span>';
    echo '        <span class="visualInfo"></span>';
    echo '        <input type="range" id="visualScale" min="1" max="100" value="20" id="fader" step="1" title="fps:20" onchange="updateScale(value)">';
    echo '        <select id="visualSelect">';
    echo '          <option value="NONE">No visualisation</option>';
    echo '          <option value="FREQ">Frequency</option>';
    echo '          <option value="SPECTRO">Spectrogram</option>';
    echo '          <option value="WAVE">Waveform</option>';
    echo '          <option value="METER">Meter</option>';
    echo '          <option value="LOUDNESS">Loudness</option>';
    echo '          <option value="OSC">Oscillator</option>';
    echo '          <option value="SQUARE">Square</option>';
    echo '          <option value="SPIKE">Spike</option>';
    echo '          <option value="TAIL">Tail</option>';
    echo '        </select>';
    echo '        <div class="close-popup" title="close"><div>close</div></div>';
    echo '      </div>';
    echo '      <div id="api16" class="api"><div class="top-spacer"></div>';
    echo '        <div id="visualisation">';
    echo '          <canvas id="freqcanvas" width="0" height="0"></canvas>';
    echo '        </div>';        
    echo '      </div>';
    echo '    </div>';
  }
?>
    
    <div id="largeAlbumCover" class="cover-album"></div>
    <div id="uparrow" class="uparrow"></div>      
  </div>     
</body>
</html>

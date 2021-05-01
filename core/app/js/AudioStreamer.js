$(document).ready(function(){

  $(".jp-previous").on("click.audiostreamer", function() {
    playPrev();
  });

  $(".jp-play").on("click.audiostreamer", function() {
    playAudio();
  });

  $(".jp-pause").on("click.audiostreamer", function() {
    pauseAudio();
  });
  //hide pause button
  $(".jp-pause").hide();

  $(".jp-next").on("click.audiostreamer", function() {
    playNext();
  });

  $(".jp-mute").on("click.audiostreamer", function() {
    muteAudio();
  });

  $(".jp-unmute").on("click.audiostreamer", function() {
    unmuteAudio();
  });
  //hide pause button
  $(".jp-unmute").hide();

  //attach events on audio element
  $("#jp_audio_0").on("ended.audiostreamer", function() { playNext(); });
  $("#jp_audio_0").on("timeupdate.audiostreamer", function() { changeProgressBar(); });

  //make play bar seekable
  $(".jp-bar").on("click.audiostreamer", function(e) {       
    //only seek if there is a seekbar greater than zero
    if ($(".jp-seek-bar").width() > 0) {
      var audioElement = document.getElementById("jp_audio_0"); 
      //get current playing song
      var hthis = $("#playlistSortable li .jp-playlist-current");
      var pdur = $(hthis).attr("dur");
      // calculate the normalized position clicked
      var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
      var clickTime = clickPosition * pdur;

      // move the playhead to the correct position
      audioElement.currentTime = clickTime;
    }
  });
  
  $( "#playlistSortable" ).sortable({
    placeholder: "ui-state-highlight",
    handle: ".move"
  });

  draggable();
  getTree();
  getAlbums();
  getSearch();
  showTreeWrap();
  recallDesktop();
  manageDesktops(0,0);
  manageUsers(0);
  manageSettings(0);
  manageLogging(0);
  aboutAudioStreamer(0);
  attachEvents();
  defaults();
  initWebAudioApi();
});

function draggable(){
  $('.drag').draggable({ 
    snap: true, 
    stack: '.drag',
    handle: 'div.handler',
    start: function(event, ui) {$('.iframe-style').css({display:"none"});},
    stop: function(event, ui) {$('.iframe-style').css({display:"block"});}
  });
  $('.drag').resizable({ 
    handles: ('n,e,s,w,ne,nw,se,sw'),
    start: function(event, ui) {$('.iframe-style').css({display:"none"});},
    stop: function(event, ui) {$('.iframe-style').css({display:"block"});
                               resizeImageWrap();
                               resizeFreqSpectrumWrap();
                              }
  });
}
function attachEvents() {
  //playlist actions
  $(".radio-playlist").on("click.audiostreamer", function() {
    radioPlaylist();
  });
  $(".clear-playlist").on("click.audiostreamer", function() {
    clearPlaylist('playlist');
  });
  $(".shuffle-playlist").on("click.audiostreamer", function() {
    shufflePlaylist();
  });
  //view drag divs
  $(".view-menu").on("click.audiostreamer", function() {
    viewMenuWrap();
  });  
  $(".showPlayer").on("click.audiostreamer", function() {
    showPlayerWrap();
  });  
  $(".showTree").on("click.audiostreamer", function() {
    showTreeWrap();
  });  
  $(".showAlbums").on("click.audiostreamer", function() {
    showAlbumsWrap();
  });  
  $(".showSearch").on("click.audiostreamer", function() {
    searchWrap();
  });  
  $(".view-albums").on("click.audiostreamer", function() {
    viewAlbumsWrap();
  });  
  $(".view-playlist").on("click.audiostreamer", function() {
    viewPlaylistWrap();
  });  
  $(".view-now-playing").on("click.audiostreamer", function() {
    viewNowPlayingWrap();
  });  
  $(".freq-spectrum").on("click.audiostreamer", function() {
    viewFreqSpectrumWrap();
  });  
  $(".desktop-save").on("click.audiostreamer", function() {
    saveDesktopWrap();
  });  
  $(".desktop-save-as").on("click.audiostreamer", function() {
    saveDesktopAsWrap();
  });  
  $(".desktop-manage").on("click.audiostreamer", function() {
    manageDesktopsWrap();
  });  
  $(".users").on("click.audiostreamer", function() {
    manageUsersWrap();
  });  
  $(".settings").on("click.audiostreamer", function() {
    manageSettingsWrap();
  });  
  $(".view-song-info").on("click.audiostreamer", function() {
    viewSongInfoWrap();
  });  
  $(".view-logging").on("click.audiostreamer", function() {
    viewLoggingWrap();
  });  
  $(".view-create-database").on("click.audiostreamer", function() {
    viewCreateDatabaseWrap();
  });  
  $(".about-AudioStreamer").on("click.audiostreamer", function() {
    aboutAudioStreamerWrap();
  });  
  $(".logout").on("click.audiostreamer", function() {
    logoutWrap();
  });  
  //close popup
  $(".close-popup").on("click.audiostreamer", function() {
    $(this).closest(".drag").css({'display' : 'none'}).find('iframe').css({'display' : 'none'});
  });
}

//Wrapper functions, see also the theme js-files
function viewMenuWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewMenu) == 'function')) {
    this.themeObj.viewMenu.apply(this, arguments);
  } else {
    this.viewMenu.apply(this, arguments);
  }
}  
function showPlayerWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.showPlayer) == 'function')) {
    this.themeObj.showPlayer.apply(this, arguments);
  } else {
    this.showPlayer.apply(this, arguments);
  }
}  
function showTreeWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.showTree) == 'function')) {
    this.themeObj.showTree.apply(this, arguments);
  } else {
    this.showTree.apply(this, arguments);
  }
}  
function showAlbumsWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.showAlbums) == 'function')) {
    this.themeObj.showAlbums.apply(this, arguments);
  } else {
    this.showAlbums.apply(this, arguments);
  }
}  
function searchWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.search) == 'function')) {
    this.themeObj.search.apply(this, arguments);
  } else {
    this.search.apply(this, arguments);
  }
}
function viewAlbumsWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewAlbums) == 'function')) {
    this.themeObj.viewAlbums.apply(this, arguments);
  } else {
    this.viewAlbums.apply(this, arguments);
  }
}  
function viewPlaylistWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewPlaylist) == 'function')) {
    this.themeObj.viewPlaylist.apply(this, arguments);
  } else {
    this.viewPlaylist.apply(this, arguments);
  }
}  
function viewNowPlayingWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewNowPlaying) == 'function')) {
    this.themeObj.viewNowPlaying.apply(this, arguments);
  } else {
    this.viewNowPlaying.apply(this, arguments);
  }
}  
function viewFreqSpectrumWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewFreqSpectrum) == 'function')) {
    this.themeObj.viewFreqSpectrum.apply(this, arguments);
  } else {
    this.viewFreqSpectrum.apply(this, arguments);
  }
}  
function saveDesktopWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.saveDesktop) == 'function')) {
    this.themeObj.saveDesktop.apply(this, arguments);
  } else {
    this.saveDesktop.apply(this, arguments);
  }
}  
function saveDesktopAsWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.saveDesktopAs) == 'function')) {
    this.themeObj.saveDesktopAs.apply(this, arguments);
  } else {
    this.saveDesktopAs.apply(this, arguments);
  }
}  
function manageDesktopsWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.manageDesktops) == 'function')) {
    this.themeObj.manageDesktops.apply(this, arguments);
  } else {
    this.manageDesktops.apply(this, arguments);
  }
}  
function manageUsersWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.manageUsers) == 'function')) {
    this.themeObj.manageUsers.apply(this, arguments);
  } else {
    this.manageUsers.apply(this, arguments);
  }  
}  
function manageSettingsWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.manageSettings) == 'function')) {
    this.themeObj.manageSettings.apply(this, arguments);
  } else {
    this.manageSettings.apply(this, arguments);
  }
}  
function viewSongInfoWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewSongInfo) == 'function')) {
    this.themeObj.viewSongInfo.apply(this, arguments);
  } else {
    this.viewSongInfo.apply(this, arguments);
  }
}  
function viewLoggingWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewLogging) == 'function')) {
    this.themeObj.viewLogging.apply(this, arguments);
  } else {
    this.viewLogging.apply(this, arguments);
  }
}  
function viewCreateDatabaseWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.viewCreateDatabase) == 'function')) {
    this.themeObj.viewCreateDatabase.apply(this, arguments);
  } else {
    this.viewCreateDatabase.apply(this, arguments);
  }
}  
function aboutAudioStreamerWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.aboutAudioStreamer) == 'function')) {
    this.themeObj.aboutAudioStreamer.apply(this, arguments);
  } else {
    this.aboutAudioStreamer.apply(this, arguments);
  }
}  
function logoutWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.logout) == 'function')) {
    this.themeObj.logout.apply(this, arguments);
  } else {
    this.logout.apply(this, arguments);
  }
}  
function resizeImageWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.resizeImage) == 'function')) {
    this.themeObj.resizeImage.apply(this, arguments);
  } else {
    this.resizeImage.apply(this, arguments);
  }
}  
function resizeFreqSpectrumWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.resizeFreqSpectrum) == 'function')) {
    this.themeObj.resizeFreqSpectrum.apply(this, arguments);
  } else {
    this.resizeFreqSpectrum.apply(this, arguments);
  }
}  
function scrollFocusWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.scrollFocus) == 'function')) {
    this.themeObj.scrollFocus.apply(this, arguments);
  } else {
    this.scrollFocus.apply(this, arguments);
  }
}  
function actionWrap() {
  if ((typeof(themeObj) != 'undefined') && (typeof(themeObj.action) == 'function')) {
    this.themeObj.action.apply(this, arguments);
  } else {
    this.action.apply(this, arguments);
  }
}  

function genreRadio(){
  //check if radio is on
  if ($("#drag5 .handler .radio-playlist").hasClass("radio-on")) {
    //get current playing song
    var hthis = $("#playlistSortable li .jp-playlist-current");
    var hid = $(hthis).attr("songId");
    //check if a song is playing
    if (hthis.length > 0) {
      //check if this is third to the last song in playlist, if so add 6 songs automatically 
      //Should do this in a loop, but easier to just write it like this.
      var hnext = $(hthis).parent().next().next().next().children("a");
      if (hnext.length == 0) {
        $.get("./addNextRadioSong.php?id="+hid, function(data) {
          $("#playlistSortable").append(data);
        });  
      } 
    } 
  }
}

function htmlDecode(value){ 
  return $('<div/>').html(value).text(); 
}  
function spawnNotification(theBody, theIcon, theTitle) {
  // Let's check if the browser supports notifications
  if (("Notification" in window)) {
    theTitle = htmlDecode(theTitle);
    var options = {
          body: htmlDecode(theBody),
          icon: theIcon,
          tag: 'AS',
          requireInteraction: true
      };
    // Let's check whether notification permissions have already been granted
    if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var hnotification = new Notification(theTitle, options);
      //setTimeout(hnotification.close.bind(hnotification), 60000); 
      hnotification.onclick = function() { playNext(); };
    } else if (Notification.permission !== 'denied') {
      // Otherwise, we need to ask the user for permission
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var hnotification = new Notification(theTitle, options);
          //setTimeout(hnotification.close.bind(hnotification), 60000); 
          hnotification.onclick = function() { playNext(); };
        }
      });
    }  
  }
}

function playSong(hthis){
  var hmp3 = $(hthis).attr("mp3");
  
  if (hmp3!=undefined) {
    var audioElement = document.getElementById("jp_audio_0");
    audioElement.src = hmp3;
    playAudio();
   
    $("#playlistSortable li a").removeClass("jp-playlist-current").parent().removeClass("jp-playlist-current");
    $(hthis).addClass("jp-playlist-current").parent().addClass("jp-playlist-current");
    
    $(".jp-progress-title").empty().append($(hthis).html());
    $("title").empty().append($(hthis).html());
    
    //Change now playing cover
    var hid = $(hthis).attr("songId");
    //var hcover = '<div class="top-spacer"></div><img id="coverNowPlaying'+hid+'" onClick="showImage(this)" title="zoom" class="cover-now-playing" src="./getCover.php?id='+hid+'&resize=0">';
    var hcover = '<div class="top-spacer"></div><img onClick="showImage(this)" title="zoom" class="cover-now-playing" src="./getCover.php?id='+hid+'&resize=0">';
    $("#api4").empty().append(hcover);
    //resize cover art
    resizeImageWrap();   
    resizeFreqSpectrumWrap();
    
    //notification
    //spawnNotification($(hthis).html(), './getCover.php?id='+hid+'&resize=0', 'AudioStreamer');    
    
    //radio
    setTimeout(function(){genreRadio()}, 500);    
  }
}

function playPrev(){
  var hthis = $("#playlistSortable li .jp-playlist-current");
  var hprev = $(hthis).parent().prev().children("a");

  playSong(hprev);
}

function playAudio(){
  var audioElement = document.getElementById("jp_audio_0");
  audioElement.play();
  //switch pause and play buttons
  $(".jp-play").hide();
  $(".jp-pause").show();
  //
  resizeImageWrap();
  resizeFreqSpectrumWrap(); 
}

function pauseAudio(){
  var audioElement = document.getElementById("jp_audio_0");
  audioElement.pause();
  //switch pause and play buttons
  $(".jp-play").show();
  $(".jp-pause").hide();
}

function muteAudio(){
  var audioElement = document.getElementById("jp_audio_0");
  audioElement.muted = true;
  //switch pause and play buttons
  $(".jp-unmute").show();
  $(".jp-mute").hide();
}

function unmuteAudio(){
  var audioElement = document.getElementById("jp_audio_0");
  audioElement.muted = false;
  //switch pause and play buttons
  $(".jp-mute").show();
  $(".jp-unmute").hide();
}

function playNext(){
  var hthis = $("#playlistSortable li .jp-playlist-current");
  var hnext = $(hthis).parent().next().children("a");

  playSong(hnext);
}

function autoStart(){
  //start auto playing first in playlist if no song is playing
  //
  //get current playing song
  var hthis = $("#playlistSortable li .jp-playlist-current");
  //check if no song is playing
  if (hthis.length == 0) {   
    //get first song in playlist
    var hthis = $("#playlistSortable li a").first();
    //start playing
    playSong(hthis);
  } 
}
  
function addSong(hid){
  $.get("./addSong.php?id="+hid, function(data) {
    $("#playlistSortable").append(data); 
    autoStart();
  });
}

function addDirectories(hdir) {
  $.get("./addDirectories.php?id="+hdir, function(data) {
    $("#playlistSortable").append(data);
    autoStart();
  });
  //.complete(function() { autoStart(); });
}

function deleteSong(hthis){
  $(hthis).parent().remove();
  //radio
  genreRadio();
}

function radioPlaylist(){
  if (!$("#drag5 .handler .radio-playlist").hasClass("radio-on")){
    //set radio on
    var hthis = $("#playlistSortable li .jp-playlist-current");
    var hid = $(hthis).attr("songId");
    $("#drag5 .handler .radio-playlist").addClass("radio-on");
    //check radio
    genreRadio(hthis, hid);
    //save in cookie, see also function defaults()
    var myDate=new Date();
    myDate.setFullYear(2076,1,1);
    $.cookie('audiostreamer_radioPlaylist', 'radio-on', { path: '/' , expires: myDate } );   
  }
  else {
    //set radio off
    $("#drag5 .handler .radio-playlist").removeClass("radio-on");
    //save in cookie, see also function defaults()
    var myDate=new Date();
    myDate.setFullYear(2076,1,1);
    $.cookie('audiostreamer_radioPlaylist', 'radio-off', { path: '/' , expires: myDate } );   
  }
}  

function clearPlaylist(pfrom){
  if (pfrom == 'playlist') {
    $("#playlistSortable li:not(.jp-playlist-current)").remove();
  } else {
    $("#playlistSortable li").remove();  
  }  
  //radio
  genreRadio();  
}  

function shufflePlaylist() {
  var $ul = $('#playlistSortable');
  $('li:not(.jp-playlist-current)', $ul).sort(function(){
     return ( Math.round( Math.random() ) - 0.5 )
  }).appendTo($ul);
}

function resizeImage() {
  //height, width of api 
  //smallest size wins
  pwidth = $("#api4").innerWidth();
  pheight = $("#api4").innerHeight() - $("#api4 .top-spacer").height();

  psquare = Math.min(pwidth, pheight) + 'px';

  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
}  

function resizeFreqSpectrum () {
  //height, width of api 
  pwidth = $("#api16").innerWidth();
  pheight = $("#api16").innerHeight() - $("#api16 .top-spacer").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
  
  //resize canvas to width and height of the outer div 
  $("#api16 #freqcanvas").width = pwidth;
  $("#api16 #freqcanvas").height = pheight;
};

function showImage(hthis) {
  //show image div and ajax loader
  $("#largeAlbumCover").html('<div class="ajax-loader"></div>')
    .fadeIn("fast")
    .css("position","fixed")
    .css("top", ( ($(window).height() - $("#largeAlbumCover").height()) / 2) +$(window).scrollTop() + "px")
    .css("left", ( ($(window).width() - $("#largeAlbumCover").width()) / 2) +$(window).scrollLeft() + "px")
    .css('z-index',maxZ("#largeAlbumCover"))
    .on("click.audiostreamer", function(){ $("#largeAlbumCover").fadeOut("fast"); });   

  //preload the image
  //take image url from parent link (href) in case of clicking on "album - song view" image
  //take image url from image (src) in case of clicking on "now playing" image  
  var himage = $(hthis).parent().attr("href");
  if (!himage) {
    himage = $(hthis).attr("src");
  }  
  imgPreload = new Image();
  //when preloading is done, display it
  imgPreload.onload = function() {
    //show popup with full size image
    $("#largeAlbumCover").html("<img id='largeAlbumCoverImage' src='"+himage+"' title='close' />");

    //recalculate height and width of image if image is bigger than window
    hheight = imgPreload.height;
    hwidth = imgPreload.width;

    hratio = hwidth / hheight;
    if (hwidth > $(window).width()) {
      hwidth = $(window).width();
      hheight = hwidth / hratio;
      $("#largeAlbumCoverImage").css("height",hheight);
      $("#largeAlbumCoverImage").css("width",hwidth);
    }
    if (hheight > $(window).height()) {
      hheight = $(window).height();
      hwidth = hheight * hratio;
      $("#largeAlbumCoverImage").css("height",hheight);
      $("#largeAlbumCoverImage").css("width",hwidth);
    }
    
    $("#largeAlbumCover")
      .css("top", ( ($(window).height() - hheight) / 2) + $(window).scrollTop() + "px")
      .css("left", ( ($(window).width() - hwidth) / 2) + $(window).scrollLeft() + "px");   
  }
  imgPreload.src = himage;
}  

function viewMenu() {
  $("#drag1").css({'display' : 'block' , 'z-index' : maxZ()});
}

function showPlayer() {
  $("#drag6").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewAlbums() {
  $("#drag2").css({'display' : 'block' , 'z-index' : maxZ()});
}
 
function viewPlaylist() {
  $("#drag5").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewNowPlaying() {
  $("#drag4").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewFreqSpectrum() {
  $("#drag16").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewSongInfo() {
  $("#drag8").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewLogging() {
  $("#drag15").css({'display' : 'block' , 'z-index' : maxZ()});
}

function viewCreateDatabase() {
  $("#drag9").css({'display' : 'block' , 'z-index' : maxZ()});
}

function getDirectory(pid) {
  $("#api2").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $("#api2").load("./selectDirectories.php?id="+pid);
  viewAlbumsWrap();
}
  
function getTree() {
  $("#api3").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $("#api3").load("./getTree.php");
}

function showTree() {
  $("#drag3").css({'display' : 'block' , 'z-index' : maxZ()});
}

function getAlbums(pgenre,psort) {
  $("#api7").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $("#api7").load("./getAlbums.php?genre="+encodeURIComponent(pgenre)
                                +'&sort='+encodeURIComponent(psort));
}

function showAlbums() {
  $("#drag7").css({'display' : 'block' , 'z-index' : maxZ()});
}

function getSearch(pgenre,partist,palbum,psong,ppath,pgenre) {
  $("#api14").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $("#api14").load("./search.php?genre="+encodeURIComponent(pgenre)
                                +'&artist='+encodeURIComponent(partist)
                                +'&album='+encodeURIComponent(palbum)
                                +'&song='+encodeURIComponent(psong)
                                +'&path='+encodeURIComponent(ppath)
                                +'&genre='+encodeURIComponent(pgenre));
}

function search() {
  $("#drag14").css({'display' : 'block' , 'z-index' : maxZ()});
}
  
function maxZ(){
  //calculate highest z-index
  //and add one
  var hmaxZ = Math.max.apply(null,$.map($('.drag'), function(e,n){
    return parseInt($(e).css('z-index'))||1 ;
    }) 
  );
  return hmaxZ+1;
}  

function getSongDetails(pid) {
  $.get("./getSongDetails.php?id="+pid, function(data) {
    $("#api8").empty();
    $("#api8").append(data);
    viewSongInfoWrap();
  });  
}

function createDirectories(pind_append) {
  if (pind_append == 1) {
    htrue = true;
  }
  else if (confirm("Are you sure you want to (re)create the music database?\nThis could take several minutes or hours (depending on the size of the library).")) {
    htrue = true;
  }
  if (htrue === true) {
    $("#api9").empty();
    $("#api9").html('<iframe class="iframe-style" allowTransparency="true" src="./createDirectories.php?ind_append='+pind_append+'"></iframe>');
    viewCreateDatabaseWrap();    
  }
}

function getID3(pid) {
  $("#getID3").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $.get("./getID3.php?id="+pid, function(data) {
    $("#getID3").empty().append(data);
  });  
}
  
function manageDesktops(hind_all_users, hvisible) {
  if (hvisible != 0) {
    $("#drag12").css({'display' : 'block' , 'z-index' : maxZ("#drag12")});
  }
  $("#api12").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $.get("./desktopCRUD.php?pmode=R&ind_all_users="+hind_all_users, function(data) {
    $("#api12").empty();
    $("#api12").append(data);
  });  
}

function manageUsers(hvisible) {
  if (hvisible != 0) {
    $("#drag11").css({'display' : 'block' , 'z-index' : maxZ("#drag11")});
  }
  $("#api11").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $.get("./userCRUD.php?pmode=R", function(data) {
    $("#api11").empty();
    $("#api11").append(data);
  });  
}

function manageSettings(hvisible) {
  if (hvisible != 0) {
    $("#drag13").css({'display' : 'block' , 'z-index' : maxZ("#drag13")});
  }
  $("#api13").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $.get("./settingCRUD.php?pmode=R", function(data) {
    $("#api13").empty();
    //$("#api13").append(data);
    $.get("./themeCRUD.php?pmode=R", function(data2) {
      $("#api13").append(data+data2);
    });  
  });  
}
  
function logout() {
  window.location.href="./login.php";
}
  
function aboutAudioStreamer(hvisible) {
  if (hvisible != 0) {
    $("#drag10").css({'display' : 'block' , 'z-index' : maxZ("#drag10")});
  }
  $.get("./aboutAudioStreamer.php", function(data) {
    $("#api10").empty();
    $("#api10").append(data);
  });  
}

function manageLogging(hvisible, pmode, psearch) {
  if (hvisible != 0) {
    viewLoggingWrap();
  }
  $("#api15").empty().append('<div class="top-spacer"></div><div class="ajax-loader"></div>');
  $.get("./logging.php?pmode="+encodeURIComponent(pmode)
                     +"&search="+encodeURIComponent(psearch), function(data) {
    $("#api15").empty();
    $("#api15").append(data);
  });  
}

function getParams(hthis) {
  hparams="";
  $(hthis).closest("tr").find("[updId]").each(function(){
    var hdetail = $(this);

    if (hdetail.attr("type")=='checkbox'){
      if (hdetail.is(":checked")){
        hparams += "&"+hdetail.attr("updId")+"=1";
      }
      else {
        hparams += "&"+hdetail.attr("updId")+"=0";
      }
    }
    else {
      hparams += "&"+hdetail.attr("updId")+"="+hdetail.val();
    }
   });
   return hparams;
 }
   
function desktopUpdate(hthis,hind_all_users) {
  hurl = "./desktopCRUD.php?pmode=U"+getParams(hthis)+"&ind_all_users="+hind_all_users; 
  $.get(hurl, function(data) {
    xmlDoc = $.parseXML( data );
    $xml = $( xmlDoc );    
    haction = '<script type="text/javascript">' + $xml.find("action").text() + '<\/script>';
    
    $("#api12").append(haction);
    if ($xml.find("status").text() == "SUCCESS") {
      $(hthis).closest("tr").find(".changed").removeClass("changed");
    }
  });  
  //requery
  //manageDesktops(hind_all_users);  
}
                         
function desktopCopy(hthis,hind_all_users) {
  hurl = "./desktopCRUD.php?pmode=C"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageDesktops(hind_all_users);  
  });  
}

function desktopDelete(hthis,hind_all_users) {
  hurl = "./desktopCRUD.php?pmode=D"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageDesktops(hind_all_users);  
  });  
}

function saveDesktop() {
  hcmd = "";
  $('.drag').each(function() {
    hcmd += "INSERT"+$(this).attr("id")+"','"+$(this).attr("style")+"');";
  });  

  hurl = "./saveDesktopItems.php"; 
  $.post(hurl, {type:'save', cmd: hcmd} , function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
  });
}

function saveDesktopAs() {
  var hname=prompt("Save desktop as ...","");
  if (hname!=null && hname!="") {
    hcmd = "";

    $('.drag').each(function() {
      hcmd += "INSERT"+$(this).attr("id")+"','"+$(this).attr("style")+"');";
    });  

    hurl = "./saveDesktopItems.php"; 
    $.post(hurl, {type:'saveAs', cmd: hcmd, name: hname} , function(data) {
      //if (data != "SUCCESS") {
      //  alert(data);
      //}
    });
  }
}

function themeswitchcss(hcss) {
  //add theme css file
  if (hcss) {
    //only add if new is different from current
    if ($("#themecss").attr("href") != hcss) {
      $("#themecss").prop('disabled',true).remove();
      $('head').append('<link id="themecss" rel="stylesheet" href="'+hcss+'" type="text/css" />');
    }
  }
}

function themeswitchjs(hjs) {
  //add theme js file
  if (hjs) {
    $.getScript(hjs);
    //store reference to this js file
    $("#themejsref").remove();
    $('body').append('<div id="themejsref" style="display:none" src="'+hjs+'"></div>');
  }
}

function recallDesktop(pmsg) {
  hurl = "./getDesktopItems.php"; 
  $.get(hurl, function(data) {
    xmlDoc = $.parseXML(data);
    $xml = $(xmlDoc);    

    if ($xml.find("status").text() == "SUCCESS") {    
      //recall styles of drag div's
      $xml.find("desktopitem").each(function() {
        $('#'+$(this).find("item").text()).attr("style", $(this).find("style").text());         
      });
      
      //resize the now playing image and the freq spectrum
      resizeImageWrap();
      resizeFreqSpectrumWrap();
      
      //recall the theme
      themeswitchcss($xml.find("css").text());
      themeswitchjs($xml.find("js").text());
    }

    if (pmsg == 1) {
      alert($xml.find("message").text());  
    }
  });  
}

function userUpdate(hthis) {
  hurl = "./userCRUD.php?pmode=U"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    else {
      $(hthis).closest("tr").find(".changed").removeClass("changed");
    }
  });  
  //requery
  manageUsers();  
}
                         
function userCopy(hthis) {
  hurl = "./userCRUD.php?pmode=C"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageUsers();  
  });  
}

function userDelete(hthis) {
  hurl = "./userCRUD.php?pmode=D"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageUsers();  
  });  
}

function settingUpdate(hthis) {
  hurl = "./settingCRUD.php?pmode=U"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    else {
      $(hthis).closest("tr").find(".changed").removeClass("changed");
    }
  });  
  //requery
  //manageSettings();  
}

function themeUpdate(hthis) {
  hurl = "./themeCRUD.php?pmode=U"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    else {
      $(hthis).closest("tr").find(".changed").removeClass("changed");
    }
  });  
  //requery
  //manageSettings();  
}
                         
function themeCopy(hthis) {
  hurl = "./themeCRUD.php?pmode=C"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageSettings();  
  });  
}

function themeDelete(hthis) {
  hurl = "./themeCRUD.php?pmode=D"+getParams(hthis); 
  $.get(hurl, function(data) {
    if (data != "SUCCESS") {
      alert(data);
    }
    //requery
    manageSettings();  
  });  
}

function action(hthis) {
  //does nothing here (look for it in the themes)
}

function readableDuration(seconds) {
  sec = Math.floor( seconds );    
  min = Math.floor( sec / 60 );
  min = min >= 10 ? min : '0' + min;    
  sec = Math.floor( sec % 60 );
  sec = sec >= 10 ? sec : '0' + sec;    
  return min + ':' + sec;
}

function changeProgressBar() {
  //
  var audioElement = document.getElementById("jp_audio_0"); 
  psec = audioElement.currentTime;
  pjdur = audioElement.duration;
  //get current playing song
  var hthis = $("#playlistSortable li .jp-playlist-current");
  var pdur = $(hthis).attr("dur");
  var pdurformat = $(hthis).attr("durformat");
  var pwidth = 0;
  //if (pjdur=='Infinity' || pjdur==0) {
  //duration = Infinity (NaN:NaN) or zero when streaming through resampling, there is no content-length...
  //we are not using this duration
  //}
  //change the currentime
  $(".jp-current-time").html(readableDuration(psec));
  //change the duration
  $(".jp-duration").html(pdurformat);
  //change the progresbar
  pwidth = (psec/pdur)*100;
  if (!isFinite(pwidth)) { pwidth = 0; }
  if (pwidth > 100) { pwidth = 100; }
  $(".jp-interface .jp-play-bar").css({'width' : pwidth+'%'});
  //
  var seekableEnd = 0;
  if (audioElement.seekable.length > 0) {
    seekableEnd = audioElement.seekable.end(audioElement.seekable.length - 1);
  }
  pwidth = (seekableEnd / pdur)*100;
  if (!isFinite(pwidth)) { pwidth = 0; }
  if (pwidth > 100) { pwidth = 100; }
  $(".jp-interface .jp-seek-bar").css({'width' : pwidth+'%'});
  //
  var bufferedEnd = 0;
  if (audioElement.buffered.length > 0) {
    bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
  }
  pwidth = (bufferedEnd / pdur)*100;
  if (!isFinite(pwidth)) { pwidth = 0; }
  if (pwidth > 100) { pwidth = 100; }
  $(".jp-interface .jp-buffer-bar").css({'width' : pwidth+'%'});
}    
  
//custom jquery filter: instead of finding all matched content only finds content that starts with a given string
$.expr[":"].startsWith = function(el, i, m) {
  var search = m[3];        
  if (!search) return false;
  return eval("/^[/]*" + search + "/i").test($(el).text());
};

function scrollFocus(hthis) {
  hapi = "#"+$(hthis).closest(".api").attr("id");

  if ($(hapi+" .scrollfield").val() == "") {
    $(hapi).scrollTop(0);
    $(hapi+" #tree li").removeClass("highlighted");
  } else {
    $(hapi+" #tree li").removeClass("highlighted");
    $(hapi+" #tree li:startsWith("+$(hapi+" .scrollfield").val()+")").addClass("highlighted");
    if ($(hapi+" .highlighted").length != 0) {$(hapi).scrollTop($(hapi+" .highlighted").position().top - $(hapi+" .top-spacer").height())};
  }
}

function defaults() {
  //store some defaults through cookies
  //radio-playlist see also function radioPlaylist
  $("#visualScale").on("change.audiostreamer", function() {
    var myDate=new Date();
    myDate.setFullYear(2076,1,1);
    $.cookie('audiostreamer_visualScale', $(this).val(), { path: '/' , expires: myDate } ); 
  });
  $("#visualSelect").on("change.audiostreamer", function() {
    var myDate=new Date();
    myDate.setFullYear(2076,1,1);
    $.cookie('audiostreamer_visualSelect', $(this).val(), { path: '/' , expires: myDate } ); 
    //
    //clear the current state if no visualisation
    if ($(this).val() == 'NONE') {
      //get the context from the canvas to draw on
      var freqcanvas = document.getElementById('freqcanvas');
      var freqctx = freqcanvas.getContext("2d");
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
    }
  });  
  //retrieve some defaults through cookies
  var pvisualScale = $.cookie('audiostreamer_visualScale');
  if (pvisualScale) {
    $("#visualScale").val(pvisualScale);
    updateScale(pvisualScale);
  }
  var pvisualSelect = $.cookie('audiostreamer_visualSelect');
  if (pvisualSelect) {
    $("#visualSelect").val(pvisualSelect);
  }
  var pradioPlaylist = $.cookie('audiostreamer_radioPlaylist');
  if (pradioPlaylist) {
    if (pradioPlaylist == 'radio-on') {
      $("#drag5 .handler .radio-playlist").addClass("radio-on");
    } else {
      $("#drag5 .handler .radio-playlist").removeClass("radio-on");
    }
  }
}

//update the scale with the value from the range input
function updateScale(vol) {
  $('#visualScale').attr("title", "fps:" + vol);
}
function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;
  // The result should be between 0.1 and 10
  var minv = Math.log(0.1);
  var maxv = Math.log(10);
  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);
  return Math.exp(minv + scale*(position-minp));
}

function isTouchDevice() { 
  return (window.ontouchstart !== undefined); 
}

//Calculating weighting filter frequency to dBA and dBC
//http://www.sengpielaudio.com/calculator-dba-spl.htm
function weighting(f,t) {
  with (Math) {
    if (!f) return 0;
    f2=f*f;
    n1=12200*12200;
    n2=20.6*20.6;
    n3=8800;
    n4=7850*7850;
    n5=12150;
    n6=2900*2900;
    //
    a=n1*f2*f2;
    a/=((f2+n2)*(f2+n1)*sqrt(f2+107.7*107.7)*sqrt(f2+737.9*737.9));
    a/=0.79434639580229505;
    a=20*LOG10E*log(a);
    if (abs(a)<0.0001) a=0;
    //
    c=n1*f2;
    c/=((f2+n1)*(f2+n2));
    c/=0.9929048655202054;
    c=20*LOG10E*log(c);
    if (abs(c)<0.0001) c=0;
    //
    if (t=='A') return a;
    if (t=='C') return c;    
  }	
}

function Amplitude2dB(amplitude) {
  return 20 * Math.log(amplitude) / Math.LN10;
}

function dB2Amplitude(db) {
  return Math.pow(10, db / 20);
}

//https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas/7592676#7592676
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  if (r>0) {
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
  }
  return this;
}

//color variables
var hcolorFreq = '#ff6812';
var hcolorGridLine = 'black';
var hcolorOsc = 'black';
var hcolorWave = '#ff6812';
var hcolorMeter = '#ff6812'; 
var hcolorSquare = '#ff6812';
var hcolorSquareShadow = 'black';
var hcolorSpike = '#ff6812';
var hcolorSpikeShadow = 'black';
var hcolorTail = '#ff6812';
var hcolorTailShadow = 'black';

function initWebAudioApi() {
  //
  //If we're on a touch device (phone, tablet), lots of trouble on the web audio api, so disable
  //If visuals button does not exists, disable Web Audio Api  
  //condition on touch removed, added extra value 'NONE' in visualSelect
  //if (($("#api1 .freq-spectrum").length == 1) && (!isTouchDevice()) ) {
  if ($("#api1 .freq-spectrum").length == 1) {
    //"use strict";
    
    //
    //get the context from the canvas to draw on
    var freqcanvas = document.getElementById('freqcanvas');
    var freqctx = freqcanvas.getContext("2d");
    // create a temp canvas we use for copying and scrolling
    var tempcanvas = document.createElement("canvas");
    var tempctx = tempcanvas.getContext("2d");
    //gradient for the spectrogram
    var rainbow = new Rainbow();
    rainbow.setSpectrum('black','blue','green','yellow','orange','red','white');
    var dynaRange = new Rainbow();
    //dynaRange.setSpectrum('#ff4800','#ff9100','#ffd900','#d9ff00','#90ff00','#48ff00');
    dynaRange.setSpectrum('#ff0000','#ff4800','#ff9100','#ffd900','#d9ff00','#90ff00','#48ff00','#00ff00');
    
    //default font for canvas
    var hfont = '10px Helvetica';
    //
    var animId = 0;
    var animTimerId;
    var renderTimerId;
    var renderCount = 0;
    var hmessage;
    //
    var fps = 20;
    fps = $("#visualScale").val();
    var now;
    var then;
    var interval = 1000/fps;
    var delta;
    //
    var hscale = 1;
    var hchoice = $("#visualSelect").val();
    var hchoiceprev;
    
    // http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
    // create the audio context
    // Webkit/blink browsers need prefix, Safari won't work without window.      
    var context;
    if (typeof window.AudioContext !== "undefined") {
      context = new window.AudioContext();
    } else if (typeof window.webkitAudioContext !== "undefined") {
      context = new window.webkitAudioContext();
    } else {
      hmessage = '<div>'
        +'Sorry, the frequency spectrum won\'t work.'
        +'<br />Your browser does not support the html5 Web Audio Api.'
        +'<br />'
        +'<br />You can always try it in Chrome or FireFox.'
        +'</div>';
      $("#visualisation").empty().append(hmessage);
      return;
    }   
    //chrome 66
    //One-liner to resume playback when user interacted with the page.
    document.querySelector('body').addEventListener('click', function() {
      context.resume().then(() => {
        //console.log('Playback resumed successfully');
      });
    });       
    //
    var audioElement = document.getElementById("jp_audio_0");
    var source = context.createMediaElementSource(audioElement);
    
    //setup analyser
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -100;
    analyser.maxDecibels = 0;
    //setup analyser2
    var analyser2 = context.createAnalyser();
    analyser2.fftSize = 2048;
    analyser2.minDecibels = -100;
    analyser2.maxDecibels = 0;
    //rms smoothing (loudness metering)
    var oldpeak1 = 0;
    var oldpeak2 = 0;
    var oldrms1 = 0;
    var oldrms2 = 0;
    var hsmoothingpeak2;
    var hsmoothingrms1;
    var hsmoothingrms2;
    var hglobalAlpha;
    var range = analyser.maxDecibels - analyser.minDecibels;
    //tail, square, spike
    var pos = [];
    var squareH = 50;
    var spikeH = 50;
    var tailH = 200;
    
    //connect the source to the analyser
    source.connect(analyser);
    source.connect(analyser2);
    //and connect to destination
    source.connect(context.destination);  
    
    window.requestAnimFrame = (function(callback) {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame || function(callback) {
          animTimerId = window.setTimeout(callback, 1000 / 60);
        };
    })();
    
    window.cancelAnimFrame = (function(handle) {
      return window.cancelAnimationFrame || window.webkitCancelAnimationFrame
        || window.mozCancelAnimationFrame || window.oCancelAnimationFrame
        || window.msCancelAnimationFrame || function(handle) {
          clearTimeout(animTimerId);
        };
    })();
    
    $("#jp_audio_0").on('pause', function() {
      //
      //cancel last animation frame
      clearTimeout(renderTimerId);
      if (animId) { window.cancelAnimFrame(animId); } 
      //reset analyser smoothingConstant
      analyser.smoothingTimeConstant = 1;    
      analyser2.smoothingTimeConstant = 1;    
      hsmoothingpeak2 = 1;
      hsmoothingrms1 = 1;
      hsmoothingrms2 = 1;
      //
      renderCount = 0;
    });        
    $("#jp_audio_0").on('play', function() {
      //
      //cancel last animation frame
      clearTimeout(renderTimerId);
      if (animId) { window.cancelAnimFrame(animId); } 
      //reset analyser smoothingConstant
      analyser.smoothingTimeConstant = 0;//0.3;    
      analyser2.smoothingTimeConstant = 0;    
      hsmoothingpeak2 = 0;
      hsmoothingrms1 = 1;
      hsmoothingrms2 = 1;
      setTimeout(function(){
        //set analyser smoothingConstant values back
        //without timer this won't work        
        smoothingConstants();
      },300);  
      //
      renderCount = 0;      
      //canvas reset
      //freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      //spike reset
      pos[0] = {x:0,y:(spikeH/2)};
      freqctx.moveTo(pos[0].x,pos[0].y);
      //draw spectrums
      render();
    });    
    $("#visualScale").on('change', function () {
      fps = $("#visualScale").val();
      //set analyser smoothingConstant values back
      smoothingConstants();
      //correct smoothing constants with fps-factor
      analyser.smoothingTimeConstant = smoothingFPS(analyser.smoothingTimeConstant);
      analyser2.smoothingTimeConstant = smoothingFPS(analyser2.smoothingTimeConstant);
      hsmoothingpeak2 = smoothingFPS(hsmoothingpeak2);
      hsmoothingrms1 = smoothingFPS(hsmoothingrms1);
      hsmoothingrms2 = smoothingFPS(hsmoothingrms2);
      //
      hglobalAlpha = smoothingFPS(hglobalAlpha);
    });
    
    function smoothingConstants() {
      //set analyser smoothingConstant values back
      analyser.smoothingTimeConstant = 0.3;
      analyser2.smoothingTimeConstant = 0.99;    
      hsmoothingpeak2 = 0.85;
      hsmoothingrms1 = 0.7;
      hsmoothingrms2 = 0.95;
      //
      hglobalAlpha = 0.99;
    }
    
    function smoothingFPS(hvalue) {
      //correct smoothing constants with fps-factor
      if (hvalue == 0 || hvalue == 1) {
        //do nothing
      } else {
        hvalue = hvalue + ((1-hvalue)*fps/150);
      }    
      return hvalue;
    }
    
    //draw the grid and spectrums
    function render(now) {
      //through requesting new frame is good, but gives rather high cpu...
      //therefore extra timeout
      //renderTimerId = window.setTimeout(function(){
      //  animId = window.requestAnimFrame(render);    
      //}, 0);
      //}, 100);

      if (!then) { 
        then = now;
      }
      requestAnimationFrame(render);
      delta = now - then;
      
      interval = 1000/fps;

      if (delta > interval) {
        //http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/ 
        then = now - (delta % interval);

        //
        renderCount = renderCount + 1;      
        //
        hchoiceprev = hchoice;
        hchoice = $("#visualSelect").val();

        //clear the current state if no visualisation
        //if (hchoice == 'NONE') {
        //  freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
        //}

        //if song is playing and spectrum is visible then redraw
        if (!audioElement.paused && $("#drag16:visible").length!=0 && hchoice != 'NONE') {
          var freqarray = new Uint8Array(analyser.frequencyBinCount);
          var freqarray2 = new Uint8Array(analyser2.frequencyBinCount);
          var timearray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqarray);  
          analyser2.getByteFrequencyData(freqarray2);  
          analyser.getByteTimeDomainData(timearray);  

          //if height or width is different then
          //resize canvas to width and height of the outer div
          if (freqctx.canvas.width != $("#visualisation").width()) {
            freqctx.canvas.width = $("#visualisation").width();
          }
          if (freqctx.canvas.height != $("#visualisation").height()) {
            freqctx.canvas.height = $("#visualisation").height();
          }
          //default font
          freqctx.font = hfont;          
                    
          if (hchoiceprev != hchoice) {
            //clear the current state
            freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
          }
          if (hchoice=='FREQ') {
            //FREQUENCY
            //clear the current state
            freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
            //set temp-canvas to zero
            tempctx.canvas.width = 0;   
            tempctx.canvas.height = 0;

            drawFreqLine(freqarray);
            drawGrid();
            drawFreqLine2(freqarray2);
            //drawTime(timearray);
          } else if (hchoice=='METER') {
            //METER
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawMeter(timearray);
          } else if (hchoice=='LOUDNESS') {
            //LOUDNESS METER
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawLoudness(timearray);
          } else if (hchoice=='SPECTRO') {
            //SPECTROGRAM
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawSpectro(freqarray);
          } else if (hchoice=='OSC') {
            //OSCILLATOR
            //clear the current state
            freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
            //set temp-canvas to zero
            tempctx.canvas.width = 0;
            tempctx.canvas.height = 0;

            drawTime(timearray);
          } else if (hchoice=='WAVE') {
            //WAVEFORM
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawWave(timearray);
          } else if (hchoice=='SQUARE') {
            //SQUARE
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawSquare(timearray);
          } else if (hchoice=='SPIKE') {
            //SPIKE
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawSpike(timearray);
          } else if (hchoice=='TAIL') {
            //TAIL
            //set temp canvas to same size
            tempctx.canvas.width = freqctx.canvas.width;
            tempctx.canvas.height = freqctx.canvas.height;        

            drawTail(timearray);
          }
        }
      }
    }
    
    function drawFreqLine(freqarray) {
      // Draw the frequency domain chart.
      freqctx.beginPath();
      freqctx.moveTo(0,freqcanvas.height);
      //
      freqctx.fillStyle = hcolorFreq;
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'black';
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      for (var i = 0; i < (freqarray.length); i++) {
        var value = freqarray[i];
        var percent = value / 256;
        var height = freqcanvas.height * percent * hscale;
        var offset = freqcanvas.height - height - 1;
        var hfreq = Math.round(i*context.sampleRate/analyser.fftSize); 
        var xpos = Math.round((Math.log(hfreq/10)*freqcanvas.width)/Math.log(context.sampleRate/20));
        if (i==0) { xpos = 0;}
        freqctx.lineTo(xpos, offset);
      }
      freqctx.lineTo(freqcanvas.width, freqcanvas.height);      
      freqctx.fill();
      freqctx.closePath();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            
    }
    
    function drawFreqLine2(freqarray2) {
      // Draw the frequency domain chart.
      freqctx.beginPath();
      freqctx.moveTo(0,freqcanvas.height);
      //
      freqctx.lineWidth = 2;
      freqctx.strokeStyle = hcolorGridLine;
      freqctx.shadowBlur = 0; 
      freqctx.shadowColor = 'white';
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      for (var i = 0; i < (freqarray2.length); i++) {
        var value = freqarray2[i];
        var percent = value / 256;
        var height = freqcanvas.height * percent * hscale;
        var offset = freqcanvas.height - height - 1;
        var hfreq = Math.round(i*context.sampleRate/analyser2.fftSize); 
        var xpos = Math.round((Math.log(hfreq/10)*freqcanvas.width)/Math.log(context.sampleRate/20));
        if (i==0) { xpos = 0;}
        freqctx.lineTo(xpos, offset);
      }
      freqctx.lineTo(freqcanvas.width, freqcanvas.height);
      //
      freqctx.closePath();
      freqctx.stroke();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            
    }
    
    function drawGrid() {
      //
      // Draw the log-grid on the x-axis of the frequency domain chart.
      var gridx = [10,20,30,40,50,60,70,80,90,
                   100,200,300,400,500,600,700,800,900,
                   1000,2000,3000,4000,5000,6000,7000,8000,9000,
                   10000,20000];
      var labelx = ["","20","30","","50","","","","",
                    "100","","300","","500","","","","",
                    "1k","","3k","","5k","","","","",
                    "10k","20k"];
      freqctx.beginPath();   
      freqctx.globalAlpha = 1;
      freqctx.fillStyle = hcolorGridLine;
      freqctx.lineWidth = 0.1;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'white';
      freqctx.shadowOffsetX = -1;      
      freqctx.shadowOffsetY = -1;            
      for (var i = 0; i < gridx.length; i++) {
        var xpos = Math.round((Math.log(gridx[i]/10)*freqcanvas.width)/Math.log(context.sampleRate/20)); 
        freqctx.moveTo(xpos, 0);
        freqctx.lineTo(xpos, freqcanvas.height-2);
        //
        freqctx.fillText(labelx[i], xpos+2, freqcanvas.height-3);
      }
      //
      //Draw the grid on the y-axis of the frequency domain chart.     
      for (var i = 0; i < (range/10); i++) {
        var ypos = Math.round((i*freqcanvas.height)/(range/10)); 
        freqctx.moveTo(0, ypos);
        freqctx.lineTo(freqcanvas.width, ypos);
        //
        freqctx.fillText((analyser.maxDecibels-(i*10)), 2, ypos-2);
      }
      //
      freqctx.closePath();
      freqctx.stroke();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            
    }
  
    function drawSpectro(freqarray) {
      // Draw the spectrogram chart.
      // copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);
      
      freqctx.beginPath();
      
      for (var i = 0; i < freqarray.length; i++) {
        // draw each pixel with the specific color
        var value = freqarray[i];
        var percent = value / 256;
        var hfreq = Math.round(i*context.sampleRate/analyser.fftSize); 
        var ypos;
        var yposprev = ypos;
        ypos = Math.round((Math.log(hfreq/10)*freqcanvas.height)/Math.log(context.sampleRate/20));
        if (i==0) { ypos = 0;}
        freqctx.fillStyle = "#"+rainbow.colourAt(percent * 100 * hscale);
        // draw the line at the right side of the canvas
        freqctx.fillRect(freqcanvas.width - 1, freqcanvas.height - ypos, 1, (ypos - yposprev));
      }
      freqctx.closePath();
      
      // restore main canvas
      freqctx.drawImage(tempcanvas, -1,0);    
    }
    
    function drawTime(timearray) { 
      // Draw the time domain chart.
      freqctx.beginPath();   
      for (var i = 0; i < (timearray.length); i++) {
        var value = timearray[i];
        var percent = value / 256;
        var height = freqcanvas.height * (((percent - 0.5) * hscale) + 0.5);
        var ypos = freqcanvas.height - height - 1;
        var barWidth = freqcanvas.width/timearray.length;
        if (barWidth <= 1) {barWidth = 1;}
        freqctx.lineWidth = 2;
        freqctx.lineTo(i * barWidth, ypos);
      }
      freqctx.strokeStyle = hcolorOsc;
      freqctx.stroke();
      //
      freqctx.closePath();
    }
    
    function drawWave(timearray) {
      //
      //Draw the grid on the x-axis of the wave domain chart.
      //freqctx.beginPath();
      //for (var i = 0; i < 10; i++) {
      //  var ypos = Math.round((i*freqcanvas.height)/10); 
      //  freqctx.globalAlpha = 0.2;
      //  freqctx.fillStyle = 'red';
      //  freqctx.fillRect(freqcanvas.width - 1, ypos, 1, 1);         
      //  freqctx.globalAlpha = 1;
      //}   
      //freqctx.closePath();     
      //freqctx.stroke();
      //
      
      // Draw the waveform.
      // copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);
      
      freqctx.beginPath();
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      // restore main canvas
      freqctx.drawImage(tempcanvas, -1,0);    
      //
      freqctx.globalAlpha = 1;
      freqctx.fillStyle = hcolorWave;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'black';
      freqctx.shadowOffsetX = 1;      
      freqctx.shadowOffsetY = 0;          
      //wave
      var min = 0.5;
      var max = 0.5;
      var peak = 0;
      var rms = 0;
      for (var i = 0; i < timearray.length; i++) {
        var value = timearray[i];
        var percent = value / 256;
        min = Math.min(percent, min);
        max = Math.max(percent, max);
      }
      //
      var height = freqcanvas.height * (((min - 0.5) * hscale) + 0.5);
      var ymin = freqcanvas.height - height - 1;
      var height = freqcanvas.height * (((max - 0.5) * hscale) + 0.5);
      var ymax = freqcanvas.height - height - 1;
      freqctx.lineWidth = 1;
      freqctx.fillRect(freqcanvas.width - 2, ymax, 1, ymin-ymax);
      
      //
      freqctx.closePath();     
      freqctx.stroke();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            

    }  

    function drawMeter(timearray) {
      //Draw the meter
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      //
      //db range
      var dbrange = 48;
      //
      //Draw the grid on the x-axis of the meter chart.
      //per 3db
      freqctx.beginPath();
      freqctx.globalAlpha = 1;
      freqctx.fillStyle = hcolorGridLine;
      freqctx.lineWidth = 0.1;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'white';
      freqctx.shadowOffsetX = -1;      
      freqctx.shadowOffsetY = -1;      
      var count = Math.round(dbrange/3)+1;
      for (var i = 0; i < count; i++) {
        var percent = (dbrange - (i*3))/dbrange;
        var height = freqcanvas.height * percent;
        var ypos = Math.round(freqcanvas.height - height - 1);
        //
        freqctx.moveTo(0, ypos);
        freqctx.lineTo(freqcanvas.width, ypos);
        //
        if (i>0) {
          freqctx.fillText('-'+(i*3), 2, ypos-2);
        }
      }   
      freqctx.closePath();     
      freqctx.stroke();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            

      freqctx.beginPath();
      //
      //wave
      var min = 0.5;
      var max = 0.5;
      var peak = 0;
      var rms = 0;
      for (var i = 0; i < timearray.length; i++) {
        var value = timearray[i];
        var percent = value / 256;
        min = Math.min(percent, min);
        max = Math.max(percent, max);
        //
        percent = (Math.abs(value-128)/128);
        peak = Math.max(peak, percent);
        rms = rms + (percent * percent);
      }
      //
      //peakdb1
      percent = peak;
      oldpeak1 = percent;
      var peakdb1 = Amplitude2dB(percent);
      //
      //peakdb2
      percent = peak;
      if (percent < oldpeak2) {
        percent = (hsmoothingpeak2 * oldpeak2) + ((1 - hsmoothingpeak2) * percent);
      }
      oldpeak2 = percent;
      var peakdb2 = Amplitude2dB(percent);
      //
      //rmsdb1
      percent = Math.sqrt(rms / timearray.length);
      //if (percent > oldrms1) {
      percent = (hsmoothingrms1 * oldrms1) + ((1 - hsmoothingrms1) * percent);
      //}
      oldrms1 = percent;
      var rmsdb1 = Amplitude2dB(percent);
      //
      //rmsdb2
      percent = Math.sqrt(rms / timearray.length);
      percent = (hsmoothingrms2 * oldrms2) + ((1 - hsmoothingrms2) * percent);
      oldrms2 = percent;
      var rmsdb2 = Amplitude2dB(percent);

      freqctx.beginPath();

      //
      var hbarwidth = freqcanvas.width/2/3-10;

      //
      //peakdb1 bar
      percent = (dbrange - Math.abs(peakdb1))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;
      //
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 5;
      freqctx.shadowColor = 'black';
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      freqctx.fillStyle = hcolorMeter;
      freqctx.roundRect(freqcanvas.width*(1/4)+5, ypos, hbarwidth-10, freqcanvas.height-ypos+5,5).fill();    
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;
      freqctx.shadowOffsetY = 0;

      //
      //peakdb2
      percent = (dbrange - Math.abs(peakdb2))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;
      //rmsdb1
      percent = (dbrange - Math.abs(rmsdb1))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos2 = freqcanvas.height - height - 1;
      //
      //dynamic range (peakdb2 - rmsdb1)
      var dynamic = (peakdb2 - rmsdb1);
      if (dynamic) {
        if (dynamic <= 7) {
          freqctx.fillStyle = '#ff0000';
        } else if (dynamic <= 8) {
          freqctx.fillStyle = '#ff4800';
        } else if (dynamic <= 9) {
          freqctx.fillStyle = '#ff9100';
        } else if (dynamic <= 10) {
          freqctx.fillStyle = '#ffd900';
        } else if (dynamic <= 11) {
          freqctx.fillStyle = '#d9ff00';
        } else if (dynamic <= 12) {
          freqctx.fillStyle = '#90ff00';
        } else if (dynamic <= 13) {
          freqctx.fillStyle = '#48ff00';
        } else if (dynamic >= 14) {
          freqctx.fillStyle = '#00ff00';
        //} else {
        //  freqctx.fillStyle = "#"+dynaRange.colourAt( ((dynamic-8 )/8) * 100 );
        }
      }
      //dynamic bar
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 5;
      freqctx.shadowColor = 'black';//freqctx.fillStyle;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      freqctx.roundRect(freqcanvas.width*(1/4)+hbarwidth+5, ypos, hbarwidth-10, (ypos2-ypos),5).fill();    
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;
      freqctx.shadowOffsetY = 0;

      //rmsdb2 bar
      percent = (dbrange - Math.abs(rmsdb2))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;
      //
      freqctx.fillStyle = hcolorMeter;
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 5;
      freqctx.shadowColor = 'black';
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      freqctx.roundRect(freqcanvas.width*(1/4)+2*hbarwidth+5, ypos, hbarwidth-10, freqcanvas.height-ypos+5,5).fill();    
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      

      //numbers
      freqctx.globalAlpha = 1;
      freqctx.font = hbarwidth+'px Helvetica';
      freqctx.fillStyle = 'white';
      freqctx.textAlign = 'center'; 
      freqctx.shadowBlur = 5;
      freqctx.shadowColor = 'black';
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      if (peakdb1 && peakdb1 > -100) {
        freqctx.font = Math.round((hbarwidth-10)/2)+'px Helvetica';
        freqctx.fillText(Math.round(peakdb1), freqcanvas.width*(1/4)+hbarwidth/2, freqcanvas.height-22);
        freqctx.font = hfont;        
        freqctx.fillText('peak', freqcanvas.width*(1/4)+hbarwidth/2, freqcanvas.height-5);          
      }
      if (dynamic && dynamic > -100) {
        freqctx.font = Math.round((hbarwidth-10)/2)+'px Helvetica';
        freqctx.fillText(Math.round(dynamic), freqcanvas.width*(1/4)+hbarwidth+hbarwidth/2, freqcanvas.height-22);          
        freqctx.font = hfont;        
        freqctx.fillText('DR', freqcanvas.width*(1/4)+hbarwidth+hbarwidth/2, freqcanvas.height-5);          
      }
      if (rmsdb2 && rmsdb2 > -100) {
        freqctx.font = Math.round((hbarwidth-10)/2)+'px Helvetica';
        freqctx.fillText(Math.round(rmsdb2), freqcanvas.width*(1/4)+2*hbarwidth+hbarwidth/2, freqcanvas.height-22);
        freqctx.font = hfont;        
        freqctx.fillText('rms', freqcanvas.width*(1/4)+2*hbarwidth+hbarwidth/2, freqcanvas.height-5);
      }
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      //
      freqctx.font = hfont;
      freqctx.textAlign = 'left'; 

    }  

    function drawLoudness(timearray) {
      // Draw the loudness
      // copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);    
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);

      //
      //db range
      var dbrange = 48;
      //
      //Draw the grid on the x-axis of the meter chart.
      //per 3db
      freqctx.beginPath();
      freqctx.globalAlpha = 1;
      freqctx.fillStyle = hcolorGridLine;
      freqctx.lineWidth = 0.1;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'white';
      freqctx.shadowOffsetX = -1;      
      freqctx.shadowOffsetY = -1;      
      var count = Math.round(dbrange/3)+1;
      for (var i = 0; i < count; i++) {
        var percent = (dbrange - (i*3))/dbrange;
        var height = freqcanvas.height * percent;
        var ypos = Math.round(freqcanvas.height - height - 1);
        //
        freqctx.moveTo(freqcanvas.width - 1, ypos);
        freqctx.lineTo(freqcanvas.width, ypos);
        //
        if ( renderCount % (freqcanvas.width/2) == 0 || renderCount == 1 ) {
          if (i>0) {
            freqctx.fillText('-'+(i*3),freqcanvas.width - 25, ypos-2);
          }
        }
      }   
      freqctx.closePath();     
      freqctx.stroke();
      //resetten
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;            

      freqctx.beginPath();
      // restore main canvas
      freqctx.drawImage(tempcanvas, -1,0);    
      
      //
      //wave
      var min = 0.5;
      var max = 0.5;
      var peak = 0;
      var rms = 0;
      for (var i = 0; i < timearray.length; i++) {
        var value = timearray[i];
        var percent = value / 256;
        min = Math.min(percent, min);
        max = Math.max(percent, max);
        //
        percent = (Math.abs(value-128)/128);
        peak = Math.max(peak, percent);
        rms = rms + (percent * percent);
      }
      //
      //peakdb1
      percent = peak;
      oldpeak1 = percent;
      var peakdb1 = Amplitude2dB(percent);
      //
      //peakdb2
      percent = peak;
      if (percent < oldpeak2) {
        percent = (hsmoothingpeak2 * oldpeak2) + ((1 - hsmoothingpeak2) * percent);
      }
      oldpeak2 = percent;
      var peakdb2 = Amplitude2dB(percent);
      //
      //rmsdb1
      percent = Math.sqrt(rms / timearray.length);
      //if (percent > oldrms1) {
      percent = (hsmoothingrms1 * oldrms1) + ((1 - hsmoothingrms1) * percent);
      //}
      oldrms1 = percent;
      var rmsdb1 = Amplitude2dB(percent);
      //
      //rmsdb2
      percent = Math.sqrt(rms / timearray.length);
      percent = (hsmoothingrms2 * oldrms2) + ((1 - hsmoothingrms2) * percent);
      oldrms2 = percent;
      var rmsdb2 = Amplitude2dB(percent);

      freqctx.beginPath();

      //
      //peakdb1
      percent = (dbrange - Math.abs(peakdb1))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;

      //peakdb2
      percent = (dbrange - Math.abs(peakdb2))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;

      //rmsdb1
      percent = (dbrange - Math.abs(rmsdb1))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos2 = freqcanvas.height - height - 1;

      //dynamic range (peakdb2 - rmsdb1)
      var dynamic = (peakdb2 - rmsdb1);
      if (dynamic) {
        if (dynamic <= 7) {
          freqctx.fillStyle = '#ff0000';
        } else if (dynamic <= 8) {
          freqctx.fillStyle = '#ff4800';
        } else if (dynamic <= 9) {
          freqctx.fillStyle = '#ff9100';
        } else if (dynamic <= 10) {
          freqctx.fillStyle = '#ffd900';
        } else if (dynamic <= 11) {
          freqctx.fillStyle = '#d9ff00';
        } else if (dynamic <= 12) {
          freqctx.fillStyle = '#90ff00';
        } else if (dynamic <= 13) {
          freqctx.fillStyle = '#48ff00';
        } else if (dynamic >= 14) {
          freqctx.fillStyle = '#00ff00';
        //} else {
        //  freqctx.fillStyle = "#"+dynaRange.colourAt( ((dynamic-8 )/8) * 100 );
        }
      }

      //dynamic
      freqctx.globalAlpha = 1;
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = 'black';//freqctx.fillStyle;
      freqctx.shadowOffsetX = 1;      
      //freqctx.shadowOffsetY = 1;      
      freqctx.fillRect(freqcanvas.width - 2, ypos, 1, (ypos2-ypos));    
      //freqctx.fill();      
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;
      freqctx.shadowOffsetY = 0;
      
      //draw loudness
      percent = (dbrange - Math.abs(rmsdb2))/dbrange;
      var height = freqcanvas.height * percent;
      var ypos = freqcanvas.height - height - 1;
      //
      freqctx.globalAlpha = 1;
      //freqctx.fillStyle = 'white';
      //freqctx.fillRect(freqcanvas.width - 2, ypos-5, 2, 10);    
      freqctx.fillStyle = 'black';
      freqctx.fillRect(freqcanvas.width - 2, ypos-5, 2, 10);    

    }  

    function drawSquare(timearray) { 
      //draw the square
      //Draw the time domain chart.
      
      //copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      //restore main canvas and blur it a bit
      freqctx.globalAlpha = hglobalAlpha;
      freqctx.drawImage(tempcanvas, 0, 0 );    
      freqctx.globalAlpha = 1;
      //
      var ypos, xpos, hmove, hdir;
      //
      xpos = pos[0].x;
      ypos = pos[0].y;
      freqctx.beginPath(); 
      freqctx.moveTo(pos[0].x,pos[0].y);      
      //
      for (var i = 0; i < (timearray.length); i++) {
        var value = timearray[i];
        var percent = value / 256;
        var height = (squareH*2) * (((percent - 0.5) * hscale) + 0.5);
        //
        if (Math.round(Math.random()) == 0) {
          hmove = -1;
        } else {
          hmove = 1;
        }        
        if (Math.round(Math.random()) == 0) {
          hdir = 'x';
        } else {
          hdir = 'y';      
        }
        //
        if (hdir == 'x') {
          xpos = xpos + (hmove*(squareH - height));
        } else {
          ypos = ypos + (hmove*(squareH - height));
        }
        //
        freqctx.lineTo(xpos, ypos);
        //
        if (xpos > freqcanvas.width) {
          xpos = freqcanvas.width;
        } else if (xpos < 0) {
          xpos = 0;
        }
        //
        if (ypos > freqcanvas.height) {
          ypos = freqcanvas.height;
        } else if (ypos < 0) {
          ypos = 0;
        }      
      }
      //
      freqctx.lineWidth = 2;
      freqctx.strokeStyle = hcolorSquare;
      //freqctx.lineJoin = "round";
      freqctx.shadowBlur = 0;
      freqctx.shadowColor = hcolorSquareShadow;
      freqctx.shadowOffsetX = 1;      
      freqctx.shadowOffsetY = 1;      
      freqctx.stroke();      
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      //
      pos[0].x = xpos;
      pos[0].y = ypos;      
    }    

    function drawSpike(timearray) { 
      //draw the spike
      //Draw the time domain chart.
      
      //copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      //restore main canvas and blur it a bit
      freqctx.globalAlpha = hglobalAlpha;
      freqctx.drawImage(tempcanvas, 0, 0 );    
      freqctx.globalAlpha = 1;
      //
      var ypos, xpos, hmovex, hmovey;
      //
      xpos = pos[0].x;
      ypos = pos[0].y;
      freqctx.beginPath(); 
      freqctx.moveTo(pos[0].x,pos[0].y);      
      //
      for (var i = 0; i < (timearray.length); i++) {
        var value = timearray[i];
        var percent = value / 256;
        var height = (spikeH*2) * (((percent - 0.5) * hscale) + 0.5);
        //
        if (Math.round(Math.random()) == 0) {
          hmovex = -1;
        } else {
          hmovex = 1;
        }        
        if (Math.round(Math.random()) == 0) {
          hmovey = -1;
        } else {
          hmovey = 1;      
        }
        //
        xpos = xpos + (hmovex*((spikeH - height)*Math.random()));
        ypos = ypos + (hmovey*((spikeH - height)*Math.random()));
        //
        freqctx.lineTo(xpos, ypos);
        //freqctx.quadraticCurveTo(xpos+(hmovex*((spikeH - height)*Math.random())), ypos+(hmovex*((spikeH - height)*Math.random())), xpos, ypos);
        //
        if (xpos > freqcanvas.width) {
          xpos = freqcanvas.width;
        } else if (xpos < 0) {
          xpos = 0;
        }
        //
        if (ypos > freqcanvas.height) {
          ypos = freqcanvas.height;
        } else if (ypos < 0) {
          ypos = 0;
        }      
      }
      //
      freqctx.lineWidth = 10;
      freqctx.strokeStyle = hcolorSpike;
      //freqctx.lineJoin = "round";
      freqctx.shadowBlur = 2;
      freqctx.shadowColor = hcolorSpikeShadow;
      //freqctx.shadowOffsetX = 1;      
      //freqctx.shadowOffsetY = 1;      
      freqctx.stroke();      
      //reset shadow
      freqctx.shadowBlur = 0;
      freqctx.shadowOffsetX = 0;      
      freqctx.shadowOffsetY = 0;      
      //
      pos[0].x = xpos;
      pos[0].y = ypos;      
    }    

    function drawTail(timearray) {
      //Draw movement
      //Draw the time domain chart.
      
      //copy the current canvas onto the temp canvas
      tempctx.drawImage(freqcanvas, 0,0);
      //clear the current state
      freqctx.clearRect(0, 0, freqcanvas.width, freqcanvas.height);
      // restore main canvas and blur it a bit
      freqctx.globalAlpha = hglobalAlpha;
      freqctx.drawImage(tempcanvas, 0, 0 );    
      freqctx.globalAlpha = 1;
      //
      var ypos, xpos, hmove, hdir;
      //
      if (Math.round(Math.random()) == 0) {
        hmove = -1;
      } else {
        hmove = 1;
      }        
      if (Math.round(Math.random()) == 0) {
        hdir = 'x';
      } else {
        hdir = 'y';      
      }
      //
      xpos = pos[0].x;
      ypos = pos[0].y;
      freqctx.beginPath(); 
      freqctx.moveTo(pos[0].x,pos[0].y);      
      freqctx.lineWidth = 6;
      freqctx.strokeStyle = hcolorTailShadow;        
      //
      for (var i = 0; i < (timearray.length); i++) {
        var value = timearray[i];
        var percent = value / 256;
        var height = (tailH*2) * (((percent - 0.5) * hscale) + 0.5);

        if (hdir == 'x') {
          xpos = xpos + (hmove*(1/10));
          ypos = pos[0].y + tailH - height;
        } else {
          xpos = pos[0].x + tailH - height;        
          ypos = ypos + (hmove*(1/10));
        }
        //
        freqctx.lineTo(xpos, ypos);
      }
      freqctx.stroke();
      //
      xpos = pos[0].x;
      ypos = pos[0].y;
      freqctx.beginPath(); 
      freqctx.moveTo(pos[0].x,pos[0].y);      
      freqctx.lineWidth = 2;
      freqctx.strokeStyle = hcolorTail;
      //
      for (var i = 0; i < (timearray.length); i++) {
        var value = timearray[i];
        var percent = value / 256;
        var height = (tailH*2) * (((percent - 0.5) * hscale) + 0.5);

        if (hdir == 'x') {
          xpos = xpos + (hmove*(1/10));
          ypos = pos[0].y + tailH - height;
        } else {
          xpos = pos[0].x + tailH - height;        
          ypos = ypos + (hmove*(1/10));
        }
        //
        freqctx.lineTo(xpos, ypos);
      }
      freqctx.stroke();
      //
      pos[0].x = xpos;
      pos[0].y = ypos;
      //
      if (pos[0].x > freqcanvas.width) {
        pos[0].x = freqcanvas.width;
      } else if (pos[0].x < 0) {
        pos[0].x = 0;
      }
      //
      if (pos[0].y > freqcanvas.height) {
        pos[0].y = freqcanvas.height;
      } else if (pos[0].y < 0) {
        pos[0].y = 0;
      }      
    }    
  }
}


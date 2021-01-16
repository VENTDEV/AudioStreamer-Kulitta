//
//This error.js will be included when the theme.css file was not found
//
//display alert
alert("ERROR !\n"+
      "Your current theme folder was not found.\n"+
      "Go to 'Settings > themes' and check the folder you entered.\n"+
      "In this folder you should find the file 'theme.css'.");
//
//make the portlets not draggable and not resizable
$(".drag").draggable("disable");
$(".drag").resizable("disable");
//
//events in audiostreamer js-file are attached with namespace "audiostreamer"
//events in theme specific js-files are attached with namespace "theme"
//(re)bind events attached in audiostreamer
$(document).on(".audiostreamer");
//unbind possible events attached in another theme
$(document).off(".theme");
//
//the events in the attachEvent function make a call to a coresponding function in the themeObj
//You can overrule these events and do something else here
//defining the themeObj here clears also previous functions in another theme  
var themeObj = new Object();
//
//
//in this lay-out we want the drag-divs to be positioned by the css, 
//so the styles of the drag-divs are cleared
$(".drag").attr('style','');
//
themeObj.showTree = function(){$(".drag:visible").not("#drag1, #drag6").hide();showTree()};
themeObj.showAlbums = function(){$(".drag:visible").not("#drag1, #drag6").hide();showAlbums()};
themeObj.search = function(){$(".drag:visible").not("#drag1, #drag6").hide();search()};
themeObj.viewAlbums = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewAlbums()};
themeObj.viewPlaylist = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewPlaylist()};
themeObj.viewNowPlaying = function(){$(".drag").not("#drag1, #drag6").hide();viewNowPlaying()};
themeObj.viewFreqSpectrum = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewFreqSpectrum()};
themeObj.manageDesktops = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageDesktops()};
themeObj.manageUsers = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageUsers()};
themeObj.manageSettings = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageSettings()};
themeObj.viewSongInfo = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewSongInfo()};
themeObj.viewLogging = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewLogging()};
themeObj.viewCreateDatabase = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewCreateDatabase()};
themeObj.aboutAudioStreamer = function(){$(".drag:visible").not("#drag1, #drag6").hide();aboutAudioStreamer()};

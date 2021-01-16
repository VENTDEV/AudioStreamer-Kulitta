//make the portlets not draggable and not resizable
$(".drag").draggable("disable");
$(".drag").resizable("disable");
//
//events in audiostreamer js-file are attached with namespace "audiostreamer"
//events in theme specific js-files are attached with namespace "theme"
//(re)bind events attached in audiostreamer
$(document).add("*").on(".audiostreamer");
//unbind possible events attached in another theme
$(document).add("*").off(".theme");
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
themeObj.viewNowPlaying = function(){viewNowPlaying();themeObj.resizeImage()};
themeObj.viewFreqSpectrum = function(){viewFreqSpectrum();themeObj.resizeFreqSpectrum()};
themeObj.resizeImage = function(){
  //height, width of drag4
  //smallest size wins
  pwidth = $("#api4").width();
  pheight = $("#api4").height() - $("#api4 .top-spacer").height();

  psquare = Math.min(pwidth, pheight);
  
  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
};
themeObj.resizeFreqSpectrum = function(){
  //height, width drag16
  pwidth = $("#api16").width();
  pheight = $("#api16").height() - $("#api16 .top-spacer").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
};

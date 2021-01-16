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
//add current class on clicking in api1 div
$("#api1 [title]").on("click.theme", function() {
  $(".view-current").removeClass('view-current');
  $(this).addClass('view-current');
});
//
themeObj.viewNowPlaying = function(){viewNowPlaying();themeObj.resizeImage();};
themeObj.viewFreqSpectrum = function(){viewFreqSpectrum();themeObj.resizeFreqSpectrum();};
themeObj.resizeImage = function(){
  //height, width of drag4
  //smallest size wins
  pwidth = $("#api4").width();
  pheight = $("#api4").height();

  psquare = Math.min(pwidth, pheight);
  
  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
  //
  //append the image in the now playing summary
  //if this already exists, then first remove
  $("#api6 .cover-now-playing").remove();
  $("#api4 .cover-now-playing").clone().appendTo("#jp_interface_1");
  $("#api6 .cover-now-playing").css({'width' : '100%', 'height' : 'auto'}); 
};
themeObj.resizeFreqSpectrum = function(){
  //height, width drag16
  pwidth = $("#api16").width();
  pheight = $("#api16").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
};

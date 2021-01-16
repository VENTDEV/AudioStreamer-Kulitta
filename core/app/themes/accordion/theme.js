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
//toggle api on clicking in handler div
$(".drag").removeClass("small large").addClass("small");
$(".handler").on("click.theme", function() {
  pdrag = $(this).closest(".drag").attr("id");
  themeObj.changeSmallLarge("#"+pdrag);
});
$(window).on("resize.theme", function() {
  themeObj.changeSmallLarge();
});
$(".handler input").on("click.theme", function(event){
  event.stopPropagation();
});
$(".handler select").on("click.theme", function(event){
  event.stopPropagation();
});
$(".handler>div").on("click.theme", function(event){
  event.stopPropagation();
});
//
themeObj.showDrag = function (pdrag) {
  if ($(pdrag).hasClass("small")) {
    themeObj.changeSmallLarge(pdrag);
  }
}
//
themeObj.changeSmallLarge = function(pdrag) {
  $pdrag = $(pdrag);
  //change currently clicked drag if switching to small
  if ($pdrag.hasClass("large")) {
    $pdrag.animate({width:"30px"}, "500", "linear"); 
  }
  $pdrag.toggleClass("small large");
  //calculate width of large drags
  //available width = "screen width" minus "small drags width" divided by number of large drags
  pwidth = ($(window).width() - ($(".drag.small:not(#drag6):visible").length * 30))/$(".drag.large:not(#drag6):visible").length;
  //if pwidth is becoming too small then switch other large drags to small
  if (pwidth <= 300) {
    $(".drag.large:not(#drag6):not("+pdrag+"):visible").toggleClass("small large").animate({width:"30px"}, "500", "linear");   
    //recalculate pwidth
    pwidth = ($(window).width() - ($(".drag.small:not(#drag6):visible").length * 30))/$(".drag.large:not(#drag6):visible").length;
  }
  //change currently large drags
  $(".drag.large:not(#drag6):visible").each(function(index) {
    $(this).animate({width:pwidth}, "500", "linear", function() {themeObj.resizeImage();themeObj.resizeFreqSpectrum();}); 
  });
}
//
themeObj.showTree = function(){showTree();themeObj.showDrag("#drag3")};
themeObj.showAlbums = function(){showAlbums();themeObj.showDrag("#drag7")};
themeObj.search = function(){search();themeObj.showDrag("#drag14")};
themeObj.viewAlbums = function(){viewAlbums();themeObj.showDrag("#drag2")};
themeObj.viewPlaylist = function(){viewPlaylist();themeObj.showDrag("#drag5")};
themeObj.viewNowPlaying = function(){viewNowPlaying();themeObj.showDrag("#drag4");themeObj.resizeImage()};
themeObj.viewFreqSpectrum = function(){viewFreqSpectrum();themeObj.showDrag("#drag16");themeObj.resizeFreqSpectrum()};
themeObj.manageDesktops = function(){manageDesktops();themeObj.showDrag("#drag12")};
themeObj.manageUsers = function(){manageUsers();themeObj.showDrag("#drag11")};
themeObj.manageSettings = function(){manageSettings();themeObj.showDrag("#drag13")};
themeObj.viewSongInfo = function(){viewSongInfo();themeObj.showDrag("#drag8")};
themeObj.viewLogging = function(){viewLogging();themeObj.showDrag("#drag15")};
themeObj.viewCreateDatabase = function(){viewCreateDatabase();themeObj.showDrag("#drag9")};
themeObj.aboutAudioStreamer = function(){aboutAudioStreamer();themeObj.showDrag("#drag10")};
themeObj.resizeImage = function(){
  //height, width of drag4
  //smallest size wins
  pwidth = $("#api4").width();
  pheight = $("#api4").height();

  psquare = Math.min(pwidth, pheight);
  
  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
};
themeObj.resizeFreqSpectrum = function(){
  //height, width drag16
  pwidth = $("#api16").width();
  pheight = $("#api16").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
};

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
themeObj.showTree = function(){$(".drag:visible").not("#drag1, #drag6").hide();showTree()};
themeObj.showAlbums = function(){$(".drag:visible").not("#drag1, #drag6").hide();showAlbums()};
themeObj.search = function(){$(".drag:visible").not("#drag1, #drag6").hide();search()};
themeObj.viewAlbums = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewAlbums()};
themeObj.viewPlaylist = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewPlaylist()};
themeObj.viewNowPlaying = function(){$(".drag").not("#drag1, #drag6").hide();viewNowPlaying();themeObj.resizeImage();};
themeObj.viewFreqSpectrum = function(){$(".drag:visible").not("#drag1, #drag6").hide();viewFreqSpectrum();themeObj.resizeFreqSpectrum()};
themeObj.manageDesktops = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageDesktops()};
themeObj.manageUsers = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageUsers()};
themeObj.manageSettings = function(){$(".drag:visible").not("#drag1, #drag6").hide();manageSettings()};
themeObj.viewSongInfo = function(){viewSongInfo();$("html,body").scrollTop(0);};
themeObj.viewLogging = function(){viewLogging();$("html,body").scrollTop(0);};
themeObj.viewCreateDatabase = function(){viewCreateDatabase();$("html,body").scrollTop(0);};
themeObj.aboutAudioStreamer = function(){$(".drag:visible").not("#drag1, #drag6").hide();aboutAudioStreamer()};
themeObj.resizeImage = function(){
  //height, width measured as screen height - top of drag4 - (margins, borders and padding)
  //smallest size wins
  pwidth = $(window).width() - 
           $("#drag4").offset().left - 
           ( $("#drag4").outerWidth(true) - $("#api4").innerWidth() ) + 
           parseInt($("#drag4").css("margin-right"))||0;
  pheight = $(window).height() - 
            $("#drag4").offset().top - 
            ( ($("#drag4").outerHeight(true) - $("#api4").innerHeight()) + $("#api4 .top-spacer").height() ) + 
            parseInt($("#drag4").css("margin-bottom"))||0;

  psquare = Math.min(pwidth, pheight);
  
  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
};
themeObj.resizeFreqSpectrum = function(){
  if ($("#drag16").length != 0) {
    //height, width measured as screen height - top of drag16 - (margins, borders and padding) 
    pwidth = $(window).width() - 
             $("#drag16").offset().left - 
             ( $("#drag16").outerWidth(true) - $("#api16").innerWidth() ) + 
             parseInt($("#drag16").css("margin-right"))||0;
    pheight = $(window).height() - 
              $("#drag16").offset().top - 
              ( ($("#drag16").outerHeight(true) - $("#api16").innerHeight()) + $("#api16 .top-spacer").height() ) + 
              parseInt($("#drag16").css("margin-bottom"))||0;

    $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
    //resize canvas to width and height of the outer div 
    $("#api16 #freqcanvas").width = pwidth;
    $("#api16 #freqcanvas").height = pheight;  
  }
};
themeObj.scrollFocus = function(hthis) {
  hapi = "#"+$(hthis).closest(".api").attr("id");

  if ($(hapi+" .scrollfield").val() == "") {
    $("html,body").scrollTop(0);
    $(hapi+" #tree li").removeClass("highlighted");
  } else {
    $(hapi+" #tree li").removeClass("highlighted");
    $(hapi+" #tree li:startsWith("+$(hapi+" .scrollfield").val()+")").addClass("highlighted");
    if ($(hapi+" .highlighted").length != 0) {$("html,body").scrollTop($(hapi+" .highlighted").offset().top)};
  }
}
//
//show scroll uparrow
//no scroll arrow if screen "users", "desktops" or "settings" is visible
$(window).on("scroll.theme", function () {
  if ($(this).scrollTop() > 50 && ( $("#drag13:visible, #drag12:visible, #drag11:visible").length - $("#drag15:visible").length  == 0 ) ) {
    $('#uparrow').css({'z-index' : maxZ()}).fadeIn();
  } else {
    $('#uparrow').fadeOut();
  }
});
//scroll body to 0px on click
$('#uparrow').on("click.theme", function () {
  $('body,html').animate({
    scrollTop: 0
  }, 200);
  return false;
});

//
//unbind the original click events in the menu
//$("#api1 [title]").not(".desktop-save, .desktop-save-as, .logout").off("click.audiostreamer");
//bind new code with theme namespace
//$(".view-folders").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewFolders();
//});  
//$(".view-albums").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewAlbums();
//});  
//$(".view-playlist").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewPlaylist();
//});  
//$(".view-now-playing").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewNowPlaying();
//});  
//$(".desktop-manage").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  manageDesktops();
//});  
//$(".users").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  manageUsers();
//});  
//$(".settings").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  manageSettings();
//});  
//$(".view-song-info").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewSongInfo();
//});  
//$(".view-logging").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewLogging();
//});  
//$(".view-create-database").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  viewCreateDatabase();
//});  
//$(".about-AudioStreamer").on("click.theme", function() {
//  $(".drag").not("#drag1, #drag6").hide();
//  aboutAudioStreamer();
//});  


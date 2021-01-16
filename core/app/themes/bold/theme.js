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
//
$("#drag16 .close-popup").off(".audiostreamer");
$("#drag16 .close-popup").on("click.theme", function() {
  $("#drag16 .handler").css({'display' : 'none'});
});
//
//$(".drag:not(#drag16) .close-popup").on("click.theme", function() {
//  $("#drag1").css({'display' : 'none'});
//});
//
//
themeObj.resizeImage = function(){
  //height, width of drag4
  //smallest size wins
  pwidth = $("#api4").width();
  pheight = $("#api4").height() - $("#api4 .top-spacer").height();

  psquare = Math.min(pwidth, pheight);
  
  $("#api4 .cover-now-playing").css({'width' : psquare, 'height' : psquare});
  
  //set image as background
  $("html").css( 'background-image', 'url(' + $("#api4 .cover-now-playing").attr("src") + ')');
};
themeObj.resizeFreqSpectrum = function(){
  //height, width drag16
  pwidth = $("#api16").width();
  pheight = $("#api16").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
};
themeObj.viewFreqSpectrum = function(){
  //
  $(".drag:not(#drag16):not(#drag17):not(#drag6)").hide();
  $("#drag16 .handler").css({'display' : 'block' , 'z-index' : maxZ()});
  themeObj.resizeFreqSpectrum();
};
themeObj.action = function(hthis){
  //show actions
  $(hthis).parent().find(".add,.play,.info,.move,.delete,.radio-playlist,.clear-playlist,.shuffle-playlist").show().delay(3000).fadeOut();
};
themeObj.scrollFocus = function(hthis){
  //do nothing
}
//
themeObj.viewMenu = function(hthis){
  if ( $("#drag1").is(":visible") ) {
    if ( parseInt($("#drag1").css("z-index")) >= (maxZ()-1) ) {
      $(".drag:not(#drag16):not(#drag17):not(#drag6) , #drag16 .handler").hide();
    } else {
      $("#drag1").css({'display' : 'block' , 'z-index' : maxZ()});
    }
  } else {
    $("#drag1").css({'display' : 'block' , 'z-index' : maxZ()});
  }
}
//change placeholder
$('.api').on('keyup', '.scrollfield', function(event){
  hapi = "#"+$(this).closest(".api").attr("id");
  if ($(hapi+" .scrollfield").val() == "") {
    $(hapi+" #tree li").show();
  } else {
	  //on enter in search scrollfield, hide elements not found
	  var keycode = (event.keyCode ? event.keyCode : event.which);
	  if(keycode == '13'){
      $(hapi+" #tree li").show();
      hsearch = $(hapi+" .scrollfield").val().toLowerCase();
      $(hapi+" #tree li").filter(function(){ return $(this).text().toLowerCase().indexOf(hsearch) == -1;}).hide();
    }
	}
});
//
//scroll body to 0px on click
$('#uparrow').on("click.theme", function () {
  //
  //find visible element with highest z-index
  var hdrag = $('.drag:visible');
  var helement;
  var hmaxZ = Math.max.apply(null,$.map(hdrag, function(e,n){
    return parseInt($(e).css('z-index'))||1 ;
    }) 
  );
  hdrag.each(function(){
    if($(this).css('z-index') == hmaxZ) {
      helement = $(this);
    }
  });
  helement.find(".api").animate({
    scrollTop: 0
  }, 200);
});
//
//show or hide possibly hidden/shown buttons on resize
$(window).on("resize.theme", function(event) { 
  if(event.target===this) { 
    if ($(window).width() >= 640) {
      $(".add,.play,.info,.move,.delete,.radio-playlist,.clear-playlist,.shuffle-playlist").show();
    } else {
      $(".add,.play,.info,.move,.delete,.radio-playlist,.clear-playlist,.shuffle-playlist").hide(); 
    }
  }  
});
//
//hide address bar in mobile
function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}



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
$("#drag1 .close-popup").off(".audiostreamer");
$("#drag1 .close-popup").on("click.theme", function() {
  //this close button will handle all close events
  //
  //find visible element with highest z-index
  var hdrag = $('.drag:visible:not(#drag1,#drag17,#drag6)');
  var helement;
  var hmaxZ = Math.max.apply(null,$.map(hdrag, function(e,n){
    return parseInt($(e).css('z-index'))||1 ;
    }) 
  );
  hdrag.each(function(){
    if($(this).css('z-index') == hmaxZ) {
      helement = $(this);
      //
      if (helement.attr('id') == 'drag16') {
        //visuals ==> close only handler
        $("#drag16 .handler").css({'display' : 'none'});
      } else if (helement.attr('id') == 'drag2' || helement.attr('id') == 'drag3' || helement.attr('id') == 'drag7' || helement.attr('id') == 'drag14') {
        //close current
        helement.css({'display' : 'none'});
        //current not full width
        if (helement.css('left') !== '0px' || helement.css('right') !== '0px') {
          //details, folder, albums or search is also visible ==> close em
          $("#drag2,#drag3,#drag7,#drag14").css({'display' : 'none'});
        }    
      } else {
        helement.css({'display' : 'none'});
      }      
    }
  });
});
//
$("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
//
$("#api1>div").on("click.theme", function() {
  $("#api1>div").removeClass("view-current");
  $(this).addClass("view-current");
});
//
themeObj.scrollFocus = function(hthis){
  //do nothing
}
themeObj.resizeImage = function(){
  //set image as background for api16
  $("#api16").css( 'background-image', 'url(' + $("#api4 .cover-now-playing").attr("src") + ')');
};
themeObj.resizeFreqSpectrum = function(){
  //height, width drag16
  pwidth = $("#api16").width();
  pheight = $("#api16").height();

  $("#api16 #visualisation").css({'width' : pwidth + 'px', 'height' : pheight + 'px'});
};
themeObj.viewMenu = function(){
  $("#drag1").css({'display' : 'block' , 'z-index' : maxZ()});  
  $(".showSearch,.desktop-manage,.users,.settings,.about-AudioStreamer,.logout").show();
}
themeObj.showPlayer = function(){
  showPlayer();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.showTree = function(){
  //show details also
  $("#drag2").css({'display' : 'block' , 'z-index' : maxZ()});  
  $("#drag3").css({'display' : 'block' , 'z-index' : maxZ()});    
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.showAlbums = function(){
  //show details also
  $("#drag2").css({'display' : 'block' , 'z-index' : maxZ()});  
  $("#drag7").css({'display' : 'block' , 'z-index' : maxZ()});    
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.search = function(){
  //show details also
  $("#drag2").css({'display' : 'block' , 'z-index' : maxZ()});  
  search();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewAlbums = function(){
  viewAlbums();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewPlaylist = function(){
  viewPlaylist();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewNowPlaying = function(){
  viewNowPlaying();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewNowPlaying = function(){
  viewNowPlaying();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewFreqSpectrum = function(){
  $("#drag16").css({'display' : 'block' , 'z-index' : maxZ()});  
  $("#drag16 .handler").css({'display' : 'block'});
  themeObj.resizeFreqSpectrum();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
};
themeObj.saveDesktop = function(){
  saveDesktop();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.saveDesktopAs = function(){
  saveDesktopAs();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.manageDesktops = function(){
  manageDesktops();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.manageUsers = function(){
  manageUsers();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.manageSettings = function(){
  manageSettings();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewSongInfo = function(){
  viewSongInfo();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewLogging = function(){
  viewLogging();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.viewCreateDatabase = function(){
  viewCreateDatabase();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.aboutAudioStreamer = function(){
  aboutAudioStreamer();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
themeObj.logout = function(){
  logout();
  $("#drag6,#drag1,#drag17").css({'display' : 'block' , 'z-index' : maxZ()});    
}
//If the document is clicked somewhere
$(document).on("mousedown.theme touchstart.theme", function(e) {
  //If the clicked element is not in the menu
  if (!$(e.target).closest(".showSearch,.desktop-manage,.users,.settings,.about-AudioStreamer,.logout").length > 0) {
    $(".showSearch,.desktop-manage,.users,.settings,.about-AudioStreamer,.logout").hide();
  }
});
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
$('#uparrow').on("click.theme", function () {
  //
  //find visible element with highest z-index
  var hdrag = $('.drag:visible:not(#drag1,#drag17,#drag6)');
  var helement;
  var hmaxZ = Math.max.apply(null,$.map(hdrag, function(e,n){
    return parseInt($(e).css('z-index'))||1 ;
    }) 
  );
  hdrag.each(function(){
    if($(this).css('z-index') == hmaxZ) {
      helement = $(this);
      //
      if (helement.attr('id') == 'drag2' || helement.attr('id') == 'drag3' || helement.attr('id') == 'drag7' || helement.attr('id') == 'drag14') {
        //scroll current
        helement.find(".api").animate({
          scrollTop: 0, scrollLeft: 0
        }, 200);
        //current not full width
        if (helement.css('left') !== '0px' || helement.css('right') !== '0px') {
          //details, folder, albums or search is also visible ==> scroll em
          $("#drag2,#drag3,#drag7,#drag14").find(".api").animate({
          scrollTop: 0, scrollLeft: 0
          }, 200);
        }    
      } else {
        helement.find(".api").animate({
          scrollTop: 0, scrollLeft: 0
        }, 200);
      }      
    }
  });
});
//

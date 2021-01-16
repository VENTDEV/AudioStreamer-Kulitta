//make the portlets draggable and not resizable
$(".drag").draggable("enable");
$(".drag").resizable("enable");
//
$(".drag").draggable("option", "grid", [ 5,5 ]);
$(".drag").draggable("option", "snap", false);
$(".drag").resizable("option", "grid", [ 5,5 ]);
//
//change height, width, left and top values of the portlets to match the grid values
$(".drag").each(function() {
  $(this).css( { left: function(index,value) { return Math.round(parseFloat(value)/5)*5; } ,
                 top: function(index,value) { return Math.round(parseFloat(value)/5)*5; } ,
                 width: function(index,value) { return Math.round(parseFloat(value)/5)*5; } ,
                 height: function(index,value) { return Math.round(parseFloat(value)/5)*5; } 
               } )   
});

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

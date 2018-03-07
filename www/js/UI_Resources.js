///////////////////////////////////////////////////////////////////////////////
/*
UI Resources.

This script contains UI-specific data and functions.
*/
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Color variables for easy color assignments.


var seqGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(25, 25, 112)), to(rgb(40, 40, 127)))";
var seqAccentColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(50, 50, 137)), to(rgb(65, 65, 152)))";
var controlGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(200, 110, 20)), to(rgb(235, 165, 65)))";
var trackGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(200, 110, 20)), to(rgb(235, 165, 65)))";
var mixGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(25, 25, 112)), to(rgb(0, 0, 82)))";
var FXGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(75, 75, 192)), to(rgb(50, 50, 137)))"
var songGridColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(200, 110, 20)), to(rgb(235, 165, 65)))";

var fontColor = "rgb(0, 0, 0)";

var activeStepColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(250, 140, 50)), to(rgb(255, 195, 95)))";
var flashStepColor = "rgb(250, 160, 70)";

var playingColor = "-webkit-gradient(linear, left top, left bottom, from(rgb(0, 220, 30)), to(rgb(30, 220, 0)))";

var greyControlColor = "rgb(25, 25, 112)";
var darkControlColor = "rgb(100, 100, 187)";

var soloColor = "rgb(150, 140, 20)";
var muteColor = "rgb(100, 0, 0)";
var soloOnColor = "rgb(200, 165, 32)";
var muteOnColor = "rgb(150, 0, 0)";

///////////////////////////////////////////////////////////////////////////////
// Applys colors to UI elements.

function applyColors() {
  $('#seqGridTable').children().css('background', seqGridColor);
  $('#controlGridTable').children().css('background', controlGridColor);
  $('#trackGridTable').children().css('background', trackGridColor);
  $('#mixGridTable').children().css('background', mixGridColor);
  $('#songGridTable').children().css('background', songGridColor);
  $('#FXGridTable').children().css('background', FXGridColor);
  for(var i = 0; i < numRows; i++) {
    for(var j = 0; j < 4; j++) {
      var id = 'seqGrid Row ' + i + ' Col ' + (j*4);
      var cell = document.getElementById(id);
      $(cell).css('background', seqAccentColor);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// Manages the greying of control cells.

function activateControl() {

          //toggle play button being green
          var idPlay = "controlGrid Row " + 2 + " Col " + 0;
          var play = document.getElementById(idPlay);
          if(isPlaying == 1) {
            $(play).css('background', playingColor);
          }
          else {
            $(play).css('background', controlGridColor);
          }

          //toggle color change of settings button when panel open
          var idSong = "controlGrid Row " + 0 + " Col " + 0;
          var song = document.getElementById(idSong);
          if(!toggleSong) {
            $(song).css('background', controlGridColor);
          }
          else {
            $(song).css('background', activeStepColor);
          }

          //toggle color change of FX button when panel open
          var idFX = "controlGrid Row " + 3 + " Col " + 0;
          var fx = document.getElementById(idFX);
          if(!toggleFX) {
            $(fx).css('background', controlGridColor);
          }
          else {
            $(fx).css('background', activeStepColor);
          }
}

///////////////////////////////////////////////////////////////////////////////
// Makes active steps in the sequencer animate when played back

function flashCurrentStep(row, currentStep) {
  var flashSpeed = 50;
      var id = "seqGrid Row " + row + " Col " + currentStep;
      var cell = document.getElementById(id);
      var textId = "mixGrid Row " + row + " Col " + 13;
      var textCell = document.getElementById(textId);
      var trackId = "trackGrid Row " + row + " Col " + 0;
      var trackCell = document.getElementById(trackId);
      var activeRadius = '0px';
      var initialRadius = '30px';
      $(cell).animate({'border-radius': activeRadius}, flashSpeed);
      $(cell).animate({'border-radius': initialRadius}, flashSpeed);
      //animate track list cells when channel playing back
      $(trackCell).parent().animate({'border-radius': initialRadius}, flashSpeed);
      $(trackCell).parent().animate({'border-radius': activeRadius}, flashSpeed);
}

///////////////////////////////////////////////////////////////////////////////
// Slides or fades elements in and out of view

function hideShow(id, type, speed, dir) {
  if($(id).is(":visible")) {
    switch(type) {
      case "slide":
      $(id).hide("slide", { direction: dir }, speed);
      break;
      case "fade":
      $(id).hide("fade", { direction: dir }, speed);
      break;
    }
  }
  else {
    switch(type) {
      case "slide":
      $(id).show("slide", { direction: dir }, speed);
      break;
      case "fade":
      $(id).show("fade", { direction: dir }, speed);
      break;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// Hides specified borders of cells

function hideBorder(id, direction) {
  var td = document.getElementById(id).parentElement;
  switch(direction) {
    case "left":
      td.style.borderLeftColor = "transparent";
    break;
    case "top":
      td.style.borderTopColor = "transparent";
    break;
    case "right":
      td.style.borderRightColor = "transparent";
    break;
    case "bottom":
      td.style.borderBottomColor = "transparent";
    break;
    case "all":
      td.style.borderLeftColor = "transparent";
      td.style.borderTopColor = "transparent";
      td.style.borderRightColor = "transparent";
      td.style.borderBottomColor = "transparent";
    break;
    case "sides":
      td.style.borderRightColor = "transparent";
      td.style.borderLeftColor = "transparent";
      break;
    case "tnb":
      td.style.borderTopColor = "transparent";
      td.style.borderBottomColor = "transparent";
      break;
    default: break;
  }
}

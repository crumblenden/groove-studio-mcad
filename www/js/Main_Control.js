///////////////////////////////////////////////////////////////////////////////
/*
Main Control.

This script calls all other functions.

It provides a control structure for user input using the coordinates of cells in
table elemntes in the UI. Coordinates and table identifiers are stored in and
parsed from element id's.

*/
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Global variables.

var channels = [];
var coords = [];
var toggleMixer = false;
var toggleSong = false;
var toggleEdit = false;
var toggleDraw = true;
var toggleFX = false;
var toggleOsc = false;

///////////////////////////////////////////////////////////////////////////////
// Tests for presence of numbers in string
// see http://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-number

function hasNumber(myString) {
  return /\d/.test(myString);
}
///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the control panel is clicked.

function controlGridClicked(coords) {
  var id = "controlGrid Row " + coords[0] + " Col " + coords[1];
  var element = document.getElementById(id);

  //Play/stop sequence
  if(coords[0] == 2 && coords[1] == 0)
    {
      play();
    }
  //Hide/show mixer
  if(coords[0] == 1 && coords[1] == 0)
    {
      toggleMixer = !toggleMixer;
      hideShow("#mixerIcon", "fade", 50, "left");
      hideShow("#gridIcon", "fade", 50, "left");
      hideShow("#mixGridContainer", "fade", 50, "left");
      hideShow("#seqGridContainer", "fade", 50, "right");
      if(!($("#seqGridContainer").is(":visible")) &&
           !($("#mixGridContainer").is(":visible"))) {
             hideShow("#seqGridContainer", "fade", 50, "right");
           }
    }
    //Hide/Show FX
  if(coords[0] == 3 && coords[1] == 0)
    {
      toggleFX = !toggleFX;
      hideShow("#FXGridContainer", "slide", 200, "right");
    }
  //Toggles the song setting table
  if(coords[0] == 0 && coords[1] == 0)
    {
      toggleSong = !toggleSong;
      hideShow("#songGridContainer", "slide", 200, "right");
    }
  if(coords[0] == 4 && coords[1] == 0)
    {
      toggleOsc = !toggleOsc;
      hideShow("#synthIcon", "fade", 5, "left");
      hideShow("#snareIcon", "fade", 5, "left");
    }

  activateControl(); // Manages the greying of control cells
}

///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the sequencing panel is clicked.

function seqGridClicked(coords) {
  if(toggleDraw) {
  toggleStepActive(coords);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the channel list panel is clicked. // not currently used

function trackGridClicked(coords) {
}

///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the mixer panel is clicked.

function mixGridClicked(coords) {
  //Send 2
  if(coords[1] == 12){
    var id = "#s2" + coords[0];
    var nextCol = 15;
    var idText = "mixGrid Row " + coords[0] + " Col " + nextCol;
    var cellText = document.getElementById(idText);
    $(id).on('touchmove', function(e) {
      e.preventDefault();
      channels[coords[0]].send2 = (1.0 * $(id).val());
      cellText.innerHTML = (channels[coords[0]].send2);
      setSend2Gain(coords[0], channels[coords[0]].send2);
    });
    setSend2Gain(coords[0], channels[coords[0]].send2);
  }

  //Pan
  if(coords[1] == 8){
    var id = "#p" + coords[0];
    var nextCol = 11;
    var idText = "mixGrid Row " + coords[0] + " Col " + nextCol;
    var cellText = document.getElementById(idText);
    $(id).on('touchmove', function() {
			channels[coords[0]].pan = (1.0 * $(id).val());
      cellText.innerHTML = (channels[coords[0]].pan);
      setPan(coords[0], channels[coords[0]].pan);
    });
    setPan(coords[0], channels[coords[0]].pan);
  }

  //Volume
  if(coords[1] == 3){
    var id = "#f" + coords[0];
    var nextCol = 6;
    var idText = "mixGrid Row " + coords[0] + " Col " + nextCol;
    var cellText = document.getElementById(idText);
    $(id).on('touchmove', function() {
			channels[coords[0]].volume = $(id).val();
      cellText.innerHTML = Math.round(channels[coords[0]].volume * 100);
      setOutGain(coords[0], channels[coords[0]].volume);
    });
    setOutGain(coords[0], channels[coords[0]].volume);
  }

  //Solo
  if(coords[1] == 1){
    toggleSolo(coords);
  }

  //Mute
  if(coords[1] == 0){
    toggleMute(coords);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the song settings panel is clicked.

function songGridClicked(coords) {
  //clear sequence
  if(coords[0] == 1 && coords[1] == 5){
    for(var i = 0; i < numRows; i++) {
      for(var j = 0; j < seqNumCols; j++) {
        if(channels[i].steps[j].isActive == true)
        {
          toggleStepActive([i, j]);
        }
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
// Called if a cell in the FX settings panel is clicked.

function FXGridClicked(coords) {
  //fx mute button
  if(coords[0] == 1 && coords[1] == 0) {
      toggleFXMute(coords);
    }
  //impulse response selection
  if(coords[0] == 0 && coords[1] == 5) {
      setImpulseResponse("Hall");
      var id = "FXGrid Row 0 Col 5";
      var cell = document.getElementById(id);
      $(cell).css('background', seqGridColor);
      var id = "FXGrid Row 0 Col 4";
      var cell = document.getElementById(id);
      $(cell).css('background', FXGridColor);
    }
  if(coords[0] == 0 && coords[1] == 4) {
      setImpulseResponse("Room");
      var id = "FXGrid Row 0 Col 4";
      var cell = document.getElementById(id);
      $(cell).css('background', seqGridColor);
      var id = "FXGrid Row 0 Col 5";
      var cell = document.getElementById(id);
      $(cell).css('background', FXGridColor);
    }
}

///////////////////////////////////////////////////////////////////////////////
// Channel mute toggling function that affects audio and UI.

function toggleMute(coords) {
  var muteId = "mixGrid Row " + coords[0] + " Col " + coords[1];
  var cell = document.getElementById(muteId);
  channels[coords[0]].mute = !channels[coords[0]].mute;
  setMuteGain(coords[0], Number(!channels[coords[0]].mute));
  if(channels[coords[0]].mute) {
    $(cell).animate({backgroundColor: muteOnColor}, 'fast');
  }
  else {
    $(cell).animate({backgroundColor: muteColor}, 'fast');
  }
}

///////////////////////////////////////////////////////////////////////////////
// Reverb mute toggling function that affects audio and UI.

function toggleFXMute(coords) {
  var muteId = "FXGrid Row " + coords[0] + " Col " + coords[1];
  var cell = document.getElementById(muteId);
  setReverbMuteGain(Number(!reverbMuteGain.gain.value));
  if(reverbMuteGain.gain.value) {
    $(cell).animate({backgroundColor: muteColor}, 'fast');
  }
  else {
    $(cell).animate({backgroundColor: muteOnColor}, 'fast');
  }
}

///////////////////////////////////////////////////////////////////////////////
// Channel solo toggling function that affects audio and UI.

function toggleSolo(coords) {
  var soloId = "mixGrid Row " + coords[0] + " Col " + coords[1];
  var cell = document.getElementById(soloId);
  channels[coords[0]].solo = !channels[coords[0]].solo;
  soloTotal = 0;
  for(var i = 0; i < numRows; i++) {
    soloTotal += Number(channels[i].solo);
  }
  if(soloTotal == 0) {
    for(var i = 0; i < numRows; i++) {
      setSoloGain(i, 1);
    }
  }
  else {
    for(var i = 0; i < numRows; i++) {
      setSoloGain(i, 0);
      setSoloGain(i, Number(channels[i].solo));
    }
  }
  if(channels[coords[0]].solo) {
    $(cell).animate({backgroundColor: soloOnColor}, 'fast');
  }
  else {
    $(cell).animate({backgroundColor: soloColor}, 'fast');
  }
}


///////////////////////////////////////////////////////////////////////////////
// Sequencer step on/off toggle function that affects audio and UI.

function toggleStepActive(coords) {
  var id = "seqGrid Row " + coords[0] + " Col " + coords[1];
  var cell = document.getElementById(id);
  if(channels[coords[0]].steps[coords[1]].isActive == true)
  {
    channels[coords[0]].steps[coords[1]].isActive = false;
    $(cell).animate({borderRadius: '0px'}, 100, 'swing', function() {
      if(coords[1] % 4 == 0) {
          $(cell).css('background', seqAccentColor);
        }
        else{
          $(cell).css('background', seqGridColor);
        }
    });
  }
  else
  {
    channels[coords[0]].steps[coords[1]].isActive = true;
    $(cell).animate({borderRadius: '30px'}, 'fast', 'swing');
    $(cell).css('background', controlGridColor);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Returns numerical coordinates and UI panel identifier from a cell's id string.

function parseID(id) {
  var idArray = id.split(" ");
  idArray.splice(1, 1);
  idArray.splice(2, 1);
  return idArray;
}

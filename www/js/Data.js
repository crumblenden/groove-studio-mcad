///////////////////////////////////////////////////////////////////////////////
/*
Data.

This script creates a structure for storing channel and step data, and is where
sample URL and other data and global variables can be found.

Channels are initialised as an array for iterative access.
An array of step objects is contained within each channel. Accessed using
channel[channel number].step[step number].

Variables have been added for future developments.

The function createChannelData(), called in Main_Control.js, creates the
structure.
*/
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// The channel object.

var channel = {
  name: "",
  sampleUrl: "",
  inputGain: 0.0,
  currentVelocity: 100,
  volume: 0.7,
  mute: false,
  solo: false,
  send1: 0.0,
  send2: 0.0,
  pitch: 0.0,
  pan: 0.0,

  steps: [
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    },
    {
      velocity: 0,
      pitch: 0,
      pan: 0,
      reverse: false,
      isActive: false,
    }]
};

///////////////////////////////////////////////////////////////////////////////
// Creates the structure.

function createChannelData(channels) {
    for(var i = 0; i < numRows; i++){
      var addChannel = $.extend(true, {}, channel);
      channels[i] = addChannel;
      channels[i].pitch = (100 * (i+1));
      channels[i].currentVelocity = 100;
    }
  }

///////////////////////////////////////////////////////////////////////////////
// Indexed URLs for sample data.

var sampleUrls = {
  "0": "drumkit1/Kick01.mp3",
  "1": "drumkit1/Kick03.mp3",
  "2": "drumkit1/ResKick01.mp3",
  "3": "drumkit1/ResKick02.mp3",
  "4": "drumkit1/ResKick03.mp3",
  "5": "drumkit1/Clap01.mp3",
  "6": "drumkit1/Clap02.mp3",
  "7": "drumkit1/Snare01.mp3",
  "8": "drumkit1/Snare02.mp3",
  "9": "drumkit1/Snare03.mp3",
  "10": "drumkit1/ClHat01.mp3",
  "11": "drumkit1/ClHat02.mp3",
  "12": "drumkit1/OpHat01.mp3",
  "13": "drumkit1/OpHat02.mp3",
  "14": "drumkit1/Vinyl03.mp3",
  "15": "drumkit1/Vinyl04.mp3"
};

var IRUrls = {
  "0": "Impulse_Responses/room.mp3",
  "1": "Impulse_Responses/hall.mp3"
};

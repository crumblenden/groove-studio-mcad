///////////////////////////////////////////////////////////////////////////////
/*
Audio System.

This script creates and modifies parameters of the Web Audio API components.

Functions for creating and connecting nodes and changing parameters are
called in Main_Control.js and Scheduler.js.

*/
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Audio objects and variables.

var audioCtx = new AudioContext();
var bLoader = new BufferLoader(audioCtx);
var bLoader2 = new BufferLoader(audioCtx);
console.log(audioCtx);

var sampleBuffers = {};
var samplesLoaded = false;

//Arrays of nodes for use with the channels
var inGains = [];
var velGains = [];
var send2Gains = [];
var outGains = [];
var muteGains = [];
var soloGains = [];
var pans = [];

//Variable used to calculate solo gains
var soloTotal = 0;

//reverb variables
var reverbConvolver;
var IRBuffers = {};
var IRLoaded = false;

//master bus
var channelBus = audioCtx.createGain();
channelBus.gain.value = 1;

///////////////////////////////////////////////////////////////////////////////
// Loads samples using the MCAD Library's BufferLoader. Sample URLs are defined
// in Data.js.

function loadSamples() {
  bLoader.loadBufferList(sampleBuffers, sampleUrls, function() {
		samplesLoaded = true;
	});
}

///////////////////////////////////////////////////////////////////////////////
// Creates convolver for reverb send.

function createReverbSend() {
  reverbOutGain = audioCtx.createGain();
  reverbOutGain.gain.value = 1.0;
  reverbMuteGain = audioCtx.createGain();
  reverbMuteGain.gain.value = 1.0;
  reverbConvolver = audioCtx.createConvolver();
  bLoader2.loadBufferList(IRBuffers, IRUrls, function() {
    IRLoaded = true;
    //setImpulseResponse('Room');
    reverbConvolver.buffer = IRBuffers[0];
    console.log(reverbConvolver);
    reverbConvolver.loop = true;
    reverbConvolver.normalise = true;
  });
}

///////////////////////////////////////////////////////////////////////////////
// Switches buffers for the impulse response

function setImpulseResponse(IRName) {
  switch(IRName) {
    case "Room":
      reverbConvolver.buffer = IRBuffers[0];
      break;
    case "Hall":
      reverbConvolver.buffer = IRBuffers[1];
      break;
    default: break;
  }
  reverbConvolver.loop = true;
  reverbConvolver.normalise = true;
  console.log(reverbConvolver);
}
///////////////////////////////////////////////////////////////////////////////
// Creates an array of stereo panner nodes, one per channel. Calls setPan()
// to initialise each channel's pan variable.

function createPans() {
  for(var i = 0; i < numRows; i++)
  {
    pans[i] = audioCtx.createStereoPanner();
    setPan(i, channels[i].pan);
  }
}


///////////////////////////////////////////////////////////////////////////////
// Creates all gain nodes for each channel. Calls set_() functions to initialise
// associated variables.

function createGains() {
  for(var i = 0; i < numRows; i++)
  {
    inGains[i] = audioCtx.createGain();
    velGains[i] = audioCtx.createGain();
    send2Gains[i] = audioCtx.createGain();
    outGains[i] = audioCtx.createGain();
    muteGains[i] = audioCtx.createGain();
    soloGains[i] = audioCtx.createGain();
    inGains[i].gain.value = 1;
    setVelGain(i, channels[i].currentVelocity);
    setSend2Gain(i, channels[i].send2);
    setOutGain(i, channels[i].volume);
    setMuteGain(i, !channels[i].mute);
    setSoloGain(i, !channels[i].solo);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Connects all audio nodes to form the signal flow structure of the app.
// Additions can easily be made.

function connectNodes() {
  for(var i = 0; i < numRows; i++)
  {
    inGains[i].connect(pans[i]);
    pans[i].connect(outGains[i]);
      pans[i].connect(send2Gains[i]);
    outGains[i].connect(muteGains[i]);
    muteGains[i].connect(soloGains[i]);
    soloGains[i].connect(channelBus);
        send2Gains[i].connect(reverbConvolver);
  }
  reverbConvolver.connect(reverbOutGain);
  reverbOutGain.connect(reverbMuteGain);
  reverbMuteGain.connect(channelBus);
  channelBus.connect(audioCtx.destination);
}

///////////////////////////////////////////////////////////////////////////////
// Called in Scheduler. Creates oscillator tones and connects to the beggining
// of each channel's signal path. Queues for playback. Used for initial UI
// prototyping, may be implemented as an additional feature later.


function connectAndQueueOscillators(stepPlayTime, freq, channelNo) {
	var oscillator = audioCtx.createOscillator();
	oscillator.connect(inGains[channelNo]);
  inGains[channelNo].gain.setTargetAtTime(0, (stepPlayTime + noteDuration) - 0.025, 0.025);
  inGains[channelNo].gain.value = 1.0;
	oscillator.start(stepPlayTime);
	oscillator.frequency.value = freq;
	oscillator.stop(stepPlayTime + noteDuration);
}

///////////////////////////////////////////////////////////////////////////////
// Called in Scheduler. Creates buffers containing sample data and connects to
// the beggining of each channel's signal path. Queues buffers for playback.

function connectAndQueueSample(stepPlayTime, channelNo) {
  if(samplesLoaded == true) {
    var source = audioCtx.createBufferSource();
      source.buffer = sampleBuffers[channelNo];
      source.connect(inGains[channelNo]);
      inGains[channelNo].gain.value = 1.0;
      inGains[channelNo].gain.setTargetAtTime(1.0, audioCtx.currentTime, 0.025);
      //source.detune.value = detune; // value in cents
      source.start();
  }
}

///////////////////////////////////////////////////////////////////////////////
// Sets channel output gain.

function setOutGain(channelNo, value) {
  outGains[channelNo].gain.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets channel mute gain. (1 or 0). Called in toggleMute() in
// Main_Control.js

function setMuteGain(channelNo, value) {
  muteGains[channelNo].gain.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets channel solo gain. (1 or 0). Called in toggleSolo() in
// Main_Control.js

function setSoloGain(channelNo, value) {
  soloGains[channelNo].gain.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets channel pan.

function setPan(channelNo, value) {
  pans[channelNo].pan.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets channel send 2.

function setSend2Gain(channelNo, value) {
  send2Gains[channelNo].gain.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets reverb mute gain.

function setReverbMuteGain(value) {
  reverbMuteGain.gain.value = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets reverb master gain.

function setReverbOutGain(value) {
  reverbOutGain.gain.value = value;
}


///////////////////////////////////////////////////////////////////////////////
// Sets channel velocity value. (1 to 127). Not currently used.

function setVelocity(channelNo, stepNo, value) {
  channels[channelNo].steps[stepNo].velocity = value;
}

///////////////////////////////////////////////////////////////////////////////
// Sets gain for channel velocity gain node. Not currently used.

function setVelGain(channelNo, value) {
  velGains[channelNo].gain.value = gainFromVelocity(value);
}

function gainFromVelocity(velocity) {
  var gain = 0.0;
  gain = velocity * (1/127);
  return gain;
}

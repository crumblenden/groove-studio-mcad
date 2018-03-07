///////////////////////////////////////////////////////////////////////////////
/*
Scheduler.

This script schedules the playback of audio.
*/
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Scheduler variables.

var tempo = 100;
var numSteps = 16;

var secondsPerBeat = 60.0 / tempo;
var secondsPerStep = secondsPerBeat/4;
var noteDuration = secondsPerStep;

var scheduleId;
var stepTime = 0.0;
var startTime;
var currentStep = 0;
var scheduleAheadTime = 0.001;
var isPlaying = false;

///////////////////////////////////////////////////////////////////////////////
// Iterates through channel data and queues active steps. scheduleAheadTime
// provides a look ahead function.

function schedule() {
	var currentTime = audioCtx.currentTime;
	currentTime -= startTime;
	while (stepTime < currentTime + scheduleAheadTime) {
		var stepPlayTime = stepTime + startTime;
    for(var i = 0; i < numRows; i++){
  		if(channels[i].steps[currentStep].isActive == true) {
				if(toggleOsc){
        connectAndQueueOscillators(stepPlayTime, channels[i].pitch, i);}
				else{
				connectAndQueueSample(stepPlayTime, i); }
				flashCurrentStep(i, currentStep);
  		 }
     }

    currentStep++;
  	if (currentStep == numSteps)  {
      currentStep = 0;
      }
    stepTime += secondsPerStep;
	}
	scheduleId = setTimeout(schedule, scheduleAheadTime * 1000);
}

///////////////////////////////////////////////////////////////////////////////
// Called by controlGridClicked() in Main_Control. Starts and stops scheduling.
function play() {
		if(isPlaying === false) {
			isPlaying = true;
			stepTime = 0.0;
			startTime = audioCtx.currentTime;
			currentStep = 0;
			schedule();
		  }
		else {
			isPlaying = false;
			clearTimeout(scheduleId);
		  }
    }

///////////////////////////////////////////////////////////////////////////////
// Changes the global tempo value. Called by songGridClicked() in Main_Control.

function setTempo(value) {
  tempo = value;
  secondsPerBeat = 60.0 / tempo;
  secondsPerStep = secondsPerBeat/4;
}

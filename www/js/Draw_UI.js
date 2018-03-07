///////////////////////////////////////////////////////////////////////////////
/*
Draw UI.

This script creates all of the UI elements dynamically using
the Document Object Model.

It implements tables to create a grid-based contol system.

Individual tables can be resized and repositioned by reassigning the below
variables.

New tables can be added quickly using the function createGrid().
This enables easy expansion and editing of the UI.

The function drawUI() is called in Main_Control.js, which in
turn calls the functions to create UI panels and add content and controls.
*/

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Global variables used to create the UI

//Offset can be used to position app within web window.
var uiOffset = 0;
mainGridXPos = uiOffset;
mainGridYPos = uiOffset;

//Get viewport size //other tried methods commented
var w = window;
  x = w.innerWidth;
  y = w.innerHeight;
//x=window.screen.width
//y=window.screen.height;
//x=$(window).width();
//y=$(window).height();

//Total number of rows = amount of channels
numRows = 16;
//Number of steps
seqNumCols = 16;
mixNumCols = seqNumCols;
trackNumCols = 1;
controlNumCols = 1;
controlNumRows = numRows;
//Dimensions of FX and settings(song) panels
songNumCols = 6;
songNumRows = 2;
FXNumCols = 6;
FXNumRows = 2;
//Calculate total number of columns in app
numCols = seqNumCols + trackNumCols + controlNumCols;

//if the screen is taller than it is wide
if(x < y){
  //calcualte cell size as a 1/9 of width
  globalCellSize = Math.floor(x / (numCols/2));
} else {
  //calcualte cell size as a 1/8 of height
  globalCellSize = Math.floor(y / (numRows/2));
}

if(globalCellSize % 2 == 1) {globalCellSize--;} //reduces pixel rounding errors
globalBorderSize = (globalCellSize / 15); //dynamic border size
globalCellSizeWithBorders = globalCellSize; //cell size
globalCellSize -= globalBorderSize * 2; //cell size without borders

globalFontSize = globalCellSize / 2.5; //dynamic font size
volFaderWidth = globalCellSize * 3;; //dynamic faders
panFaderWidth = globalCellSize * 2;
sendFaderWidth = globalCellSize * 2;
faderHeight = globalCellSize - (globalBorderSize * 2);
///////////////////////////////////////////////////////////////////////////////
// Main draw function called in Main_Control.js.

function drawUI() {
  //create main 18*16 table within a div
  var body = document.body;
  var container = document.createElement('div');
  body.appendChild(container);
  var parent = container;
  createGrid(mainGridXPos, mainGridYPos, globalCellSize,
              globalBorderSize, numRows, numCols, "mainGrid", parent);

  //create and position 16*16 sequencer table
  var cellPos = getCellPosFromCoords(trackNumCols, 0);
  var cellLeft = cellPos[0];
  var cellTop = cellPos[1];
  parent = document.getElementById("mainGridContainer");
  createGrid((cellLeft + "px"), (cellTop + "px"), globalCellSize,
              globalBorderSize, numRows, seqNumCols, "seqGrid", parent, "absolute");

  //create and position 16*16 mixer table
  var cellPos = getCellPosFromCoords(trackNumCols, 0);
  var cellLeft = cellPos[0];
  var cellTop = cellPos[1];
  parent = document.getElementById("mainGridContainer");
  createGrid( (cellLeft + "px"), (cellTop + "px"), globalCellSize,
              globalBorderSize, numRows, mixNumCols, "mixGrid", parent, "absolute");

  //create control panel
  parent = document.getElementById("mainGridContainer");
  createGrid((x-globalCellSizeWithBorders + "px"), "0px", globalCellSize,
              globalBorderSize, controlNumRows, controlNumCols, "controlGrid", parent, "fixed");

  //create track list panel
  var cellPos = getCellPosFromCoords(0, 0);
  var cellLeft = cellPos[0];
  var cellTop = cellPos[1];
  parent = document.getElementById("mainGridContainer");
  createGrid((cellLeft + "px"), (cellTop + "px"), globalCellSize,
              globalBorderSize, numRows, trackNumCols, "trackGrid", parent, "absolute");

  //create settings/song panel
  parent = document.getElementById("mainGridContainer");
  createGrid( (x - (globalCellSizeWithBorders*(songNumCols+controlNumCols))+  "px"), (0 + "px"), globalCellSize,
              globalBorderSize, songNumRows, songNumCols, "songGrid", parent, "fixed");

  //create FX settings panel
  parent = document.getElementById("mainGridContainer");
  createGrid( (x - (globalCellSizeWithBorders*(FXNumCols+controlNumCols)) + "px"),
                  ((globalCellSizeWithBorders*FXNumRows)+ "px"), globalCellSize,
                      globalBorderSize, FXNumRows, FXNumCols, "FXGrid", parent, "fixed");

  //hide contextual UI panes
  $('#mixGridContainer').hide();
  $('#songGridContainer').hide();
  $('#FXGridContainer').hide();
  //add UI content
  addMixControls();
  addSongControls();
  addFXControls();
  addTextAndIcons();
}

///////////////////////////////////////////////////////////////////////////////
// Returns the absolute position of a td element from its' row, col coordinates.

function getCellPosFromCoords(x, y) {
  cellAbsSize = globalCellSize + (globalBorderSize * 2);
  cellLeft = cellAbsSize * x;
  cellTop = cellAbsSize * y;
  return [cellLeft, cellTop];
}

///////////////////////////////////////////////////////////////////////////////
// Draws a table contained in a div using the supplied arguments.

function createGrid(posLeft, posTop, cellSize, borderWidth, numRows, numCols, gridId, parentElement, positioning) {
  allBordersWidth = (borderWidth * numCols) * 2;
  container = document.createElement("div");
  container.id = gridId + "Container";
  container.style.width = ((cellSize * numCols) + allBordersWidth) + "px";
  container.style.height = (cellSize * numRows) + "px";
  container.style.position = positioning;
  container.style.left = posLeft;
  container.style.top = posTop;
  container.style.borderWidth = borderWidth;
  parentElement.appendChild(container);

  grid = document.createElement("table");
  grid.id = gridId + "Table";
  grid.style.width = container.style.width - allBordersWidth;
  grid.style.height = container.style.height;
  grid.style.position = "absolute";
  grid.style.left = "0px";
  grid.style.top = "0px";
  grid.style.lineHeight = globalCellSize + "px";
  container.appendChild(grid);

  for(var i = 0; i < numRows; i++)
  {
      //create tr element with numerical id
      tr = document.createElement("tr");
      tr.id = gridId + " Row " + i;
      tr.style.width = cellSize + "px";
      tr.style.height = cellSize + "px";
      grid.appendChild(tr);

      for(var j = 0; j < numCols; j++)
      {
          //create td elements
          td = document.createElement("td");
          td.style.width = cellSize + "px";
          td.style.height = cellSize + "px";
          td.style.borderWidth = borderWidth + "px";
          tr.appendChild(td);
          //create div within each td, with 2 dimensional id
          div = document.createElement("div");
          div.id = tr.id + " Col " + j;
          div.style.width = cellSize + "px";
          div.style.height = cellSize + "px";
          div.style.borderStyle = "none";
          div.style.overflow = "visible"; //stops resizing of cells
          div.style.backgroundColor = "transparent";
          td.appendChild(div);
      }
  }
}

///////////////////////////////////////////////////////////////////////////////
// Adds controls and content to the mixer table

function addMixControls() {

  for(var i = 0; i < numRows; i++) {
    //create reverb send fader for each channel, with numerical id
    var send2FaderTd = document.getElementById("mixGrid Row " + i + " Col " + 12);
    var send2Fader = document.createElement('input');
    send2FaderTd.style.width = globalCellSize * 4;
    send2Fader.id = "s" + i;
    send2Fader.type = "range";
    send2Fader.style.width = sendFaderWidth + "px";
    send2Fader.style.height = faderHeight + "px";
    send2Fader.min = 0.0;
    send2Fader.max = 1.0;
    send2Fader.step = 0.01;
    send2Fader.value = 0.0;
    send2FaderTd.appendChild(send2Fader);
    //create value display
    var send2ValTd = document.getElementById("mixGrid Row " + i + " Col " + 14);
    send2ValTd.style.fontSize = globalFontSize + "px";
    send2ValTd.innerHTML = channels[i].send2;

    //create pan fader for each channel, with numerical id
    var panFaderTd = document.getElementById("mixGrid Row " + i + " Col " + 8);
    var panFader = document.createElement('input');
    panFader.id = "p" + i;
    panFader.type = "range";
    panFader.style.width = panFaderWidth + "px";
    panFader.style.height = faderHeight + "px";
    panFader.min = -1.0;
    panFader.max = 1.0;
    panFader.step = 0.01;
    panFader.value = 0.0;
    panFaderTd.appendChild(panFader);
    //create value display
    var panValTd = document.getElementById("mixGrid Row " + i + " Col " + 10);
    panValTd.style.fontSize = globalFontSize + "px";
    panValTd.innerHTML = channels[i].pan;

    //create volume fader for each channel, with numerical id
    var faderTd = document.getElementById("mixGrid Row " + i + " Col " + 3);
    var fader = document.createElement('input');
    fader.id = "f" + i;
    fader.type = "range";
    fader.style.width = volFaderWidth + "px";
    fader.style.height = faderHeight + "px";
    fader.min = 0;
    fader.max = 1;
    fader.step = 0.01;
    fader.value = 0.7;
    faderTd.appendChild(fader);
    //create value display
    var volValTd = document.getElementById("mixGrid Row " + i + " Col " + 6);
    volValTd.style.fontSize = globalFontSize + "px";
    volValTd.style.verticalAlign = "middle";
    volValTd.style.borderRadius = "5px";
    volValTd.innerHTML = channels[i].volume * 100;

    //create mute button for each channel
    var muteTd = document.getElementById("mixGrid Row " + i + " Col " + 0);
    muteTd.style.fontSize = globalFontSize + "px";
    muteTd.innerHTML = "mute";
    muteTd.style.backgroundColor = muteColor;
    muteTd.style.borderRadius = "5px";

    //create solo button for each channel
    var soloTd = document.getElementById("mixGrid Row " + i + " Col " + 1);
    soloTd.style.fontSize = globalFontSize + "px";
    soloTd.style.align = "center";
    soloTd.innerHTML = "solo";
    soloTd.style.backgroundColor = soloColor;
    soloTd.style.borderRadius = "5px";

    //hide specified borders for every row in mixer
    hideBorder("mixGrid Row " + i + " Col " + 2, "right");
    hideBorder("mixGrid Row " + i + " Col " + 3, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 4, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 5, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 6, "left");
    hideBorder("mixGrid Row " + i + " Col " + 7, "right");
    hideBorder("mixGrid Row " + i + " Col " + 8, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 9, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 10, "left");
    hideBorder("mixGrid Row " + i + " Col " + 11, "right");
    hideBorder("mixGrid Row " + i + " Col " + 12, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 13, "sides");
    hideBorder("mixGrid Row " + i + " Col " + 14, "left");
  }
}

///////////////////////////////////////////////////////////////////////////////
// Adds controls and content to the song settings table

function addSongControls() {
  //create tempo fader
  var tempoFaderTd = document.getElementById("songGrid Row " + 0 + " Col " + 2);
  var tempoFader = document.createElement('input');
  tempoFader.id = "t0";
  tempoFader.type = "range";
  tempoFader.style.width = volFaderWidth + "px";
  tempoFader.style.height = faderHeight + "px";
  tempoFader.min = 20;
  tempoFader.max = 400;
  tempoFader.step = 1;
  tempoFader.value = 120;
  tempoFaderTd.appendChild(tempoFader);

  //create value display
  var tempoValTd = document.getElementById("songGrid Row " + 0 + " Col " + 5);
  tempoValTd.style.fontSize = globalFontSize + "px";
  tempoValTd.innerHTML = "120";

  //create button to clear sequence
  var clearTd = document.getElementById("songGrid Row " + 1 + " Col " + 5);
  clearTd.style.fontSize = globalFontSize + "px";
  clearTd.style.align = "center";
  clearTd.innerHTML = "clear";
  clearTd.style.backgroundColor = muteColor;
  clearTd.style.borderRadius = "30px";

  //hide specified borders
  hideBorder("songGrid Row " + 0 + " Col " + 0, "right");
  hideBorder("songGrid Row " + 0 + " Col " + 1, "sides");
  hideBorder("songGrid Row " + 0 + " Col " + 2, "sides");
  hideBorder("songGrid Row " + 0 + " Col " + 3, "sides");
  hideBorder("songGrid Row " + 0 + " Col " + 4, "sides");
  hideBorder("songGrid Row " + 0 + " Col " + 5, "left");
  hideBorder("songGrid Row " + 1 + " Col " + 0, "right");
  hideBorder("songGrid Row " + 1 + " Col " + 1, "sides");
  hideBorder("songGrid Row " + 1 + " Col " + 2, "left");
  hideBorder("songGrid Row " + 1 + " Col " + 3, "right");
  hideBorder("songGrid Row " + 1 + " Col " + 4, "left");

}

///////////////////////////////////////////////////////////////////////////////
// Adds controls and content to the FX settings table

function addFXControls() {

  //create room select button
  var roomTd = document.getElementById("FXGrid Row " + 0 + " Col " + 4);
  roomTd.style.fontSize = globalFontSize + "px";
  roomTd.innerHTML = "room";

  //create hall select button
  var hallTd = document.getElementById("FXGrid Row " + 0 + " Col " + 5);
  hallTd.style.fontSize = globalFontSize + "px";
  hallTd.innerHTML = "hall";

  //create reverb return fader, with id
  var faderTd = document.getElementById("FXGrid Row " + 1 + " Col " + 2);
  var fader = document.createElement('input');
  fader.id = "r0";
  fader.type = "range";
  fader.style.width = volFaderWidth + "px";
  fader.style.height = faderHeight + "px";
  fader.min = 0;
  fader.max = 1;
  fader.step = 0.01;
  fader.value = 1;
  faderTd.appendChild(fader);

  //create value display
  var volValTd = document.getElementById("FXGrid Row " + 1 + " Col " + 5);
  volValTd.style.fontSize = globalFontSize + "px";
  volValTd.innerHTML = reverbOutGain.gain.value * 100;

  //create reverb mute button
  var muteTd = document.getElementById("FXGrid Row " + 1 + " Col " + 0);
  muteTd.style.fontSize = globalFontSize + "px";
  muteTd.innerHTML = "mute";
  muteTd.style.backgroundColor = muteColor;

  //hide specified borders
  hideBorder("FXGrid Row " + 0 + " Col " + 0, "right");
  hideBorder("FXGrid Row " + 0 + " Col " + 1, "sides");
  hideBorder("FXGrid Row " + 0 + " Col " + 2, "sides");
  hideBorder("FXGrid Row " + 0 + " Col " + 3, "left");
  hideBorder("FXGrid Row " + 1 + " Col " + 1, "right");
  hideBorder("FXGrid Row " + 1 + " Col " + 2, "sides");
  hideBorder("FXGrid Row " + 1 + " Col " + 3, "sides");
  hideBorder("FXGrid Row " + 1 + " Col " + 4, "sides");
  hideBorder("FXGrid Row " + 1 + " Col " + 5, "left");

  //initilise IR selection system
  setImpulseResponse("Room");
  var id = "FXGrid Row 0 Col 4";
  var cell = document.getElementById(id);
  $(cell).css('background', seqGridColor);
  var id = "FXGrid Row 0 Col 5";
  var cell = document.getElementById(id);
  $(cell).css('background', FXGridColor);
}

///////////////////////////////////////////////////////////////////////////////
// Adds text and icons to UI elements.

function addTextAndIcons() {

  var cell = document.getElementById("controlGrid Row " + 2 + " Col " + 0);
    var playIcon = document.createElement('img');
    playIcon.src = "buttonIcons/playIcon.png";
    playIcon.style.display = "block";
    playIcon.style.width = "100%";
    playIcon.style.height = "100%";
    playIcon.style.padding = "auto";
    cell.appendChild(playIcon);

  var cell = document.getElementById("controlGrid Row " + 1 + " Col " + 0);
    var mixerIcon = document.createElement('img');
    mixerIcon.src = "buttonIcons/mixerIcon.png";
    mixerIcon.id = "mixerIcon";
    mixerIcon.style.display = "block";
    mixerIcon.style.width = "100%";
    mixerIcon.style.height = "100%";
    mixerIcon.style.padding = "auto";
    cell.appendChild(mixerIcon);

    var gridIcon = document.createElement('img');
    gridIcon.src = "buttonIcons/gridIcon.png";
    gridIcon.id = "gridIcon";
    gridIcon.style.display = "block";
    gridIcon.style.width = "100%";
    gridIcon.style.height = "100%";
    gridIcon.style.padding = "auto";
    gridIcon.style.position = "relative";
    cell.appendChild(gridIcon);
    hideShow("#gridIcon", "fade", 0, "left");

  var cell = document.getElementById("controlGrid Row " + 3 + " Col " + 0);
    var fxIcon = document.createElement('img');
    fxIcon.src = "buttonIcons/fxIcon.png";
    fxIcon.style.display = "block";
    fxIcon.style.width = "100%";
    fxIcon.style.height = "100%";
    fxIcon.style.padding = "auto";
    cell.appendChild(fxIcon);

  var cell = document.getElementById("controlGrid Row " + 4 + " Col " + 0);
    var snareIcon = document.createElement('img');
    snareIcon.src = "buttonIcons/snareIcon.png";
    snareIcon.id = "snareIcon";
    snareIcon.style.display = "block";
    snareIcon.style.width = "100%";
    snareIcon.style.height = "100%";
    snareIcon.style.padding = "auto";
    cell.appendChild(snareIcon);

    var synthIcon = document.createElement('img');
    synthIcon.src = "buttonIcons/synthIcon.png";
    synthIcon.id = "synthIcon";
    synthIcon.style.display = "block";
    synthIcon.style.width = "100%";
    synthIcon.style.height = "100%";
    synthIcon.style.padding = "auto";
    synthIcon.style.position = "relative";
    cell.appendChild(synthIcon);
    hideShow("#snareIcon", "fade", 0, "left");

  var cell = document.getElementById("controlGrid Row " + 0 + " Col " + 0);
    var settingsIcon = document.createElement('img');
    settingsIcon.src = "buttonIcons/settingsIcon.png";
    settingsIcon.style.display = "block";
    settingsIcon.style.width = "100%";
    settingsIcon.style.height = "100%";
    settingsIcon.style.padding = "auto";
    cell.appendChild(settingsIcon);

  var cell = document.getElementById("songGrid Row " + 0 + " Col " + 0);
    cell.style.fontSize = globalFontSize + "px";
    cell.innerHTML = "&nbsp&nbsp&nbsp&nbsptempo";

  var cell = document.getElementById("songGrid Row " + 1 + " Col " + 0);
    cell.style.fontSize = globalFontSize + "px";
    cell.style.fontColor = 'black';
    cell.innerHTML = "&nbsp&nbsp&nbsp&nbspgroove&nbspstudio";

  var cell = document.getElementById("songGrid Row " + 1 + " Col " + 3);
    cell.style.fontSize = globalFontSize + "px";
    cell.innerHTML = "&nbsp&nbspC.L.&nbsp2017";

  var cell = document.getElementById("FXGrid Row " + 0 + " Col " + 0);
    cell.style.fontSize = globalFontSize + "px";
    cell.innerHTML = "&nbsp&nbsp&nbsp&nbspconvolution&nbspreverb";

  var cell = document.getElementById("FXGrid Row " + 1 + " Col " + 1);
    cell.style.fontSize = globalFontSize + "px";
    cell.innerHTML = "vol";

  for(var i = 0; i < numRows; i++) {
    var cell = document.getElementById("trackGrid Row " + i + " Col " + 0);
      cell.style.fontSize = globalFontSize + "px";
      cell.innerHTML = i+1;

    var cell = document.getElementById("mixGrid Row " + i + " Col " + 2);
      cell.style.fontSize = globalFontSize + "px";
      cell.innerHTML = "vol";

    var cell = document.getElementById("mixGrid Row " + i + " Col " + 7);
      cell.style.fontSize = globalFontSize + "px";
      cell.innerHTML = "pan";

    var cell = document.getElementById("mixGrid Row " + i + " Col " + 11);
      cell.style.fontSize = globalFontSize + "px";
      cell.innerHTML = "verb";
  }
}

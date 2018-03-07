var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {

        //lock device orientation
        screen.orientation.lock('landscape');

        $(document).ready(function() {
          createChannelData(channels); //initilise data structure & sample URLs
          loadSamples();
          createGains(); //create gain nodes
          createPans(); //create panners
          createReverbSend(); //create convolver
          connectNodes(); //connect WAAPI elements
          drawUI(); //create ui
          applyColors(); //apply color scheme
          activateControl(); //initialise controls

          //listen for event type 'input'
          document.addEventListener("input", function(e) {
            //parses target element id
            var id = e.target.id;
            var idArray = id.split("");
            if(idArray.length == 3) {idArray[1] = idArray[1] + idArray[2];}

            switch(idArray[0]) {
              //if element is a send fader
              case "s":
                channels[idArray[1]].send2 = (1.0 * $("#"+id).val());
                console.log(channels[idArray[1]].send2 );
                setSend2Gain(idArray[1], channels[idArray[1]].send2);
                var textCell = document.getElementById("mixGrid Row " +
                                        idArray[1] + " Col 14");
                textCell.innerHTML = (channels[idArray[1]].send2*100);
                textCell.style.overflow = "hidden";
                break;
              //if element is a pan fader
              case "p":
                channels[idArray[1]].pan = (1.0 * $("#"+id).val());
                console.log(channels[idArray[1]].pan );
                setPan(idArray[1], channels[idArray[1]].pan);
                var textCell = document.getElementById("mixGrid Row " +
                                        idArray[1] + " Col 10");
                textCell.innerHTML = (channels[idArray[1]].pan);
                textCell.style.overflow = "hidden";
                break;
              //if element is a volume fader
              case "f":
                channels[idArray[1]].volume = (1.0 * $("#"+id).val());
                console.log(channels[idArray[1]].volume );
                setOutGain(idArray[1], channels[idArray[1]].volume);
                var textCell = document.getElementById("mixGrid Row " +
                                        idArray[1] + " Col 6");
                textCell.innerHTML = (channels[idArray[1]].volume*100);
                textCell.style.overflow = "hidden";
                break;
              //if element is the reverb volume fader
              case "r":
                var value = (1.0 * $("#"+id).val());
                reverbOutGain.gain.value = value;
                console.log(reverbOutGain.gain.value);
                setReverbOutGain(value);
                var textCell = document.getElementById("FXGrid Row 1 Col 5");
                textCell.style.overflow = "hidden";
                textCell.innerHTML = (reverbOutGain.gain.value * 100);
                break;
              //if element is the tempo fader
              case "t":
                var temp = (1.0 * $("#"+id).val());
                setTempo(temp);
                console.log(tempo);
                var textCell = document.getElementById("songGrid Row 0 Col 5");
                textCell.style.overflow = "hidden";
                textCell.innerHTML = (tempo);
                break;
              default: break;
            }
          });

            //listen for mouse down event
            $("div").on('mousedown', function(e) {
              e.preventDefault();
              //get id of target element
              var id = $(this).attr("id");
              //check its valid
              if(hasNumber(id)){
                    var id = $(this).attr("id");
                    var idArray = parseID(id);
                    //execute function based on which panel target is in
                    switch(idArray[0]) {
                        case "controlGrid":
                          coords = [idArray[1], idArray[2]];
                          controlGridClicked(coords);
                          break;
                        case "seqGrid":
                          coords = [idArray[1], idArray[2]];
                          seqGridClicked(coords);
                          break;
                        case "trackGrid":
                          coords = [idArray[1], idArray[2]];
                          trackGridClicked(coords);
                          break;
                        case "mixGrid":
                          coords = [idArray[1], idArray[2]];
                          mixGridClicked(coords);
                          break;
                        case "songGrid":
                          coords = [idArray[1], idArray[2]];
                          songGridClicked(coords);
                          break;
                        case "FXGrid":
                          coords = [idArray[1], idArray[2]];
                          FXGridClicked(coords);
                          break;
                        }
                      }
           });
          //floats the track list pane on the left
          $(window).scroll(function(){
              $('#trackGridTable').css({
                  'left': $(this).scrollLeft()
              });
          });
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

app.initialize();

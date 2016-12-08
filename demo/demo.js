Demo = function () {

    var output = document.getElementById('output'),
        demo = document.getElementById('demo'),
        count = 0;

    var log = function (msg, separate) {
        count = count + (separate ? 1 : 0);
        output.value = count + ": " + msg + "\n" + (separate ? "\n" : "") + output.value;
        demo.className = fsm.current;
    };

    var fsm = StateMachine.create({

        events: [
          { name: 'start', from: 'none', to: 'base' },

          { name: 'VolUp', from: 'base', to: 'green' },
          { name: 'VolUp', from: 'green', to: 'yellow' },
          { name: 'VolUp', from: 'yellow', to: 'red' },
          { name: 'VolUp', from: 'red', to: 'blue' },
          { name: 'VolUp', from: 'blue', to: 'orange' },
          { name: 'VolUp', from: 'orange', to: 'base' },


          { name: 'VolDown', from: 'base', to: 'orange' },
          { name: 'VolDown', from: 'orange', to: 'blue' },
          { name: 'VolDown', from: 'blue', to: 'red' },
          { name: 'VolDown', from: 'red', to: 'yellow' },
          { name: 'VolDown', from: 'yellow', to: 'green' },
          { name: 'VolDown', from: 'green', to: 'base' },

          { name: 'stay', from: 'base', to: 'base' },
          { name: 'stay', from: 'red', to: 'red' },
          { name: 'stay', from: 'yellow', to: 'yellow' },
          { name: 'stay', from: 'green', to: 'green' },
          { name: 'stay', from: 'blue', to: 'blue' },
          { name: 'stay', from: 'orange', to: 'orange' },

        ],

        callbacks: {
            onbeforestart: function (event, from, to) { log("STARTING UP"); },
            onstart: function (event, from, to) { log("READY"); },

            onbeforeVolUp: function (event, from, to) { log("START   EVENT: VolUp!", true); },
            onbeforeVolDown: function (event, from, to) { log("START   EVENT: VolDown!", true); },
            onbeforestay: function (event, from, to) { log("START   EVENT: stay!", true); },

            onVolUp: function (event, from, to) { log("FINISH  EVENT: VolUP!"); },
            onVolDown: function (event, from, to) { log("FINISH  EVENT: VolDown!"); },
            onstay: function (event, from, to) { log("FINISH  EVENT: stay!"); },

            onleavegreen: function (event, from, to) { log("LEAVE   STATE: green"); },
            onleaveyellow: function (event, from, to) { log("LEAVE   STATE: yellow"); },
            onleavered: function (event, from, to) { log("LEAVE   STATE: red"); },
            onleaveblue: function (event, from, to) { log("LEAVE   STATE: blue"); },
            onleaveorange: function (event, from, to) { log("LEAVE   STATE: orange"); },
            onleavebase: function (event, from, to) { log("LEAVE   STATE: base"); },

            ongreen: function (event, from, to) { log("ENTER   STATE: green"); },
            onyellow: function (event, from, to) { log("ENTER   STATE: yellow"); },
            onred: function (event, from, to) { log("ENTER   STATE: red"); },
            onblue: function (event, from, to) { log("ENTER   STATE: blue"); },
            onorange: function (event, from, to) { log("ENTER   STATE: orange"); },
            onbase: function (event, from, to) { log("ENTER   STATE: base"); },

            onchangestate: function (event, from, to) { log("CHANGED STATE: " + from + " to " + to); }
        }
    });

    

    fsm.start();

    return fsm;

}();
var FreqSize = 16;
var frequencyData = new Uint8Array(FreqSize);
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('audioElement');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();

// bind our analyser to the media element source.
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

function test() {
    analyser.getByteFrequencyData(frequencyData);
    console.log(frequencyData[0]);
    Demo.VolUp();
    setTimeout(function () {
        //Demo.clear(); // trigger deferred state transition
        update();
    }, 1000);

}
var lastval = 0;
function update() {
    analyser.getByteFrequencyData(frequencyData);
    if (frequencyData[0] == lastval) {
        Demo.stay();
    }
    else if (frequencyData[0] < lastval) {
        lastval = frequencyData[0];
        Demo.VolUp();
    }
    else {
        lastval = frequencyData[0];
        Demo.VolDown();
    }
    setTimeout(function () {
        //Demo.clear(); // trigger deferred state transition
        update();
    }, 100);
}
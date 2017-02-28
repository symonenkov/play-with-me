var log = console.log.bind(console),
    midi;
var AudioContext = AudioContext || webkitAudioContext; // for ios/safari
var context = new AudioContext();
var data, cmd, channel, type, note, velocity;

//create a synth and connect it to the master output (your speakers)
var multiband = new Tone.MultibandCompressor()
var synth = new Tone.PolySynth(4, Tone.AMSynth).toMaster();


// create MIDI note table to conver midinote to frequency
var midiNoteToFreq = [];
var a = 440;
for (var i = 0; i < 127; ++i) {
    midiNoteToFreq[i] = (a / 32) * Math.pow(2, ((i - 9) / 12));
}
// console.log(midiNoteToFreq.length);

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}


// midi functions
function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(ev) {
    var cmd = ev.data[0] >> 4;
    var channel = ev.data[0] & 0xf;
    var noteNumber = ev.data[1];
    var velocity = ev.data[2];

    if (channel == 9)
        return
    if (cmd == 8 || ((cmd == 9) && (velocity == 0))) { // with MIDI, note on with velocity zero is the same as note off
        // note off
        noteOff(noteNumber);
    } else if (cmd == 9) {
        // note on
        noteOn(noteNumber, velocity / 124.0);
    } else if (cmd == 11) {
        controller(noteNumber, velocity / 124.0);
    } else if (cmd == 14) {
        // pitch wheel
        pitchWheel(((velocity * 128.0 + noteNumber) - 8192) / 8192.0);
    } else if (cmd == 10) { // poly aftertouch
        polyPressure(noteNumber, velocity / 124)
    } else
        console.log("" + ev.data[0] + " " + ev.data[1] + " " + ev.data[2])

}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}

function listInputs(inputs) {
    var input = inputs.value;
    log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}

function noteOn(midiNote, velocity) {
    synth.triggerAttack(midiNoteToFreq[midiNote], undefined, velocity);
    createCircle(midiNote, velocity, 2);
    sendNoteOn({ midiNote, velocity });
}

function noteOff(midiNote, velocity) {
    synth.triggerRelease(midiNoteToFreq[midiNote]);
    sendNoteOff({ midiNote, velocity });
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// effects


function circle(note, velocity, coords, radius, effectName) {
    var circle = document.createElement("DIV");

    if (effectName) {
        circle.className = "circle " + effectName;
    } else {
        circle.className = "circle fadeOut";
    }

    if (radius) {
        //child
        circle.radius = radius;
    } else {
        circle.radius = velocity * 200;

    }


    if (coords) {
        // if child
        circle.coords = {
            coordX: coords.coordX,
            coordY: coords.coordY
        };

    } else {
        circle.coords = {
            coordX: randomIntFromInterval(0, window.innerWidth - circle.radius),
            coordY: randomIntFromInterval(0, window.innerHeight - circle.radius)
        };

    }

    circle.style.left = circle.coords.coordX + "px";
    circle.style.top = circle.coords.coordY + "px";
    circle.style.width = circle.radius + "px";
    circle.style.height = circle.radius + "px";
    circle.style.backgroundColor = noteToColor(midiNoteToNote[note], velocity);

    circle.style.animationDuration = "0.5s";

    return circle;
}

function createCircle(note, velocity, childsCount) {
    // console.log(midiNoteToNote[note] + '  ' + velocity)

    var parentCircle = circle(note, velocity);

    var childCircles = [];
    for (var i = 0; i < childsCount; i++) {
        var childRadius = randomIntFromInterval((parentCircle.radius / 4), (parentCircle.radius / 2));
        childCoords = {
            coordX: randomIntFromInterval((parentCircle.coords.coordX), (parentCircle.coords.coordX + parentCircle.radius / 1.2)),
            coordY: randomIntFromInterval((parentCircle.coords.coordY), (parentCircle.coords.coordY + parentCircle.radius / 1.2))
        }
        childCircles[i] = circle(note, velocity, childCoords, childRadius, 'fadeIn');
    }
    var child2Circles = [];
    for (var i = 0; i < childsCount; i++) {
        for (var j = 0; j < childsCount; j++) {
            var child2Radius = randomIntFromInterval((childCircles[i].radius / 4), (childCircles[i].radius / 2));
            child2Coords = {
                coordX: randomIntFromInterval((childCircles[i].coords.coordX), (childCircles[i].coords.coordX + childCircles[i].radius / 1.2)),
                coordY: randomIntFromInterval((childCircles[i].coords.coordY), (childCircles[i].coords.coordY + childCircles[i].radius / 1.2))
            }
            child2Circles.push(circle(note, velocity, child2Coords, child2Radius));
        }
    }

    document.getElementById('effects-layer').appendChild(parentCircle);

    var timer = 500;

    setTimeout(function() {
        // remove parent circle DOM element
        document.getElementById('effects-layer').removeChild(parentCircle);

        // // create childs
        // for (var i = 0; i < childsCount; i++) {
        //     document.getElementById('effects-layer').appendChild(childCircles[i]);
        // }
        // setTimeout(function() {
        //     // remove childs
        //     for (var i = 0; i < childsCount; i++) {
        //         document.getElementById('effects-layer').removeChild(childCircles[i])
        //     }

        //     // create new childs
        //     for (var i = 0; i < child2Circles.length; i++) {
        //         document.getElementById('effects-layer').appendChild(child2Circles[i]);
        //     }
        // }, timer)


    }, timer);
}

function noteToColor(note, velocity) {
    var color = "";
    switch (note) {
        case 'C':
            color = "rgba(255,0,0," + velocity + ")";
            break;
        case 'C#':
            color = "rgba(255,128,0," + velocity + ")";
            break;
        case 'D':
            color = "rgba(255,255,0," + velocity + ")";
            break;
        case 'D#':
            color = "rgba(128,255,0," + velocity + ")";
            break;
        case 'E':
            color = "rgba(0,255,0," + velocity + ")";
            break;
        case 'F':
            color = "rgba(0,255,128," + velocity + ")";
            break;
        case 'F#':
            color = "rgba(0,255,255," + velocity + ")";
            break;
        case 'G':
            color = "rgba(0,128,255," + velocity + ")";
            break;
        case 'G#':
            color = "rgba(0,0,255," + velocity + ")";
            break;
        case 'A':
            color = "rgba(128,0,255," + velocity + ")";
            break;
        case 'A#':
            color = "rgba(255,0,255," + velocity + ")";
            break;
        case 'B':
            color = "rgba(255,0,128," + velocity + ")";
            break;

    }
    return color;
}


// midi notes dictionary
var midiNoteToNote = [];
var midiNoteToNoteOct = [];
var Notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
for (var i = 0; i < 10; i++) {
    for (var j = 0; j <= 11; j++) {
        midiNoteToNote.push(Notes[j]);
        midiNoteToNoteOct.push(Notes[j] + i);
    }
}
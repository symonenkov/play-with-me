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
    createCircle(midiNote, velocity);
}

function noteOff(midiNote, velocity) {
    synth.triggerRelease(midiNoteToFreq[midiNote]);
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}



// effects
function randomPosition() {
    var position = [];
    var width = window.innerWidth;
    var height = window.innerHeight;
    // x position
    position[0] = Math.floor(Math.random() * width);
    // y position
    position[1] = Math.floor(Math.random() * height);

    return position;
}



function createCircle(note, velocity) {
    console.log(midiNoteToNote[note] + '  ' + velocity)
    var circle = document.createElement("DIV");
    circle.className = "circle fadeOut";
    circle.style.left = randomPosition()[0] + "px";
    circle.style.top = randomPosition()[1] + "px";
    var radius = velocity * 120;
    circle.style.width = radius + "px";
    circle.style.height = radius + "px";

    circle.style.backgroundColor = noteToColor(midiNoteToNote[note], velocity);

    circle.style.animationDuration = 20 * velocity + "s";
    document.getElementById('effects-layer').appendChild(circle);
    // remove circle DOM element
    setTimeout(function() {
        document.body.removeChild(circle);
    }, 50000);
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
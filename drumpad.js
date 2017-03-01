var pad1 = new Tone.Player({
    "url": "./drums/kick.mp3",
    // "loop": true
}).toMaster();
pad1.id = "pad1";

var pad2 = new Tone.Player({
    "url": "./drums/snare.mp3",
    // "loop": true
}).toMaster();
pad2.id = "pad2";

var pad3 = new Tone.Player({
    "url": "./drums/hat.mp3",
    // "loop": true
}).toMaster();
pad3.id = "pad3";

var pad4 = new Tone.Player({
    "url": "./drums/tom.mp3",
    // "loop": true
}).toMaster();
pad4.id = "pad4";

var pad5 = new Tone.Player({
    "url": "./drums/stick.mp3",
    // "loop": true
}).toMaster();
pad5.id = "pad5";

var pad6 = new Tone.Player({
    "url": "./drums/maracas.mp3",
    // "loop": true
}).toMaster();
pad6.id = "pad6";

var pad7 = new Tone.Player({
    "url": "./drums/clav.mp3",
    // "loop": true
}).toMaster();
pad7.id = "pad7";

var pad8 = new Tone.Player({
    "url": "./drums/conga.mp3",
    // "loop": true
}).toMaster();
pad8.id = "pad8";

var pad9 = new Tone.Player({
    "url": "./drums/cowbell.mp3",
    // "loop": true
}).toMaster();
pad9.id = "pad9";


function padOn(pad) {
    pad.start();
    document.getElementById(pad.id).className += " pad-active";
    sendNoteOn(pad);
}

function padOff(pad) {
    pad.stop();
    document.getElementById(pad.id).className = "pad-text";
    sendNoteOn(pad);
}


document.body.onkeydown = function(e) {
    // TODO: switch
    if (e.keyCode == 81) {
        padOn(pad1);
    }
    if (e.keyCode == 87) {
        padOn(pad2);
    }
    if (e.keyCode == 69) {
        padOn(pad3);
    }
    if (e.keyCode == 65) {
        padOn(pad4);
    }
    if (e.keyCode == 83) {
        padOn(pad5);
    }
    if (e.keyCode == 68) {
        padOn(pad6);
    }
    if (e.keyCode == 90) {
        padOn(pad7);
    }
    if (e.keyCode == 88) {
        padOn(pad8);
    }
    if (e.keyCode == 67) {
        padOn(pad9);
    }
}

document.body.onkeyup = function(e) {
    if (e.keyCode == 81) {
        padOff(pad1);
    }
    if (e.keyCode == 87) {
        padOff(pad2);
    }
    if (e.keyCode == 69) {
        padOff(pad3);
    }
    if (e.keyCode == 65) {
        padOff(pad4);
    }
    if (e.keyCode == 83) {
        padOff(pad5);
    }
    if (e.keyCode == 68) {
        padOff(pad6);
    }
    if (e.keyCode == 90) {
        padOff(pad7);
    }
    if (e.keyCode == 88) {
        padOff(pad8);
    }
    if (e.keyCode == 67) {
        padOff(pad9);
    }
}
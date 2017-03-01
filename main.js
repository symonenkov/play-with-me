  var socket = io();

  // Sends a note on
  function sendNoteOn(note) {
      // tell server to execute 'new message' and send along one parameter
      socket.emit('note on', note);
  }

  // Whenever the server emits 'note on', trigger attack this note
  socket.on('note on', function(data) {
      synth.triggerAttack(midiNoteToFreq[data.note.midiNote], undefined, data.note.velocity);
      // synth.triggerAttackRelease(midiNoteToFreq[data.note.midiNote], '+2s', data.note.velocity);
      createCircle(data.note.midiNote, data.note.velocity, 2);
  });
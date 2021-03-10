const JZZ = require('jzz');
const my_port = JZZ.Widget({
  _receive: function(msg) { console.log(msg.toString()); }
});
JZZ.addMidiOut('Virtual MIDI-Out', my_port);

JZZ({ engine: 'none' }).openMidiOut('Virtual MIDI-Out')
  .wait(100).ch(0).rpnTuningA(442) // A = 442Hz
  .bank(121, 1).program(24) // GM2 Ukulele!
  .noteOn('C5', 127).wait(500).noteOff('C5');

// click the [▶run] button... ↓
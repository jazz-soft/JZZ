var JZZ = require('../jzz');
JZZ().or('Cannot start MIDI engine!')
     .openMidiOut().or('MIDI-Out: Cannot open!')
     .and(function(){ console.log('MIDI-Out:', this._name); })
     .wait(500).send([0x90,60,127])
     .wait(500).send([0x90,64,127])
     .wait(500).send([0x90,67,127])
     .wait(500).send([0x90,72,127])
     .wait(800).send([0x80,60,0]).send([0x80,64,0]).send([0x80,67,0]).send([0x80,72,0]);

JZZ().openMidiIn().or('MIDI-In:  Cannot open!')
     .and(function(){ console.log('MIDI-In: ', this._name); })
     .connect(function(msg){console.log(msg.toString());});

JZZ().wait(5000).close().and('thank you!').wait(800);

var assert = require('assert');
var JZZ = require('..');
var MT;
try {
  MT = require('midi-test');
}
catch(err) {
  console.log('midi-test module is disabled in this configuration');
}

function Sample(done, list) {
  this.done = done;
  this.list = list.slice();
  this.count = 0;
  this.compare = function(msg) {
    if (this.count < this.list.length) assert.equal(msg.slice().toString(), this.list[this.count].toString());
    this.count++;
    if (this.count == this.list.length) this.done();
  };
}

describe('Engine', function() {
  if (process.platform == 'win32' || process.platform == 'darwin') {
    it('Default MIDI-Out', function(done) {
      JZZ().openMidiOut().and(function() { this.close(); done(); });
    });
  }
  if (process.platform == 'win32') {
    it('Microsoft GS Wavetable Synth', function(done) {
      JZZ().openMidiOut('Microsoft GS Wavetable Synth').and(function() { this.close(); done(); });
    });
    it('/Microsoft/', function(done) {
      JZZ().openMidiOut(/Microsoft/).and(function() { this.close(); done(); });
    });
  }
  if (process.platform == 'darwin') {
    it('Apple DLS Synth', function(done) {
      JZZ().openMidiOut('Apple DLS Synth').and(function() { this.close(); done(); });
    });
    it('/Apple/', function(done) {
      JZZ().openMidiOut(/Apple/).and(function() { this.close(); done(); });
    });
  }
  if (MT && (process.platform == 'darwin' || process.platform == 'linux')) {
    it('Virtual MIDI-In', function(done) {
      var src = MT.MidiSrc('Virtual MIDI-In');
      src.connect();
      JZZ().openMidiIn('Virtual MIDI-In').and(function() { this.close(); src.disconnect(); done(); });
    });
    it('Virtual MIDI-Out', function(done) {
      var port;
      var dst = MT.MidiDst('Virtual MIDI-Out');
      dst.connect();
      dst.receive = function(msg) {
        port.close();
        dst.disconnect();
        done();
      };
      port = JZZ().openMidiOut('Virtual MIDI-Out').and(function() { this.noteOn(0, 60, 127); });
    });
  }
});

describe('Web MIDI API', function() {
  if (MT && (process.platform == 'darwin' || process.platform == 'linux')) {
    it.skip('onstatechange', function(done) {
      var src = MT.MidiSrc('Virtual MIDI-In');
      function onSuccess(midiaccess) {
        midiaccess.onstatechange = function() { src.disconnect(); done(); };
        setImmediate(function() { src.connect(); });
      }
      function onFail(err) { console.log('requestMIDIAccess failed!', err); }
      JZZ.requestMIDIAccess().then(onSuccess, onFail);
    });
  }
});

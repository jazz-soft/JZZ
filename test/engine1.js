//// testing 'node'/'plugin' engine

var assert = require('assert');
var JZZ = require('..');
var MT;
if (process.platform == 'darwin' || process.platform == 'linux') {
  try {
    MT = require('midi-test');
  }
  catch(err) {
    console.log('midi-test module is disabled in this configuration');
  }
}

var test = require('./tests.js')(JZZ, 'node', MT);

describe('Engine: node', function() {
  test.engine_name();
  test.native_midi_out();
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.dummy_midi_in();
  test.dummy_midi_out();
  if (MT) {
    test.virtual_midi_in();
    test.virtual_midi_out();
  }
});

describe('Web MIDI API', function() {
  if (MT) {
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

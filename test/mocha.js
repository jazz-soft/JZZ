var assert = require('assert');
var JZZ = require('..');

describe('MIDI messages', function() {
  it('empty', function() {
    assert.equal(JZZ.MIDI().toString(), 'empty');
  });
  it('noteOn', function() {
    assert.equal(JZZ.MIDI.noteOn(0, 'C6').toString(), '90 48 7f -- Note On');
  });
  it('noteOff', function() {
    assert.equal(JZZ.MIDI.noteOff(0, 'C6').toString(), '80 48 40 -- Note Off');
  });
});

describe('SMF events', function() {
  it('smfEndOfTrack', function() {
    assert.equal(JZZ.MIDI.smfEndOfTrack().toString(), 'smf ff 2f -- End of Track');
  });
});

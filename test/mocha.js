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
  it('smfText', function() {
    assert.equal(JZZ.MIDI.smfText('\ttwo\nlines\x00').toString(), 'smf ff 01 -- Text: \\ttwo\\nlines\\x00');
  });
  it('smfCopyright', function() {
    assert.equal(JZZ.MIDI.smfCopyright('© ...').toString(), 'smf ff 02 -- Copyright: © ...');
  });
  it('smfSeqName', function() {
    assert.equal(JZZ.MIDI.smfSeqName('sequence').toString(), 'smf ff 03 -- Sequence Name: sequence');
  });
  it('smfInstrName', function() {
    assert.equal(JZZ.MIDI.smfInstrName('instrument').toString(), 'smf ff 04 -- Instrument Name: instrument');
  });
  it('smfLyric', function() {
    assert.equal(JZZ.MIDI.smfLyric('𝄋𝄋𝄋').toString(), 'smf ff 05 -- Lyric: 𝄋𝄋𝄋');
  });
  it('smfMarker', function() {
    assert.equal(JZZ.MIDI.smfMarker('marker').toString(), 'smf ff 06 -- Marker: marker');
  });
  it('smfCuePoint', function() {
    assert.equal(JZZ.MIDI.smfCuePoint('cue point').toString(), 'smf ff 07 -- Cue Point: cue point');
  });
  it('smfProgName', function() {
    assert.equal(JZZ.MIDI.smfProgName('program').toString(), 'smf ff 08 -- Program Name: program');
  });
  it('smfDevName', function() {
    assert.equal(JZZ.MIDI.smfDevName('device').toString(), 'smf ff 09 -- Device Name: device');
  });
  it('smfEndOfTrack', function() {
    assert.equal(JZZ.MIDI.smfEndOfTrack().toString(), 'smf ff 2f -- End of Track');
  });
});

describe('SMPTE', function() {
  it('00:00:00:00', function() {
    assert.equal(JZZ.SMPTE().toString(), '00:00:00:00');
  });
  it('23:59:59:23', function() {
    assert.equal(JZZ.SMPTE().decrQF().toString(), '23:59:59:23');
  });
  it('23:59:59:29', function() {
    assert.equal(JZZ.SMPTE(30, 23, 59, 59, 29).toString(), '23:59:59:29');
  });
});

describe('JZZ.lib', function() {
  it('toBase64', function() {
    assert.equal(JZZ.lib.toBase64('MIDI'), 'TUlESQ==');
  });
  it('fromBase64', function() {
    assert.equal(JZZ.lib.fromBase64('TUlESQ=='), 'MIDI');
  });
  it('toUTF8', function() {
    assert.equal(JZZ.lib.toUTF8('МИДИ'), '\xD0\x9C\xD0\x98\xD0\x94\xD0\x98');
    assert.equal(JZZ.lib.toUTF8('音樂'), '\xE9\x9F\xB3\xE6\xA8\x82');
    assert.equal(JZZ.lib.toUTF8('𝄞'), '\xED\xA0\xB4\xED\xB4\x9E'); // C-Clef
  });
  it('fromUTF8', function() {
    assert.equal(JZZ.lib.fromUTF8('\xD0\x9C\xD0\x98\xD0\x94\xD0\x98'), 'МИДИ');
    assert.equal(JZZ.lib.fromUTF8('МИДИ'), 'МИДИ');
    assert.equal(JZZ.lib.fromUTF8('\xE9\x9F\xB3\xE6\xA8\x82'), '音樂');
    assert.equal(JZZ.lib.fromUTF8('音樂'), '音樂');
    assert.equal(JZZ.lib.fromUTF8('\xF0\x9D\x84\x9E'), '𝄞'); // C-Clef 4-byte
    assert.equal(JZZ.lib.fromUTF8('\xED\xA0\xB4\xED\xB4\x9E'), '𝄞'); // C-Clef surrogate pair
  });
});

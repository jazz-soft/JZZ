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
  it('empty', function() {
    assert.equal(JZZ.MIDI.smf(1).toString(), 'ff01 -- Text');
  });
  it('smf', function() {
    assert.equal(JZZ.MIDI.smf(JZZ.MIDI.smf(0x7f)).toString(), 'ff7f -- Meta Event');
    assert.equal(JZZ.MIDI.smf([0x7f]).toString(), 'ff7f -- Meta Event');
    assert.equal(JZZ.MIDI.smf(0x7f, [0, 1]).toString(), 'ff7f -- Meta Event: 00 01');
    assert.equal(JZZ.MIDI.smf(0x7f, 0, 1).toString(), 'ff7f -- Meta Event: 00 01');
    assert.equal(JZZ.MIDI.smf([0x7f, 0, 1]).toString(), 'ff7f -- Meta Event: 00 01');
  });
  it('smf/SeqNumber', function() {
    assert.equal(JZZ.MIDI.smf(0, [1]).toString(), 'ff00 -- Sequence Number: 1');
    assert.equal(JZZ.MIDI.smfSeqNumber(300).toString(), 'ff00 -- Sequence Number: 300');
  });
  it('smf/Text', function() {
    assert.equal(JZZ.MIDI.smf(1, 'smf').toString(), 'ff01 -- Text: smf');
    assert.equal(JZZ.MIDI.smfText('\ttwo\nlines\x00').toString(), 'ff01 -- Text: \\ttwo\\nlines\\x00');
  });
  it('smf/Copyright', function() {
    assert.equal(JZZ.MIDI.smfCopyright('© ...').toString(), 'ff02 -- Copyright: © ...');
  });
  it('smf/SeqName', function() {
    assert.equal(JZZ.MIDI.smfSeqName('sequence').toString(), 'ff03 -- Sequence Name: sequence');
  });
  it('smf/InstrName', function() {
    assert.equal(JZZ.MIDI.smfInstrName('instrument').toString(), 'ff04 -- Instrument Name: instrument');
  });
  it('smf/Lyric', function() {
    assert.equal(JZZ.MIDI.smfLyric('𝄋𝄋𝄋').toString(), 'ff05 -- Lyric: 𝄋𝄋𝄋');
  });
  it('smf/Marker', function() {
    assert.equal(JZZ.MIDI.smfMarker('marker').toString(), 'ff06 -- Marker: marker');
  });
  it('smf/CuePoint', function() {
    assert.equal(JZZ.MIDI.smfCuePoint('cue point').toString(), 'ff07 -- Cue Point: cue point');
  });
  it('smf/ProgName', function() {
    assert.equal(JZZ.MIDI.smfProgName('program').toString(), 'ff08 -- Program Name: program');
  });
  it('smf/DevName', function() {
    assert.equal(JZZ.MIDI.smfDevName('device').toString(), 'ff09 -- Device Name: device');
  });
  it('smf/ChannelPrefix', function() {
    assert.equal(JZZ.MIDI.smf(0x20, '\x0a').toString(), 'ff20 -- Channel Prefix: 0a');
    assert.equal(JZZ.MIDI.smfChannelPrefix(10).toString(), 'ff20 -- Channel Prefix: 0a');
    assert.equal(JZZ.MIDI.smfChannelPrefix('\n').toString(), 'ff20 -- Channel Prefix: 0a');
  });
  it('smf/EndOfTrack', function() {
    assert.equal(JZZ.MIDI.smf(0x2f).toString(), 'ff2f -- End of Track');
    assert.equal(JZZ.MIDI.smfEndOfTrack().toString(), 'ff2f -- End of Track');
  });
  it('smf/Tempo', function() {
    assert.equal(JZZ.MIDI.smf(0x51, '\x07\xa1\x20').toString(), 'ff51 -- Tempo: 120 bpm');
    assert.equal(JZZ.MIDI.smfTempo(500000).toString(), 'ff51 -- Tempo: 120 bpm');
    assert.equal(JZZ.MIDI.smfBPM(120).toString(), 'ff51 -- Tempo: 120 bpm');
  });
  it('smf/SMPTE', function() {
    assert.equal(JZZ.MIDI.smf(0x54, '\x17\x3b\x3b\x17\x4b').toString(), 'ff54 -- SMPTE Offset: 23:59:59:23:75');
  });
  it('smf/TimeSignature', function() {
    assert.equal(JZZ.MIDI.smf(0x58, '\x03\x02\x18\x08').toString(), 'ff58 -- Time Signature: 3/4 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature('7/8').toString(), 'ff58 -- Time Signature: 7/8 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature(7, 8).toString(), 'ff58 -- Time Signature: 7/8 24 8');
  });
  it('smf/KeySignature', function() {
    assert.equal(JZZ.MIDI.smf(0x59, '\xfb\x01').toString(), 'ff59 -- Key Signature: Bb min');
    assert.equal(JZZ.MIDI.smfKeySignature('\xfb\x01').toString(), 'ff59 -- Key Signature: Bb min');
    assert.equal(JZZ.MIDI.smfKeySignature('a# moll').toString(), 'ff59 -- Key Signature: A# min');
    assert.equal(JZZ.MIDI.smfKeySignature('Eb major').toString(), 'ff59 -- Key Signature: Eb');
    assert.equal(JZZ.MIDI.smfKeySignature('C').toString(), 'ff59 -- Key Signature: C');
  });
  it('smf/MetaEvent', function() {
    assert.equal(JZZ.MIDI.smf(0x7f).toString(), 'ff7f -- Meta Event');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x0a\x0b\x0c').toString(), 'ff7f -- Meta Event: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfMetaEvent('\x0a\x0b\x0c').toString(), 'ff7f -- Meta Event: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfMetaEvent([0xa, 0xb, 0xc]).toString(), 'ff7f -- Meta Event: 0a 0b 0c');
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

var assert = require('assert');
var JZZ = require('..');

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

var engine = JZZ({ engine: 'none' });

describe('Info', function() {
  console.log('Node:', process.versions.node);
  console.log('process.platform:', process.platform);
  console.log('process.arch:', process.arch);
  console.log('JZZ:', engine.info().ver);
});

describe('MIDI messages', function() {
  it('empty', function() {
    assert.equal(JZZ.MIDI().toString(), 'empty');
  });
  it('noteOn', function() {
    var msg = JZZ.MIDI.noteOn(1, 'C5', 20);
    assert.equal(msg.getChannel(), 1);
    assert.equal(msg.getNote(), 60);
    assert.equal(msg.getVelocity(), 20);
    msg.setChannel(0).setNote('c6').setVelocity(127);
    assert.equal(msg.toString(), '90 48 7f -- Note On');
  });
  it('noteOff', function() {
    assert.equal(JZZ.MIDI.noteOff(0, 'C6').toString(), '80 48 40 -- Note Off');
    assert.equal(JZZ.MIDI.noteOff('0', 'C6').toString(), '80 48 40 -- Note Off');
  });
  it('aftertouch', function() {
    assert.equal(JZZ.MIDI.aftertouch(0, 'C6', 127).toString(), 'a0 48 7f -- Aftertouch');
  });
  it('control', function() {
    assert.equal(JZZ.MIDI.control(0, 6, 15).toString(), 'b0 06 0f -- Data Entry MSB');
    assert.equal(JZZ.MIDI.control('0', '6', '15').toString(), 'b0 06 0f -- Data Entry MSB');
  });
  it('program', function() {
    assert.equal(JZZ.MIDI.program(0, 0).toString(), 'c0 00 -- Program Change');
  });
  it('pressure', function() {
    assert.equal(JZZ.MIDI.pressure(0, 127).toString(), 'd0 7f -- Channel Aftertouch');
  });
  it('pitchBend', function() {
    assert.equal(JZZ.MIDI.pitchBend(0, 300).toString(), 'e0 2c 02 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBend('0', '300').toString(), 'e0 2c 02 -- Pitch Wheel');
  });
  it('bankMSB', function() {
    assert.equal(JZZ.MIDI.bankMSB(0, 15).toString(), 'b0 00 0f -- Bank Select MSB');
  });
  it('bankLSB', function() {
    assert.equal(JZZ.MIDI.bankLSB(0, 15).toString(), 'b0 20 0f -- Bank Select LSB');
  });
  it('modMSB', function() {
    assert.equal(JZZ.MIDI.modMSB(0, 15).toString(), 'b0 01 0f -- Modulation Wheel MSB');
  });
  it('modLSB', function() {
    assert.equal(JZZ.MIDI.modLSB(0, 15).toString(), 'b0 21 0f -- Modulation Wheel LSB');
  });
  it('breathMSB', function() {
    assert.equal(JZZ.MIDI.breathMSB(0, 15).toString(), 'b0 02 0f -- Breath Controller MSB');
  });
  it('breathLSB', function() {
    assert.equal(JZZ.MIDI.breathLSB(0, 15).toString(), 'b0 22 0f -- Breath Controller LSB');
  });
  it('footMSB', function() {
    assert.equal(JZZ.MIDI.footMSB(0, 15).toString(), 'b0 04 0f -- Foot Controller MSB');
    assert.equal(JZZ.MIDI.footMSB('0', '15').toString(), 'b0 04 0f -- Foot Controller MSB');
  });
  it('footLSB', function() {
    assert.equal(JZZ.MIDI.footLSB(0, 15).toString(), 'b0 24 0f -- Foot Controller LSB');
  });
  it('portamentoMSB', function() {
    assert.equal(JZZ.MIDI.portamentoMSB(0, 15).toString(), 'b0 05 0f -- Portamento Time MSB');
  });
  it('portamentoLSB', function() {
    assert.equal(JZZ.MIDI.portamentoLSB(0, 15).toString(), 'b0 25 0f -- Portamento Time LSB');
  });
  it('volumeMSB', function() {
    assert.equal(JZZ.MIDI.volumeMSB(0, 15).toString(), 'b0 07 0f -- Channel Volume MSB');
  });
  it('volumeLSB', function() {
    assert.equal(JZZ.MIDI.volumeLSB(0, 15).toString(), 'b0 27 0f -- Channel Volume LSB');
  });
  it('balanceMSB', function() {
    assert.equal(JZZ.MIDI.balanceMSB(0, 15).toString(), 'b0 08 0f -- Balance MSB');
  });
  it('balanceLSB', function() {
    assert.equal(JZZ.MIDI.balanceLSB(0, 15).toString(), 'b0 28 0f -- Balance LSB');
  });
  it('panMSB', function() {
    assert.equal(JZZ.MIDI.panMSB(0, 15).toString(), 'b0 0a 0f -- Pan MSB');
  });
  it('panLSB', function() {
    assert.equal(JZZ.MIDI.panLSB(0, 15).toString(), 'b0 2a 0f -- Pan LSB');
  });
  it('expressionMSB', function() {
    assert.equal(JZZ.MIDI.expressionMSB(0, 15).toString(), 'b0 0b 0f -- Expression Controller MSB');
  });
  it('expressionLSB', function() {
    assert.equal(JZZ.MIDI.expressionLSB(0, 15).toString(), 'b0 2b 0f -- Expression Controller LSB');
  });
  it('damper', function() {
    assert.equal(JZZ.MIDI.damper(0, true).toString(), 'b0 40 7f -- Damper Pedal On/Off');
  });
  it('portamento', function() {
    assert.equal(JZZ.MIDI.portamento(0, true).toString(), 'b0 41 7f -- Portamento On/Off');
  });
  it('sostenuto', function() {
    assert.equal(JZZ.MIDI.sostenuto(0, true).toString(), 'b0 42 7f -- Sostenuto On/Off');
  });
  it('soft', function() {
    assert.equal(JZZ.MIDI.soft(0, true).toString(), 'b0 43 7f -- Soft Pedal On/Off');
  });
  it('allSoundOff', function() {
    assert.equal(JZZ.MIDI.allSoundOff(0).toString(), 'b0 78 00 -- All Sound Off');
  });
  it('allNotesOff', function() {
    assert.equal(JZZ.MIDI.allNotesOff(0).toString(), 'b0 7b 00 -- All Notes Off');
  });
  it('mtc', function() {
    assert.equal(JZZ.MIDI.mtc(0).toString(), 'f1 00 -- MIDI Time Code');
  });
  it('songPosition', function() {
    assert.equal(JZZ.MIDI.songPosition(300).toString(), 'f2 2c 02 -- Song Position');
  });
  it('songSelect', function() {
    assert.equal(JZZ.MIDI.songSelect(15).toString(), 'f3 0f -- Song Select');
  });
  it('tune', function() {
    assert.equal(JZZ.MIDI.tune().toString(), 'f6 -- Tune request');
  });
  it('clock', function() {
    assert.equal(JZZ.MIDI.clock().toString(), 'f8 -- Timing clock');
  });
  it('start', function() {
    assert.equal(JZZ.MIDI.start().toString(), 'fa -- Start');
  });
  it('continue', function() {
    assert.equal(JZZ.MIDI.continue().toString(), 'fb -- Continue');
  });
  it('stop', function() {
    assert.equal(JZZ.MIDI.stop().toString(), 'fc -- Stop');
  });
  it('active', function() {
    assert.equal(JZZ.MIDI.active().toString(), 'fe -- Active Sensing');
  });
  it('sxIdRequest', function() {
    assert.equal(JZZ.MIDI.sxIdRequest().toString(), 'f0 7e 7f 06 01 f7');
  });
  it('sxFullFrame', function() {
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE()).toString(), 'f0 7f 7f 01 01 00 00 00 00 f7');
  });
  it('reset', function() {
    assert.equal(JZZ.MIDI.reset().toString(), 'ff -- Reset');
  });
  it('freq', function() {
    assert.equal(JZZ.MIDI.freq('A6'), 880);
  });
});

describe('SMF events', function() {
  it('empty', function() {
    assert.equal(JZZ.MIDI.smf(1).toString(), 'ff01 -- Text');
    assert.equal(JZZ.MIDI.smf(0x70).toString(), 'ff70 -- SMF');
  });
  it('smf', function() {
    assert.equal(JZZ.MIDI.smf(JZZ.MIDI.smf(0x7f)).toString(), 'ff7f -- Sequencer Specific');
    assert.equal(JZZ.MIDI.smf([0x7f]).toString(), 'ff7f -- Sequencer Specific');
    assert.equal(JZZ.MIDI.smf(0x7f, [0, 1]).toString(), 'ff7f -- Sequencer Specific: 00 01');
    assert.equal(JZZ.MIDI.smf(0x7f, 0, 1).toString(), 'ff7f -- Sequencer Specific: 00 01');
    assert.equal(JZZ.MIDI.smf([0x7f, 0, 1]).toString(), 'ff7f -- Sequencer Specific: 00 01');
    assert.equal(JZZ.MIDI.smf(0x70, 'abc').toString(), 'ff70 -- SMF: 61 62 63');
  });
  it('smf/SeqNumber', function() {
    assert.equal(JZZ.MIDI.smf(0, [1]).toString(), 'ff00 -- Sequence Number: 1');
    assert.equal(JZZ.MIDI.smfSeqNumber(300).toString(), 'ff00 -- Sequence Number: 300');
  });
  it('smf/Text', function() {
    var msg = JZZ.MIDI.smf(1, 'smf');
    assert.equal(msg.getData(), 'smf');
    msg.setData();
    assert.equal(msg.getData(), '');
    msg.setText('音樂');
    assert.equal(msg.getText(), '音樂');
    assert.equal(msg.getData(), '\xE9\x9F\xB3\xE6\xA8\x82');
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
    var msg = JZZ.MIDI.smfChannelPrefix(10);
    assert.equal(msg.isSMF(), true);
    assert.equal(msg.getChannel(), 10);
    msg.setChannel(0);
    assert.equal(msg.getChannel(), 0);
    assert.equal(JZZ.MIDI.smf(0x20, '\x0a').toString(), 'ff20 -- Channel Prefix: 0a');
    assert.equal(JZZ.MIDI.smfChannelPrefix(10).toString(), 'ff20 -- Channel Prefix: 0a');
    assert.equal(JZZ.MIDI.smfChannelPrefix('\n').toString(), 'ff20 -- Channel Prefix: 0a');
  });
  it('smf/MidiPort', function() {
    assert.equal(JZZ.MIDI.smf(0x21, '\x0a').toString(), 'ff21 -- MIDI Port: 0a');
    assert.equal(JZZ.MIDI.smfMidiPort(10).toString(), 'ff21 -- MIDI Port: 0a');
    assert.equal(JZZ.MIDI.smfMidiPort('\n').toString(), 'ff21 -- MIDI Port: 0a');
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
    assert.equal(JZZ.MIDI.smfSMPTE(JZZ.SMPTE(30, 7, 40).incrQF().incrQF().incrQF().incrQF().incrQF()).toString(), 'ff54 -- SMPTE Offset: 07:40:00:01:25');
    assert.equal(JZZ.MIDI.smfSMPTE().toString(), 'ff54 -- SMPTE Offset: 00:00:00:00:00');
    assert.equal(JZZ.MIDI.smfSMPTE(7, 40).toString(), 'ff54 -- SMPTE Offset: 07:40:00:00:00');
    assert.equal(JZZ.MIDI.smfSMPTE([7, 40, 30]).toString(), 'ff54 -- SMPTE Offset: 07:40:30:00:00');
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
  it('smf/Sequencer', function() {
    assert.equal(JZZ.MIDI.smf(0x7f).toString(), 'ff7f -- Sequencer Specific');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x0a\x0b\x0c').toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfSequencer('\x0a\x0b\x0c').toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfSequencer([0xa, 0xb, 0xc]).toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
  });
});

describe('SMPTE', function() {
  it('00:00:00:00', function() {
    assert.equal(JZZ.SMPTE().toString(), '00:00:00:00');
  });
  it('23:59:59:23', function() {
    assert.equal(JZZ.SMPTE().decrQF().incrFrame().decrFrame().toString(), '23:59:59:23');
  });
  it('23:59:59:29', function() {
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(30, 23, 59, 59, 29)).toString(), '23:59:59:29');
  });
  it('master/slave', function() {
    var master = JZZ.SMPTE(24, 7, 39, 59);
    var slave = JZZ.SMPTE();
    for (var n = 0; n < 9; n++) {
      slave.read(JZZ.MIDI.mtc(master));
      master.incrQF();
    }
    assert.equal(slave.toString(), '07:39:59:02');
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
    assert.equal(JZZ.lib.toUTF8(), '');
    assert.equal(JZZ.lib.toUTF8('МИДИ'), '\xD0\x9C\xD0\x98\xD0\x94\xD0\x98');
    assert.equal(JZZ.lib.toUTF8('音樂'), '\xE9\x9F\xB3\xE6\xA8\x82');
    assert.equal(JZZ.lib.toUTF8('𝄞'), '\xED\xA0\xB4\xED\xB4\x9E'); // G-Clef
  });
  it('fromUTF8', function() {
    assert.equal(JZZ.lib.fromUTF8(), '');
    assert.equal(JZZ.lib.fromUTF8('\xD0\x9C\xD0\x98\xD0\x94\xD0\x98'), 'МИДИ');
    assert.equal(JZZ.lib.fromUTF8('МИДИ'), 'МИДИ');
    assert.equal(JZZ.lib.fromUTF8('\xE9\x9F\xB3\xE6\xA8\x82'), '音樂');
    assert.equal(JZZ.lib.fromUTF8('音樂'), '音樂');
    assert.equal(JZZ.lib.fromUTF8('\xF0\x9D\x84\x9E'), '𝄞'); // G-Clef 4-byte
    assert.equal(JZZ.lib.fromUTF8('\xED\xA0\xB4\xED\xB4\x9E'), '𝄞'); // G-Clef surrogate pair
  });
});

describe('JZZ.Widget', function() {
  it('ch', function(done) {
    var sample = new Sample(done, [
      [0x91, 0x3c, 0x7f], [0x82, 0x3c, 0x7f], [0xff],
      [0xf1, 0x04], [0xf1, 0x04],
      [0x90, 0x3c, 0x7f], [0x80, 0x3c, 0x40], [0x95, 0x3c, 0x7f], [0x85, 0x3c, 0x40]
    ]);
    var port = JZZ.Widget({ _receive: function(msg) { sample.compare(msg); }});
    port.ch(1).noteOn('C5').ch(2).noteOff('C5', 127).ch(3).reset();
    port.ch(4).mtc(JZZ.SMPTE(30, 1, 2, 3, 4)).ch().mtc(JZZ.SMPTE(30, 1, 2, 3, 4));
    port.note(0, 'B#4', 127, 1).ch(5).wait(10).note('Dbb5', 127, 1).wait(10).disconnect().close();
  });
  it('mpe', function(done) {
    var sample = new Sample(done, [
      [0xc0, 0x19], [0x91, 0x3c, 0x7f], [0x92, 0x3e, 0x7f], [0x81, 0x3c, 0x40],
      [0x91, 0x40, 0x7f], [0x81, 0x40, 0x40]
    ]);
    var port = JZZ.Widget();
    port.connect(function(msg) { sample.compare(msg); });
    port.mpe(0, 4).program(25).noteOn('C5').noteOn('D5').noteOff('C5').note('E5', 127, 1);
  });
});

var test = require('./tests.js')(JZZ, 'none');

describe('Engine: none', function() {
  test.engine_name();
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.widget_midi_in();
  test.widget_midi_out();
});

describe('Web MIDI API', function() {
  it('requestMIDIAccess', function(done) {
    function onSuccess(/*midiaccess*/) { done(); }
    function onFail(err) { console.log('requestMIDIAccess failed!', err); }
    JZZ.requestMIDIAccess().then(onSuccess, onFail);
  });
});


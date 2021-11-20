var assert = require('assert');
var JZZ = require('..');
var test = require('./tests.js')(JZZ, { engine: ['webmidi', 'none'] });

describe('Info', function() {
  console.log('Node:', process.versions.node);
  console.log('process.platform:', process.platform);
  console.log('process.arch:', process.arch);
  console.log('JZZ:', JZZ.info().ver);
});

describe('MIDI messages', function() {
  it('empty', function() {
    var msg = JZZ.MIDI();
    var dummy = 'dummy';
    msg._stamp(dummy);
    msg._stamp(dummy);
    assert.equal(msg._stamped(dummy), true);
    msg._unstamp(dummy);
    msg._unstamp();
    assert.equal(msg.toString(), 'empty');
  });
  it('match', function() {
    var msg = JZZ.MIDI(0x91, 'C5', 0x7f);
    assert.equal(msg.match(msg), true);
    assert.equal(msg.match([0x91, 0x3c, 0x7f]), true);
    assert.equal(msg.match([0x91]), true);
    assert.equal(msg.match([0x90, 0x3c, 0x7f]), false);
    assert.equal(msg.match([[0x94, 0x70], 0x3c, 0x7f]), true);
    assert.equal(msg.match([[0x94, 0x7f], 0x3c, 0x7f]), false);
  });
  it('label', function() {
    assert.equal(JZZ.MIDI(0x90, 'C#5', 0x7f).label('C#').label('Db').toString(), '90 3d 7f -- Note On (C#, Db)');
  });
  it('noteOn', function() {
    var msg = JZZ.MIDI.noteOn(1, 'C5', 20);
    assert.equal(msg.getChannel(), 1);
    assert.equal(msg.getNote(), 60);
    assert.equal(msg.getVelocity(), 20);
    assert.equal(msg.isNoteOn(), true);
    assert.equal(msg.isNoteOff(), false);
    msg.setChannel().setChannel(0).setNote('c6').setNote().setVelocity(127).setVelocity(128);
    assert.equal(msg.toString(), '90 48 7f -- Note On');
    msg.setVelocity(0);
    assert.equal(msg.isNoteOn(), false);
    assert.equal(msg.isNoteOff(), true);
    assert.equal(msg.toString(), '90 48 00 -- Note Off');
    msg.setSysExId(20);
    assert.equal(msg.getSysExId(), undefined);
    assert.equal(msg.isSMF(), false);
    assert.equal(msg.isEOT(), false);
    assert.equal(msg.isTempo(), false);
    assert.equal(msg.isTimeSignature(), false);
    assert.equal(msg.isKeySignature(), false);
    assert.equal(msg.getData(), undefined);
    assert.equal(msg.getText(), undefined);
    assert.equal(msg.getBPM(), undefined);
    assert.equal(msg.getTimeSignature(), undefined);
    assert.equal(msg.getKeySignature(), undefined);
    msg = JZZ.MIDI(0x90, 0x48, 0x7f);
    assert.equal(msg.toString(), '90 48 7f -- Note On');
    assert.throws(function() { JZZ.MIDI(['C5', 0x48, 0x7f]); });
    assert.throws(function() { JZZ.MIDI([-1, 0x48, 0x7f]); });
    assert.throws(function() { JZZ.MIDI([0x100, 0x48, 0x7f]); });
    assert.throws(function() { JZZ.MIDI.noteOn(0, undefined, 20); });
    assert.throws(function() { JZZ.MIDI.noteOn(16, 'C5', 20); });
  });
  it('noteOff', function() {
    var msg = JZZ.MIDI.noteOff(0, 'C6');
    assert.equal(msg.isNoteOn(), false);
    assert.equal(msg.isNoteOff(), true);
    assert.equal(msg.toString(), '80 48 40 -- Note Off');
    assert.equal(JZZ.MIDI.noteOff('0', 'C6').toString(), '80 48 40 -- Note Off');
    assert.equal(JZZ.MIDI.ch(2).ch().ch().ch(5).ch(5).noteOff('C6').toString(), '85 48 40 -- Note Off');
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
    assert.equal(JZZ.MIDI.ch(1).program(0).toString(), 'c1 00 -- Program Change');
  });
  it('pressure', function() {
    assert.equal(JZZ.MIDI.pressure(0, 127).toString(), 'd0 7f -- Channel Aftertouch');
  });
  it('pitchBend', function() {
    assert.equal(JZZ.MIDI.pitchBend(0, 300).toString(), 'e0 2c 02 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBend('0', '300').toString(), 'e0 2c 02 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBend(0, 2, 44).toString(), 'e0 2c 02 -- Pitch Wheel');
    assert.throws(function() { JZZ.MIDI.pitchBend(0, 0xffff); });
  });
  it('pitchBendF', function() {
    assert.equal(JZZ.MIDI.pitchBendF(0, -1).toString(), 'e0 00 00 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBendF(0, -.5).toString(), 'e0 00 20 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBendF(0, 0).toString(), 'e0 00 40 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBendF(0, .5).toString(), 'e0 00 60 -- Pitch Wheel');
    assert.equal(JZZ.MIDI.pitchBendF(0, 1).toString(), 'e0 7f 7f -- Pitch Wheel');
  });
  it('bank', function() {
    assert.equal(JZZ.MIDI.bank(0, 1, 2)[0].toString(), 'b0 00 01 -- Bank Select MSB');
    assert.equal(JZZ.MIDI.bank(0, 1, 2)[1].toString(), 'b0 20 02 -- Bank Select LSB');
    assert.equal(JZZ.MIDI.bank(0, 0x82)[0].toString(), 'b0 00 01 -- Bank Select MSB');
    assert.equal(JZZ.MIDI.bank(0, 0x82)[1].toString(), 'b0 20 02 -- Bank Select LSB');
  });
  it('bankMSB', function() {
    assert.equal(JZZ.MIDI.bankMSB(0, 15).toString(), 'b0 00 0f -- Bank Select MSB');
  });
  it('bankLSB', function() {
    assert.equal(JZZ.MIDI.bankLSB(0, 15).toString(), 'b0 20 0f -- Bank Select LSB');
  });
  it('mod', function() {
    assert.equal(JZZ.MIDI.mod(0, 1, 2)[0].toString(), 'b0 01 01 -- Modulation Wheel MSB');
    assert.equal(JZZ.MIDI.mod(0, 1, 2)[1].toString(), 'b0 21 02 -- Modulation Wheel LSB');
    assert.equal(JZZ.MIDI.mod(0, 0x82)[0].toString(), 'b0 01 01 -- Modulation Wheel MSB');
    assert.equal(JZZ.MIDI.mod(0, 0x82)[1].toString(), 'b0 21 02 -- Modulation Wheel LSB');
  });
  it('modF', function() {
    assert.equal(JZZ.MIDI.modF(0, .5)[0].toString(), 'b0 01 40 -- Modulation Wheel MSB');
    assert.equal(JZZ.MIDI.modF(0, .5)[1].toString(), 'b0 21 00 -- Modulation Wheel LSB');
  });
  it('modMSB', function() {
    assert.equal(JZZ.MIDI.modMSB(0, 15).toString(), 'b0 01 0f -- Modulation Wheel MSB');
  });
  it('modLSB', function() {
    assert.equal(JZZ.MIDI.modLSB(0, 15).toString(), 'b0 21 0f -- Modulation Wheel LSB');
  });
  it('breath', function() {
    assert.equal(JZZ.MIDI.breath(0, 1, 2)[0].toString(), 'b0 02 01 -- Breath Controller MSB');
    assert.equal(JZZ.MIDI.breath(0, 1, 2)[1].toString(), 'b0 22 02 -- Breath Controller LSB');
    assert.equal(JZZ.MIDI.breath(0, 0x82)[0].toString(), 'b0 02 01 -- Breath Controller MSB');
    assert.equal(JZZ.MIDI.breath(0, 0x82)[1].toString(), 'b0 22 02 -- Breath Controller LSB');
  });
  it('breathF', function() {
    assert.equal(JZZ.MIDI.breathF(0, .5)[0].toString(), 'b0 02 40 -- Breath Controller MSB');
    assert.equal(JZZ.MIDI.breathF(0, .5)[1].toString(), 'b0 22 00 -- Breath Controller LSB');
  });
  it('breathMSB', function() {
    assert.equal(JZZ.MIDI.breathMSB(0, 15).toString(), 'b0 02 0f -- Breath Controller MSB');
  });
  it('breathLSB', function() {
    assert.equal(JZZ.MIDI.breathLSB(0, 15).toString(), 'b0 22 0f -- Breath Controller LSB');
  });
  it('foot', function() {
    assert.equal(JZZ.MIDI.foot(0, 1, 2)[0].toString(), 'b0 04 01 -- Foot Controller MSB');
    assert.equal(JZZ.MIDI.foot(0, 1, 2)[1].toString(), 'b0 24 02 -- Foot Controller LSB');
    assert.equal(JZZ.MIDI.foot(0, 0x82)[0].toString(), 'b0 04 01 -- Foot Controller MSB');
    assert.equal(JZZ.MIDI.foot(0, 0x82)[1].toString(), 'b0 24 02 -- Foot Controller LSB');
  });
  it('footF', function() {
    assert.equal(JZZ.MIDI.footF(0, .5)[0].toString(), 'b0 04 40 -- Foot Controller MSB');
    assert.equal(JZZ.MIDI.footF(0, .5)[1].toString(), 'b0 24 00 -- Foot Controller LSB');
  });
  it('footMSB', function() {
    assert.equal(JZZ.MIDI.footMSB(0, 15).toString(), 'b0 04 0f -- Foot Controller MSB');
    assert.equal(JZZ.MIDI.footMSB('0', '15').toString(), 'b0 04 0f -- Foot Controller MSB');
  });
  it('footLSB', function() {
    assert.equal(JZZ.MIDI.footLSB(0, 15).toString(), 'b0 24 0f -- Foot Controller LSB');
  });
  it('portamentoTime', function() {
    assert.equal(JZZ.MIDI.portamentoTime(0, 1, 2)[0].toString(), 'b0 05 01 -- Portamento Time MSB');
    assert.equal(JZZ.MIDI.portamentoTime(0, 1, 2)[1].toString(), 'b0 25 02 -- Portamento Time LSB');
    assert.equal(JZZ.MIDI.portamentoTime(0, 0x82)[0].toString(), 'b0 05 01 -- Portamento Time MSB');
    assert.equal(JZZ.MIDI.portamentoTime(0, 0x82)[1].toString(), 'b0 25 02 -- Portamento Time LSB');
  });
  it('portamentoTimeF', function() {
    assert.equal(JZZ.MIDI.portamentoTimeF(0, .5)[0].toString(), 'b0 05 40 -- Portamento Time MSB');
    assert.equal(JZZ.MIDI.portamentoTimeF(0, .5)[1].toString(), 'b0 25 00 -- Portamento Time LSB');
  });
  it('portamentoMSB', function() {
    assert.equal(JZZ.MIDI.portamentoMSB(0, 15).toString(), 'b0 05 0f -- Portamento Time MSB');
  });
  it('portamentoLSB', function() {
    assert.equal(JZZ.MIDI.portamentoLSB(0, 15).toString(), 'b0 25 0f -- Portamento Time LSB');
  });
  it('volume', function() {
    assert.equal(JZZ.MIDI.volume(0, 1, 2)[0].toString(), 'b0 07 01 -- Channel Volume MSB');
    assert.equal(JZZ.MIDI.volume(0, 1, 2)[1].toString(), 'b0 27 02 -- Channel Volume LSB');
    assert.equal(JZZ.MIDI.volume(0, 0x82)[0].toString(), 'b0 07 01 -- Channel Volume MSB');
    assert.equal(JZZ.MIDI.volume(0, 0x82)[1].toString(), 'b0 27 02 -- Channel Volume LSB');
    assert.equal(JZZ.MIDI.ch(5).volume(0x82)[1].toString(), 'b5 27 02 -- Channel Volume LSB');
  });
  it('volumeF', function() {
    assert.equal(JZZ.MIDI.volumeF(0, .5)[0].toString(), 'b0 07 40 -- Channel Volume MSB');
    assert.equal(JZZ.MIDI.volumeF(0, .5)[1].toString(), 'b0 27 00 -- Channel Volume LSB');
  });
  it('volumeMSB', function() {
    assert.equal(JZZ.MIDI.volumeMSB(0, 15).toString(), 'b0 07 0f -- Channel Volume MSB');
  });
  it('volumeLSB', function() {
    assert.equal(JZZ.MIDI.volumeLSB(0, 15).toString(), 'b0 27 0f -- Channel Volume LSB');
  });
  it('balance', function() {
    assert.equal(JZZ.MIDI.balance(0, 1, 2)[0].toString(), 'b0 08 01 -- Balance MSB');
    assert.equal(JZZ.MIDI.balance(0, 1, 2)[1].toString(), 'b0 28 02 -- Balance LSB');
    assert.equal(JZZ.MIDI.balance(0, 0x82)[0].toString(), 'b0 08 01 -- Balance MSB');
    assert.equal(JZZ.MIDI.balance(0, 0x82)[1].toString(), 'b0 28 02 -- Balance LSB');
  });
  it('balanceF', function() {
    assert.equal(JZZ.MIDI.balanceF(0, 0)[0].toString(), 'b0 08 40 -- Balance MSB');
    assert.equal(JZZ.MIDI.balanceF(0, 0)[1].toString(), 'b0 28 00 -- Balance LSB');
  });
  it('balanceMSB', function() {
    assert.equal(JZZ.MIDI.balanceMSB(0, 15).toString(), 'b0 08 0f -- Balance MSB');
  });
  it('balanceLSB', function() {
    assert.equal(JZZ.MIDI.balanceLSB(0, 15).toString(), 'b0 28 0f -- Balance LSB');
  });
  it('pan', function() {
    assert.equal(JZZ.MIDI.pan(0, 1, 2)[0].toString(), 'b0 0a 01 -- Pan MSB');
    assert.equal(JZZ.MIDI.pan(0, 1, 2)[1].toString(), 'b0 2a 02 -- Pan LSB');
    assert.equal(JZZ.MIDI.pan(0, 0x82)[0].toString(), 'b0 0a 01 -- Pan MSB');
    assert.equal(JZZ.MIDI.pan(0, 0x82)[1].toString(), 'b0 2a 02 -- Pan LSB');
  });
  it('panF', function() {
    assert.equal(JZZ.MIDI.panF(0, 0)[0].toString(), 'b0 0a 40 -- Pan MSB');
    assert.equal(JZZ.MIDI.panF(0, 0)[1].toString(), 'b0 2a 00 -- Pan LSB');
  });
  it('panMSB', function() {
    assert.equal(JZZ.MIDI.panMSB(0, 15).toString(), 'b0 0a 0f -- Pan MSB');
  });
  it('panLSB', function() {
    assert.equal(JZZ.MIDI.panLSB(0, 15).toString(), 'b0 2a 0f -- Pan LSB');
  });
  it('expression', function() {
    assert.equal(JZZ.MIDI.expression(0, 1, 2)[0].toString(), 'b0 0b 01 -- Expression Controller MSB');
    assert.equal(JZZ.MIDI.expression(0, 1, 2)[1].toString(), 'b0 2b 02 -- Expression Controller LSB');
    assert.equal(JZZ.MIDI.expression(0, 0x82)[0].toString(), 'b0 0b 01 -- Expression Controller MSB');
    assert.equal(JZZ.MIDI.expression(0, 0x82)[1].toString(), 'b0 2b 02 -- Expression Controller LSB');
  });
  it('expressionF', function() {
    assert.equal(JZZ.MIDI.expressionF(0, .5)[0].toString(), 'b0 0b 40 -- Expression Controller MSB');
    assert.equal(JZZ.MIDI.expressionF(0, .5)[1].toString(), 'b0 2b 00 -- Expression Controller LSB');
  });
  it('expressionMSB', function() {
    assert.equal(JZZ.MIDI.expressionMSB(0, 15).toString(), 'b0 0b 0f -- Expression Controller MSB');
  });
  it('expressionLSB', function() {
    assert.equal(JZZ.MIDI.expressionLSB(0, 15).toString(), 'b0 2b 0f -- Expression Controller LSB');
  });
  it('damper', function() {
    assert.equal(JZZ.MIDI.damper(0).toString(), 'b0 40 7f -- Damper Pedal On');
    assert.equal(JZZ.MIDI.damper(0, true).toString(), 'b0 40 7f -- Damper Pedal On');
    assert.equal(JZZ.MIDI.damper(0, false).toString(), 'b0 40 00 -- Damper Pedal Off');
  });
  it('portamento', function() {
    assert.equal(JZZ.MIDI.portamento(0).toString(), 'b0 41 7f -- Portamento On');
    assert.equal(JZZ.MIDI.portamento(0, true).toString(), 'b0 41 7f -- Portamento On');
    assert.equal(JZZ.MIDI.portamento(0, false).toString(), 'b0 41 00 -- Portamento Off');
  });
  it('sostenuto', function() {
    assert.equal(JZZ.MIDI.sostenuto(0).toString(), 'b0 42 7f -- Sostenuto On');
    assert.equal(JZZ.MIDI.sostenuto(0, true).toString(), 'b0 42 7f -- Sostenuto On');
    assert.equal(JZZ.MIDI.sostenuto(0, false).toString(), 'b0 42 00 -- Sostenuto Off');
  });
  it('soft', function() {
    assert.equal(JZZ.MIDI.soft(0).toString(), 'b0 43 7f -- Soft Pedal On');
    assert.equal(JZZ.MIDI.soft(0, true).toString(), 'b0 43 7f -- Soft Pedal On');
    assert.equal(JZZ.MIDI.soft(0, false).toString(), 'b0 43 00 -- Soft Pedal Off');
  });
  it('legato', function() {
    assert.equal(JZZ.MIDI.legato(0).toString(), 'b0 44 7f -- Legato On');
    assert.equal(JZZ.MIDI.legato(0, true).toString(), 'b0 44 7f -- Legato On');
    assert.equal(JZZ.MIDI.legato(0, false).toString(), 'b0 44 00 -- Legato Off');
  });
  it('hold2', function() {
    assert.equal(JZZ.MIDI.hold2(0).toString(), 'b0 45 7f -- Hold 2 On');
    assert.equal(JZZ.MIDI.hold2(0, true).toString(), 'b0 45 7f -- Hold 2 On');
    assert.equal(JZZ.MIDI.hold2(0, false).toString(), 'b0 45 00 -- Hold 2 Off');
  });
  it('soundVariation', function() {
    assert.equal(JZZ.MIDI.soundVariation(0, 64).toString(), 'b0 46 40 -- Sound Variation');
  });
  it('filterResonance', function() {
    assert.equal(JZZ.MIDI.filterResonance(0, 64).toString(), 'b0 47 40 -- Filter Resonance');
  });
  it('releaseTime', function() {
    assert.equal(JZZ.MIDI.releaseTime(0, 64).toString(), 'b0 48 40 -- Release Time');
  });
  it('attackTime', function() {
    assert.equal(JZZ.MIDI.attackTime(0, 64).toString(), 'b0 49 40 -- Attack Time');
  });
  it('brightness', function() {
    assert.equal(JZZ.MIDI.brightness(0, 64).toString(), 'b0 4a 40 -- Brightness');
  });
  it('decayTime', function() {
    assert.equal(JZZ.MIDI.decayTime(0, 64).toString(), 'b0 4b 40 -- Decay Time');
  });
  it('vibratoRate', function() {
    assert.equal(JZZ.MIDI.vibratoRate(0, 64).toString(), 'b0 4c 40 -- Vibrato Rate');
  });
  it('vibratoDepth', function() {
    assert.equal(JZZ.MIDI.vibratoDepth(0, 64).toString(), 'b0 4d 40 -- Vibrato Depth');
  });
  it('vibratoDelay', function() {
    assert.equal(JZZ.MIDI.vibratoDelay(0, 64).toString(), 'b0 4e 40 -- Vibrato Delay');
  });
  it('ptc', function() {
    assert.equal(JZZ.MIDI.ptc(0, 'C5').toString(), 'b0 54 3c -- Portamento Control');
  });
  it('data', function() {
    assert.equal(JZZ.MIDI.data(0, 1, 2)[0].toString(), 'b0 06 01 -- Data Entry MSB');
    assert.equal(JZZ.MIDI.data(0, 1, 2)[1].toString(), 'b0 26 02 -- Data Entry LSB');
    assert.equal(JZZ.MIDI.data(0, 0x82)[0].toString(), 'b0 06 01 -- Data Entry MSB');
    assert.equal(JZZ.MIDI.data(0, 0x82)[1].toString(), 'b0 26 02 -- Data Entry LSB');
  });
  it('dataF', function() {
    assert.equal(JZZ.MIDI.dataF(0, .5)[0].toString(), 'b0 06 40 -- Data Entry MSB');
    assert.equal(JZZ.MIDI.dataF(0, .5)[1].toString(), 'b0 26 00 -- Data Entry LSB');
  });
  it('dataMSB', function() {
    assert.equal(JZZ.MIDI.dataMSB(0, 1).toString(), 'b0 06 01 -- Data Entry MSB');
  });
  it('dataLSB', function() {
    assert.equal(JZZ.MIDI.dataLSB(0, 1).toString(), 'b0 26 01 -- Data Entry LSB');
  });
  it('dataIncr', function() {
    assert.equal(JZZ.MIDI.dataIncr(0).toString(), 'b0 60 00 -- Data Increment');
  });
  it('dataDecr', function() {
    assert.equal(JZZ.MIDI.dataDecr(0).toString(), 'b0 61 00 -- Data Decrement');
  });
  it('nrpn', function() {
    assert.equal(JZZ.MIDI.nrpn(0, 1, 2)[0].toString(), 'b0 63 01 -- Non-Registered Parameter Number MSB');
    assert.equal(JZZ.MIDI.nrpn(0, 1, 2)[1].toString(), 'b0 62 02 -- Non-Registered Parameter Number LSB');
    assert.equal(JZZ.MIDI.nrpn(0, 0x82)[0].toString(), 'b0 63 01 -- Non-Registered Parameter Number MSB');
    assert.equal(JZZ.MIDI.nrpn(0, 0x82)[1].toString(), 'b0 62 02 -- Non-Registered Parameter Number LSB');
  });
  it('nrpnMSB', function() {
    assert.equal(JZZ.MIDI.nrpnMSB(0, 0).toString(), 'b0 63 00 -- Non-Registered Parameter Number MSB');
  });
  it('nrpnLSB', function() {
    assert.equal(JZZ.MIDI.nrpnLSB(0, 1).toString(), 'b0 62 01 -- Non-Registered Parameter Number LSB');
  });
  it('rpn', function() {
    assert.equal(JZZ.MIDI.rpn(0, 1, 2)[0].toString(), 'b0 65 01 -- Registered Parameter Number MSB');
    assert.equal(JZZ.MIDI.rpn(0, 1, 2)[1].toString(), 'b0 64 02 -- Registered Parameter Number LSB');
    assert.equal(JZZ.MIDI.rpn(0, 0x82)[0].toString(), 'b0 65 01 -- Registered Parameter Number MSB');
    assert.equal(JZZ.MIDI.rpn(0, 0x82)[1].toString(), 'b0 64 02 -- Registered Parameter Number LSB');
    assert.throws(function() { JZZ.MIDI.rpn(0, 0x8000); });
  });
  it('rpnMSB', function() {
    assert.equal(JZZ.MIDI.rpnMSB(0, 0).toString(), 'b0 65 00 -- Registered Parameter Number MSB');
  });
  it('rpnLSB', function() {
    assert.equal(JZZ.MIDI.rpnLSB(0, 1).toString(), 'b0 64 01 -- Registered Parameter Number LSB');
  });
  it('rpnPitchBendRange', function() {
    var a = JZZ.MIDI.rpnPitchBendRange(0, 1, 0x55);
    var b = JZZ.MIDI.rpnPitchBendRangeF(0, 2.5);
    assert.equal(a.length, 4);
    assert.equal(a[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b0 64 00 -- Registered Parameter Number LSB');
    assert.equal(a[2].toString(), 'b0 06 01 -- Data Entry MSB');
    assert.equal(a[3].toString(), 'b0 26 55 -- Data Entry LSB');
    assert.equal(b.length, 4);
    assert.equal(b[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(b[1].toString(), 'b0 64 00 -- Registered Parameter Number LSB');
    assert.equal(b[2].toString(), 'b0 06 02 -- Data Entry MSB');
    assert.equal(b[3].toString(), 'b0 26 32 -- Data Entry LSB');
  });
  it('rpnTuning', function() {
    var a = JZZ.MIDI.rpnTuningA(0, 216); // 432/2
    var b = JZZ.MIDI.rpnTuning(0, 5, 6, 7);
    assert.equal(a.length, 7);
    assert.equal(a[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b0 64 02 -- Registered Parameter Number LSB');
    assert.equal(a[2].toString(), 'b0 06 34 -- Data Entry MSB');
    assert.equal(a[3].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[4].toString(), 'b0 64 01 -- Registered Parameter Number LSB');
    assert.equal(a[5].toString(), 'b0 06 2b -- Data Entry MSB');
    assert.equal(a[6].toString(), 'b0 26 55 -- Data Entry LSB');
    assert.equal(b.length, 7);
    assert.equal(b[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(b[1].toString(), 'b0 64 02 -- Registered Parameter Number LSB');
    assert.equal(b[2].toString(), 'b0 06 05 -- Data Entry MSB');
    assert.equal(b[3].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(b[4].toString(), 'b0 64 01 -- Registered Parameter Number LSB');
    assert.equal(b[5].toString(), 'b0 06 06 -- Data Entry MSB');
    assert.equal(b[6].toString(), 'b0 26 07 -- Data Entry LSB');
  });
  it('rpnSelectTuning', function() {
    var a = JZZ.MIDI.rpnSelectTuning(0, 8);
    assert.equal(a.length, 3);
    assert.equal(a[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b0 64 03 -- Registered Parameter Number LSB');
    assert.equal(a[2].toString(), 'b0 06 08 -- Data Entry MSB');
    a = JZZ.MIDI.rpnSelectTuning(1, 7, 8);
    assert.equal(a.length, 6);
    assert.equal(a[0].toString(), 'b1 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b1 64 04 -- Registered Parameter Number LSB');
    assert.equal(a[2].toString(), 'b1 06 07 -- Data Entry MSB');
    assert.equal(a[3].toString(), 'b1 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[4].toString(), 'b1 64 03 -- Registered Parameter Number LSB');
    assert.equal(a[5].toString(), 'b1 06 08 -- Data Entry MSB');
  });
  it('rpnModulationDepthRange', function() {
    var a = JZZ.MIDI.rpnModulationDepthRangeF(0, 2.5);
    assert.equal(a.length, 4);
    assert.equal(a[0].toString(), 'b0 65 00 -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b0 64 05 -- Registered Parameter Number LSB');
    assert.equal(a[2].toString(), 'b0 06 02 -- Data Entry MSB');
    assert.equal(a[3].toString(), 'b0 26 40 -- Data Entry LSB');
  });
  it('rpnNull', function() {
    var a = JZZ.MIDI.rpnNull(0);
    assert.equal(a.length, 2);
    assert.equal(a[0].toString(), 'b0 65 7f -- Registered Parameter Number MSB');
    assert.equal(a[1].toString(), 'b0 64 7f -- Registered Parameter Number LSB');
  });
  it('undefined', function() {
    assert.equal(JZZ.MIDI(0xb0, 0x66, 0x7f).toString(), 'b0 66 7f -- Undefined');
  });
  it('allSoundOff', function() {
    assert.equal(JZZ.MIDI.allSoundOff(0).toString(), 'b0 78 00 -- All Sound Off');
  });
  it('resetAllControllers', function() {
    assert.equal(JZZ.MIDI.resetAllControllers(0).toString(), 'b0 79 00 -- Reset All Controllers');
  });
  it('localControl', function() {
    assert.equal(JZZ.MIDI.localControl(0).toString(), 'b0 7a 7f -- Local Control On/Off');
    assert.equal(JZZ.MIDI.localControl(0, true).toString(), 'b0 7a 7f -- Local Control On/Off');
    assert.equal(JZZ.MIDI.localControl(0, false).toString(), 'b0 7a 00 -- Local Control On/Off');
  });
  it('allNotesOff', function() {
    assert.equal(JZZ.MIDI.allNotesOff(0).toString(), 'b0 7b 00 -- All Notes Off');
  });
  it('omni', function() {
    assert.equal(JZZ.MIDI.omni(0).toString(), 'b0 7d 00 -- Omni Mode On');
    assert.equal(JZZ.MIDI.omni(0, true).toString(), 'b0 7d 00 -- Omni Mode On');
    assert.equal(JZZ.MIDI.omni(0, false).toString(), 'b0 7c 00 -- Omni Mode Off');
  });
  it('mono', function() {
    assert.equal(JZZ.MIDI.mono(0).toString(), 'b0 7e 01 -- Mono Mode On');
    assert.equal(JZZ.MIDI.mono(0, 0).toString(), 'b0 7e 00 -- Mono Mode On');
  });
  it('poly', function() {
    assert.equal(JZZ.MIDI.poly(0).toString(), 'b0 7f 00 -- Poly Mode On');
  });
  it('mode1234', function() {
    var m1 = JZZ.MIDI.ch(0).mode1();
    assert.equal(m1.length, 2);
    assert.equal(m1[0].toString(), 'b0 7d 00 -- Omni Mode On');
    assert.equal(m1[1].toString(), 'b0 7f 00 -- Poly Mode On');
    var m2 = JZZ.MIDI.ch(0).mode2();
    assert.equal(m2.length, 2);
    assert.equal(m2[0].toString(), 'b0 7d 00 -- Omni Mode On');
    assert.equal(m2[1].toString(), 'b0 7e 01 -- Mono Mode On');
    var m3 = JZZ.MIDI.ch(0).mode3();
    assert.equal(m3.length, 2);
    assert.equal(m3[0].toString(), 'b0 7c 00 -- Omni Mode Off');
    assert.equal(m3[1].toString(), 'b0 7f 00 -- Poly Mode On');
    var m4 = JZZ.MIDI.ch(0).mode4();
    assert.equal(m4.length, 2);
    assert.equal(m4[0].toString(), 'b0 7c 00 -- Omni Mode Off');
    assert.equal(m4[1].toString(), 'b0 7e 01 -- Mono Mode On');
  });
  it('mtc', function() {
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 0, 0)).toString(), 'f1 00 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 0, 1)).toString(), 'f1 10 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 0, 2)).toString(), 'f1 20 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 0, 3)).toString(), 'f1 30 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 1, 4)).toString(), 'f1 40 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 1, 5)).toString(), 'f1 50 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 1, 6)).toString(), 'f1 60 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(24, 0, 0, 0, 1, 7)).toString(), 'f1 70 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(25, 0, 0, 0, 1, 7)).toString(), 'f1 72 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(29.97, 0, 0, 0, 1, 7)).toString(), 'f1 74 -- MIDI Time Code');
    assert.equal(JZZ.MIDI.mtc(JZZ.SMPTE(30, 0, 0, 0, 1, 7)).toString(), 'f1 76 -- MIDI Time Code');
  });
  it('songPosition', function() {
    assert.equal(JZZ.MIDI.songPosition(300).toString(), 'f2 2c 02 -- Song Position');
    assert.equal(JZZ.MIDI.songPosition(2, 44).toString(), 'f2 2c 02 -- Song Position');
  });
  it('songSelect', function() {
    assert.equal(JZZ.MIDI.songSelect(15).toString(), 'f3 0f -- Song Select');
  });
  it('tune', function() {
    assert.equal(JZZ.MIDI.tune().toString(), 'f6 -- Tune request');
  });
  it('clock', function() {
    var msg = JZZ.MIDI.clock();
    msg.setChannel(1); // ignored
    assert.equal(msg.toString(), 'f8 -- Timing clock');
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
    var msg = JZZ.MIDI.sxIdRequest();
    assert.equal(msg.isSysEx(), true);
    assert.equal(msg.isFullSysEx(), true);
    msg.setSysExId(20).setSysExId(128);
    assert.equal(msg.getSysExId(), 20);
    assert.equal(msg.toString(), 'f0 7e 14 06 01 f7');
    msg.setChannel(10);
    msg.setNote(60);
    msg.setVelocity(120);
    assert.equal(msg.getChannel(), undefined);
    assert.equal(msg.getNote(), undefined);
    assert.equal(msg.getVelocity(), undefined);
    assert.equal(msg.getData(), undefined);
    assert.equal(msg.isNoteOn(), false);
    assert.equal(msg.isNoteOff(), false);
  });
  it('sxTuningDumpRequest', function() {
    assert.equal(JZZ.MIDI.sxTuningDumpRequest(5).toString(), 'f0 7e 7f 08 00 05 f7');
    assert.equal(JZZ.MIDI.sxId(3).sxTuningDumpRequest(5).toString(), 'f0 7e 03 08 00 05 f7');
    assert.equal(JZZ.MIDI.sxTuningDumpRequest(5, 8).toString(), 'f0 7e 7f 08 03 05 08 f7');
  });
  it('sxNoteTuning', function() {
    var a = []; a[69] = 69.5; a[70] = 70.25;
    assert.equal(JZZ.MIDI.sxNoteTuning(3, { 'A5': 0x114000 }).toString(), 'f0 7f 7f 08 02 03 01 45 45 00 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningF(4, { 'A5': 'A5' }).toString(), 'f0 7f 7f 08 02 04 01 45 45 00 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningHZ(4, { 'A5': 440 }).toString(), 'f0 7f 7f 08 02 04 01 45 45 00 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningF(5, a).toString(), 'f0 7f 7f 08 02 05 02 45 45 40 00 46 46 20 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningF(6, 7, a).toString(), 'f0 7f 7f 08 07 06 07 02 45 45 40 00 46 46 20 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningHZ(6, 7, { 'A5': 440 }).toString(), 'f0 7f 7f 08 07 06 07 01 45 45 00 00 f7');
    assert.equal(JZZ.MIDI.sxNoteTuningF(8, 9, a, false).toString(), 'f0 7e 7f 08 07 08 09 02 45 45 40 00 46 46 20 00 f7');
    assert.throws(function() { JZZ.MIDI.sxNoteTuning(0, { a5: 0x200000 }); });
    assert.throws(function() { JZZ.MIDI.sxNoteTuningF(0, { a5: 0, 69: 0 }); });
    assert.throws(function() { JZZ.MIDI.sxNoteTuningF(0, { 200: 0 }); });
    assert.throws(function() { JZZ.MIDI.sxNoteTuningF(0, { 0: 'dummy' }); });
    assert.throws(function() { JZZ.MIDI.sxNoteTuningHZ(0, { 0: 'dummy' }); });
  });
  it('sxScaleTuning1', function() {
    var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var b = [0x10000, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var c = [-.64, -.32, 0, .32, .63, 0, 0, 0, 0, 0, 0, 0];
    assert.equal(JZZ.MIDI.sxScaleTuning1(a).toString(), 'f0 7f 7f 08 08 03 7f 7f 01 02 03 04 05 06 07 08 09 0a 0b 0c f7');
    assert.equal(JZZ.MIDI.sxScaleTuning1(a, false).toString(), 'f0 7e 7f 08 08 03 7f 7f 01 02 03 04 05 06 07 08 09 0a 0b 0c f7');
    assert.equal(JZZ.MIDI.sxScaleTuning1F(c).toString(), 'f0 7f 7f 08 08 03 7f 7f 00 20 40 60 7f 40 40 40 40 40 40 40 f7');
    assert.equal(JZZ.MIDI.sxScaleTuning1F(0xff, c).toString(), 'f0 7f 7f 08 08 00 01 7f 00 20 40 60 7f 40 40 40 40 40 40 40 f7');
    assert.throws(function() { JZZ.MIDI.sxScaleTuning1([]); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning1(b); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning1(0x10000, a); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning1F([.64]); });
  });
  it('sxScaleTuning2', function() {
    var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var b = [0x10000, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var c = [-1, -.75, -.5, -.25, 0, .25, .5, .75, 1, 0, 0, 0];
    assert.equal(JZZ.MIDI.sxScaleTuning(a).toString(),
      'f0 7f 7f 08 09 03 7f 7f 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 0a 00 0b 00 0c f7');
    assert.equal(JZZ.MIDI.sxScaleTuning2(a).toString(),
      'f0 7f 7f 08 09 03 7f 7f 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 0a 00 0b 00 0c f7');
    assert.equal(JZZ.MIDI.sxScaleTuning2(a, false).toString(),
      'f0 7e 7f 08 09 03 7f 7f 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 0a 00 0b 00 0c f7');
    assert.equal(JZZ.MIDI.sxScaleTuningF(c).toString(),
      'f0 7f 7f 08 09 03 7f 7f 00 00 10 00 20 00 30 00 40 00 50 00 60 00 70 00 7f 7f 40 00 40 00 40 00 f7');
    assert.equal(JZZ.MIDI.sxScaleTuningF(0xff, c).toString(),
      'f0 7f 7f 08 09 00 01 7f 00 00 10 00 20 00 30 00 40 00 50 00 60 00 70 00 7f 7f 40 00 40 00 40 00 f7');
    assert.throws(function() { JZZ.MIDI.sxScaleTuning2([]); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning2(b); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning2(0x10000, a); });
    assert.throws(function() { JZZ.MIDI.sxScaleTuning2F([2, 0]); });
  });
  it('sxFullFrame', function() {
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE()).toString(), 'f0 7f 7f 01 01 00 00 00 00 f7');
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE(24, 0, 0, 0, 0)).toString(), 'f0 7f 7f 01 01 00 00 00 00 f7');
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE(25, 0, 0, 0, 0)).toString(), 'f0 7f 7f 01 01 20 00 00 00 f7');
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE(29.97, 0, 0, 0, 0)).toString(), 'f0 7f 7f 01 01 40 00 00 00 f7');
    assert.equal(JZZ.MIDI.sxFullFrame(JZZ.SMPTE(30, 0, 0, 0, 0)).toString(), 'f0 7f 7f 01 01 60 00 00 00 f7');
  });
  it('sxMasterVolume', function() {
    assert.equal(JZZ.MIDI.sxMasterVolume(0x7f, 0x7e).toString(), 'f0 7f 7f 04 01 7e 7f f7');
    assert.equal(JZZ.MIDI.sxMasterVolume(0x3ffe).toString(), 'f0 7f 7f 04 01 7e 7f f7');
    assert.equal(JZZ.MIDI.sxMasterVolumeF(.5).toString(), 'f0 7f 7f 04 01 00 40 f7');
    assert.equal(JZZ.MIDI.sxId(127).sxMasterVolumeF(0).toString(), 'f0 7f 7f 04 01 00 00 f7');
    assert.equal(JZZ.MIDI.sxId(17).sxMasterVolumeF(0).toString(), 'f0 7f 11 04 01 00 00 f7');
    assert.equal(JZZ.MIDI.sxId(17).sxId().sxMasterVolumeF(0).toString(), 'f0 7f 7f 04 01 00 00 f7');
    assert.throws(function() { JZZ.MIDI.sxMasterVolumeF(-1); });
    assert.throws(function() { JZZ.MIDI.sxMasterVolumeF('dummy'); });
  });
  it('sxMasterTuning', function() {
    assert.equal(JZZ.MIDI.sxMasterFineTuning(0x7f, 0x7e).toString(), 'f0 7f 7f 04 03 7e 7f f7');
    assert.equal(JZZ.MIDI.sxMasterFineTuning(0x3ffe).toString(), 'f0 7f 7f 04 03 7e 7f f7');
    assert.equal(JZZ.MIDI.sxMasterFineTuningF(1.5).toString(), 'f0 7f 7f 04 03 00 60 f7');
    assert.equal(JZZ.MIDI.sxMasterCoarseTuning(0x20).toString(), 'f0 7f 7f 04 04 00 20 f7');
    assert.equal(JZZ.MIDI.sxMasterCoarseTuningF(-1.5).toString(), 'f0 7f 7f 04 04 00 3f f7');
    assert.equal(JZZ.MIDI.sxMasterCoarseTuningF(1.5).toString(), 'f0 7f 7f 04 04 00 41 f7');
    assert.equal(JZZ.MIDI.sxMasterTranspose(0x20).toString(), 'f0 7f 7f 04 04 00 20 f7');
    assert.equal(JZZ.MIDI.sxMasterTransposeF(-1.5).toString(), 'f0 7f 7f 04 04 00 3f f7');
    var a = JZZ.MIDI.sxId(17).sxMasterTuningA(216); // 432/2
    assert.equal(a.length, 2);
    assert.equal(a[0].toString(), 'f0 7f 11 04 04 00 34 f7');
    assert.equal(a[1].toString(), 'f0 7f 11 04 03 55 2b f7');
    var b = JZZ.MIDI.sxId(17).sxMasterTuning(2, 5);
    assert.equal(b.length, 2);
    assert.equal(b[0].toString(), 'f0 7f 11 04 04 00 02 f7');
    assert.equal(b[1].toString(), 'f0 7f 11 04 03 05 00 f7');
    assert.throws(function() { JZZ.MIDI.sxMasterCoarseTuningF(255); });
    assert.throws(function() { JZZ.MIDI.sxMasterFineTuningF('dummy'); });
  });
  it('sxGM', function() {
    assert.equal(JZZ.MIDI.sxGM(0).toString(), 'f0 7e 7f 09 02 f7');
    assert.equal(JZZ.MIDI.sxGM(false).toString(), 'f0 7e 7f 09 02 f7');
    assert.equal(JZZ.MIDI.sxGM().toString(), 'f0 7e 7f 09 01 f7');
    assert.equal(JZZ.MIDI.sxGM(1).toString(), 'f0 7e 7f 09 01 f7');
    assert.equal(JZZ.MIDI.sxGM(true).toString(), 'f0 7e 7f 09 01 f7');
    assert.equal(JZZ.MIDI.sxGM(2).toString(), 'f0 7e 7f 09 03 f7');
    assert.equal(JZZ.MIDI.sxGM().isGmReset(), true);
    assert.equal(JZZ.MIDI.sxGM().isGsReset(), false);
    assert.equal(JZZ.MIDI.sxGM().isXgReset(), false);
  });
  it('sxGS', function() {
    assert.equal(JZZ.MIDI.sxId(0x10).sxGS().toString(), 'f0 41 10 42 12 40 00 7f 00 41 f7');
    assert.equal(JZZ.MIDI.sxId(0x10).sxGS(0x40, 0x01, 0x33, 0x0c).toString(), 'f0 41 10 42 12 40 01 33 0c 00 f7');
    assert.equal(JZZ.MIDI.sxGS([0x40, 0x01, 0x33, 0x0c]).toString(), 'f0 41 7f 42 12 40 01 33 0c 00 f7');
    assert.equal(JZZ.MIDI.sxGS().isGmReset(), false);
    assert.equal(JZZ.MIDI.sxGS().isGsReset(), true);
    assert.equal(JZZ.MIDI.sxGS().isXgReset(), false);
  });
  it('sxXG', function() {
    var msg = JZZ.MIDI.sxXG();
    assert.equal(msg.isGmReset(), false);
    assert.equal(msg.isGsReset(), false);
    assert.equal(msg.isXgReset(), true);
    assert.equal(JZZ.MIDI.sxXG(0, 0, 0x7e, 0).toString(), 'f0 43 10 4c 00 00 7e 00 f7');
    assert.equal(JZZ.MIDI.sxXG([0, 0, 0x7e, 0]).toString(), 'f0 43 10 4c 00 00 7e 00 f7');
    assert.throws(function() { JZZ.MIDI.sxId(0x7e).sxXG(); });
  });
  it('gsMasterVolume', function() {
    assert.equal(JZZ.MIDI.gsMasterVolume(0x40).toString(), 'f0 41 7f 42 12 40 00 04 40 7c f7');
    assert.equal(JZZ.MIDI.gsMasterVolumeF(0.5).toString(), 'f0 41 7f 42 12 40 00 04 40 7c f7');
  });
  it('gsMasterTuning', function() {
    assert.equal(JZZ.MIDI.gsMasterFineTuning(0, 1, 2, 3).toString(), 'f0 41 7f 42 12 40 00 00 00 01 02 03 3a f7');
    assert.equal(JZZ.MIDI.gsMasterFineTuning(0x123).toString(), 'f0 41 7f 42 12 40 00 00 00 01 02 03 3a f7');
    assert.throws(function() { JZZ.MIDI.gsMasterFineTuning(); });
    assert.equal(JZZ.MIDI.gsMasterFineTuningF(0).toString(), 'f0 41 7f 42 12 40 00 00 00 04 00 00 3c f7');
    assert.equal(JZZ.MIDI.gsMasterFineTuningF(0.9999).toString(), 'f0 41 7f 42 12 40 00 00 00 07 0e 08 23 f7');
    assert.equal(JZZ.MIDI.gsMasterFineTuningF(-0.9999).toString(), 'f0 41 7f 42 12 40 00 00 00 00 01 08 37 f7');
    assert.equal(JZZ.MIDI.gsMasterCoarseTuning(0x41).toString(), 'f0 41 7f 42 12 40 00 05 41 7a f7');
    assert.equal(JZZ.MIDI.gsMasterCoarseTuningF(1).toString(), 'f0 41 7f 42 12 40 00 05 41 7a f7');
    assert.equal(JZZ.MIDI.gsMasterTranspose(0x41).toString(), 'f0 41 7f 42 12 40 00 05 41 7a f7');
    assert.equal(JZZ.MIDI.gsMasterTransposeF(1).toString(), 'f0 41 7f 42 12 40 00 05 41 7a f7');
    assert.equal(JZZ.MIDI.gsMasterTuningF(1.5)[0].toString(), 'f0 41 7f 42 12 40 00 05 41 7a f7');
    assert.equal(JZZ.MIDI.gsMasterTuningF(1.5)[1].toString(), 'f0 41 7f 42 12 40 00 00 00 05 0f 04 28 f7');
    assert.equal(JZZ.MIDI.gsMasterTuningA(880)[0].toString(), 'f0 41 7f 42 12 40 00 05 4c 6f f7');
    assert.equal(JZZ.MIDI.gsMasterTuningA(880)[1].toString(), 'f0 41 7f 42 12 40 00 00 00 04 00 00 3c f7');
  });
  it('gsOctaveTuning', function() {
    assert.equal(JZZ.MIDI.gsOctaveTuning(1, 'C5', 114).toString(), 'f0 41 7f 42 12 40 12 40 72 7c f7');
    assert.equal(JZZ.MIDI.gsOctaveTuning(1, 'B#', 114).toString(), 'f0 41 7f 42 12 40 12 40 72 7c f7');
    assert.equal(JZZ.MIDI.gsOctaveTuningF(1, 0, 0.5).toString(), 'f0 41 7f 42 12 40 12 40 72 7c f7');
    assert.throws(function() { JZZ.MIDI.gsOctaveTuning(0, 'dummy', 0); });
    assert.throws(function() { JZZ.MIDI.gsOctaveTuningF(0, 0, 1); });
  });
  it('gsScaleTuning', function() {
    assert.equal(JZZ.MIDI.gsScaleTuning(0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[1].toString(), 'f0 41 7f 42 12 40 11 41 00 6e f7');
    assert.equal(JZZ.MIDI.gsScaleTuningF(0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[1].toString(), 'f0 41 7f 42 12 40 11 41 40 2e f7');
    assert.throws(function() { JZZ.MIDI.gsScaleTuning(0, []); });
    assert.throws(function() { JZZ.MIDI.gsScaleTuningF(0, []); });
  });
  it('xgMasterVolume', function() {
    assert.equal(JZZ.MIDI.xgMasterVolume(0x40).toString(), 'f0 43 10 4c 00 00 04 40 f7');
    assert.equal(JZZ.MIDI.xgMasterVolumeF(0.5).toString(), 'f0 43 10 4c 00 00 04 40 f7');
  });
  it('xgMasterTuning', function() {
    assert.equal(JZZ.MIDI.xgMasterFineTuning(0, 1, 2, 3).toString(), 'f0 43 10 4c 00 00 00 00 01 02 03 f7');
    assert.equal(JZZ.MIDI.xgMasterFineTuning(0x123).toString(), 'f0 43 10 4c 00 00 00 00 01 02 03 f7');
    assert.throws(function() { JZZ.MIDI.xgMasterFineTuning(); });
    assert.equal(JZZ.MIDI.xgMasterFineTuningF(0).toString(), 'f0 43 10 4c 00 00 00 00 04 00 00 f7');
    assert.equal(JZZ.MIDI.xgMasterFineTuningF(0.9999).toString(), 'f0 43 10 4c 00 00 00 00 07 0e 08 f7');
    assert.equal(JZZ.MIDI.xgMasterFineTuningF(-0.9999).toString(), 'f0 43 10 4c 00 00 00 00 00 01 08 f7');
    assert.equal(JZZ.MIDI.xgMasterCoarseTuning(0x41).toString(), 'f0 43 10 4c 00 00 06 41 f7');
    assert.equal(JZZ.MIDI.xgMasterCoarseTuningF(1).toString(), 'f0 43 10 4c 00 00 06 41 f7');
    assert.equal(JZZ.MIDI.xgMasterTranspose(0x41).toString(), 'f0 43 10 4c 00 00 06 41 f7');
    assert.equal(JZZ.MIDI.xgMasterTransposeF(1).toString(), 'f0 43 10 4c 00 00 06 41 f7');
    assert.equal(JZZ.MIDI.xgMasterTuningF(1.5)[0].toString(), 'f0 43 10 4c 00 00 06 41 f7');
    assert.equal(JZZ.MIDI.xgMasterTuningF(1.5)[1].toString(), 'f0 43 10 4c 00 00 00 00 05 0f 04 f7');
    assert.equal(JZZ.MIDI.xgMasterTuningA(880)[0].toString(), 'f0 43 10 4c 00 00 06 4c f7');
    assert.equal(JZZ.MIDI.xgMasterTuningA(880)[1].toString(), 'f0 43 10 4c 00 00 00 00 04 00 00 f7');
  });
  it('xgOctaveTuning', function() {
    assert.equal(JZZ.MIDI.xgOctaveTuning(1, 'C5', 114).toString(), 'f0 43 10 4c 08 01 41 72 f7');
    assert.equal(JZZ.MIDI.xgOctaveTuning(1, 'B#', 114).toString(), 'f0 43 10 4c 08 01 41 72 f7');
    assert.equal(JZZ.MIDI.xgOctaveTuningF(1, 0, 0.5).toString(), 'f0 43 10 4c 08 01 41 72 f7');
    assert.throws(function() { JZZ.MIDI.xgOctaveTuning(0, 'dummy', 0); });
    assert.throws(function() { JZZ.MIDI.xgOctaveTuningF(0, 0, 1); });
  });
  it('xgScaleTuning', function() {
    assert.equal(JZZ.MIDI.xgScaleTuning(0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[1].toString(), 'f0 43 10 4c 08 00 42 00 f7');
    assert.equal(JZZ.MIDI.xgScaleTuningF(0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[1].toString(), 'f0 43 10 4c 08 00 42 40 f7');
    assert.throws(function() { JZZ.MIDI.xgScaleTuning(0, []); });
    assert.throws(function() { JZZ.MIDI.xgScaleTuningF(0, []); });
  });
  it('sxMidiSoft', function() {
    assert.equal(JZZ.MIDI.sxMidiSoft(0).toString(), 'f0 00 20 24 00 00 f7 -- [K:00]');
    assert.equal(JZZ.MIDI.sxMidiSoft(4, 'MidiSoft').toString(), 'f0 00 20 24 00 04 4d 69 64 69 53 6f 66 74 f7 -- [K:04] MidiSoft');
  });
  it('reset', function() {
    assert.equal(JZZ.MIDI.reset().toString(), 'ff -- Reset');
  });
  it('freq', function() {
    assert.equal(JZZ.MIDI.freq('-3'), 6.875);
    assert.equal(JZZ.MIDI.freq(57), 220);
    assert.equal(JZZ.MIDI.freq('A6'), 880);
    assert.equal(JZZ.MIDI.freq('A5', 880), 880);
  });
  it('shift', function() {
    assert.equal(JZZ.MIDI.shift(432), Math.log2(432/440) * 12);
    assert.equal(JZZ.MIDI.shift(880, 440), 12);
  });
  it('midi', function() {
    assert.equal(JZZ.MIDI.midi(50) - JZZ.MIDI.shift(50), 69);
    assert.equal(JZZ.MIDI.midi('C#5'), 61);
    assert.throws(function() { JZZ.MIDI.midi(50, 'dummy'); });
    assert.throws(function() { JZZ.MIDI.midi('dummy'); });
  });
  it('to14b', function() {
    assert.equal(JZZ.MIDI.to14b(-.01), 0);
    assert.equal(JZZ.MIDI.to14b(0), 0);
    assert.equal(JZZ.MIDI.to14b(.00007), 1);
    assert.equal(JZZ.MIDI.to14b(.25), 0x1000);
    assert.equal(JZZ.MIDI.to14b(.5), 0x2000);
    assert.equal(JZZ.MIDI.to14b(.75), 0x3000);
    assert.equal(JZZ.MIDI.to14b(.99994), 0x3fff);
    assert.equal(JZZ.MIDI.to14b(1), 0x3fff);
    assert.equal(JZZ.MIDI.to14b(1.01), 0x3fff);
    assert.throws(function() { JZZ.MIDI.to14b('dummy'); });
  });
  it('to21b', function() {
    assert.equal(JZZ.MIDI.to21b(), 0x1fffff);
    assert.equal(JZZ.MIDI.to21b(-.01), 0);
    assert.equal(JZZ.MIDI.to21b(0), 0);
    assert.equal(JZZ.MIDI.to21b(.25), 0x1000);
    assert.equal(JZZ.MIDI.to21b(.5), 0x2000);
    assert.equal(JZZ.MIDI.to21b(1), 0x4000);
    assert.equal(JZZ.MIDI.to21b(1.75), 0x7000);
    assert.equal(JZZ.MIDI.to21b(2.25), 0x9000);
    assert.equal(JZZ.MIDI.to21b(127.75), 0x1ff000);
    assert.equal(JZZ.MIDI.to21b(128), 0x1ffffe);
    assert.throws(function() { JZZ.MIDI.to21b('dummy'); });
  });
});

describe('SMF events', function() {
  it('empty', function() {
    assert.equal(JZZ.MIDI.smf(1).toString(), 'ff01 -- Text');
    assert.equal(JZZ.MIDI.smf(0x70).toString(), 'ff70 -- SMF');
    assert.throws(function() { JZZ.MIDI.smf(300); });
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
    assert.equal(JZZ.MIDI.smfSeqNumber('').toString(), 'ff00 -- Sequence Number: 0');
    assert.equal(JZZ.MIDI.smfSeqNumber('\x01').toString(), 'ff00 -- Sequence Number: 1');
    assert.equal(JZZ.MIDI.smfSeqNumber('\x01\x01').toString(), 'ff00 -- Sequence Number: 257');
    assert.throws(function() { JZZ.MIDI.smfSeqNumber(-1); });
    assert.throws(function() { JZZ.MIDI.smfSeqNumber('\x01\x01\x01'); });
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
    assert.equal(JZZ.MIDI.smfText('\ttwo\nlines\r\x00').toString(), 'ff01 -- Text: \\ttwo\\nlines\\r\\x00');
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
    assert.equal(JZZ.MIDI.smfChannelPrefix('').toString(), 'ff20 -- Channel Prefix: 00');
    assert.equal(JZZ.MIDI.smfChannelPrefix('\n').toString(), 'ff20 -- Channel Prefix: 0a');
    assert.throws(function() { JZZ.MIDI.smfChannelPrefix(-1); });
    assert.throws(function() { JZZ.MIDI.smfChannelPrefix('\x01\x01\x01'); });
  });
  it('smf/MidiPort', function() {
    assert.equal(JZZ.MIDI.smf(0x21, '\x0a').toString(), 'ff21 -- MIDI Port: 0a');
    assert.equal(JZZ.MIDI.smfMidiPort(10).toString(), 'ff21 -- MIDI Port: 0a');
    assert.equal(JZZ.MIDI.smfMidiPort('').toString(), 'ff21 -- MIDI Port: 00');
    assert.equal(JZZ.MIDI.smfMidiPort('\n').toString(), 'ff21 -- MIDI Port: 0a');
    assert.throws(function() { JZZ.MIDI.smfMidiPort(-1); });
    assert.throws(function() { JZZ.MIDI.smfMidiPort('\x01\x01\x01'); });
  });
  it('smf/EndOfTrack', function() {
    var msg = JZZ.MIDI.smf(0x2f);
    assert.equal(msg.isEOT(), true);
    assert.equal(msg.toString(), 'ff2f -- End of Track');
    assert.equal(JZZ.MIDI.smfEndOfTrack().toString(), 'ff2f -- End of Track');
    assert.throws(function() { JZZ.MIDI.smfEndOfTrack(-1); });
  });
  it('smf/Tempo', function() {
    var msg = JZZ.MIDI.smf(0x51, '\x07\xa1\x20');
    assert.equal(msg.isTempo(), true);
    assert.equal(msg.getTempo(), 500000);
    assert.equal(msg.getBPM(), 120);
    assert.equal(msg.toString(), 'ff51 -- Tempo: 120 bpm');
    assert.equal(JZZ.MIDI.smfTempo('\x07\xa1\x20').toString(), 'ff51 -- Tempo: 120 bpm');
    assert.equal(JZZ.MIDI.smfTempo(500000).toString(), 'ff51 -- Tempo: 120 bpm');
    assert.equal(JZZ.MIDI.smfBPM(120).toString(), 'ff51 -- Tempo: 120 bpm');    assert.throws(function() { JZZ.MIDI.smfEndOfTrack(-1); });
    assert.throws(function() { JZZ.MIDI.smfTempo(0x1000000); });
    assert.throws(function() { JZZ.MIDI.smfBPM(0.001); });
  });
  it('smf/SMPTE', function() {
    assert.equal(JZZ.MIDI.smf(0x54, '\x17\x3b\x3b\x17\x4b').toString(), 'ff54 -- SMPTE Offset: 23:59:59:23:75');
    assert.equal(JZZ.MIDI.smfSMPTE('\x17\x3b\x3b\x17\x4b').toString(), 'ff54 -- SMPTE Offset: 23:59:59:23:75');
    assert.equal(JZZ.MIDI.smfSMPTE(JZZ.SMPTE(30, 7, 40).incrQF().incrQF().incrQF().incrQF().incrQF()).toString(), 'ff54 -- SMPTE Offset: 07:40:00:01:25');
    assert.equal(JZZ.MIDI.smfSMPTE().toString(), 'ff54 -- SMPTE Offset: 00:00:00:00:00');
    assert.equal(JZZ.MIDI.smfSMPTE(7, 40).toString(), 'ff54 -- SMPTE Offset: 07:40:00:00:00');
    assert.equal(JZZ.MIDI.smfSMPTE([7, 40, 30]).toString(), 'ff54 -- SMPTE Offset: 07:40:30:00:00');
  });
  it('smf/TimeSignature', function() {
    var msg = JZZ.MIDI.smf(0x58, '\x03\x02\x18\x08');
    assert.equal(msg.isTimeSignature(), true);
    assert.equal(msg.getTimeSignature()[0], 3);
    assert.equal(msg.getTimeSignature()[1], 4);
    assert.equal(msg.toString(), 'ff58 -- Time Signature: 3/4 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature('\x03\x02\x18\x08').toString(), 'ff58 -- Time Signature: 3/4 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature('7/8').toString(), 'ff58 -- Time Signature: 7/8 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature('7/8', 24, 8).toString(), 'ff58 -- Time Signature: 7/8 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature(7, 8).toString(), 'ff58 -- Time Signature: 7/8 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature(7, 8, 24, 8).toString(), 'ff58 -- Time Signature: 7/8 24 8');
    assert.equal(JZZ.MIDI.smfTimeSignature('0/10').toString(), 'ff58 -- Time Signature: 48/32768 49 48');
    assert.equal(JZZ.MIDI.smfTimeSignature(1000, 0).toString(), 'ff58 -- Time Signature: 49/65536 48 48');
    function err(a, b, c, d) {
      try {
        JZZ.MIDI.smfTimeSignature(a, b, c, d);
      }
      catch (e) {
        return e.message;
      }
    }
    assert.equal(err('0/4'), 'Wrong time signature: 0/4');
    assert.equal(err(0, 4), 'Wrong time signature: 0/4');
    assert.equal(err('1/0'), 'Wrong time signature: 1/0');
    assert.equal(err(1, 0), 'Wrong time signature: 1/0');
    assert.equal(err(3, 5), 'Wrong time signature: 3/5');
    assert.equal(err('3/5'), 'Wrong time signature: 3/5');
    assert.equal(err(256, 4), 'Wrong time signature: 256/4');
    assert.equal(err(-3, -4), 'Wrong time signature: -3/-4');
    assert.equal(err('МИДИ'), 'Bad MIDI value: М');
    assert.equal(err(), 'Wrong time signature: undefined');
  });
  it('smf/KeySignature', function() {
    var msg = JZZ.MIDI.smf(0x59, '\xfb\x01');
    assert.equal(msg.isKeySignature(), true);
    assert.equal(msg.getKeySignature()[0], -5);
    assert.equal(msg.getKeySignature()[1], 'Bb');
    assert.equal(msg.getKeySignature()[2], true);
    assert.equal(msg.toString(), 'ff59 -- Key Signature: Bb min');
    assert.equal(JZZ.MIDI.smf(0x59, '\xfb\x02').toString(), 'ff59 -- Key Signature: invalid');
    assert.equal(JZZ.MIDI.smfKeySignature('\xfb\x01').toString(), 'ff59 -- Key Signature: Bb min');
    assert.equal(JZZ.MIDI.smfKeySignature('a# moll').toString(), 'ff59 -- Key Signature: A# min');
    assert.equal(JZZ.MIDI.smfKeySignature('Eb major').toString(), 'ff59 -- Key Signature: Eb');
    assert.equal(JZZ.MIDI.smfKeySignature('C').toString(), 'ff59 -- Key Signature: C');
    assert.throws(function() { JZZ.MIDI.smfKeySignature('b#m'); });
    assert.throws(function() { JZZ.MIDI.smfKeySignature('МИДИ'); });
  });
  it('smf/Sequencer', function() {
    assert.equal(JZZ.MIDI.smf(0x7f).toString(), 'ff7f -- Sequencer Specific');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x0a\x0b\x0c').toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfSequencer('\x0a\x0b\x0c').toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
    assert.equal(JZZ.MIDI.smfSequencer([0xa, 0xb, 0xc]).toString(), 'ff7f -- Sequencer Specific: 0a 0b 0c');
  });
  it('smf/XF Version', function() {
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x00\x58\x46\x30\x32\x00\x00').toString(), 'ff7f -- [XF:00] Version: XF02 00 00');
  });
  it('smf/XF Chord', function() {
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x01\x33\x0a\x33\x0a').toString(), 'ff7f -- [XF:01] Chord: Em7');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x01\x27\x13\x27\x13').toString(), 'ff7f -- [XF:01] Chord: Bb7');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x01\x26\x00\x27\x13').toString(), 'ff7f -- [XF:01] Chord: Ab');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x01\x44\x23\x44\x23').toString(), 'ff7f -- [XF:01] Chord: F#?');
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x01\x00\x00\x00\x00').toString(), 'ff7f -- [XF:01] Chord: -');
  });
  it('smf/XF Song Data Number', function() {
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x7f\x01\x02\x03\x04\x05\x06\x07\x08\x01\x02').toString(), 'ff7f -- [XF:7f] XG Song Data Number: 01 02 03 04 05 06 07 08 01 02');
  });
  it('smf/XF Unknown', function() {
    assert.equal(JZZ.MIDI.smf(0x7f, '\x43\x7b\x7e\x01\x02\x03').toString(), 'ff7f -- [XF:7e]: 01 02 03');
  });
});

describe('SMPTE', function() {
  it('00:00:00:00', function() {
    assert.equal(JZZ.SMPTE().toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(24, 0, 0, 0, 0).toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(25, 0, 0, 0, 0).toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(29.97, 0, 0, 0, 0).toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(30, 0, 0, 0, 0).toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(30, 0, 0, 0, 28).setType(25).toString(), '00:00:00:24');
    assert.throws(function() { JZZ.SMPTE(31, 0, 0, 0, 0); });
    assert.throws(function() { JZZ.SMPTE(30, 24, 0, 0, 0); });
    assert.throws(function() { JZZ.SMPTE(30, 0, 60, 0, 0); });
    assert.throws(function() { JZZ.SMPTE(30, 0, 0, 60, 0); });
    assert.throws(function() { JZZ.SMPTE(30, 0, 0, 0, 30); });
    assert.throws(function() { JZZ.SMPTE(30, 0, 0, 0, 0, 8); });
  });
  it('00:01:00:02', function() {
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 10, 0, 0)).toString(), '00:10:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 0)).toString(), '00:01:00:02');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 1)).toString(), '00:01:00:02');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 2)).toString(), '00:01:00:02');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 3)).toString(), '00:01:00:03');
  });
  it('isFullFrame', function() {
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(24, 0, 0, 0, 0, 0)).isFullFrame(), true);
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(24, 0, 0, 0, 0, 1)).isFullFrame(), false);
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(24, 0, 0, 0, 0, 4)).isFullFrame(), true);
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(24, 0, 0, 0, 0, 5)).isFullFrame(), false);
  });
  it('increase quarter frame', function() {
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 0)).incrQF().toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 3)).incrQF().toString(), '00:00:00:01');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 5)).incrQF().toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 7)).incrQF().toString(), '00:00:00:01');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 29, 3)).incrQF().toString(), '00:00:01:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 59, 29, 3)).incrQF().toString(), '00:01:00:02');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 59, 59, 29, 3)).incrQF().toString(), '01:00:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 23, 59, 59, 29, 3)).incrQF().toString(), '00:00:00:00');
  });
  it('decrease quarter frame', function() {
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 0)).decrQF().toString(), '23:59:59:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 2)).decrQF().toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 4)).decrQF().toString(), '23:59:59:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 0, 6)).decrQF().toString(), '00:00:00:00');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 1, 0, 0, 0)).decrQF().toString(), '00:59:59:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 2)).decrQF().toString(), '00:00:59:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 1, 0, 0)).decrQF().toString(), '00:00:59:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 1, 0)).decrQF().toString(), '00:00:00:29');
    assert.equal(JZZ.SMPTE(JZZ.SMPTE(29.97, 0, 0, 0, 2)).decrQF().toString(), '00:00:00:01');
  });
  it('Full Frame SysEx', function() {
    var smpte = JZZ.SMPTE();
    smpte.read([0xf0, 0x7f, 0x7f, 1, 1, 1, 1, 1, 1, 0xf7]);
    assert.equal(smpte.toString(), '01:01:01:01');
    assert.equal(JZZ.MIDI.sxFullFrame(smpte).toString(), 'f0 7f 7f 01 01 01 01 01 01 f7');
  });
  it('master/slave', function() {
    var master = JZZ.SMPTE(24, 7, 39, 59);
    var slave = JZZ.SMPTE();
    for (var n = 0; n < 9; n++) {
      slave.read(JZZ.MIDI.mtc(master));
      master.incrQF();
    }
    assert.equal(slave.read([0x90, 0x40, 0x7f]), false);
    assert.equal(slave.toString(), '07:39:59:02');
  });
  it('master/slave backwards', function() {
    var master = JZZ.SMPTE(24, 7, 39, 59);
    var slave = JZZ.SMPTE();
    for (var n = 0; n < 10; n++) {
      slave.read(JZZ.MIDI.mtc(master));
      master.decrQF();
    }
    assert.equal(slave.toString(), '07:39:58:21');
  });
});

describe('JZZ.lib', function() {
  it('toBase64', function() {
    assert.equal(JZZ.lib.toBase64(''), '');
    assert.equal(JZZ.lib.toBase64('M'), 'TQ==');
    assert.equal(JZZ.lib.toBase64('MI'), 'TUk=');
    assert.equal(JZZ.lib.toBase64('MID'), 'TUlE');
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
  it('connect', function(done) {
    var port1 = JZZ.Widget({ _receive: function(msg) { this._emit(msg); done(); }});
    var port2 = JZZ.Widget();
    var port3 = JZZ.Widget();
    port1.connect(port2);
    port2.connect(port3);
    port3.connect(port1);
    port2.noteOn(0, 'C5', 127);
  });
  it('port', function(done) {
    var sample = new test.Sample(done, [
      [0xff], [0xc0, 1], [],
      [0xf0, 0x7f, 0x7f, 4, 4, 0, 0x40, 0xf7],
      [0xf0, 0x7f, 0x7f, 4, 3, 0, 0x40, 0xf7],
      [0x90, 0x3c, 0x7f], [0x80, 0x3c, 0x7f],
      [0xb0, 0, 0], [0xb0, 0x20, 1]
    ]);
    var port = JZZ.Widget({ _receive: function(msg) { sample.compare(msg); }});
    port.reset().program(0, 1).smfEndOfTrack().sxMasterTuningA(440).noteOn(0, 'C5').noteOff(0, 'C5', 127).bank(0, 1);
  });
  it('ch', function(done) {
    var sample = new test.Sample(done, [
      [0xc1, 1], [0x91, 0x3c, 0x7f], [0x82, 0x3c, 0x7f], [0xff],
      [0xb3, 0, 0], [0xb3, 0x20, 1],
      [0xf1, 0x04], [0xf1, 0x04],
      [0x90, 0x3c, 0x7f], [0x99, 0, 1], [0x80, 0x3c, 0x40],
      [0x95, 0x3c, 0x7f], [0x85, 0x3c, 0x40], [0x95, 0, 1]
    ]);
    var port = JZZ.Widget({ _receive: function(msg) { sample.compare(msg); }});
    port.ch(1).program(1).noteOn('C5').ch(2).noteOff('C5', 127).ch(3).reset().bank(1);
    port.ch(4).mtc(JZZ.SMPTE(30, 1, 2, 3, 4)).ch().mtc(JZZ.SMPTE(30, 1, 2, 3, 4));
    port.note(0, 'B#4', 127, 1).note(9, 0, 1).ch(5).wait(10).note('Dbb5', 127, 1).wait(10).note(0, 1).disconnect().close();
  });
  it('sxId', function(done) {
    var sample = new test.Sample(done, [
      [0xf0, 0x7f, 0x11, 0x04, 0x04, 0x00, 0x40, 0xf7], [0xf0, 0x7f, 0x11, 0x04, 0x03, 0x00, 0x40, 0xf7],
      [0xf0, 0x7f, 0x7f, 0x04, 0x04, 0x00, 0x40, 0xf7], [0xf0, 0x7f, 0x7f, 0x04, 0x03, 0x00, 0x40, 0xf7]
    ]);
    var dummy = function() {};
    var port = JZZ.Widget({ _receive: function(msg) { sample.compare(msg); }});
    port.sxId(17).wait(1).sxMasterTuningA(440).sxId().sxId(127).sxMasterTuningA(440).disconnect().disconnect(dummy).close();
  });
  it('mpe', function(done) {
    var sample = new test.Sample(done, [
      [0xc0, 0x19], [0xb0, 0, 0], [0xb0, 0x20, 0x4f], [0x91, 0x3c, 0x7f],
      [0xc1, 0x19], [0xb1, 0, 0], [0xb1, 0x20, 0x4f],
      [0x92, 0x3e, 0x7f], [0xa2, 0x3e, 0x7f], [0x81, 0x3c, 0x40],
      [0x91, 0x40, 0x7f], [0x93, 0, 1], [0x81, 0x40, 0x40]
    ]);
    var port = JZZ.Widget();
    port.connect(function(msg) { sample.compare(msg); });
    port.mpe(0, 4).program(25).bank(79).noteOn('C5').program('C5', 25).bank('C5', 79, undefined)
      .noteOn('D5').aftertouch('D5', 127).noteOff('C5').note('E5', 127, 1).note(0, 1)
      .mpe(0, 4).mpe(0, 4).mpe(0, 3).mpe(0, 0).mpe();
  });
});

describe('JZZ.Context', function() {
  it('reset', function() {
    var ctxt = JZZ.Context();
    ctxt.noteOn(0, 0, 0).smfText('dummy').reset();
  });
  it('progName 0', function(done) {
    var ctxt = JZZ.Context();
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'c0 00 -- Program Change');
      done();
    });
    ctxt.program(0, 0);
  });
  it('progName 1', function(done) {
    var ctxt = JZZ.Context();
    JZZ.MIDI.programName = function(a, b, c) { return a + ' ' + b  + ' ' + c; };
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'c1 01 -- Program Change (1 undefined undefined)');
      JZZ.MIDI.programName = undefined;
      done();
    });
    ctxt.program(1, 1);
  });
  it('progName 2', function(done) {
    var ctxt = JZZ.Context();
    JZZ.MIDI.programName = function(a, b, c) { return a + ' ' + b  + ' ' + c; };
    ctxt.rpn(1, 2, 3);
    ctxt.bank(1, 2, 3);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'c1 01 -- Program Change (1 2 3)');
      JZZ.MIDI.programName = undefined;
      done();
    });
    ctxt.program(1, 1);
  });
  it('rpn 0', function(done) {
    var ctxt = JZZ.Context();
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 61 00 -- Data Decrement');
      done();
    });
    ctxt.dataDecr(0);
  });
  it('rpn 1', function(done) {
    var ctxt = JZZ.Context();
    ctxt.rpnMSB(0, 0);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 61 00 -- Data Decrement (RPN 00 ??)');
      done();
    });
    ctxt.dataDecr(0);
  });
  it('rpn 2', function(done) {
    var ctxt = JZZ.Context();
    ctxt.rpnLSB(0, 0);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 61 00 -- Data Decrement (RPN ?? 00)');
      done();
    });
    ctxt.dataDecr(0);
  });
  it('rpn 3', function(done) {
    var ctxt = JZZ.Context();
    ctxt.rpn(0, 0, 1);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 26 00 -- Data Entry LSB (RPN 00 01: Channel Fine Tune)');
      done();
    });
    ctxt.dataLSB(0, 0);
  });
  it('rpn 4', function(done) {
    var ctxt = JZZ.Context();
    ctxt.rpnNull(0);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 06 00 -- Data Entry MSB (RPN 7f 7f: NONE)');
      done();
    });
    ctxt.dataMSB(0, 0);
  });
  it('nrpn 1', function(done) {
    var ctxt = JZZ.Context();
    ctxt.nrpnMSB(0, 0);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 61 00 -- Data Decrement (NRPN 00 ??)');
      done();
    });
    ctxt.dataDecr(0);
  });
  it('nrpn 2', function(done) {
    var ctxt = JZZ.Context();
    ctxt.nrpnLSB(0, 0);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 61 00 -- Data Decrement (NRPN ?? 00)');
      done();
    });
    ctxt.dataDecr(0);
  });
  it('nrpn 3', function(done) {
    var ctxt = JZZ.Context();
    ctxt.nrpn(0, 0, 1);
    ctxt.connect(function(msg) {
      assert.equal(msg.toString(), 'b0 26 00 -- Data Entry LSB (NRPN 00 01)');
      done();
    });
    ctxt.dataLSB(0, 0);
  });
  it('GM1', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxGM(1);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 09 01 f7 (GM1 System On)');
    assert.equal(ctxt._gm, '1');
  });
  it('GM2', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxGM(2);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 09 03 f7 (GM2 System On)');
    assert.equal(ctxt._gm, '2');
  });
  it('GM off', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxGM(0);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 09 02 f7 (GM System Off)');
    assert.equal(ctxt._gm, '0');
  });
  it('GS', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxGS();
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 00 7f 00 41 f7 (GS Reset)');
    assert.equal(ctxt._gm, 'R');
    msg = JZZ.MIDI.sxGS(0x40, 0, 0, 0, 0x04, 0, 0);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 00 00 00 04 00 00 3c f7 (GS Master Tuning)');
    msg = JZZ.MIDI.sxGS(0x40, 0, 4, 0x7f);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 00 04 7f 3d f7 (GS Master Volume)');
    msg = JZZ.MIDI.sxGS(0x40, 0, 5, 0x40);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 00 05 40 7b f7 (GS Master Transpose)');
    msg = JZZ.MIDI.sxGS(0x40, 0, 1, 0);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 00 01 00 3f f7 (GS Parameter)');
    msg = JZZ.MIDI.sxGS(0x40, 0x11, 0x15, 0x02);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 11 15 02 18 f7 (GS Drum Part Change)');
    msg = JZZ.MIDI.sxGS(0x40, 0x10, 0x15, 0x00);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 10 15 00 1b f7 (GS Drum Part Change)');
    msg = JZZ.MIDI.sxGS(0x40, 0x12, 0x45, 0x40);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 12 45 40 29 f7 (GS Scale Tuning)');
    msg = JZZ.MIDI.sxGS(0x40, 0x10, 0x16, 0x00);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 40 10 16 00 1a f7 (GS Parameter)');
    msg = JZZ.MIDI.sxGS(0x41, 0x10, 0x15, 0x00);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 7f 42 12 41 10 15 00 1a f7 (GS Parameter)');
  });
  it('XG', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxXG();
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 00 00 7e 00 f7 (XG System On)');
    assert.equal(ctxt._gm, 'Y');
    msg = JZZ.MIDI.sxXG(0, 0, 0, 0x40, 0, 0, 0);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 00 00 00 40 00 00 00 f7 (XG Master Tuning)');
    msg = JZZ.MIDI.sxXG(0, 0, 4, 0x7f);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 00 00 04 7f f7 (XG Master Volume)');
    msg = JZZ.MIDI.sxXG(0, 0, 6, 0x40);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 00 00 06 40 f7 (XG Master Transpose)');
    msg = JZZ.MIDI.sxXG(8, 1, 0x41, 0x40);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 08 01 41 40 f7 (XG Scale Tuning)');
    msg = JZZ.MIDI.sxXG(1, 1, 1, 1);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 10 4c 01 01 01 01 f7 (XG Parameter)');
  });
  it('device id request', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxIdRequest();
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 06 01 f7 (Device ID Request)');
  });
  it('device id response', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7e, 0x10, 0x06, 0x02, 0x41, 0x2b, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 10 06 02 41 2b 02 00 00 00 01 00 00 f7 (Device ID Response)');
  });
  it('master volume', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI.sxMasterVolumeF(1);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 04 01 7f 7f f7 (Master Volume)');
  });
  it('master balance', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x04, 0x02, 0x7f, 0x7f, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 04 02 7f 7f f7 (Master Balance)');
  });
  it('master fine tuning', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x04, 0x03, 0x7f, 0x7f, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 04 03 7f 7f f7 (Master Fine Tuning)');
  });
  it('master coarse tuning', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x04, 0x04, 0x7f, 0x7f, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 04 04 7f 7f f7 (Master Coarse Tuning)');
  });
  it('note/scale tuning', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x08, 0x00, 0x00, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 08 00 00 f7');
    msg = JZZ.MIDI([0xf0, 0x7e, 0x7f, 0x08, 0x00, 0x00, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 08 00 00 f7 (Bulk Tuning Dump Request)');
    msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x08, 0x02, 0x00, 0x01, 0x45, 0x47, 0x00, 0x00, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 08 02 00 01 45 47 00 00 f7 (Note Tuning)');
    msg = JZZ.MIDI([0xf0, 0x7e, 0x7f, 0x08, 0x02, 0x00, 0x01, 0x45, 0x47, 0x00, 0x00, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 7f 08 02 00 01 45 47 00 00 f7');
  });
  it('unknown 04 xx', function() {
    var ctxt = JZZ.Context();
    var msg = JZZ.MIDI([0xf0, 0x7f, 0x7f, 0x04, 0x7f, 0x7f, 0x7f, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 7f 04 7f 7f 7f f7');
  });
  it('etc', function() {
    var msg;
    var ctxt = JZZ.Context();
    msg = JZZ.MIDI([0xf0, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 f7');

    msg = JZZ.MIDI([0xf0, 0x41, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 41 f7');

    msg = JZZ.MIDI([0xf0, 0x43, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 43 f7');

    msg = JZZ.MIDI([0xf0, 0x7e, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e f7');
    msg = JZZ.MIDI([0xf0, 0x7e, 0x00, 0x06, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 00 06 f7');
    msg = JZZ.MIDI([0xf0, 0x7e, 0x00, 0x09, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7e 00 09 f7');

    msg = JZZ.MIDI([0xf0, 0x7f, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f f7');
    msg = JZZ.MIDI([0xf0, 0x7f, 0x00, 0x04, 0xf7]);
    ctxt._receive(msg);
    assert.equal(msg.toString(), 'f0 7f 00 04 f7');
  });
});

describe('Engine: none', function() {
  it('and/or', function() { JZZ().and('').openMidiIn('Non-existing port').or(''); });
  test.engine_name('none', true);
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.dummy_midi_in();
  test.dummy_midi_out();
  test.widget_midi_in();
  test.widget_midi_out();
  test.connect_watcher();
  test.init_web_audio();
  test.web_midi_access_no_sysex();
  test.web_midi_access_sysex();
  test.web_midi_input_no_sysex();
  test.web_midi_input_sysex();
  test.web_midi_output_no_sysex();
  test.web_midi_output_sysex();
  test.close_engine();
});

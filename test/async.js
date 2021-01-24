var assert = require('assert');
var JZZ = require('..');

describe('async calls', function() {
  this.timeout(5000);
  function nop() {}
  var broke = 'We broke it!';
  var notexisting = 'Not existing port';
  var notfound = 'Port "Not existing port" not found';
  var midi_in_name = 'Widget MIDI-In';
  var midi_in_impl = {
    _info: function(name) { return { name: name }; },
    _openIn: function(port, name) {
      port._info = this._info(name);
      port._resume();
    }
  };
  var midi_out_name = 'Widget MIDI-Out';
  var midi_out_impl = {
    _info: function(name) { return { name: name }; },
    _openOut: function(port, name) {
      port._info = this._info(name);
      port._resume();
    }
  };

  it('await JZZ()', async function() {
    await JZZ();
  });

  it('await JZZ() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(); });
    }
    catch (err) {
      msg = err.message;
      JZZ()._repair();
    }
    assert.equal(msg, 'Unknown JZZ error');
  });

  it('await JZZ().or()', async function() {
    await JZZ().or(function() { assert.equal(true, false); });
  });

  it('await JZZ().or() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).or(function() {});
    }
    catch (err) {
      msg = err.message;
      JZZ()._repair();
    }
    assert.equal(msg, broke);
  });

  it('await JZZ().and()', async function() {
    await JZZ().and(function() {});
  });

  it('await JZZ().and() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).and(function() {});
    }
    catch (err) {
      msg = err.message;
      JZZ()._repair();
    }
    assert.equal(msg, broke);
  });

  it('await JZZ().then()', async function() {
    await JZZ().then(nop);
    await JZZ().then(undefined, nop);
  });

  it('await JZZ().then() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).then(nop);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    msg = undefined;
    try {
      await JZZ().then(undefined, nop);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    JZZ()._repair();
  });

  it('await JZZ().wait()', async function() {
    await JZZ().wait(1);
  });

  it('await JZZ().wait() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).wait(1);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    JZZ()._repair();
  });

  it('await JZZ().openMidiIn()', async function() {
    JZZ.lib.registerMidiIn(midi_in_name, midi_in_impl);
    await JZZ().openMidiIn(midi_in_name);
  });

  it('await JZZ().openMidiIn() / throw 1', async function() {
    var msg;
    try {
      var jzz = await JZZ();
      await jzz.openMidiIn(notexisting);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiIn() / throw 2', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).wait(1).openMidiIn(notexisting);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    JZZ()._repair();
  });

  it('await JZZ().openMidiIn().then()', async function() {
    JZZ.lib.registerMidiIn(midi_in_name, midi_in_impl);
    await JZZ().openMidiIn(midi_in_name).then(nop);
  });

  it('await JZZ().openMidiOut()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name);
  });

  it('await JZZ().openMidiOut() / throw 1', async function() {
    var msg;
    try {
      var jzz = await JZZ();
      await jzz.openMidiOut(notexisting);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut() / throw 2', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).wait(1).openMidiOut(notexisting);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    JZZ()._repair();
  });

  it('await JZZ().openMidiOut().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).then(nop);
  });

  it('await JZZ().openMidiOut().noteOn()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).wait(1).noteOn(0, 0x40, 0x7f);
  });

  it('await JZZ().openMidiOut().noteOn() / throw 1', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    var msg;
    try {
      await JZZ().openMidiOut(midi_out_name).wait(1).noteOn(0, 0xff, 0xff);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, 'Bad MIDI value: 255');
  });

  it('await JZZ().openMidiOut().noteOn() / throw 2', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).noteOn(0, 0x40, 0x7f);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut().noteOn().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).noteOn(0, 0x40, 0x7f).then(nop);
  });

  it('await JZZ().openMidiOut().note().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).note(0, 0x40, 0x7f, 1).then(nop);
  });

  it('await JZZ().openMidiOut().data().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).data(0, 1);
    await JZZ().openMidiOut(midi_out_name).data(0, 1).then(nop);
  });

  it('await JZZ().openMidiOut().sxMasterVolume().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).sxMasterVolume(0);
    await JZZ().openMidiOut(midi_out_name).sxMasterVolume(0).then(nop);
  });

  it('await JZZ().openMidiOut().sxMasterTuning().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).sxMasterTuningF(0);
    await JZZ().openMidiOut(midi_out_name).sxMasterTuningF(0).then(nop);
    await JZZ().openMidiOut(midi_out_name).sxMasterTuningA(216).then(nop);
  });

  it('await JZZ().openMidiOut().ch()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).wait(1).ch(0);
  });

  it('await JZZ().openMidiOut().ch() / throw 1', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).ch(0);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });


  it('await JZZ().openMidiOut().ch() / throw 2', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).ch(0).noteOn('C5');
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut().ch().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).ch().then(nop);
    await JZZ().openMidiOut(midi_out_name).ch(0).then();
    await JZZ().openMidiOut(midi_out_name).ch(0).ch().then();
  });

  it('await JZZ().openMidiOut().mpe()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).wait(1).mpe(0, 5);
  });

  it('await JZZ().openMidiOut().mpe() / throw 1', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).mpe(0, 5);
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut().mpe() / throw 2', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).mpe(0, 5).wait(1).noteOn('C5');
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut().mpe().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).mpe().then(nop);
    await JZZ().openMidiOut(midi_out_name).mpe(0, 5).then(nop);
    await JZZ().openMidiOut(midi_out_name).mpe(0, 5).mpe().then(nop);
  });

  it('await JZZ().openMidiOut().close()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).wait(1).close().wait(1);
  });

  it('await JZZ().openMidiOut().close() / throw 1', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    var msg;
    try {
      await JZZ().openMidiOut(midi_out_name).wait(1).close().wait(1).noteOn(0, 'C5', 127);
    }
    catch (err) {
      msg = err.message;
    }
    assert.notEqual(msg, undefined);
  });

  it('await JZZ().openMidiOut().close() / throw 2', async function() {
    var msg;
    try {
      await JZZ().openMidiOut(notexisting).wait(1).close();
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, notfound);
  });

  it('await JZZ().openMidiOut().close().then()', async function() {
    JZZ.lib.registerMidiOut(midi_out_name, midi_out_impl);
    await JZZ().openMidiOut(midi_out_name).close().then(nop);
  });

});

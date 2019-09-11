var assert = require('assert');
var JZZ = require('..');

describe('async calls', function() {
  var broke = 'We broke it!';
  var notexisting = 'Not existing port';
  var notfound = 'Port "Not existing port" not found';

  it('await JZZ()', async function() {
    await JZZ();
  });

  it('await JZZ() / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); });
    }
    catch (err) {
      msg = err.message;
      JZZ()._repair();
    }
    assert.equal(msg, broke);
  });

  it('await JZZ().then(...)', async function() {
    await JZZ().then(function() {});
    await JZZ().then(undefined, function() {});
  });

  it('await JZZ().then(...) / throw', async function() {
    var msg;
    try {
      await JZZ().and(function() { this._break(broke); }).then(function() {});
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    msg = undefined;
    try {
      await JZZ().then(undefined, function() {});
    }
    catch (err) {
      msg = err.message;
    }
    assert.equal(msg, broke);
    JZZ()._repair();
  });

  it('await JZZ().wait(...)', async function() {
    await JZZ().wait(1);
  });

  it('await JZZ().openMidiIn(...)', async function() {
    var name = 'Widget MIDI-In';
    var widget = {
      _info: function(name) { return { name: name }; },
      _openIn: function(port, name) {
        port._info = this._info(name);
        port._resume();
      }
    };
    JZZ.lib.registerMidiIn(name, widget);
    await JZZ().openMidiIn(name);
  });

  it('await JZZ().openMidiIn(...) / throw', async function() {
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

  it('await JZZ().openMidiOut(...)', async function() {
    var name = 'Widget MIDI-Out';
    var widget = {
      _info: function(name) { return { name: name }; },
      _openOut: function(port, name) {
        port._info = this._info(name);
        port._resume();
      }
    };
    JZZ.lib.registerMidiOut(name, widget);
    await JZZ().openMidiOut(name);
  });

  it('await JZZ().openMidiOut(...) / throw', async function() {
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

});

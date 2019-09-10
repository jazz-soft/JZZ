var assert = require('assert');
var JZZ = require('..');

describe('async calls', function() {
  it('await JZZ()', async function() {
    var jzz = await JZZ();
  });
  it('await JZZ().then(...)', async function() {
    await JZZ().then(function() {});
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
    var port = await JZZ().openMidiIn(name);
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
    var port = await JZZ().openMidiOut(name);
  });
});

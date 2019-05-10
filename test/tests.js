var assert = require('assert');
module.exports = function(JZZ, ENGINE, DRIVER) {
  var engine = JZZ({ engine: ENGINE });
  return {

    engine_name: function() {
      it('engine: ' + ENGINE, function(done) {
        engine.wait(0).wait(1).and(function() { // console.log(this.info());
          assert.equal(this.info().engine, ENGINE);
          done();
        });
      });
    },

    native_midi_out: function() {
      if (process.platform == 'win32' || process.platform == 'darwin') {
        it('Default MIDI-Out', function(done) {
          engine.openMidiOut().and(function() { this.close(); done(); });
        });
      }
      if (process.platform == 'win32') {
        it('Microsoft GS Wavetable Synth', function(done) {
          engine.openMidiOut('Microsoft GS Wavetable Synth').and(function() { this.close(); done(); });
        });
        it('/Microsoft/', function(done) {
          engine.openMidiOut(/Microsoft/).and(function() { this.close(); done(); });
        });
      }
      if (process.platform == 'darwin') {
        it('Apple DLS Synth', function(done) {
          engine.openMidiOut('Apple DLS Synth').and(function() { this.close(); done(); });
        });
        it('/Apple/', function(done) {
          engine.openMidiOut(/Apple/).and(function() { this.close(); done(); });
        });
      }
    },

    non_existent_midi_in: function() {
      it('Non-existent MIDI-In', function(done) {
        engine.openMidiIn('Non-existing port').or(function() { done(); });
      });
    },

    non_existent_midi_out: function() {
      it('Non-existent MIDI-Out', function(done) {
        engine.openMidiOut('Non-existing port').or(function() { done(); });
      });
    },

    dummy_midi_in: function() {
      it('Dummy MIDI-In', function(done) {
        JZZ.lib.registerMidiIn('Dummy MIDI-In', {
          _info: function(name) { return { name: name }; },
          _openIn: function(port, name) {
            port._info = this._info(name);
            port._resume();
          }
        });
        engine.openMidiIn('Dummy MIDI-In').connect(function(msg) { done(); }).emit([0x90, 0x40, 0x7f]);
      });
    },

    dummy_midi_out: function() {
      it('Dummy MIDI-Out', function(done) {
        JZZ.lib.registerMidiOut('Dummy MIDI-Out', {
          _info: function(name) { return { name: name }; },
          _openOut: function(port, name) {
            port._info = this._info(name);
            port._receive = function(msg) { done(); };
            port._resume();
          }
        });
        engine.openMidiOut('Dummy MIDI-Out').and(function() { this.noteOn(0, 60); });
      });
    },

    virtual_midi_in: function() {
      it('Virtual MIDI-In', function(done) {
        var src = DRIVER.MidiSrc('Virtual MIDI-In');
        src.connect();
        engine.openMidiIn('Virtual MIDI-In').and(function() { this.close(); src.disconnect(); done(); });
      });
    },

    virtual_midi_out: function() {
      it('Virtual MIDI-Out', function(done) {
        var port;
        var dst = DRIVER.MidiDst('Virtual MIDI-Out');
        dst.connect();
        dst.receive = function(msg) {
          port.close();
          dst.disconnect();
          done();
        };
        port = engine.openMidiOut('Virtual MIDI-Out').and(function() { this.noteOn(0, 60, 127); });
      });
    },

  };
};

var assert = require('assert');
module.exports = function(JZZ, PARAMS, DRIVER) {
  var engine = JZZ(PARAMS);
  return {

    Sample: function(done, list) {
      this.done = done;
      this.list = list.slice();
      this.count = 0;
      this.compare = function(msg) {
        if (this.count < this.list.length) assert.equal(msg.slice().toString(), this.list[this.count].toString());
        this.count++;
        if (this.count == this.list.length) this.done();
      };
    },

    engine_name: function(name, sysex) {
      it('engine: ' + name, function(done) {
        engine.wait(0).wait(1).and(function() { // console.log(this.info());
          assert.equal(this.info().engine, name);
          assert.equal(this.info().sysex, sysex);
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

    widget_midi_in: function() {
      it('Widget MIDI-In', function(done) {
        var port1, port2;
        var widget = {
          _info: function(name) { return { name: name }; },
          _openIn: function(port, name) {
            port._info = this._info(name);
            port._resume();
          }
        };
        port1 = JZZ.lib.openMidiIn('Widget MIDI-In', widget);
        JZZ.lib.registerMidiIn('Widget MIDI-In', widget);
        JZZ.lib.registerMidiIn('Widget MIDI-In', widget);
        port2 = engine.openMidiIn('Widget MIDI-In');
        port1.connect(function() {
          port1.disconnect().close();
          port2.disconnect(port1).close();
          done();
        });
        port2.connect(port1);
        port2.emit([0x90, 0x40, 0x7f]);
      });
    },

    widget_midi_out: function() {
      it('Widget MIDI-Out', function(done) {
        var port1, port2;
        var widget1 = {
          _info: function(name) { return { name: name }; },
          _openOut: function(port, name) {
            port._info = this._info(name);
            port._receive = function() {
              port1.disconnect().close();
              port2.disconnect(port1).close();
              done();
            };
            port._resume();
          }
        };
        var widget2 = {
          _info: function(name) { return { name: name }; },
          _openOut: function(port, name) {
            port._info = this._info(name);
            port._resume();
          }
        };
        port1 = JZZ.lib.openMidiOut('Widget MIDI-Out', widget1);
        JZZ.lib.registerMidiOut('Widget MIDI-Out', widget2);
        JZZ.lib.registerMidiOut('Widget MIDI-Out', widget2); // should ignore second call
        port2 = engine.openMidiOut('Widget MIDI-Out');
        port2.connect(port1);
        port2.and(function() { this.noteOn(0, 60); });
      });
    },

    connect_watcher: function() {
      it('Connection watcher', function() {
        var dummy = function() {};
        engine.refresh().onChange().connect(dummy);
        engine.refresh().onChange().connect(function() {});
        engine.refresh().onChange().disconnect(dummy);
        engine.refresh().onChange().disconnect();
        engine.refresh().onChange().connect(function() {});
        engine.refresh().onChange().disconnect();
      });
    },

    virtual_midi_in: function() {
      it('Virtual MIDI-In', function(done) {
        var port;
        var src = DRIVER.MidiSrc('Virtual MIDI-In');
        src.connect();
        port = engine.openMidiIn('Virtual MIDI-In').and(function() { setTimeout(function() { src.emit([0x90, 0x40, 0x7f]); }, 0); });
        port.connect(function() { port.disconnect().close(); src.disconnect(); done(); });
      });
    },

    virtual_midi_out: function() {
      it('Virtual MIDI-Out', function(done) {
        var port;
        var dst = DRIVER.MidiDst('Virtual MIDI-Out');
        dst.connect();
        dst.receive = function() {
          port.disconnect().close();
          dst.disconnect();
          done();
        };
        port = engine.openMidiOut('Virtual MIDI-Out');
        port.and(function() { this.noteOn(0, 60, 127); });
      });
    },

    add_midi_in: function() {
      it('Add MIDI-In', function(done) {
        var name = 'Virtual MIDI-In to add';
        var src = DRIVER.MidiSrc(name);
        engine.refresh().onChange(function(arg) {
          assert.equal(arg.inputs.added[0].name, name);
          engine.onChange().disconnect();
          src.disconnect();
          done();
        });
        engine.refresh().and(function() {
          src.connect();
        });
      });
    },

    add_midi_out: function() {
      it('Add MIDI-Out', function(done) {
        var name = 'Virtual MIDI-Out to add';
        var dst = DRIVER.MidiDst(name);
        engine.refresh().onChange(function(arg) {
          assert.equal(arg.outputs.added[0].name, name);
          engine.onChange().disconnect();
          dst.disconnect();
          done();
        });
        engine.refresh().and(function() {
          dst.connect();
        });
      });
    },

    remove_midi_in: function() {
      it('Remove MIDI-In', function(done) {
        var name = 'Virtual MIDI-In to remove';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        engine.refresh().onChange(function(arg) {
          assert.equal(arg.inputs.removed[0].name, name);
          engine.onChange().disconnect();
          done();
        });
        engine.refresh().and(function() {
          src.disconnect();
        });
      });
    },

    remove_midi_out: function() {
      it('Remove MIDI-Out', function(done) {
        var name = 'Virtual MIDI-Out to remove';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        engine.refresh().onChange().connect(function(arg) {
          assert.equal(arg.outputs.removed[0].name, name);
          engine.onChange().disconnect();
          done();
        });
        engine.refresh().and(function() {
          dst.disconnect();
        });
      });
    },

    web_midi_access: function() {
      it('requestMIDIAccess', function(done) {
        function onSuccess(/*midiaccess*/) { done(); }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.requestMIDIAccess().then(onSuccess, onFail);
      });
    },

    close_engine: function() {
      it('Close engine', function() {
        engine.refresh().close();
      });
    }

  };
};

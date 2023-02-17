var assert = require('assert');

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

module.exports = function(JZZ, PARAMS, DRIVER) {
  var engine = JZZ(PARAMS);
  return {

    Sample: Sample,

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

    dummy_midi_in: function() {
      it('Dummy MIDI-In', function(done) {
        var port1, port2;
        var widget = {
          _info: function(name) { return { name: name }; },
          _openIn: function(port, name) {
            port._info = this._info(name);
            port._resume();
          }
        };
        port1 = JZZ.lib.openMidiIn('Dummy MIDI-In', widget);
        JZZ.lib.registerMidiIn('Dummy MIDI-In', widget);
        JZZ.lib.registerMidiIn('Dummy MIDI-In', widget);
        port2 = engine.openMidiIn('Dummy MIDI-In');
        port1.connect(function() {
          port1.disconnect().close();
          port2.disconnect(port1).close();
          done();
        });
        port2.connect(port1);
        port2.emit([0x90, 0x40, 0x7f]);
      });
    },

    dummy_midi_out: function() {
      it('Dummy MIDI-Out', function(done) {
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
        port1 = JZZ.lib.openMidiOut('Dummy MIDI-Out', widget1);
        JZZ.lib.registerMidiOut('Dummy MIDI-Out', widget2);
        JZZ.lib.registerMidiOut('Dummy MIDI-Out', widget2); // should ignore second call
        port2 = engine.openMidiOut('Dummy MIDI-Out');
        port2.connect(port1);
        port2.and(function() { assert.equal(this.connected(), 1); this.send([]); this.rpn(0, 0).ch(1).rpn(0); this.noteOn(0, 60); });
      });
    },

    widget_midi_in: function() {
      it('Widget MIDI-In', function(done) {
        var port1, port2;
        var widget1 = JZZ.Widget({ _info: { type: 'widget', manufacturer: 'jazz-soft', version: '1.0' } });
        var widget2 = JZZ.Widget();
        JZZ.addMidiIn('Widget MIDI-In 1', widget1);
        JZZ.addMidiIn('Widget MIDI-In 1', widget2);
        JZZ.addMidiIn('Widget MIDI-In 2', widget2);
        port1 = engine.openMidiIn('Widget MIDI-In 1');
        port2 = engine.openMidiIn('Widget MIDI-In 2');
        port1.connect(function() {
          port1.disconnect().close();
          port2.disconnect(port1).close();
          done();
        });
        port2.connect(widget1);
        widget2.send([0x90, 0x40, 0x7f]);
      });
    },

    widget_midi_out: function() {
      it('Widget MIDI-Out', function(done) {
        var port1, port2;
        var widget1 = JZZ.Widget({ _info: { type: 'widget', manufacturer: 'jazz-soft', version: '1.0' } });
        var widget2 = JZZ.Widget();
        JZZ.addMidiOut('Widget MIDI-Out 1', widget1);
        JZZ.addMidiOut('Widget MIDI-Out 1', widget2);
        JZZ.addMidiOut('Widget MIDI-Out 2', widget2);
        port1 = engine.openMidiOut('Widget MIDI-Out 1');
        port2 = engine.openMidiOut('Widget MIDI-Out 2');
        widget1._receive = function(/*msg*/) {
          port1.disconnect().close();
          port2.disconnect(port1).close();
          done();
        };
        widget2.connect(port1);
        port2.send([0x90, 0x40, 0x7f]);
      });
    },

    mask_midi_in: function() {
      it('Mask MIDI-In', function(done) {
        var port;
        var widget = JZZ.Widget();
        JZZ.addMidiIn('Widget MIDI-In', widget);
        JZZ.maskMidiIn('Widget MIDI-In');
        JZZ.maskMidiIn('Widget MIDI-In');
        engine.openMidiIn('Widget MIDI-In').or(function() { done(); });
      });
    },

    mask_midi_out: function() {
      it('Mask MIDI-In', function(done) {
        var port;
        var widget = JZZ.Widget();
        JZZ.addMidiOut('Widget MIDI-Out', widget);
        JZZ.maskMidiOut('Widget MIDI-Out');
        JZZ.maskMidiOut('Widget MIDI-Out');
        engine.openMidiOut('Widget MIDI-Out').or(function() { done(); });
      });
    },

    unmask_midi_in: function() {
      it('Unmask MIDI-In', function(done) {
        var port;
        var widget = JZZ.Widget();
        JZZ.addMidiIn('Widget MIDI-In', widget);
        JZZ.unmaskMidiIn('Widget MIDI-In');
        JZZ.maskMidiIn('Widget MIDI-In');
        JZZ.unmaskMidiIn('Widget MIDI-In');
        engine.openMidiIn('Widget MIDI-In').and(function() { done(); });
      });
    },

    unmask_midi_out: function() {
      it('Unmask MIDI-In', function(done) {
        var port;
        var widget = JZZ.Widget();
        JZZ.addMidiOut('Widget MIDI-Out', widget);
        JZZ.unmaskMidiOut('Widget MIDI-Out');
        JZZ.maskMidiOut('Widget MIDI-Out');
        JZZ.unmaskMidiOut('Widget MIDI-Out');
        engine.openMidiOut('Widget MIDI-Out').and(function() { done(); });
      });
    },

    connect_watcher: function() {
      it('Connection watcher', function() {
        var dummy = function() {};
        engine.refresh().onChange().connect(dummy);
        engine.refresh().onChange().connect(dummy);
        engine.refresh().onChange().connect(function() {});
        engine.refresh().onChange().disconnect(dummy);
        engine.refresh().onChange().disconnect(dummy);
        engine.refresh().onChange().disconnect();
        engine.refresh().onChange().connect(function() {});
        engine.refresh().onChange().disconnect();
        engine.refresh().onChange().refresh();
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
        var name1 = 'Virtual MIDI-Out 1';
        var name2 = 'Virtual MIDI-Out 2';
        var port1, port2;
        var dst1 = DRIVER.MidiDst(name1);
        var dst2 = DRIVER.MidiDst(name2);
        dst1.connect();
        dst2.connect();
        dst2.receive = function() {
          port1.disconnect().close();
          port2.disconnect().close();
          dst1.disconnect();
          dst2.disconnect();
          done();
        };
        port1 = engine.openMidiOut(name1);
        port2 = engine.openMidiOut(name2);
        port2.and(function() { this.send([]); this.noteOn(0, 60, 127); });
      });
    },

    virtual_midi_in_busy: function() {
      it('Virtual MIDI-In busy', function(done) {
        var name = 'Virtual MIDI-In busy';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        src.busy = true;
        engine.openMidiIn(name).or(function() { src.disconnect(); done(); });
      });
    },

    virtual_midi_out_busy: function() {
      it('Virtual MIDI-Out busy', function(done) {
        var name = 'Virtual MIDI-In busy';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        dst.busy = true;
        engine.openMidiOut(name).or(function() { dst.disconnect(); done(); });
      });
    },

    clone_midi_in: function() {
      it('Clone MIDI-In', function(done) {
        var port1, port2;
        var name = 'Virtual MIDI-In clone';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        port1 = engine.openMidiIn(name);
        port2 = engine.openMidiIn(name);
        assert.notEqual(port1, port2);
        var count = 3;
        function onmidi(/*msg*/) {
          count--;
          if (!count) {
            port2.close();
            src.disconnect();
            done();
          }
        }
        port1.connect(onmidi);
        port2.connect(onmidi);
        setTimeout(function() {
          src.emit([0x90, 0x40, 0x7f]);
          setTimeout(function() {
            port1.close();
            src.emit([0x80, 0x40, 0x7f]);
          }, 10);
        }, 10);
      });
    },

    clone_midi_out: function() {
      it('Clone MIDI-Out', function(done) {
        var port1, port2;
        var name = 'Virtual MIDI-Out clone';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        port1 = engine.openMidiOut(name);
        port2 = engine.openMidiOut(name);
        assert.notEqual(port1, port2);
        var count = 3;
        dst.receive = function(/*msg*/) {
          count--;
          if (!count) {
            port2.close();
            dst.disconnect();
            done();
          }
        };
        setTimeout(function() {
          port1.send([0x90, 0x40, 0x7f]);
          port2.send([0x90, 0x50, 0x7f]);
          setTimeout(function() {
            port1.close();
            port2.send([0x80, 0x50, 0x7f]);
          }, 10);
        }, 10);
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

    init_web_audio: function() {
      it('Init Web Audio', function() {
        JZZ.lib.getAudioContext();
        if (typeof window != 'undefined' && window.dispatchEvent) window.dispatchEvent({ name: 'keydown' });
      });
    },

    web_midi_access_no_sysex: function() {
      it('requestMIDIAccess no sysex', function(done) {
        function onSuccess(midiaccess) { assert.equal(midiaccess.sysexEnabled, false); done(); }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.requestMIDIAccess().then(onSuccess, onFail);
      });
    },

    web_midi_access_sysex: function() {
      it('requestMIDIAccess sysex', function(done) {
        function onSuccess(midiaccess) { assert.equal(midiaccess.sysexEnabled, true); done(); }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.requestMIDIAccess({ sysex: true }).then(onSuccess, onFail);
      });
    },

    web_midi_access_sysex_fail: function() {
      it('requestMIDIAccess sysex must fail', function(done) {
        function onSuccess(/*midiaccess*/) { console.log('Must fail!'); }
        function onFail(/*err*/) { done(); }
        JZZ.requestMIDIAccess({ sysex: true }).then(onSuccess, onFail);
      });
    },

    web_midi_input_no_sysex: function() {
      it('MIDIInput no sysex', function(done) {
        var name = 'Widget MIDI-In no sysex';
        var myport;
        var widget = {
          _info: function(name) { return { name: name }; },
          _openIn: function(port, name) {
            myport = port;
            port._info = this._info(name);
            port._resume();
          }
        };
        function onSuccess(midi) {
          var inputs = midi.inputs;
          var dummy = inputs.size;
          assert.equal(dummy > 0, true);
          dummy = inputs.keys();
          dummy = inputs.values();
          dummy = inputs.entries();
          inputs.forEach(function(p) {
            if (p.name == name) {
              var sample = new Sample(function() { p.open(); p.close(); p.close().then(function() { done(); }); }, [[0x90, 0x40, 0x7f]]);
              assert.equal(p.type, 'input');
              assert.equal(p.state, 'connected');
              assert.equal(p.connection, 'closed');
              assert.equal(midi.inputs.has(p.id), true);
              p.onmidimessage = function(msg) {
                sample.compare(msg.data);
              };
              setTimeout(function() {
                myport.emit([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7, 0x90, 0x40, 0x7f]);
              }, 0);
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.lib.registerMidiIn(name, widget);
        JZZ.requestMIDIAccess().then(onSuccess, onFail);
      });
    },

    web_midi_input_sysex: function() {
      it('MIDIInput sysex', function(done) {
        var name = 'Widget MIDI-In sysex';
        var myport;
        var widget = {
          _info: function(name) { return { name: name }; },
          _openIn: function(port, name) {
            myport = port;
            port._info = this._info(name);
            port._resume();
          }
        };
        function onSuccess(midi) {
          midi.inputs.forEach(function(p) {
            if (p.name == name) {
              var sample = new Sample(done, [[0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7], [0x90, 0x40, 0x7f]]);
              p.open();
              p.open(); // test multiple open()
              p.onmidimessage = function(msg) {
                sample.compare(msg.data);
              };
              p.open().then(function(port) { assert.equal(port.connection, 'open'); }, function(err) { throw err; });
              setTimeout(function() {
                myport.emit([0xf0, 0x7e, 0x7f]);
                myport.emit([0x06, 0x01]);
                myport.emit([0xf7, 0x90]);
                myport.emit([0x40, 0x7f]);
              }, 0);
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.lib.registerMidiIn(name, widget);
        JZZ.requestMIDIAccess({ sysex: true }).then(onSuccess, onFail);
      });
    },

    web_midi_output_no_sysex: function() {
      it('MIDIOutput no sysex', function(done) {
        var name = 'Widget MIDI-Out no sysex';
        var myport;
        var sample = new Sample(function() { myport.open(); myport.close(); myport.close().then(function() { done(); }); }, [
          [0xf8],
          [0xc0, 0x10],
          [0x90, 0x40, 0x7f]
        ]);
        var widget = {
          _info: function(name) { return { name: name }; },
          _openOut: function(port, name) {
            port._info = this._info(name);
            port._resume();
            port.connect(function(msg) {
              sample.compare(msg);
            });
          }
        };
        function onSuccess(midi) {
          midi.outputs.forEach(function(p) {
            if (p.name == name) {
              assert.equal(p.type, 'output');
              assert.equal(p.state, 'connected');
              assert.equal(p.connection, 'closed');
              myport = p;
              var now = JZZ.lib.now();
              assert.throws(function()  { p.send([300]); });
              assert.throws(function()  { p.send([0xf7]); });
              assert.throws(function()  { p.send([0x90, 0x90, 0x00]); });
              assert.throws(function()  { p.send([0x20, 0x20, 0x20]); });
              assert.throws(function()  { p.send([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); });
              p.send([0x90, 0x40, 0x7f], now + 40);
              p.send([0xf8]);
              p.send([0xc0, 0x10], now + 10);
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.lib.registerMidiOut(name, widget);
        JZZ.requestMIDIAccess().then(onSuccess, onFail);
      });
    },

    web_midi_output_sysex: function() {
      it('MIDIOutput sysex', function(done) {
        var name = 'Widget MIDI-Out sysex';
        var sample = new Sample(done, [
          [0x90, 0x40, 0x7f],
          [0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]
        ]);
        var widget = {
          _info: function(name) { return { name: name }; },
          _openOut: function(port, name) {
            port._info = this._info(name);
            port._resume();
            port.connect(function(msg) {
              sample.compare(msg);
            });
          }
        };
        function onSuccess(midi) {
          midi.outputs.forEach(function(p) {
            if (p.name == name) {
              p.open();
              p.open(); // test multiple open()
              p.send([0x90, 0x40, 0x7f]);
              p.send([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]);
              p.open().then(function(port) { assert.equal(port.connection, 'open'); }, function(err) { throw err; });
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        JZZ.lib.registerMidiOut(name, widget);
        JZZ.requestMIDIAccess({ sysex: true }).then(onSuccess, onFail);
      });
    },

    web_midi_input_busy: function() {
      it('MIDIInput busy', function(done) {
        var name = 'MIDIInput busy';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        src.busy = true;
        engine.refresh();
        function onSuccess(midi) {
          midi.inputs.forEach(function(p) {
            if (p.name == name) {
              assert.equal(p.state, 'connected');
              assert.equal(p.connection, 'closed');
              p.open().then(function() {
                console.log('MIDI port should not open!');
              }, function() {
                assert.equal(p.connection, 'closed');
                src.disconnect();
                engine.refresh();
                done();
              });
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_input_connect: function() {
      it('MIDIInput connect', function(done) {
        var name = 'MIDIInput connect';
        var src = DRIVER.MidiSrc(name);
        function onSuccess(midi) {
          midi.onstatechange = function(e) {
            assert.equal(e.port.state, 'connected');
            assert.equal(e.port.connection, 'closed');
            midi.onstatechange = null;
            src.disconnect();
            engine.refresh();
            done();
          };
          setTimeout(function() { src.connect(); }, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_input_disconnect: function() {
      it('MIDIInput disconnect', function(done) {
        var name = 'MIDIInput disconnect';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        engine.refresh();
        function onSuccess(midi) {
          midi.inputs.forEach(function(p) {
            if (p.name == name) {
              assert.equal(p.state, 'connected');
              p.onstatechange = function(e) {
                assert.equal(e.port.state, 'disconnected');
                assert.equal(e.port.connection, 'closed');
                e.port.onmidimessage = null;
                e.port.onstatechange = null;
                done();
              };
            }
          });
          setTimeout(function() { src.disconnect(); }, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_input_reconnect: function() {
      it('MIDIInput reconnect', function(done) {
        var port;
        var access;
        var name = 'MIDIInput reconnect';
        var src = DRIVER.MidiSrc(name);
        src.connect();
        engine.refresh();

        function call0() {
          assert.equal(port.state, 'connected');
          assert.equal(port.connection, 'closed');
          src.disconnect();
          engine.refresh();
          setTimeout(call1, 10);
        }
        function call1() {
          assert.equal(port.state, 'disconnected');
          assert.equal(port.connection, 'closed');
          port.open();
          setTimeout(call2, 10);
        }
        function call2() {
          assert.equal(port.state, 'disconnected');
          assert.equal(port.connection, 'pending');
          var inputs = access.inputs;
          var dummy = inputs.size;
          dummy = inputs.keys();
          dummy = inputs.values();
          dummy = inputs.entries();
          assert.notEqual(typeof dummy, 'undefined');
          assert.equal(inputs.get(port.id), undefined);
          inputs.forEach(function(p) {
            assert.notEqual(p.name, name);
          });
          src.connect();
          engine.refresh();
          setTimeout(call3, 10);
        }
        function call3() {
          assert.equal(port.state, 'connected');
          assert.equal(port.connection, 'open');
          src.disconnect();
          engine.refresh();
        }
        var steps = [['disconnected', 'closed'], ['disconnected', 'pending'], ['connected', 'open'], ['disconnected', 'pending']];
        var step = 0;

        function onSuccess(midi) {
          access = midi;
          midi.inputs.forEach(function(p) {
            if (p.name == name) {
              port = p;
              port.onstatechange = function(e) {
                assert.equal(e.port.state, steps[step][0]);
                assert.equal(e.port.connection, steps[step][1]);
                step++;
                if (step == steps.length) {
                  port.onstatechange = null;
                  port.close();
                  done();
                }
              };
            }
          });
          setTimeout(call0, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_output_busy: function() {
      it('MIDIOutput busy', function(done) {
        var name = 'MIDIOutput busy';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        dst.busy = true;
        engine.refresh();
        function onSuccess(midi) {
          midi.outputs.forEach(function(p) {
            if (p.name == name) {
              assert.equal(p.state, 'connected');
              assert.equal(p.connection, 'closed');
              p.open().then(function() {
                console.log('MIDI port should not open!');
              }, function() {
                assert.equal(p.connection, 'closed');
                dst.disconnect();
                engine.refresh();
                done();
              });
            }
          });
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_output_connect: function() {
      it('MIDIOutput connect', function(done) {
        var name = 'MIDIOutput connect';
        var dst = DRIVER.MidiDst(name);
        function onSuccess(midi) {
          midi.onstatechange = function(e) {
            assert.equal(e.port.state, 'connected');
            assert.equal(e.port.connection, 'closed');
            midi.onstatechange = null;
            dst.disconnect();
            engine.refresh();
            done();
          };
          setTimeout(function() { dst.connect(); }, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_output_disconnect: function() {
      it('MIDIOutput disconnect', function(done) {
        var name = 'MIDIOutput disconnect';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        engine.refresh();
        function onSuccess(midi) {
          midi.outputs.forEach(function(p) {
            if (p.name == name) {
              assert.equal(p.state, 'connected');
              p.onstatechange = function(e) {
                assert.equal(e.port.state, 'disconnected');
                assert.equal(e.port.connection, 'closed');
                e.port.onstatechange = null;
                done();
              };
            }
          });
          setTimeout(function() { dst.disconnect(); }, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    web_midi_output_reconnect: function() {
      it('MIDIOutput reconnect', function(done) {
        var port;
        var name = 'MIDIOutput reconnect';
        var dst = DRIVER.MidiDst(name);
        dst.connect();
        engine.refresh();

        function call0() {
          assert.equal(port.state, 'connected');
          assert.equal(port.connection, 'closed');
          dst.disconnect();
          engine.refresh();
          setTimeout(call1, 10);
        }
        function call1() {
          assert.equal(port.state, 'disconnected');
          assert.equal(port.connection, 'closed');
          assert.throws(function()  { port.send([0x90, 0x40, 0x7f]); });
          assert.equal(port.connection, 'closed');
          port.open();
          setTimeout(call2, 10);
        }
        function call2() {
          assert.equal(port.state, 'disconnected');
          assert.equal(port.connection, 'pending');
          dst.connect();
          engine.refresh();
          setTimeout(call3, 10);
        }
        function call3() {
          assert.equal(port.state, 'connected');
          assert.equal(port.connection, 'open');
          dst.disconnect();
          engine.refresh();
        }
        var steps = [['disconnected', 'closed'], ['disconnected', 'pending'], ['connected', 'open'], ['disconnected', 'pending']];
        var step = 0;

        function onSuccess(midi) {
          midi.outputs.forEach(function(p) {
            if (p.name == name) {
              port = p;
              port.onstatechange = function(e) {
                assert.equal(e.port.state, steps[step][0]);
                assert.equal(e.port.connection, steps[step][1]);
                step++;
                if (step == steps.length) {
                  port.onstatechange = null;
                  port.close();
                  done();
                }
              };
            }
          });
          setTimeout(call0, 10);
        }
        function onFail(err) { console.log('requestMIDIAccess failed!', err); }
        setTimeout(function() { JZZ.requestMIDIAccess().then(onSuccess, onFail); }, 20);
      });
    },

    close_engine: function() {
      it('Close engine', function() {
        engine.refresh().close();
      });
    }
  };
};

//// testing the 'webmidi' engine

global.window = global;
var _startTime = Date.now();
global.performance = { now: function() { return Date.now() - _startTime; } };

var JZZ = require('..');
var WMT = require('web-midi-test');

WMT.sysex = false;
global.navigator = WMT;

var test = require('./tests.js')(JZZ, { engine: 'webmidi', sysex: true, degrade: true }, WMT);

describe('Engine: webmidi', function() {
  test.engine_name('webmidi', false);
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.widget_midi_in();
  test.widget_midi_out();
  test.connect_watcher();
  test.virtual_midi_in();
  test.virtual_midi_out();
  test.virtual_midi_in_busy();
  test.virtual_midi_out_busy();
  test.clone_midi_in();
  test.clone_midi_out();
  test.add_midi_in();
  test.add_midi_out();
  test.remove_midi_in();
  test.remove_midi_out();
  test.init_web_audio();
  test.web_midi_access_no_sysex();
  test.web_midi_access_sysex_fail();
  test.web_midi_input_no_sysex();
  test.web_midi_output_no_sysex();
  test.web_midi_input_busy();
  test.web_midi_input_connect();
  test.web_midi_input_disconnect();
  test.web_midi_input_reconnect();
  test.web_midi_output_busy();
  test.web_midi_output_connect();
  test.web_midi_output_disconnect();
  test.web_midi_output_reconnect();
  test.close_engine();
});

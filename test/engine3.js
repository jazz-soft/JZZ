//// testing the 'webmidi' engine

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
  test.add_midi_in();
  test.add_midi_out();
  test.remove_midi_in();
  test.remove_midi_out();
  test.web_midi_access_no_sysex();
  test.web_midi_access_sysex_fail();
  test.close_engine();
});

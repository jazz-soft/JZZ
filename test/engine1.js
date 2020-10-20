//// testing the 'node'/'plugin' engine

global.navigator = {};

var JZZ = require('..');
var MT;
if (process.platform == 'darwin' || process.platform == 'linux') {
  try {
    MT = require('midi-test');
  }
  catch(err) {
    console.log('midi-test module is disabled in this configuration');
  }
}

global.window = {};
var test = require('./tests.js')(JZZ, undefined, MT);

describe('Engine: node', function() {
  test.engine_name('node', true);
  test.native_midi_out();
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.dummy_midi_in();
  test.dummy_midi_out();
  test.connect_watcher();
  if (MT) {
    test.virtual_midi_in();
    test.virtual_midi_out();
    test.clone_midi_in();
    test.clone_midi_out();
    test.add_midi_in();
    test.add_midi_out();
    test.remove_midi_in();
    test.remove_midi_out();
  }
  test.init_web_audio();
  test.web_midi_access_no_sysex();
  test.web_midi_access_sysex();
  test.web_midi_input_no_sysex();
  test.web_midi_input_sysex();
  test.web_midi_output_no_sysex();
  test.web_midi_output_sysex();
  if (MT) {
    test.web_midi_input_connect();
    test.web_midi_input_disconnect();
    //test.web_midi_input_reconnect();
    test.web_midi_output_connect();
    test.web_midi_output_disconnect();
    //test.web_midi_output_reconnect();
  }
  test.close_engine();
});

//// testing the 'node'/'plugin' engine

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

global.navigator = {};

var test = require('./tests.js')(JZZ, undefined, MT);

describe('Engine: node', function() {
  test.engine_name('node', true);
  test.native_midi_out();
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.widget_midi_in();
  test.widget_midi_out();
  test.connect_watcher();
  if (MT) {
    test.virtual_midi_in();
    test.virtual_midi_out();
    test.add_midi_in();
    test.add_midi_out();
    test.remove_midi_in();
    test.remove_midi_out();
    test.web_midi_access();
  }
  test.web_midi_access_no_sysex();
  test.web_midi_access_sysex();
  test.close_engine();
});

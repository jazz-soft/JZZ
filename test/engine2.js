//// testing 'extension' engine

var assert = require('assert');
var JZZ = require('..');

var DOM = {
  exchange: { innerText: '' },
  Event: function(name) { this.name = name; },
  CustomEvent: function(name, data) { this.name = name; this.data = data; },
  getElementById: function() { return this.exchange; },
  addEventListener: function(name, handle) { this.handle = handle; },
  removeEventListener: function(name, handle) { delete this.handle; },
  dispatchEvent: function(evt) {
    //console.log('dispatchEvent', evt);
    if (!evt.data) {
      this.exchange.innerText += '["version", 0, "99"]\n';
    }
    else {
      var func = evt.data.detail[0];
      if (func == 'refresh') {
        var v = ['refresh', { ins: [], outs: [] }];
        this.exchange.innerText += JSON.stringify(v) + '\n';
      }
      else {
        console.log('function', func, 'not yet implemented!');
      }
    }
    if (this.handle) this.handle();
  }
};
global.document = DOM;
global.Event = DOM.Event;
global.CustomEvent = DOM.CustomEvent;

var test = require('./tests.js')(JZZ, 'extension', DOM);

describe('Engine: extension', function() {
  test.engine_name();
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.dummy_midi_in();
  test.dummy_midi_out();
//  test.virtual_midi_in();
//  test.virtual_midi_out();
});

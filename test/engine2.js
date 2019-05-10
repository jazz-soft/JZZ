//// testing 'extension' engine

var assert = require('assert');
var JZZ = require('..');

var DOM = {
  inArr: [],
  outArr: [],
  inMap: {},
  outMap: {},
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
        for (var k in this.inMap) v[1].ins.push({ name: k });
        for (var k in this.outMap) v[1].outs.push({ name: k });
        this.exchange.innerText += JSON.stringify(v) + '\n';
      }
      else if (func == 'openin') {
        this.inArr[evt.data.detail[1]] = this.inMap[evt.data.detail[2]];
        this.exchange.innerText += JSON.stringify(evt.data.detail) + '\n';
      }
      else if (func == 'openout') {
        this.outArr[evt.data.detail[1]] = this.outMap[evt.data.detail[2]];
        this.exchange.innerText += JSON.stringify(evt.data.detail) + '\n';
      }
      else if (func == 'closein') {
        delete this.inArr[evt.data.detail[1]];
      }
      else if (func == 'closeout') {
        delete this.outArr[evt.data.detail[1]];
      }
      else if (func == 'play') {
        this.outArr[evt.data.detail[1]].receive(evt.data.detail.slice(2));
      }
      else {
        console.log('function', func, 'not yet implemented!');
      }
    }
    if (this.handle) this.handle();
  },
  MidiSrc: function(name) {
    return {
      name: name,
      connect: function() {
        if (!DOM.inMap[name]) DOM.inMap[name] = this;
      },
      disconnect: function() {
        if (DOM.inMap[name]) delete DOM.inMap[name];
      }
    };
  },
  MidiDst: function(name) {
    return {
      name: name,
      connect: function() {
        if (!DOM.outMap[name]) DOM.outMap[name] = this;
      },
      disconnect: function() {
        if (DOM.outMap[name]) delete DOM.outMap[name];
      }
    };
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
  test.virtual_midi_in();
  test.virtual_midi_out();
});

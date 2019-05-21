//// testing the 'extension' engine

var JZZ = require('..');
var WMT = require('web-midi-test');

var DOM = {
  inArr: [],
  outArr: [],
  inMap: {},
  outMap: {},
  handle: {},
  exchange: { innerText: '' },
  Event: function(name) { this.name = name; },
  CustomEvent: function(name, data) { this.name = name; this.data = data; },
  getElementById: function() { return this.exchange; },
  addEventListener: function(name, handle) { this.handle[name] = handle; },
  removeEventListener: function(name /*, handle*/) { delete this.handle[name]; },
  dispatchEvent: function(evt) {
    //console.log('dispatchEvent', evt);
    if (evt.name != 'jazz-midi') {
      if (this.handle[evt.name]) this.handle[evt.name]();
      return;
    }
    if (!evt.data) {
      this.exchange.innerText += '["version", 0, "99"]\n';
    }
    else {
      var func = evt.data.detail[0];
      if (func == 'refresh') {
        var k;
        var v = ['refresh', { ins: [], outs: [] }];
        for (k in this.inMap) v[1].ins.push({ name: k });
        for (k in this.outMap) v[1].outs.push({ name: k });
        this.exchange.innerText += JSON.stringify(v) + '\n';
      }
      else if (func == 'openin') {
        this.inMap[evt.data.detail[2]].pos = evt.data.detail[1];
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
    if (this.handle['jazz-midi-msg']) this.handle['jazz-midi-msg']();
  },
  MidiSrc: function(name) {
    return {
      name: name,
      connect: function() {
        if (!DOM.inMap[name]) DOM.inMap[name] = this;
      },
      disconnect: function() {
        if (DOM.inMap[name]) delete DOM.inMap[name];
      },
      emit: function(msg) {
        DOM.exchange.innerText += JSON.stringify(['midi', this.pos, 0].concat(msg)) + '\n';
        if (DOM.handle) DOM.handle['jazz-midi-msg']();
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
  },
  AudioContext: function() {
    return {
      resume: function() { this.state = 'running'; },
      createOscillator: function() {
        return {
          connect: function() {},
          start: function() {},
          stop: function() {}
        };
      },
      createGainNode: function() {
        return {
          connect: function() {},
          gain: { setTargetAtTime: function() {} }
        };
      }
    };
  },
  body: { appendChild: function() {} },
  createElement: function() {
    return {
      style: {},
    };
  }
};
global.document = DOM;
global.window = DOM;
global.Event = DOM.Event;
global.CustomEvent = DOM.CustomEvent;
WMT.midi = false;
global.navigator = WMT;

var test = require('./tests.js')(JZZ, { engine: ['webmidi', 'plugin', 'extension'] }, DOM);

describe('Engine: extension', function() {
  test.engine_name('extension', true);
  test.non_existent_midi_in();
  test.non_existent_midi_out();
  test.widget_midi_in();
  test.widget_midi_out();
  test.virtual_midi_in();
  test.virtual_midi_out();
  it('Dummy AudioContext', function() { DOM.dispatchEvent({ name: 'keydown' }); });
});

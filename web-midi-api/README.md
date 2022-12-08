# Web MIDI API for Node.js

![nodejs](https://jazz-soft.github.io/img/nodejs.jpg)
![windows](https://jazz-soft.github.io/img/windows.jpg)
![macos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![raspberry pi](https://jazz-soft.github.io/img/rpi.jpg)  
[![npm](https://img.shields.io/npm/v/web-midi-api.svg)](https://www.npmjs.com/package/web-midi-api)
[![npm](https://img.shields.io/npm/dt/web-midi-api.svg)](https://www.npmjs.com/package/web-midi-api)
[![build](https://github.com/jazz-soft/JZZ/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ/actions)
[![Coverage](https://coveralls.io/repos/github/jazz-soft/JZZ/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/JZZ?branch=master)

This package is deprecated and kept here for the old projects compatibility.
It redirects to [**jzz**](https://www.npmjs.com/package/jzz):

```js
// index.js:
module.exports = require('jzz');
```

If you are starting a new project, please consider using
[**jzz**](https://www.npmjs.com/package/jzz) directly.

## Other versions
- [**cwilso/WebMIDIAPIShim**](https://github.com/cwilso/WebMIDIAPIShim) by [**Chris Wilson**](https://github.com/cwilso)
- [**abudaan/WebMIDIAPIShim**](https://github.com/abudaan/WebMIDIAPIShim) by [**Daniel van der Meer**](https://github.com/abudaan)


## Usage

`npm install web-midi-api`
```js
var navigator = require('web-midi-api');
// consider using var navigator = require('jzz');

var midi;
var inputs;
var outputs;

function onMIDIFailure(msg) {
  console.log('Failed to get MIDI access - ' + msg);
  process.exit(1);
}

function onMIDISuccess(midiAccess) {
  midi = midiAccess;
  inputs = midi.inputs;
  outputs = midi.outputs;
  setTimeout(testOutputs, 500);
}

function testOutputs() {
  console.log('Testing MIDI-Out ports...');
  outputs.forEach(function(port) {
    console.log('id:', port.id, 'manufacturer:', port.manufacturer, 'name:', port.name, 'version:', port.version);
    port.open();
    port.send([0x90, 60, 0x7f]);
  });
  setTimeout(stopOutputs, 1000);
}

function stopOutputs() {
  outputs.forEach(function(port) {
    port.send([0x80, 60, 0]);
  });
  testInputs();
}

function onMidiIn(ev) {
  var arr = [];
  for(var i = 0; i < ev.data.length; i++) {
    arr.push((ev.data[i] < 16 ? '0' : '') + ev.data[i].toString(16));
  }
  console.log('MIDI:', arr.join(' '));
}

function testInputs() {
  console.log('Testing MIDI-In ports...');
  inputs.forEach(function(port) {
    console.log('id:', port.id, 'manufacturer:', port.manufacturer, 'name:', port.name, 'version:', port.version);
    port.onmidimessage = onMidiIn;
  });
  setTimeout(stopInputs, 5000);
}

function stopInputs() {
  console.log('Thank you!');
  navigator.close(); // This will close MIDI inputs, otherwise Node.js will wait for MIDI input forever.
  process.exit(0);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
```

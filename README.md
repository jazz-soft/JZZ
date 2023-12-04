# JZZ: MIDI library for Node.js and web-browsers
![nodejs](https://jazz-soft.github.io/img/nodejs.jpg)
![firefox](https://jazz-soft.github.io/img/firefox.jpg)
![chrome](https://jazz-soft.github.io/img/chrome.jpg)
![opera](https://jazz-soft.github.io/img/opera.jpg)
![safari](https://jazz-soft.github.io/img/safari.jpg)
![msie](https://jazz-soft.github.io/img/msie.jpg)
![edge](https://jazz-soft.github.io/img/edgc.jpg)
![windows](https://jazz-soft.github.io/img/windows.jpg)
![macos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![raspberry pi](https://jazz-soft.github.io/img/rpi.jpg)
![ios](https://jazz-soft.github.io/img/ios.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)  
[![npm](https://img.shields.io/npm/v/jzz.svg)](https://www.npmjs.com/package/jzz)
[![npm](https://img.shields.io/npm/dt/jzz.svg)](https://www.npmjs.com/package/jzz)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/jzz/badge)](https://www.jsdelivr.com/package/npm/jzz)
[![build](https://github.com/jazz-soft/JZZ/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ/actions)
[![Coverage](https://coveralls.io/repos/github/jazz-soft/JZZ/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/JZZ?branch=master)
[![Try jzz on RunKit](https://badge.runkitcdn.com/jzz.svg)](https://npm.runkit.com/jzz)

**JZZ.js** allows sending, receiving and playing MIDI messages
in **Node.js** and **all major browsers**
in **Linux**, **MacOS** and **Windows**.
Some features are available on **iOS** and **Android** devices.

**JZZ.js** enables [**Web MIDI API**](https://webaudio.github.io/web-midi-api/)
in **Node.js** and those browsers that don't support it,
and provides additional functionality to make developer's life easier.

For the best user experience, it's *highly RECOMMENDED (though not required)*
to install the latest version of [**Jazz-Plugin**](https://jazz-soft.net)
and browser extensions from [**Chrome Web Store**](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
or [**Mozilla Add-ons**](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi)
or [**Apple App Store**](https://apps.apple.com/us/app/jazz-midi/id1506447231).

## Features
- MIDI In/Out
- User-defined MIDI nodes
- MIDI files
- MPE
- SMPTE
- UMP (MIDI 2.0)
- Additional modules

## Install

`npm install jzz --save`  
or `yarn add jzz`  
or get the full development version and minified scripts from [**Github**](https://github.com/jazz-soft/JZZ)

*Note:* in the (unlikely) case you get into trouble installing the
[**midi-test**](https://www.npmjs.com/package/midi-test) module,
that requires special system configuration,
you can safely remove it from the *devDependencies*
by running `npm remove midi-test --save-dev`.

## Usage

##### Plain HTML

```html
<script src="JZZ.js"></script>
//...
```

##### CDN (jsdelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/jzz"></script>       // the latest version, or
<script src="https://cdn.jsdelivr.net/npm/jzz@1.7.6"></script> // any particular version
//...
```

##### CDN (unpkg)

```html
<script src="https://unpkg.com/jzz"></script>       // the latest version, or
<script src="https://unpkg.com/jzz@1.7.6"></script> // any particular version
//...
```

##### CommonJS

```js
var JZZ = require('jzz');
//...
```

##### TypeScript / ES6

```ts
import { JZZ } from 'jzz';
//...
```

##### AMD

```js
require(['JZZ'], function(JZZ) {
  //...
});
```

## Web MIDI API

##### (Node.js example)

```js
var navigator = require('jzz');
navigator.requestMIDIAccess().then(onSuccess, onFail);
// ...
navigator.close(); // This will close MIDI inputs,
                   // otherwise Node.js will wait for MIDI input forever.
// In browsers the funcion is neither defined nor required.
```

## JZZ API

##### MIDI Output/Input

```js
JZZ().or('Cannot start MIDI engine!')
     .openMidiOut().or('Cannot open MIDI Out port!')
     .wait(500).send([0x90,60,127]) // note on
     .wait(500).send([0x80,60,0]);  // note off
JZZ().openMidiIn().or('Cannot open MIDI In port!')
     .and(function() { console.log('MIDI-In: ', this.name()); })
     .connect(function(msg) { console.log(msg.toString()); })
     .wait(10000).close();
```

##### Connecting MIDI nodes

```js
var input = JZZ().openMidiIn();
var output = JZZ().openMidiOut();
var delay = JZZ.Widget({ _receive: function(msg) { this.wait(500).emit(msg); }});
input.connect(delay);
delay.connect(output);
```

##### Helpers and shortcuts

```js
// All calls below will do the same job:
port.send([0x90, 61, 127]).wait(500).send([0x80, 61, 0]);   // arrays
port.send(0x90, 61, 127).wait(500).send(0x80, 61, 0);       // comma-separated
port.send(0x90, 'C#5', 127).wait(500).send(0x80, 'Db5', 0); // note names
port.noteOn(0, 'C#5', 127).wait(500).noteOff(0, 'B##4');    // helper functions
port.note(0, 'C#5', 127, 500);                              // another shortcut
port.ch(0).noteOn('C#5').wait(500).noteOff('C#5');          // using channels
port.ch(0).note('C#5', 127, 500);                           // using channels
```

##### Asynchronous calls

```js
// in the environments that support async/await:
async function playNote() {
  var midi = await JZZ();
  var port = await midi.openMidiOut();
  await port.noteOn(0, 'C5', 127);
  await port.wait(500);
  await port.noteOff(0, 'C5');
  await port.close();
  console.log('done!');
}
// or:
async function playAnotherNote() {
  var port = await JZZ().openMidiOut();
  await port.noteOn(0, 'C5', 127).wait(500).noteOff(0, 'C5').close();
  console.log('done!');
}
```

##### Virtual MIDI ports

```js
var logger = JZZ.Widget({ _receive: function(msg) { console.log(msg.toString()); }});
JZZ.addMidiOut('Console Logger', logger);

// now it can be used as a port:
var port = JZZ().openMidiOut('Console Logger');
// ...

// substitute the native MIDIAccess
// to make virtual ports visible to the Web MIDI API code:
navigator.requestMIDIAccess = JZZ.requestMIDIAccess;
```

##### Frequency / MIDI conversion

```js
JZZ.MIDI.freq('A5'); // => 440
JZZ.MIDI.freq(69);   // => 440
JZZ.MIDI.freq(69.5); // => 452.8929841231365
// from frequency:
JZZ.MIDI.midi(440);  // => 69
JZZ.MIDI.midi(450);  // => 69.38905773230853
// or from name:
JZZ.MIDI.midi('A5'); // => 69
```

## MIDI 2.0

`MIDI2()` is an adapter that enables MIDI 2.0 in all subsequent chained calls.  
`MIDI1()` returns the operation back to MIDI 1.0.  
Note that the downstream MIDI nodes don't require any special actions to receive and transfer MIDI 2.0 messages:

```js
var first = JZZ.Widget();
var second = JZZ.Widget();
var third = JZZ.Widget();
first.connect(second);
second.connect(third);
third.connect(function (msg) { console.log(msg.toString()); });

first
  .send([0x90, 0x3c, 0x7f])       // 90 3c 7f -- Note On
  .MIDI2()                        // enable MIDI 2.0
  .send([0x20, 0x90, 0x3c, 0x7f]) // 20903c7f -- Note On
  .MIDI1()                        // reset to MIDI 1.0
  .send([0x90, 0x3c, 0x7f])       // 90 3c 7f -- Note On
```

When used with MIDI 2.0, most of MIDI 1.0 helpers require `group` as an additional first parameter  
and produce MIDI 1.0 messages wrapped into UMP packages.  
Most of the new MIDI 2.0 helpers don't have corresponding MIDI 1.0 messages.  
Use `gr()`, `ch()` and `sxId()` calls to set default `group`, `channel` and `SysEx ID` for the subsequent calls.  
`MIDI2()` and `MIDI1()` clear off default `group`, `channel`, `SysEx ID` and `MPE` settings:

```js
first
  .noteOn(5, 'C5', 127)           // 95 3c 7f -- Note On
  .ch(5).noteOn('C5', 127)        // 95 3c 7f -- Note On
  .MIDI2()
  .noteOn(2, 5, 'C5', 127)        // 22953c7f -- Note On
  .gr(2).noteOn(5, 'C5', 127)     // 22953c7f -- Note On
  .ch(5).noteOn('C5', 127)        // 22953c7f -- Note On
  .MIDI2()
  .noteOn(2, 5, 'C5', 127)        // 22953c7f -- Note On
  .ch(5).noteOn(2, 'C5', 127)     // 22953c7f -- Note On
  .MIDI2()
  .umpNoteOn(2, 5, 'C5', 127)     // 42953c00 007f0000 -- Note On
  .gr(2).umpNoteOn(5, 'C5', 127)  // 42953c00 007f0000 -- Note On
  .ch(5).umpNoteOn('C5', 127)     // 42953c00 007f0000 -- Note On
```

More on [MIDI 2.0 support](https://jazz-soft.net/doc/JZZ/jzzmidi2.html)...

## Additional modules
- [**JZZ-midi-SMF**](https://github.com/jazz-soft/JZZ-midi-SMF) - Standard MIDI files: read / write / play
- [**JZZ-midi-GM**](https://github.com/jazz-soft/JZZ-midi-GM) - General MIDI instrument names: MIDI to string / string to MIDI
- [**JZZ-midi-Gear**](https://github.com/jazz-soft/JZZ-midi-Gear) - Retrieve your MIDI device model and manufacturer
- [**JZZ-input-Kbd**](https://github.com/jazz-soft/JZZ-input-Kbd) - Virtual piano controls for your MIDI projects
- [**JZZ-synth-Tiny**](https://github.com/jazz-soft/JZZ-synth-Tiny) - A tiny General MIDI synth implemented with the Web Audio API
- [**JZZ-gui-Select**](https://github.com/jazz-soft/JZZ-gui-Select) - MIDI Input/Output pickers
- [**JZZ-gui-Player**](https://github.com/jazz-soft/JZZ-gui-Player) - MIDI Player - ready for your page
- [**JZZ-gui-Karaoke**](https://github.com/jazz-soft/JZZ-gui-Karaoke) - Karaoke :)
- [**etc...**](https://github.com/jazz-soft/JZZ-modules) - Import third-party solutions into the JZZ framework

## Testing your MIDI application
- [**midi-test**](https://github.com/jazz-soft/midi-test) - Virtual MIDI ports for testing MIDI applications
- [**web-midi-test**](https://github.com/jazz-soft/web-midi-test) - Fake Web MIDI API for testing Web MIDI applications
- [**jazz-midi-headless**](https://github.com/jazz-soft/jazz-midi-headless) - MIDI for headless testing
- [**test-midi-files**](https://github.com/jazz-soft/test-midi-files) - A framework for producing test MIDI files

*Check the [**Getting Started**](https://jazz-soft.net/doc/JZZ) page
and the [**API reference**](https://jazz-soft.net/doc/JZZ/reference.html)
for more information...*

## Thanks for your support!
[![Stargazers for @jazz-soft/JZZ](https://reporoster.com/stars/jazz-soft/JZZ)](https://github.com/jazz-soft/JZZ/stargazers)

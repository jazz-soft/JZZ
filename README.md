# JZZ: Asynchronous MIDI Library

[![nodejs](http://jazz-soft.github.io/img/nodejs.jpg)](https://www.npmjs.com/package/jzz)
[![firefox](http://jazz-soft.github.io/img/firefox.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![chrome](http://jazz-soft.github.io/img/chrome.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![opera](http://jazz-soft.github.io/img/opera.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![safari](http://jazz-soft.github.io/img/safari.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![msie](http://jazz-soft.github.io/img/msie.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![windows](http://jazz-soft.github.io/img/windows.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](http://jazz-soft.net/download/Jazz-Plugin)
[![raspberry pi](http://jazz-soft.github.io/img/rpi.jpg)](https://www.npmjs.com/package/jazz-midi)
[![ios](http://jazz-soft.github.io/img/ios.jpg)](https://github.com/jazz-soft/JZZ-modules)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://github.com/jazz-soft/JZZ-modules)

**JZZ.js** allows sending, receiving and playing MIDI messages
in **Node.js** and **all major browsers**
in **Linux**, **MacOS** and **Windows**.

It requires [**jazz-midi**](https://www.npmjs.com/package/jazz-midi)
or [**Jazz-Plugin**](http://jazz-soft.net),
and uses [**Chrome Web MIDI API**](http://webaudio.github.io/web-midi-api)
and/or [**Web Audio**](https://github.com/jazz-soft/JZZ-modules)
as a fallback.

Limited support is available on **iOS** and **Android** devices.

Node.js module: [**npm install jzz**](https://www.npmjs.com/package/jzz).

Development version and minified scripts are available at [**Github**](https://github.com/jazz-soft/JZZ).

Your questions and comments are welcome [**here**](http://jazz-soft.org).

You can also [**support**](http://jazz-soft.net/donate) this project.

## Usage

##### Node.js

    var JZZ = require('jzz');
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0])
         .and('thank you!');

##### HTML

    <script src="scripts/JZZ.js"></script>
    ...
    <script><!--
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0])
         .and('thank you!');
    --></script>

##### Helpers and shortcuts

All calls below will do the same job:

    port.send([0x90,61,127]).wait(500).send([0x80,61,0]);   // arrays
    port.send(0x90,61,127).wait(500).send(0x80,61,0);       // comma-separated
    port.send(0x90,'C#5',127).wait(500).send(0x80,'Db5',0); // note names
    port.noteOn(0,'C#5',127).wait(500).noteOff(0,'B##4');   // helper functions
    port.note(0,'C#5',127,500);                             // another shortcut

##### MIDI input

    JZZ().openMidiIn().or('MIDI-In:  Cannot open!')
         .and(function(){ console.log('MIDI-In: ', this.name()); })
         .connect(function(msg){console.log(msg.toString());})
         .wait(10000).close();

*Check the [**Getting Started**](http://jazz-soft.net/doc/JZZ) page
and the [**API reference**](http://jazz-soft.net/doc/JZZ/reference.html)
for more information ...*

# JZZ: MIDI library for Node.js and web-browsers

[![nodejs](http://jazz-soft.github.io/img/nodejs.jpg)](https://www.npmjs.com/package/jzz)
[![firefox](http://jazz-soft.github.io/img/firefox.jpg)](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi)
[![chrome](http://jazz-soft.github.io/img/chrome.jpg)](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
[![opera](http://jazz-soft.github.io/img/opera.jpg)](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
[![safari](http://jazz-soft.github.io/img/safari.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![msie](http://jazz-soft.github.io/img/msie.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![macos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![raspberry pi](http://jazz-soft.github.io/img/rpi.jpg)](https://www.npmjs.com/package/jazz-midi)
[![ios](http://jazz-soft.github.io/img/ios.jpg)](https://github.com/jazz-soft/JZZ-modules)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://github.com/jazz-soft/JZZ-modules)

**JZZ.js** allows sending, receiving and playing MIDI messages
in **Node.js** and **all major browsers**
in **Linux**, **MacOS** and **Windows**.
Some features are available on **iOS** and **Android** devices.

**JZZ.js** enables [**Web MIDI API**](http://webaudio.github.io/web-midi-api/)
in **Node.js** and those browsers that don't support it,
and provides additional functionality to make developer's life easier.

For the best user experience, it's *highly RECOMMENDED (though not required)*
to install the latest version of [**Jazz-Plugin**](http://jazz-soft.net)
and browser extensions from [**Chrome Web Store**](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
or [**Mozilla Add-ons**](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi).

## Features
- MIDI In/Out
- User-defined MIDI nodes
- MPE
- SMPTE
- MIDI files
- Additional modules

## Install

[**npm install jzz**](https://www.npmjs.com/package/jzz)  
or **bower install jzz**  
or **yarn add jzz**  
or get the full development version and minified scripts from [**Github**](https://github.com/jazz-soft/JZZ)

## Usage

##### Plain HTML

    <script src="JZZ.js"></script>
    //...

##### CDN

    <script src="https://cdn.jsdelivr.net/npm/jzz"></script>       // the latest version, or
    <script src="https://cdn.jsdelivr.net/npm/jzz@0.4.8"></script> // any particular version
    //...

##### CommonJS (Browserify and Node.js command line applications)

    var JZZ = require('jzz');
    //...

##### AMD

    require(['JZZ'], function(JZZ) {
      //...
    });

## Web MIDI API

##### (Node.js example)

    var navigator = require('jzz');
    navigator.requestMIDIAccess().then(onSuccess, onFail);
    // ...
    navigator.close(); // This will close MIDI inputs,
                       // otherwise Node.js will wait for MIDI input forever.
    // In browser this call is not required, and the function does not exist.

## JZZ API

##### MIDI Output/Input

    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127]) // note on
         .wait(500).send([0x80,60,0]);  // note off
    JZZ().openMidiIn().or('Cannot open MIDI In port!')
         .and(function() { console.log('MIDI-In: ', this.name()); })
         .connect(function(msg) { console.log(msg.toString()); })
         .wait(10000).close();

##### Connecting MIDI nodes

    var input = JZZ().openMidiIn();
    var output = JZZ().openMidiOut();
    var delay = JZZ.Widget({ _receive: function(msg) { this.wait(500).emit(msg); }});
    input.connect(delay);
    delay.connect(output);

##### Helpers and shortcuts

    // All calls below will do the same job:
    port.send([0x90, 61, 127]).wait(500).send([0x80, 61, 0]);   // arrays
    port.send(0x90, 61, 127).wait(500).send(0x80, 61, 0);       // comma-separated
    port.send(0x90, 'C#5', 127).wait(500).send(0x80, 'Db5', 0); // note names
    port.noteOn(0, 'C#5', 127).wait(500).noteOff(0, 'B##4');    // helper functions
    port.note(0, 'C#5', 127, 500);                              // another shortcut
    port.ch(0).noteOn('C#5').wait(500).noteOff('C#5');          // using channels
    port.ch(0).note('C#5', 127, 500);                           // using channels

## Additional modules
- [**JZZ-midi-SMF**](https://github.com/jazz-soft/JZZ-midi-SMF) - Standard MIDI files: read / write / play 
- [**JZZ-midi-GM**](https://github.com/jazz-soft/JZZ-midi-GM) - General MIDI instrument names: MIDI to string / string to MIDI 
- [**JZZ-midi-Gear**](https://github.com/jazz-soft/JZZ-midi-Gear) - Retrieve your MIDI device model and manufacturer
- [**JZZ-input-Kbd**](https://github.com/jazz-soft/JZZ-input-Kbd) - Virtual piano controls for your MIDI projects
- [**JZZ-synth-OSC**](https://github.com/jazz-soft/JZZ-synth-OSC) - A simple Web Audio synth to use when MIDI is not available
- [**etc...**](https://github.com/jazz-soft/JZZ-modules) - Import third-party solutions into the JZZ framework 

*Check the [**Getting Started**](https://jazz-soft.net/doc/JZZ) page
and the [**API reference**](https://jazz-soft.net/doc/JZZ/reference.html)
for more information.  
Your questions and comments are welcome [**here**](https://jazz-soft.org).*

We would really appreciate your [**support**](https://jazz-soft.net/donate)!

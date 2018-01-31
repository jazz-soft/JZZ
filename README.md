# JZZ: Asynchronous MIDI Library

[![nodejs](http://jazz-soft.github.io/img/nodejs.jpg)](https://www.npmjs.com/package/jzz)
[![firefox](http://jazz-soft.github.io/img/firefox.jpg)](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi)
[![chrome](http://jazz-soft.github.io/img/chrome.jpg)](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
[![opera](http://jazz-soft.github.io/img/opera.jpg)](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
[![safari](http://jazz-soft.github.io/img/safari.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![msie](http://jazz-soft.github.io/img/msie.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.net/download/Jazz-Plugin)
[![raspberry pi](http://jazz-soft.github.io/img/rpi.jpg)](https://www.npmjs.com/package/jazz-midi)
[![ios](http://jazz-soft.github.io/img/ios.jpg)](https://github.com/jazz-soft/JZZ-modules)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://github.com/jazz-soft/JZZ-modules)

**JZZ.js** allows sending, receiving and playing MIDI messages
in **Node.js** and **all major browsers**
in **Linux**, **MacOS** and **Windows**.
Some features are available on **iOS** and **Android** devices.

For the best user experience, it's *highly RECOMMENDED (though not required)*
to install the latest version of [**Jazz-Plugin**](http://jazz-soft.net)
and browser extensions from [**Chrome Web Store**](https://chrome.google.com/webstore/detail/jazz-midi/jhdoobfdaejmldnpihidjemjcbpfmbkm)
or [**Mozilla Add-ons**](https://addons.mozilla.org/en-US/firefox/addon/jazz-midi).

## Install

[**npm install jzz**](https://www.npmjs.com/package/jzz)  
or **bower install jzz**  
or **yarn add jzz**  
or get full development version and minified scripts from [**Github**](https://github.com/jazz-soft/JZZ)

## Usage

##### Plain HTML

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

##### CommonJS (Browserify and Node.js command line applications)

    var JZZ = require('jzz');
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0])
         .and('thank you!');

##### AMD

    require(['JZZ'], function(JZZ) {
      JZZ().or('Cannot start MIDI engine!')
           .openMidiOut().or('Cannot open MIDI Out port!')
           .wait(500).send([0x90,60,127])
           .wait(500).send([0x90,64,127])
           .wait(500).send([0x90,67,127])
           .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0])
           .and('thank you!');
    });

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

*Check the [**Getting Started**](https://jazz-soft.net/doc/JZZ) page
and the [**API reference**](https://jazz-soft.net/doc/JZZ/reference.html)
for more information.  
Your questions and comments are welcome [**here**](https://jazz-soft.org).*

We would really appreciate your [**support**](https://jazz-soft.net/donate)!

# JZZ

### Async MIDI made easy!

## Asynchronous MIDI Library.

This library requires [Jazz-Plugin](http://jazz-soft.net)
or [jazz-midi](https://www.npmjs.com/package/jazz-midi)
and uses [Chrome Web MIDI API](http://webaudio.github.io/web-midi-api) as a fallback option.

## Usage

#### HTML

    <script src="scripts/JZZ.js"></script>
    ...
    <script><!--
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(500).send([0x90,72,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0]).send([0x90,72,0])
         .and('thank you!');
    --></script>

#### Node.js

    var JZZ = require('jzz');
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(500).send([0x90,72,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0]).send([0x90,72,0])
         .and('thank you!');

## API
coming soon...
# JZZ: Asynchronous MIDI Library.

This library requires [**Jazz-Plugin**](http://jazz-soft.net)
or [**jazz-midi**](https://www.npmjs.com/package/jazz-midi),
and uses [**Chrome Web MIDI API**](http://webaudio.github.io/web-midi-api) as a fallback.

Current version is rather a preview. It provides only MIDI-Out support.

MIDI-In and other features will be coming gradually.

Node.js module: [**npm install jzz**](https://www.npmjs.com/package/jzz).

Your questions and comments are welcome [**here**](http://jazz-soft.org).

You can also [**support**](http://jazz-soft.net/donate) this project.

## Usage

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

##### Node.js

    var JZZ = require('jzz');
    JZZ().or('Cannot start MIDI engine!')
         .openMidiOut().or('Cannot open MIDI Out port!')
         .wait(500).send([0x90,60,127])
         .wait(500).send([0x90,64,127])
         .wait(500).send([0x90,67,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0])
         .and('thank you!');

##### Helpers and shortcuts

All calls below will do the same job:

    port.send([0x90,61,127]).wait(500).send([0x80,61,0]);   // arrays
    port.send(0x90,61,127).wait(500).send(0x80,61,0);       // comma-separated
    port.send(0x90,'C#5',127).wait(500).send(0x80,'Db5',0); // note names
    port.noteOn(0,'C#5',127).wait(500).noteOff(0,'Db5');    // helper functions
    port.note(0,'C#5',127,500);                             // another shortcut

See more examples [**here**](http://jazz-soft.net/demo)...

# API

## MIDI engine

#### JZZ()
Returns a MIDI engine object (singleton).
Subsequent calls return the same object and ignore arguments.

Syntax: **JZZ(*arg*)**

- *arg* can be empty or an object(map) with the following keys:
  - **sysex** - if *true*, Web MIDI API will be called with the *{sysex:true}* option.
Other MIDI implementations are not as paranoic about the sysex messages and ignore this key.

Example:

    engine = JZZ({sysex:true});
    engine = JZZ();


## MIDI Out port

#### openMidiOut()
Returns the MIDI Out port.

Syntax: **openMidiOut(*arg*)**

- If *arg* is an integer, tries to open the port from the list of available ports by this index.
- If *arg* is a string, tries to open the port by name.
- If *arg* is an array with integer or strings, returns the first port successfully opened by the above rules.
- If *arg* is a function, returning integer, string, or an array, uses the function output as described above.
- If *arg* is a RegExp, returns the first successfully opened port with the matching name.
- If *arg* is empty, returns the first successfully opened port from the whole list.

Example:

    port = engine.openMidiOut(0);
    port = engine.openMidiOut('Microsoft GS Wavetable Synth');
    port = engine.openMidiOut(['Microsoft GS Wavetable Synth', 'Apple DLS Synth', 0]);
    port = engine.openMidiOut(function(){ return [2, 1, 0]; });
    port = engine.openMidiOut(/Yamaha/);
    port = engine.openMidiOut();

#### send()
Sends MIDI message through the port.

Syntax: **send(*arg*);**

- *arg* must be an array representing the message.

Example:

    port.send([0x90,60,127]);


## Common calls

#### or()
Executes if the previous operation on the object failed.

Syntax: **or(*arg*);**

- If *arg* is a function, it will execute in the context of the current object,
otherwise, it will be printed via the *console.log*.

#### and()
Executes when the object is ready.

Syntax: **and(*arg*);**

If *arg* is a function, it will execute in the context of the current object,
otherwise, it will be printed via the *console.log*.

Example:

    engine = JZZ().or('Cannot start MIDI engine!').and('MIDI engine is ready!');


#### wait()
Returns a delayed instance of the current object.

Syntax: **wait(*arg*);**

- *arg* is a delay in microseconds.

Example:

    port.wait(100).send([0x90,60,127])
        .wait(100).send([0x90,64,127])
        .wait(100).send([0x90,67,127]);
     
    port.wait(100).send([0x90,60,127]);
    port.wait(200).send([0x90,64,127]);
    port.wait(300).send([0x90,67,127]);

These two code snippets above will produce equivalent results.


*to be continued...*

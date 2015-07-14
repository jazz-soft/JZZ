**Async MIDI made easy!**

# JZZ: Asynchronous MIDI Library.

This library requires [*Jazz-Plugin*](http://jazz-soft.net)
or [*jazz-midi*](https://www.npmjs.com/package/jazz-midi) module
and uses [*Chrome Web MIDI API*](http://webaudio.github.io/web-midi-api) as a fallback.

Current version is rather a preview. It provides only MIDI-Out support.

MIDI-In and other features will be coming gradually.

Your questions and comments are welcome [*here*](http://jazz-soft.org).


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
         .wait(500).send([0x90,72,127])
         .wait(1000).send([0x90,60,0]).send([0x90,64,0]).send([0x90,67,0]).send([0x90,72,0])
         .and('thank you!');
    --></script>


##### Node.js


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

### MIDI engine

#### JZZ()
- Returns a MIDI engine object (singleton).
Subsequent calls return the same object and ignore arguments.

Syntax: *ZZ(**arg**)*

**arg** can be empty or an object(map) with the following keys:

*sysex:* - if **true**, Web MIDI API will be called with the **{sysex:true}** option.

Other MIDI implementations are not as paranoic about the sysex messages.

Example:
    engine = JZZ();
    engine = JZZ({sysex:true});


### MIDI Out port

#### openMidiOut()
- Returns the MIDI Out port.

Syntax: *openMidiOut(**arg**);*

**arg** can be empty or an object(map) with the following keys:

Example:
    port = engine.openMidiOut();
    port = engine.openMidiOut(0);
    port = engine.openMidiOut('');
    port = engine.openMidiOut(['Microsoft GS Wavetable Synth', 'Apple DLS Synth', 0]);
    port = engine.openMidiOut(/Yamaha/);

#### send()
- Sends MIDI message through the port.

Syntax: *send(**arg**);*

**arg** must be an array representing the message.

Example:
    port.send([0x90,60,127]);


### Common calls

#### or()
- Executes if the previous operation on the object failed.

Syntax: *or(**arg**);*

If **arg** is a Function, it will execute in the context of the current object,
otherwise, it will be printed via **console.log**.

#### and()
- Executes when the object is ready.

Syntax: *and(**arg**);*

If **arg** is a Function, it will execute in the context of the current object,
otherwise, it will be printed via **console.log**.

Example:
    engine = JZZ().or('Cannot start MIDI engine!').and('MIDI engine is ready!');


#### wait()
- Returns a delayed instance of the current object.

Syntax: *wait(**arg**);*

**arg** is a delay in microseconds.

Example:
    port.wait(100).send([0x90,60,127])
        .wait(100).send([0x90,64,127])
        .wait(100).send([0x90,67,127]);
    
    port.wait(100).send([0x90,60,127]);
    port.wait(200).send([0x90,64,127]);nd
    port.wait(300).send([0x90,67,127]);

- these two code snippets will produce the equivalent results.


to be continued...

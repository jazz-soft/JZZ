# JZZ: Asynchronous MIDI Library

![firefox](http://jazz-soft.github.io/img/firefox.jpg)
![chrome](http://jazz-soft.github.io/img/chrome.jpg)
![opera](http://jazz-soft.github.io/img/opera.jpg)
![safari](http://jazz-soft.github.io/img/safari.jpg)
![msie](http://jazz-soft.github.io/img/msie.jpg)
![windows](http://jazz-soft.github.io/img/windows.jpg)
![mocos](http://jazz-soft.github.io/img/macos.jpg)
![linux](http://jazz-soft.github.io/img/linux.jpg)

**JZZ.js** allows sending, receiving and playing MIDI messages
in **Node.js** and **all major browsers**
in **Linux**, **MacOS** and **Windows**.

It requires [**jazz-midi**](https://www.npmjs.com/package/jazz-midi)
or [**Jazz-Plugin**](http://jazz-soft.net),
and uses [**Chrome Web MIDI API**](http://webaudio.github.io/web-midi-api) as a fallback.

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


## MIDI-Out port

#### openMidiOut()
Returns the MIDI-Out port.

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

Syntax: **send(*args*)**

- *args* must be a comma-separated list or an array of bytes.
- string note names are accepted where appropriate (in the *note on* / *note off* / *aftertouch*
MIDI messages).

Example:

    port.send([0x90,'C5',127]);   // middle C

#### close()
Closes the port.

*NOTE:* No other calls except **wait()** and **and()** can be chained to the closed port.

## MIDI-In port

#### openMidiIn()
Returns the MIDI-In port.

Syntax: **openMidiIn(*arg*)** - exactly the same as **openMidiOut(*arg*)** above.

#### close()
Closes the port. See the comment above.

In Node.js applications all MIDI-In ports must be closed for the application could exit.

#### connect()
Add a MIDI event handler or connect the MIDI-Out port.

Syntax: **connect(*arg*)**

- *args* is a MIDI-Out port object or a function, that receives the MIDI message object
and executes in the context of the current MIDI-In object.

Multiple connections are allowed.

Example:

    // Default MIDI-In -> default MIDI-Out
    JZZ().openMidiIn().connect(JZZ().openMidiOpen());

#### disconnect()
Remove the MIDI event handler or disconnect the MIDI-Out port.

Syntax: **disconnect(*arg*)** - same as **connect(*arg*)**.

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

*Check [**here**](http://jazz-soft.net/doc/JZZ) for more information...*

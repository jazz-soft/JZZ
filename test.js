var JZZ = require('.');
var outs;
var ins;

function tryMidiOut() {
  for (var i = 0; i < outs.length; i++) {
    var ff = function(x) {
      return function() {
        console.log('testing MIDI Out:', x);
        JZZ().openMidiOut(x).or('Cannot open ' + x)
          .program(0, 0).noteOn(0,'C5',127)
          .wait(600)
          .noteOff(0,'C5')
          .wait(200)
          .program(0, 8).noteOn(0,'C5',127)
          .wait(600)
          .noteOff(0,'C5')
          .and(function() {
            this.close();
            setTimeout(nextstep, 1600);
          });
      }  
    }(outs[i].name);
    steps.splice(i, 0, ff);
  }
  nextstep();
}

function tryMidiIn() {
  for (var i = 0; i < ins.length; i++) {
    var ff = function(x) {
      return function() {
        console.log('\ntesting MIDI In', x);
        JZZ().openMidiIn(x).or('Cannot open ' + x)
          .connect(function(msg){ console.log(x + ': ' + msg); })
          .wait(3000)
          .and(function() {
            console.log('done');
            this.close();
            setTimeout(nextstep, 500);
          });
      }  
    }(ins[i].name);
    steps.splice(i, 0, ff);
  }
  nextstep();
}

function wait() {
  console.log('\ntimeout...\n');
  setTimeout(nextstep, 1000);
}

var steps = [tryMidiOut, tryMidiIn, wait, tryMidiOut, tryMidiIn];

JZZ().or('Cannot start MIDI engine!').and(function(){
  outs = this.info().outputs;
  ins = this.info().inputs;
  nextstep();
});

function nextstep() {
  if (!steps.length) return;
  steps.splice(0, 1)[0]();
}


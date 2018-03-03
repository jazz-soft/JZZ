var JZZ = require('.');

JZZ().onChange(function(arg){
  console.log(arg);
}).wait(10000).and('done').disconnect();
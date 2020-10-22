//// testing the minified script

var JZZ = require('../minified/JZZ.js');
global.navigator = { requestMIDIAccess: JZZ.requestMIDIAccess };

describe('Minified script', function() {
  it('it works!', function(done) {
    JZZ({ engine: 'webmidi' }).and(done);
  });
});

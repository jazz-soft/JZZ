module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
        all: [ 'javascript/*.js' ]
    },
    uglify: {
      javascript: {
        expand: true,
        cwd: 'javascript',
        src: '*.js',
        dest: 'minified'
      }
    }
  });
  grunt.task.registerTask('version', 'Check version consistency', function() {
    var pkg = grunt.file.readJSON('package.json');
    var JZZ = require('.');
    var ver = JZZ().info().ver;
    if (ver == pkg.version) {
       grunt.log.ok('Version:', ver);
    }
    else {
      grunt.log.error('Version:', ver, '!=', pkg.version);
      return false;
    }
    var i, data, match;
    data = grunt.file.read('README.md').split(/\r?\n/);
    for (i = 0; i < data.length; i++) {
      match = data[i].match(/@(\d+\.\d+\.\d+)/);
      if (match) {
        ver = match[1];
        if (ver == pkg.version) {
           grunt.log.ok('README Version:', ver);
        }
        else {
          grunt.log.error('README Version:', ver, '!=', pkg.version);
          return false;
        }
      }
    }
    data = grunt.file.read('web-midi-api/package.json').split(/\r?\n/);
    for (i = 0; i < data.length; i++) {
      match = data[i].match(/"jzz":\s*"\^(\d+\.\d+\.\d+)"/);
      if (match) {
        ver = match[1];
        if (ver == pkg.version) {
           grunt.log.ok('Web-MIDI-API:', ver);
        }
        else {
          grunt.log.error('Web-MIDI-API:', ver, '!=', pkg.version);
          return false;
        }
      }
    }
  });
  grunt.task.registerTask('ts', 'Check index.d.ts', function() {
    var JZZ = require('.');
    function F1() {}
    JZZ.lib.copyMidiHelpers(F1);
    var M1 = Object.keys(F1.prototype).sort();
    var M1x = Object.keys(JZZ.MIDI.prototype).sort();
    function F2() {}
    JZZ.lib.copyUmpHelpers(F2);
    var M2 = Object.keys(F2.prototype).sort();
    var M2x = Object.keys(JZZ.UMP.prototype).sort();
    var LIB = Object.keys(JZZ.lib).sort();
    var ts = grunt.file.read('index.d.ts').split(/\r?\n/);
    var list = {};
    var current;
    var i, k;
    for (i = 0; i < ts.length; i++) {
      var match = ts[i].match(/namespace\s+(\S+)/);
      if (match) {
        current = {};
        list['namespace ' + match[1]] = current;
        continue;
      }
      match = ts[i].match(/interface\s+(\S+)/);
      if (match) {
        if (match[1] == 'Constructor') continue;
        current = {};
        list['interface ' + match[1]] = current;
        continue;
      }
      match = ts[i].match(/\s+(\S+)\(/);
      if (match) {
        current[match[1]] = true;
      }
    }
    k = 'namespace MIDI';
    for (i = 0; i < M1.length; i++) {
      if (!list[k][M1[i]])
      console.log('missing', k, ':', M1[i]);
    }
    k = 'interface MIDI';
    for (i = 0; i < M1x.length; i++) {
      if (M1x[i][0] == '_') continue;
      if (!list[k][M1x[i]])
      console.log('missing', k, ':', M1x[i]);
    }
    k = 'interface lib';
    for (i = 0; i < LIB.length; i++) {
      if (!list[k][LIB[i]])
      console.log('missing', k, ':', LIB[i]);
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'uglify', 'version']);
};

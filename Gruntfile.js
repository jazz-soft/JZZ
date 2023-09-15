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
    var rdme = grunt.file.read('README.md').split(/\r?\n/);
    for (var i = 0; i < rdme.length; i++) {
      var match = rdme[i].match(/@(\d+\.\d+\.\d+)/);
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
  });
  grunt.task.registerTask('ts', 'Check index.d.ts', function() {
    var JZZ = require('.');
    function F1() {}
    JZZ.lib.copyMidiHelpers(F1);
    var H1 = Object.keys(F1.prototype).sort();
    function F2() {}
    JZZ.lib.copyUmpHelpers(F2);
    var H2 = Object.keys(F2.prototype).sort();
    var ts = grunt.file.read('index.d.ts').split(/\r?\n/);
    var list = {};
    var current;
    var i, j, k;
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
    var M1 = ['namespace MIDI'];
    for (j = 0; j < M1.length; j++) {
      for (k = 0; k < H1.length; k++) {
        if (!list[M1[j]][H1[k]])
        console.log('missing', M1[j], ':', H1[k] );
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'uglify', 'version']);
};

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
        all: [ 'javascript/*.js', 'test/*.js' ]
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
        break;
      }
    }
    if (ver == pkg.version) {
       grunt.log.ok('README Version:', ver);
    }
    else {
      grunt.log.error('README Version:', ver, '!=', pkg.version);
      return false;
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'uglify', 'version']);
};

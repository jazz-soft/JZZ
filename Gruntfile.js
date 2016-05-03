module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      javascript: {
        expand: true,
        cwd: 'jzz/javascript',
        src: '*.js',
        dest: 'javascript'
      }
    },
    uglify: {
      javascript: {
        expand: true,
        cwd: 'jzz/javascript',
        src: '*.js',
        dest: 'minified'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['copy', 'uglify']);
};

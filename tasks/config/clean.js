/**
 * `clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove the files and folders in your Sails app's web root
 * (conventionally a hidden directory called `.tmp/public`).
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-clean
 *
 */
module.exports = function(grunt) {

  grunt.config.set('clean', {
    dev: ['.tmp/public/**'],
    build: ['www'],
    preProd: ['assets/dist'],
    prod: [
        'assets/js/controllers',
        'assets/js/directives',
        'assets/js/services',
        'assets/css/*.css'
      ]
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};

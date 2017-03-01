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
    hash: {
      src: ['./assets/js/**/*.js', './assets/css/*.css'],
      filter: function(filepath) {
        return /\.[\w]{8}\./.test(filepath);
      }
    },
    hashProd: {
      src: ['./assets/js/**/*.js', './assets/css/*.css'],
      filter: function(filepath) {
        return !/\.[\w]{8}\./.test(filepath);
      }
    },
    build: ['www'],
    dist: ['assets/dist']
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
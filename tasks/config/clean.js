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
    dev: 
      {
        src: ['.tmp/public/**', './assets/js/**/*.js', './assets/css/*.css'],
        filter: function(filepath){
          if (filepath.includes('.tmp/public/')) return true;
          if (filepath.includes('sails.io.js')) return false;
          return /\.[\w]*\./.test(filepath);
        }
      }
    ,
    build: ['www'],
    dist: ['assets/dist'],
    prod: [
        'assets/js/**/*.js',
        'assets/css/*.css'
      ]
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
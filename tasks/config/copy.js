/**
 * `copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders from your `assets/` directory into
 * the web root (`.tmp/public`) so they can be served via HTTP,
 * and also for further pre-processing by other Grunt tasks.
 *
 * #### Normal usage (`sails lift`)
 * Copies all directories and files (except CoffeeScript and LESS)
 * from the `assets/` folder into the web root -- conventionally a
 * hidden directory located `.tmp/public`.
 *
 * #### Via the `build` tasklist (`sails www`)
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-copy
 *
 */
module.exports = function (grunt) {

  grunt.config.set('copy', {
    dev: {
      files: [
        {
          expand: true,
          cwd: './assets',
          src: ['**/*.!(coffee|less)'],
          dest: '.tmp/public'
        },
        {
          expand: true,
          flatten: true,
          cwd: './assets',
          src: ['bower_components/summernote/dist/font/**/*'],
          dest: '.tmp/public/min/font'
        },
        {
          expand: true,
          cwd: './assets/js',
          src: ['**/*.js'],
          dest: './assets/js/',
          rename: function(dest, src) {
            var re = /\.[\w]*\./;
            if (!re.test(src)) {
              return dest + src;
            }
            src = src.replace(re, '.');
            if (src == 'app.js') {
              return 'assets/js/app.js';
            }
            if (/Controller/.test(src)) {
              return 'assets/js/controllers/' + src;
            }
            if (/Directive/.test(src)) {
              return 'assets/js/directives/' + src;
            }
            if (/Service/.test(src)) {
              return 'assets/js/services/' + src;
            }
            return dest + src;
          }
        },
        {
          expand: true,
          cwd: './assets/css',
          src: '*.css',
          dest: './assets/css/',
          rename: function(dest, src) {
            var re = /\.[\w]*\./;
            if (!re.test(src)) {
              return dest + src;
            }
            src = src.replace(re, '.');
            return dest + src;
          }
        }
      ]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    },
    prod: {
      files: [
        {
          expand: true,
          cwd: './assets/dist/js',
          src: ['**/*.js'],
          dest: 'assets/js/dist/',
          rename: function (dest, src) {
            if (/app\.[\w]*\.js/g.test(src)) {
              return 'assets/js/' + src;
            }
            if (/Controller\.[\w]*\.js/g.test(src)) {
              return 'assets/js/controllers/' + src;
            }
            if (/Directive\.[\w]*\.js/g.test(src)) {
              return 'assets/js/directives/' + src;
            }
            if (/Service\.[\w]*\.js/g.test(src)) {
              return 'assets/js/services/' + src;
            }
            return dest + src;
          }
        },
        {
          expand: true,
          cwd: './assets/dist/css',
          src: ['*.css'],
          dest: 'assets/css/dist/'
        }
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};

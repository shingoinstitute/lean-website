/**
 * `rev.js`
 */

var rev = require('git-rev');

module.exports = function(grunt) {

	rev.short(function(hash) {
		
		var jsFiles = '.tmp/public/min/production.' + hash + '.min.js';
		var cssFiles = '.tmp/public/min/production.' + hash + '.min.css';

		grunt.config.set('rename', {
			dist: {
				files: {
					jsFiles: '.tmp/public/min/production.min.js',
					cssFiles: '.tmp/public/min/production.min.css'
				}
			}
		});
	});

	grunt.loadNpmTasks('grunt-rename');

}
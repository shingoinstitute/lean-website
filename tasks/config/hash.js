/**
 * `rename.js`
 */

module.exports = function(grunt) {

	grunt.config.set('hash', {
		options: {
			mapping: 'assets/hashManfest.json',
			srcBasePath: '.tmp/',
			destBasePath: '.tmp/',
			flatten: false,
			hashLength: 8,
			hashFunction: function(source, encoding) {
				return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
			}
		},
		js: {
			src: ['.tmp/public/min/**/*.js'],
			dest: '.tmp/public/min/'
		}
	});

	grunt.loadNpmTasks('grunt-hash');

}
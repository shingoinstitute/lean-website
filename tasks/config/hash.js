/**
 * `rename.js`
 */

module.exports = function(grunt) {

	grunt.config.set('hash', {
		options: {
			mapping: 'assets/hashManfest.json',
			srcBasePath: 'assets/',
			destBasePath: 'assets/',
			flatten: false,
			hashLength: 8,
			hashFunction: function(source, encoding) {
				return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
			}
		},
		js: {
			src: 'assets/js/**/*.js',
			dest: 'assets/dist/js'
		},
		css: {
			src: 'assets/css/*.css',
			dest: 'assets/dist/css'
		}
	});

	grunt.loadNpmTasks('grunt-hash');

}
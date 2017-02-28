/**
 * `grunt-hash` config for appending a hash to the end of files to circumvent browser cache issues.
 */

module.exports = function(grunt) {

grunt.config.set('hash', {

	options: {
		mapping: 'assets/AssetsMap.json', //mapping file so your server can serve the right files
		srcBasePath: 'assets/', // the base Path you want to remove from the `key` string in the mapping file
		destBasePath: 'assets/', // the base Path you want to remove from the `value` string in the mapping file
		flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
		hashLength: 8, // hash length, the max value depends on your hash function
		hashFunction: function(source, encoding){ // default is md5
				return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
		}
	},
	js: {
		src: 'assets/js/**/*.js',  //all your js that needs a hash appended to it
		dest: 'assets/dist/js/' //where the new files will be created
	},
	css: {
		src: 'assets/css/*.css',  //all your css that needs a hash appended to it
		dest: 'assets/dist/css/' //where the new files will be created
	}

});

	grunt.loadNpmTasks('grunt-hash');
}
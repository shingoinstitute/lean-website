/**
 * `cleanHashAssets`
 *
 *	@description :: run these grunt tasks prior to lifting in production mode to append a hash to the end of each angularjs filename.
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('cleanHashAssets', [
	  'copy:hashAssets',
	  'clean:hash'
  ]);
};

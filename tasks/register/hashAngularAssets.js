/**
 * `hashAngularAssets`
 *
 *	@description :: run these grunt tasks prior to lifting in production mode to append a hash to the end of each angularjs filename.
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('hashAngularAssets', [
    'compileAssets',
    'hash',
    'clean:hashProd',
    'copy:hashDist',
    'clean:dist'
  ]);
};

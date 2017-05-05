/**
* grunt/pipeline.js
*
* The order in which your css, javascript, and template files should be
* compiled and linked from your views and static HTML files.
*
* (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
* for matching multiple files, and ! in front of an expression to ignore files.)
*
* For more information see:
*   https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
*/


// CSS files to inject in order

var cssFilesToInject = [
'bower_components/bootstrap/dist/css/*.css',
'bower_components/angular-material/angular-material.css',
'bower_components/summernote/dist/summernote.css',
'css/materialize.css',
'css/master.css'
];

var jsFilesToInject = [
// Load sails.io before everything else
'js/dependencies/sails.io.js',

//jquery before bootstrap
'bower_components/jquery/dist/jquery.js',

'bower_components/bootstrap/dist/js/bootstrap.js',
'css/materialize/js/materialize.min.js',
'bower_components/lodash/lodash.js',
'bower_components/summernote/dist/summernote.js',
'bower_components/clipboard/dist/clipboard.min.js',

// Load angular modules
'bower_components/angular/angular.js',
'bower_components/angular-route/angular-route.js',
'bower_components/angular-aria/angular-aria.js',
'bower_components/angular-animate/angular-animate.js',
'bower_components/angular-material/angular-material.js',
'bower_components/angular-messages/angular-messages.js',
'bower_components/underscore/underscore-min.js',
'bower_components/angular-underscore-module/angular-underscore-module.js',
'bower_components/angular-sanitize/angular-sanitize.js',
'bower_components/angular-cookies/angular-cookies.min.js',
'bower_components/trix/dist/trix.js',
'bower_components/angular-trix/dist/angular-trix.js',
'bower_components/moment/moment.js',
'bower_components/angular-moment/angular-moment.js',
'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
'bower_components/angular-summernote/dist/angular-summernote.js',
'bower_components/ngclipboard/dist/ngclipboard.min.js',


// Dependencies like jQuery, or Angular are brought in here
'js/dependencies/**/*.js',

// All of the rest of your client-side js files
// will be injected here in no particular order.
'js/**/*.js'
];

var templateFilesToInject = [
'templates/**/*.html'
];

// Default path for public folder (see documentation for more information)
var tmpPath = '.tmp/public/';

module.exports.cssFilesToInject = cssFilesToInject.map(function(cssPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (cssPath[0] === '!') {
    return require('path').join('!.tmp/public/', cssPath.substr(1));
  }
  return require('path').join('.tmp/public/', cssPath);
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(jsPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (jsPath[0] === '!') {
    return require('path').join('!.tmp/public/', jsPath.substr(1));
  }
  return require('path').join('.tmp/public/', jsPath);
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(tplPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (tplPath[0] === '!') {
    return require('path').join('!assets/', tplPath.substr(1));
  }
  return require('path').join('assets/',tplPath);
});

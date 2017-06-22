/**
* Route Mappings
* (sails.config.routes)
*
* Your routes map URLs to views and controllers.
*
* If Sails receives a URL that doesn't match any of the routes below,
* it will check for matching files (images, scripts, stylesheets, etc.)
* in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
* might match an image file: `/assets/images/foo.jpg`
*
* Finally, if those don't match either, the default 404 handler is triggered.
* See `api/responses/notFound.js` to adjust your app's 404 logic.
*
* Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
* flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
* CoffeeScript for the front-end.
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

module.exports.routes = {
	
	// enable all "cors". CSRF protection is taken care of by the NGINX config on the production server.
	// Allowing CORS on all routes removes unnecessary headaches while proxying requests
	// on the production server.
	'/*': {
		cors: true
	},

	// +-------------+
	// | auth routes |
	// +-------------+
	'/auth/linkedin': 'AuthController.linkedInAuth',
	'/auth/linkedin/callback': 'AuthController.linkedInAuthCallback',
	'/auth/local': 'AuthController.localAuth',
	'/auth/login': 'AuthController.login',
	'PUT /auth/login': 'AuthController.login',
	'/auth/logout': 'AuthController.logout',
	'GET /verifyEmail/:id': 'AuthController.verifyEmail',
	
	// +--------------+
	// | entry routes |
	// +--------------+
	'PUT /entry/upvote/:id': 'EntryController.upvote',
	'PUT /entry/downvote/:id': 'EntryController.downvote',
	'GET /entry/topResults': 'EntryController.topResults',
	
	// +-------------+
	// | user routes |
	// +-------------+
	'/me': 'UserController.me',
	'get /users': 'UserController.find',
	'POST /reset': 'UserController.sendPasswordResetEmail',
	'GET /reset/:id': {
		layout: 'layout',
		controller: 'UserController',
		action: 'reset'
	},
	'GET /reset': {
		view: 'layout'
	},
	'PUT /reset/:id': 'UserController.updatePassword',
	
	// +------------+
	// | dev routes |
	// +------------+
	'DELETE /dev/delete': 'DevController.deleteAll',
	'/dev/test': 'DevController.test'
	
};

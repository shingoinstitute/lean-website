/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var passport = require('passport');

module.exports = function(req, res, next) {
	// return next();
	// var xsrf_header = req.get('X-XSRF-TOKEN');
	// var xsrf_cookie = req.cookies['XSRF-TOKEN'];

	// if (xsrf_header !== xsrf_cookie) {
	// 	return res.status(403).json({ error: 'user not authorized' });
	// }

	passport.authenticate('jwt', function(err, user, info) {
		if (err) {
			return res.status(500).json({ error: err, info: info, user: null });
		}
		if (!user) {
			return res.status(403).json({ error: 'user not authorized', info: info });
		}
		req.user = user;

		return next();
	})(req, res);

};

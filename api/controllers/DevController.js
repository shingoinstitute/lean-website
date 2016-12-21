/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
	linkedinAuth: function(req, res) {
		return res.view('dev/login', {
			layout: 'devLayout'
		});
	},

	linkedinAuthCallback: function(req, res) {
		passport.authenticate('linkedin', {
			failureRedirect: '/login',
			session: false
		})(req, res, function(err, foo, bar) {
			if (err) {
				sails.log.error(err);
				return res.json({
					success: false,
					user: null,
					error: err
				});
			}

			if (req.user) {
				var token = AuthService.createToken(req.user);
				res.cookie('JWT', token);
				res.set('Authorization', 'JWT ' + token);
				sails.log.info('Auth header: ' + res.headers.authorization);
				sails.log.info('Token: ' + token);
			} else {
				sails.log.info('No user in req.');
			}

			return res.view('dev/user', {
				layout: 'devLayout',
				error: err,
				user: foo,
				foo: bar
			});
		});
	},
};

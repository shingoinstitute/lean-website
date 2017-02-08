/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

module.exports = {

	verifyEmail: function (req, res) {
		var uuid = req.param('id');
		var token = req.param('vt'); // verification token

		User.findOne({uuid: uuid}).exec(function(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.status(404).json('E_USER_NOT_FOUND');

			if (!bcrypt.compareSync(token, user.emailVerificationToken)) return res.status(403).json('E_NOT_AUTHORIZED');
			user.verifiedEmail = user.email;
			user.emailVerificationToken = null;
			user.save(function(err) {
				if (err) return res.negotiate(err);
				return res.redirect('/dashboard');
			});
		});
	},

	localAuth: function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if (info) {
				sails.log.info(JSON.stringify(info, null, 2));
			}

			if (err) {
				sails.log.error('/auth/local @callback: ' + err.name + ': ' + err.message);
				return res.status(500).json(err);
			}

			if (!user) {
				sails.log.warn('/auth/local @callback:  User is undefined!');
				return res.status(404).json({error: info.error || 'Error: user not found.'});
			}

			return res.json({
				success: true,
				user: user.toJSON(),
				token: AuthService.createToken(user)
			});
		})(req, res);
	},

	linkedInAuth: function (req, res) {
		passport.authenticate('linkedin')(req, res);
	},

	linkedInAuthCallback: function (req, res) {
		passport.authenticate('linkedin', {
			failureRedirect: '/login',
			session: false
		})(req, res, function (err) {
			if (err) {
				sails.log.error(err);
				return res.status(500).json(err);
			}

			if (!req.user) {
				sails.log.error(new Error('LinkedInAuthCallback missing user object in request...'));
			} else {
				var token = AuthService.createToken(req.user);
				res.cookie('JWT', token);
				res.set('Authorization', 'JWT ' + token);
			}

			return res.redirect('/dashboard');
		});
	},

	login: function (req, res) {
		if (req.user) {
			return res.redirect('/dashboard');
		}
		return res.json('user not logged in.');
	},

	logout: function (req, res) {
		req.logout();
		return res.json('User successfully logged out.');
	},
}

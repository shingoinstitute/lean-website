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
		var uuid = req.param('id'); // user's uuid
		var token = req.param('vt'); // verification token

		User.findOne({ uuid: uuid }).exec(function (err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.status(404).json('E_USER_NOT_FOUND');



			if (!bcrypt.compareSync(token, user.emailVerificationToken)) return res.status(403).json('E_NOT_AUTHORIZED');
			user.verifiedEmail = user.email;
			user.emailVerificationToken = null;
			user.save(function (err) {
				if (err) return res.negotiate(err);
				return res.redirect('/dashboard');
			});
		});
	},

	localAuth: function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				err.info = info || 'an unknown error has occured.';
				err.timestamp = new Date().toDateString() + ', ' + new Date().toLocaleDateString();
				sails.log.error(JSON.stringify(err, null, 3));
				return res.status(500).json({
					error: err.info,
					_error: err
				});
			}

			if (!user) {
				var error = new Error('user is undefined');
				var date = new Date();
				sails.log.warn(JSON.stringify({
					error: {
						message: error.message,
						fileName: "AuthController.js",
						method: "localAuth",
						info: info.error || info,
						timestamp: date.toDateString() + ', ' + date.toLocaleTimeString()
					}
				}, null, 3));
				return res.status(404).json({ error: info.error });
			}

			req.logIn(user, function (err) {
				if (err) return res.negotiate(err);
				return res.json({
					success: true,
					user: user.toJSON(),
					token: AuthService.createToken(user)
				});
			});
		})(req, res);
	},

	linkedInAuth: function (req, res) {
		passport.authenticate('linkedin')(req, res);
	},

	linkedInAuthCallback: function (req, res) {
		passport.authenticate('linkedin', {
			failureRedirect: '/login'
		})(req, res, function (err) {

			if (err) {
				sails.log.error(err);
				return res.negotiate(err);
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
		if (req.user) return res.redirect('/dashboard');
		return res.json('user not logged in.');
	},

	logout: function (req, res) {
		req.logout();
		return res.json('User successfully logged out.');
	}

};

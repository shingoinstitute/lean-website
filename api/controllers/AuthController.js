/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');
var nodemailer = require('nodemailer');

module.exports = {

	verifyEmail: function (req, res) {
		AuthService.verifyToken(req, res)
		.then(function (user) {

			User.findOne({uuid: user.uuid}).exec(function(err, user) {
				if (err) return res.status(500).json(err);

				if (!user) return res.status(404).json('Error: user not found!');
				
				user.verifiedEmail = user.email;
				user.save(function(err) {
					if (err) return res.status(500).json(err);
					return res.json(user.toJSON());
				});

			});
		})
		.catch(function (err) {
			sails.log.error(err);
			return res.status(500).json({error: err});
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
		})(req, res, function (err, foo, bar) {
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

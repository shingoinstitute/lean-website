/**
* @description :: UserController.js
*/

var _ = require('lodash');

module.exports = {

	me: function(req, res) {
		if (!req.user) { return res.status(401).json({error: 'user is not logged in.'}); }
      return res.json(req.user.toJSON());
	},

   create: function (req, res) {
		var newUser = {};
		newUser.email = req.param('email');
		newUser.password = req.param('password');
		newUser.firstname = req.param('firstname');
		newUser.lastname = req.param('lastname');

		if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
			return res.status(403).json('Error: Could not create new account, missing required parameters (must have email, password, firstname, and lastname).');
		}

		User.create(newUser).exec(function (err, user) {
			if (err) return res.status(400).json(err);

			if (Array.isArray(user)) user = user.pop();

			if (sails.config.environment === 'production') {
				EmailService.sendVerificationEmail(user)
				.then(function (info) {
					sails.log.info('Email verification link sent to ' + user.email);
				})
				.catch(function (err) {
					sails.log.error(err);
				});
			}

			return res.json({
				success: true,
				user: user.toJSON(),
				token: AuthService.createToken(user),
				info: typeof info != 'undefined' ? info.response : ''
			});
		});
	},

	/**
	 * Handler for requesting a password reset
	 * 
	 * @description If a resetToken is present, lets request go through to '/reset', otherwise sends an email with a password reset link to the logged in user's primary email address
	 */
	requestPasswordReset: function(req, res) {
		var resetToken = req.param(sails.config.email.resetPasswordTokenParamName);
		if (resetToken && resetToken == req.user.resetPasswordToken && Date.now() > req.user.resetPasswordExpires) {
			return res.json("OK");
		}

		var email = req.param('email');

		if (email) {
			User.findOne({email: email}).exec(function(err, user) {
				if (err) return res.negotiate(err);
				if (!user) return res.status(404).json('user not found');
				return EmailService.sendPasswordResetEmail(user)
			})
			.then(function(info) {
			return res.json(info);
			})
			.catch(function(err) {
				sails.log.error(err);
				return res.negotiate(err);
			});
		} else {
			EmailService.sendPasswordResetEmail(req.user)
			.then(function(info) {
				return res.json(info);
			})
			.catch(function(err) {
				sails.log.error(err);
				return res.negotiate(err);
			});
		}
	},

	/**
	 * Handler for resetting passwords
	 * 
	 * @returns Anything other than HTTP status 200 means an error occured, the user is not authorized, or their token is expired. 
	 */
	resetPassword: function(req, res) {
		var resetToken = req.param(sails.config.email.resetPasswordTokenParamName);
		if (resetToken != req.user.resetPasswordToken) {
			return res.status(403).json('user not authorized!');
		}

		if (Date.now() > req.user.resetPasswordExpires) {
			return res.status(403).json('token invalid or expired.');
		}

		var password = req.param('password');

		if (!password) return res.status(403).json('password not found!');

		req.user.password = password;
		req.user.save(function(err) {
			if (err) {
				sails.log.error(err);
				return res.negotiate(err);
			}
			return res.json(req.user.toJSON());
		});
	}

}

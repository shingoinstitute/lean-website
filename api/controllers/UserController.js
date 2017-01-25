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
	 * Handler for GET "/reset/:id"
	 */
	reset: function(req, res) {
		var uuid = req.param('id');
		var token = req.param(sails.config.email.resetPasswordTokenParamName);

		User.findOne({uuid: uuid}).exec(function(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.status(404).json('user not found');

			if (!AuthService.compareResetToken(token, user)) return res.status(403).json('reset link invalid or expired');
			
			return res.redirect("/reset?id=" + uuid + "&r_jwt=" + token);
		});
	},

	/**
	 * Handler for route POST "/reset", expecting "email" parameter
	 */
	sendPasswordResetEmail: function(req, res) {
		var email = req.param('email');

		if (!email) {
			return res.status(400).json("missing email param");
		}

		EmailService.sendPasswordResetEmail(email)
		.then(function(info) {
			return res.json(info);
		})
		.catch(function(err) {
			sails.log.error(err);
			return res.negotiate(err);
		});

	},

	/**
	 * Handler for PUT "/reset/:id", expects a token parameter to identify the user
	 */
	updatePassword: function(req, res) {
		var uuid = req.param('id');
		var token = req.param('token');
		var password = req.param('password');

		if (!token) {return res.status(403).json('user not authorized!');}
		
		if (!password) return res.status(400).json('missing password parameter');

		User.findOne({uuid: uuid}).exec(function(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.status(404).json('user not found');

			if (!AuthService.compareResetToken(token, user)) return res.status(403).json('reset link invalid or expired');

			user.password = password;
			user.save(function(err) {
				if (err) {
					sails.log.error(err);
					return res.negotiate(err);
				}
				return res.json(user.toJSON());
			});
		});
	}

}

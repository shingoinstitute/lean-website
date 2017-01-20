/**
* @description :: UserController.js
*/

var _ = require('lodash');

module.exports = {

	me: function(req, res) {
		if (!req.user) { return res.status(401).json({error: 'user is not logged in.'}); }
      return res.json(req.user.toJSON());
	},

   findAll: function(req, res) {
      User.find().exec(function(err, users) {
         if (err) { return res.status(500).json(err); }
         if (!users) return res.status(404).json('users not found');

         _.forEach(users, function(user) {
            user = user.toJSON();
         });

			// allow System Admins to get a valid JWT for each user
			if (req.user.role == 'systemAdmin' && sails.config.environment === 'development') {
				_.forEach(users, function(user) {
					user.jwt = AuthService.createToken(user);
				});
			}

         return res.json(users);
      });
   },

	find: function(req, res) {
		User.findOne({uuid: req.param('id')}).exec(function(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.status(404).json('user not found');

			user = user.toJSON();
			if (req.user.role == 'systemAdmin' && sails.config.environment === 'development') {
				user.jwt = AuthService.createToken(user);
			}

			return res.json(user);
		})
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
	 * @description resetPassword :: Handler for user resetting password.
	 * @returns :: Anything other than HTTP status 200 means an error occured, the user is not authorized, or their token is expired. 
	 */
	resetPassword: function(req, res) {

		// If HTTP method is GET, treat request as if the user clicked the reset password link from the password reset email they recieved at their primary email address.
		if (req.method == "GET") {

			AuthService.verifyToken(req, res)
			.then(function(user) {
				if (req.param('JWT') != user.resetPasswordToken) {
					return res.status(403).json('user not authorized!');
				}

				if (Date.now() > user.resetPasswordExpires) {
					return res.status(403).json('token invalid or expired.');
				}

				req.user.resetPasswordToken = null;
				req.user.resetPasswordExpires = null;
				req.user.save(function(err) {
					if (err) sails.log.error(err);
				});

				return res.json(user.toJSON());
			})
			.catch(function(err) {
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

		
	}

}

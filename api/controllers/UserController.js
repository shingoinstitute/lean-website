/**
* @description :: UserController.js
*/

var _ = require('lodash');

module.exports = {

	me: function(req, res) {
		if (!req.user) { return res.status(401).json({error: 'user is not logged in.'}); }
      return res.json(req.user.toJSON());
	},

   users: function(req, res) {
      User.find().exec(function(err, users) {
         if (err) { return res.status(500).json(err); }
         if (!users) return res.status(404).json('users not found');
         _.forEach(users, function(user) {
            user = user.toJSON();
         });
         return res.json(users);
      });
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

}

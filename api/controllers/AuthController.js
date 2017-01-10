/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');

module.exports = {

	createAccount: function(req, res) {
		var newUser = {};
		newUser.email = req.param('email');
		newUser.password = req.param('password');
		newUser.firstname = req.param('firstname');
		newUser.lastname = req.param('lastname');

		if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
			return res.json({
				success: false,
				error: 'Could not create new account, missing required paramaters.'
			});
		}

		User.create(newUser).exec(function(err, user) {
			if (err) return res.json({
				success: false,
				error: err
			});

			return res.json({
				success: true,
				user: user.toJSON(),
				token: AuthService.createToken(user)
			});

		});

	},

	localAuth: function(req, res) {
		passport.authenticate('local', function (err, user, info) {
				if (info) {
					sails.log.info(JSON.stringify(info, null, 2));
				}

				if (err) {
					sails.log.error('/auth/local @callback: ' + err.name + ': ' + err.message);
					return res.json({
						success: false,
						user: false,
						error: err, 
					});
				}

				if (!user) {
					sails.log.warn('/auth/local @callback:  User is undefined!');
					return res.json({
						success: false,
						user: false,
						error: info.error || new Error('user not found.')
					});
				}

				return res.json({
					success: true,
					user: user.toJSON(),
					token: AuthService.createToken(user)
				});
		})(req, res);
	},

   linkedInAuth: function(req, res) {
      passport.authenticate('linkedin')(req, res);
   },

   linkedInAuthCallback: function(req, res) {
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
			} else {
				sails.log.info('user object not found in req object.');
			}

			return res.redirect('/dashboard');
		});
   },

	login: function(req, res) {
		var data = {};
		data.error = 'If you see this message, something probably went wrong logging in.'
		if (req.user) data.user = req.user;
		return res.json(data);
	},

   logout: function(req, res) {
		if (req.user) {
			req.logout();
			return res.json({success: true, message: 'User successfully logged out.'});
		} else {
			req.logout();
			return res.json({success: true, message: 'Logout was attempted, but no user was logged in.'})
		}
   },
}

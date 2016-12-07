/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');

module.exports = {

	signUp: function(req, res) {
		var newUser = {};
		newUser.email = req.param('username');
		newUser.password = req.param('password');
		newUser.firstname = req.param('firstname');
		newUser.lastname = req.param('lastname');

		User.signUp(newUser)
		.then(function(user) {
			return res.json({
				success: true,
				user: user.toJSON()
			});
		})
		.catch(function(err) {
			return res.json({
				success: false,
				error: err
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
					return res.json({error: err, user: null});
				}

				if (!user) {
					sails.log.warn('/auth/local @callback:  User is undefined!');
					return res.json({
						user: null,
						info: info,
						error: err
					});
				}

				return res.json({
					token: AuthService.createToken(user),
					user: user.toJSON()
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
				res.cookie('token', token);
				res.set('Authorization', 'JWT ' + token);
			} else {
				sails.log.info('No user in req.');
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

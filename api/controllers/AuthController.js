/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');

module.exports = {

	signUp: function(req, res) {
		return res.json({});
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
      PassportService.linkedInAuth(req, res);
   },

   linkedInAuthCallback: function(req, res) {
      PassportService.linkedInCallback(req, res, function(err) {
         if (err) {
            sails.log.error('/auth/linkedin @callback: ', err);
            res.json({
               success: false,
               error: err
            });
         }

         req.logIn(req.user, function(err) {
            if (err) {
					sails.log.error('/auth/linkedin @login: ', err);
               return res.json({
                  success: false,
                  error: err
               });
            } else {
					sails.log.info('/auth/linkedin login successful');
               return res.json({
                  success: true,
                  user: req.user
               });
            }
         });
      });
   },

	login: function(req, res) {
		var data = {};
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

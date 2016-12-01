/**
*
*  @description - AuthController.js
*
*/

module.exports = {

	localAuth: function(req, res) {
		PassportService.localAuth(req, res, function(err, user, info) {
			if (info) { sails.log.info(info); }
			if (err) {
				sails.log.error('/auth/local @callback: ', err);
				res.json({error: err, user: null})
			} else {
				req.logIn(user, function(err) {
					if (err) {
						sails.log.error('/auth/local @login: ', err);
						return res.json({
							success: false,
							error: err,
							user: null
						})
					} else {
						sails.log.info('Session: ', req.session);
						sails.log.info('user logged in as ' + req.user.firstname + ' ' + req.user.lastname + '.')
						return res.json({
							success: true,
							user: req.user
						});
					}
				});
			}
		});
	},

	localAuthCallback: function(req, res) {
		if (req.user) {
			return res.json({
				success: true,
				user: req.user
			});
		} else {
			return res.json({
				success: false,
				error: 'user not logged in or login attempt was unsuccessful.'
			});
		}
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

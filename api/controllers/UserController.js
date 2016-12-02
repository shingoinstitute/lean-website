/**
* @description :: UserController.js
*/

module.exports = {

	me: function(req, res) {
		if (req.user) {

			UserPermissions.grantAllPriviledges(req, function(err, user) {
				User.findOne({uuid: req.user.uuid}).exec(function(err, user) {
					if (err) {
						return res.json({error: err});
					}

					if (!user) {
						return res.json(new Error('user not found!').message);
					}

					return res.json({
						success: true,
						user: req.user
					});
				});
			});
		} else {
			// sails.log.debug('@/me-4');
			sails.log.warn('warn: user attempted to access /me without being logged in.')
			res.cookie('tl-message', 'You are not logged in.')
			return res.json({
				success: false,
				error: 'user is not logged in'
			});
		}
	},

	session: function(req, res) {
		if (req.session) return res.json({session: req.session});
		return res.json({session: null})
	},

   users: function(req, res) {
      User.find().exec(function(err, users) {
         if (err) {
            return res.json({
               success: false,
               error: err
            });
         } else {
            return res.json({
               success: true,
               users: users
            });
         }
      });
   },

   createUser: function(req, res) {
      User.findOne({email: req.param('username')}).exec(function(err, user) {
         if (err) return res.json({success: false, error: err});
         if (!user) {
            User.create(user).exec(function(err, user) {
               if (err) return res.json({success: false, error: err});
               return res.json({
                  success: true,
                  user: user
               });
            });
         } else {
            return res.json({
					success: false,
               error: 'username/email is already in use.'
            });
         }
      });
   },

   dashboard: function(req, res) {

   },
}

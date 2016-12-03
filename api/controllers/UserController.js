/**
* @description :: UserController.js
*/

module.exports = {

	me: function(req, res) {
		if (req.user) {
			User.findOne({uuid: req.user.uuid}).exec(function(err, user) {
				if (err) return res.json({error:err});
				if (!user) return res.json({error: 'user not found.'});
				user.role = 'systemAdmin';
				User.updateRole(user, function(err, user) {
					if (err) {
						// sails.log.info('1');
						return res.json({error: err.toString()});
					}

					if (!user) {
						// sails.log.info('2');
						return res.json({error: new Error('permissions not updated.')});
					}

					return res.json({
						success: true,
						user: user,
					});
				});
			});
		} else {
			sails.log.info('user attempted to access /me route without a JWT.');
			res.cookie('tl-message', 'You are not logged in.');
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

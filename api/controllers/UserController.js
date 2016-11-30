/**
* @description :: UserController.js
*/

module.exports = {

	me: function(req, res) {
		if (req.user) {
			return res.json({
				success: true,
				user: req.user
			});
		} else {
			sails.log.warn('warn: user attempted to access /me without being logged in.')
			res.cookie('tl-message', 'You are not logged in.')
			return res.json({
				success: false,
				error: 'user is not logged in'
			});
		}
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

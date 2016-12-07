/**
* @description :: UserController.js
*/

var _ = require('lodash');

module.exports = {

	me: function(req, res) {
		if (req.user) {
			User.findOne({uuid: req.user.uuid}).exec(function(err, user) {
				UserPermissions.findOne({user: user.uuid}).exec(function(err, permissions) {
					if (err) return res.status(500).json({error: err});
					if (!permissions) return res.json({error: 'user permissions not found'});
					var grantedPermissions = [];
					_.forEach(permissions, function(value, key) {
						if (value === true) {
							grantedPermissions.push(key);
						}
					});
					user.permissions = grantedPermissions;
					return res.json({
						success: true,
						user: user
					});
				});
			});
		} else {
			sails.log.info('user attempted to access /me route without JWT.');
			res.cookie('tl-message', 'You are not logged in.');
			return res.json({
				success: false,
				error: 'user is not logged in'
			});
		}
	},

	permissions: function(req, res) {

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

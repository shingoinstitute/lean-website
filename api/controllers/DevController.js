/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
	deleteAll: function (req, res) {

		if (sails.config.environment != 'development') return res.forbidden('This action is only available in a development environment');
		
		User.destroy({}).exec(function(err) {
			if (err) return res.negotiate(err);
			UserPermissions.destroy({}).exec(function(err) {
				if (err) return res.negotiate(err);
				return res.json({
					success: true
				});
			});
		});
	},

	test: function(req, res) {
		if (sails.config.environment != 'development') return res.forbidden('This action is only available in a development environment');

		var id = req.param('id');
		User.findOne({uuid: id}).exec(function(err, user) {
			if (err) return res.json(err);
			if (!user) return res.json('user not found');
			delete user.emailVerificationToken;
			user.save(function(err) {
				if (err) return res.json(err);
				return res.json('SUCCESS');
			});
		});
	}

};

/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require('lodash');

module.exports = {
	deleteAll: function (req, res) {
		var deleteCount = 0;
		User.find().populate('permissions').exec(function (err, users) {

			if (err) return res.json({
				success: false,
				error: JSON.stringify(err)
			});

			users.forEach(function(record) {
				User.destroy({uuid: record.uuid}).exec(function(err) {
					if (err) sails.log.error('', err);
				});
			});
			
			return res.json({
				info: 'deleted ' + users.length + ' records.'
			});

		});
	}
};

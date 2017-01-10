/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require('lodash');
var nodemailer = require('nodemailer');

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
	},

	sendMail: function(req, res) {
		var email = req.param('email') || 'cr.blackburn89@gmail.com';
		sails.hooks.email.send('', {
			recipientName: 'Craig',
			senderName: 'TeachingLEAN'
		}, {
			to: email,
			subject: 'Test Email'
		}, function(err) {
			if (err) return res.json({
				success: false,
				error: err
			});
			return res.json({
				success: true,
				info: 'Message sent to ' + email
			});
		});
	}

};

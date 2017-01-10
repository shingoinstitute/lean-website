/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var crypto = require('crypto-js');

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
		var email = req.param('email');

		if (!email) return res.json({
			success: false,
			info: 'Failed to send message, email address not found.'
		});

		var cipherText = process.env.GMAIL_PWORD;
		var bytes = crypto.AES.decrypt(cipherText, sails.config.cryptoJs.secret);
		var password = bytes.toString(crypto.enc.Utf8);

		var options = {
			service: sails.config.email.service,
			auth: {
				user: sails.config.email.user,
				pass: password
			}
		}

		var transporter = nodemailer.createTransport(options);

		transporter.sendMail(sails.config.email.mailOptions, function(err, info) {
			if (err) return res.json({
				success: false,
				error: err
			});
			return res.json({
				success: true,
				info: 'Message sent: ' + info.response
			});
		});

		// var template = 'testEmail';

		// var data = {
		// 	recipientName: 'Craig',
		// 	senderName: 'TeachingLEAN'
		// }

		// var options = {
		// 	to: email,
		// 	subject: 'Test Email'
		// }

		// function emailCallback(err) {
		// 	if (err) return res.json({
		// 		success: false,
		// 		error: err
		// 	});
		// 	return res.json({
		// 		success: true,
		// 		info: 'Message sent to ' + email
		// 	});
		// }

		// sails.hooks.email.send(template, data, options, emailCallback);
	}

};


var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransporter({
	host: 'outlook.office365.com',
	secureConnection: false,
	port: 587,
	auth: {
		user: sails.config.email.SHINGO_IT_EMAIL || process.env.SHINGO_IT_EMAIL,
		pass: sails.config.email.SHINGO_IT_PWORD || process.env.SHINGO_IT_PWORD
	},
	tls: {
		ciphers: 'SSLv3'
	}
}));

module.exports = {

	/**
	 * @description sendVerificationEmail :: sends verifcation email to user's primary email address
	 * @returns - bluebird promise
	 */
	sendVerificationEmail: function (user) {
		return new Promise(function (next, error) {
			if (!user) return error(new Error('user is undefined.'));

			var recipient = user.email;
			if (!recipient) return error(new Error('user.email is undefined.'));

			var token = AuthService.createToken(user);

			var redirectUrl = sails.config.email.redirectUrl + "?JWT=" + token;

			var mailOptions = {
				from: 'shingo.it@usu.edu',
				to: recipient,
				subject: 'TeachingLEAN.net - email verification',
				html: '<p>Click <a href="' + redirectUrl + '">here</a> to verify your email address for TeachingLEAN.net.</p>'
			}

			transporter.sendMail(mailOptions, function (err, info) {
				if (err) return error(err);
				return next(info);
			});
		});
	}
}

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

transporter.sendMailAsync = Promise.promisify(transporter.sendMail);

module.exports = {

	/**
	 * @description sendVerificationEmail :: sends verifcation email to user's primary email address
	 * @returns - bluebird promise
	 */
	sendVerificationEmail: function (user) {
		if (!user) return error(new Error('user is undefined.'));

		var recipient = user.email;
		if (!recipient) return error(new Error('user.email is undefined.'));

		var token = AuthService.createToken(user);

		var redirectUrl = sails.config.email.emailVerificationURL + "?JWT=" + token;

		var mailOptions = {
			from: 'shingo.it@usu.edu',
			to: recipient,
			subject: 'TeachingLEAN.net - email verification',
			html: '<p>Click <a href="' + redirectUrl + '">here</a> to verify your email address for TeachingLEAN.net.</p>'
		}

		return transporter.sendMailAsync(mailOptions);
	},

	/**
	 * @description sendPasswordResetEmail :: Creates a JSON web token to use as a password reset token, then sends an email to the recipient with the token as a URL parameter
	 * @param {User} user :: waterline user object containing email property and .save() prototype method
	 */
	sendPasswordResetEmail: function(user) {
		var recipient = user.email;

		var token = AuthService.createToken(user);

		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 1000*60*60*24;
		user.save(function(err){
			if (err) sails.log.error(err);
		});

		var redirectUrl = sails.config.email.passwordResetURL + "?" + sails.config.email.resetPasswordTokenParamName + "=" + token;

		var mailOptions = {
			from: 'shingo.it@usu.edu',
			to: recipient,
			subject: 'TeachingLEAN.net - password reset',
			html: '<p>Click <a href="' + redirectUrl + '">here</a> to reset your password.</p>' +
					'<p>Or</p>' +
					'<p>Copy and paste the following link into your browsers url bar.</p>' +
					'<br><br>' +
					'<p>' + redirectUrl + '</p>' +
					'<br><br>' +
					'<p>This link will expire in 24 hours.</p>' +
					'<p>If you didn\'t request this, you\'re probably getting hacked.</p>'
		}

		return transporter.sendMailAsync(mailOptions);
	}

}
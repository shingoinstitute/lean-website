
var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt');

const tokenExpires = sails.config.email.tokenExpires;
const saltRounds = sails.config.email.saltRounds;

var transporter = nodemailer.createTransport(smtpTransporter({
	host: 'outlook.office365.com',
	secureConnection: false,
	port: 587,
	auth: {
		user: process.env.SHINGO_IT_EMAIL || sails.config.email.SHINGO_IT_EMAIL,
		pass: process.env.SHINGO_IT_PWORD || sails.config.email.SHINGO_IT_PWORD
	},
	tls: {
		ciphers: 'SSLv3'
	}
}));

transporter.sendMailAsync = Promise.promisify(transporter.sendMail);

module.exports = {

	/**
	 * @description sendVerificationEmail :: sends verifcation email to user's primary email address
	 */
	sendVerificationEmail: function (user) {
		var token = AuthService.generateBase64Token(user);
		user.emailVerificationToken = bcrypt.hashSync(token, saltRounds);
		user.save(function(err) {
			if (err) sails.log.error(err);
		});

		var redirectUrl = sails.config.email.emailVerificationURL + "/" + user.uuid + "?vt=" + token;

		return transporter.sendMailAsync({
			from: 'shingo.it@usu.edu',
			to: user.email,
			subject: 'TeachingLEAN.net - email verification',
			html: 'Thank you for signing up with TeachingLean.org, we&#39;re excited to see you join the community!' + +
			'<p>Click <a href="' + redirectUrl + '">here</a> to verify your email address for <a href="https://teachinglean.org">teachinglean.org</a>.</p>' +
			'<p>For HTML safe browsers, copy and paste this link into your web browser:</p>' + 
			'<p>' + redirectUrl + '</p>'
		});
	},

	/**
	 * @description sendPasswordResetEmail :: Creates a JSON web token to use as a password reset token, then sends an email to the recipient with the token as a URL parameter
	 * @param {User} user :: waterline user object containing email property and .save() prototype method
	 */
	sendPasswordResetEmail: function(email) {
		return new Promise(function(resolve, reject) {
			User.findOne({email: email}).exec(function(err, user) {
				if (err) return reject(err);
				if (!user) return reject(new Error('user not found'));

				// generate a new token
				AuthService.generateBase64Token(user, function(err, token) {
					if (err) return reject(err);

					user.resetPasswordToken = bcrypt.hashSync(token, saltRounds);
					user.resetPasswordExpires = Date.now() + tokenExpires;
					user.save(function(err){
						if (err) sails.log.error(err);
					});

					var redirectUrl = sails.config.email.passwordResetURL + "/" + user.uuid + "?" + sails.config.email.resetPasswordTokenParamName + "=" + token;

					transporter.sendMailAsync({
						from: 'shingo.it@usu.edu',
						to: user.email,
						subject: 'TeachingLean.org - password reset',
						html: '<style>p {text-align: center;}</style>' +
								'<p>Click <a href="' + redirectUrl + '">here</a> to reset your password.</p>' +
								'<p>Or</p>' +
								'<p>Copy and paste the following link into your browsers url bar.</p>' +
								'<br><br>' +
								'<p>' + redirectUrl + '</p>' +
								'<br><br>' +
								'<p>This link will expire in 12 hours.</p>' +
								'<p>If you didn&#39;t request this, you&#39;re probably getting hacked.</p>'
					});

					return resolve();
				});
			});
		})
		
	}
}
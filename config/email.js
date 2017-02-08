/**
 * @description email.js :: exports env variables used for sending email verification links and password reset links.
 */

module.exports.email = {
	emailVerificationURL: process.env.NODE_ENV == 'production' ? 'https://teachinglean.org/verifyEmail' : 'http://localhost:1337/verifyEmail',
	passwordResetURL: process.env.NODE_ENV == 'production' ? 'https://teachinglean.org/reset' : 'http://localhost:1337/reset',
	resetPasswordTokenParamName: 'token',
	saltRounds: 10,
	tokenExpires: 1000*60*60*12
}
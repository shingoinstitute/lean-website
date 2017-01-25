var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var crypto = require('crypto');

const saltRounds = 10;
const tokenExpires = 1000*60*60*12;

const options = {
	secret: sails.config.passport.jwt.secret,
	issuer: sails.config.passport.jwt.issuer,
	audience: sails.config.passport.jwt.audience,
	algorithm: sails.config.passport.jwt.algorithm,
	expiresInMinutes: sails.config.passport.jwt.maxAge
}

module.exports = {

	/**
	 * Hashes users password to store securely in the DB using bycrypt
	 * 
	 * @param {Object} values - an object containing a password. The plain text password is replaced by the hashed password.
	 */
	hashPassword: function (values) {
		if (values.password) {
			values.password = bcrypt.hashSync(values.password, saltRounds);
		}
	},

	/**
	 * @description comparePassword :: compares a password against a hashed password in the database
	 * @param {String} password - the users non-hashed password
	 * @param {String} hash - the user's hashed password stored in the database
	 */
	comparePassword: function (password, hash) {
		return bcrypt.compareSync(password, hash);
	},

	/**
	 * @description createToken :: creates a JSON web token for a user
	 * @param {Object} user - a user object obtained from Waterline
	 */
	createToken: function (user) {
		try {
			user = user.toJSON();
		} finally {
			return jwt.sign({ user: user }, options.secret, {
				algorithm: options.algorithm,
				expiresIn: options.maxAge,
				audience: options.audience
			});
		}
	},

	/**
	 * @description verifyToken :: verifies a jwt token given to user in verification email
	 * @returns - bluebird promise, reject(err) or resolve(user)
	 */
	verifyToken: function (req, res) {
		return new Promise(function (resolve, reject) {
			passport.authenticate('jwt', function (err, user, info) {
				if (err) return reject(err);
				if (!user) return reject(new Error('invalid token!'));
				return resolve(user, info);
			})(req, res);
		});
	},

	/**
	 * generateBase64Token
	 * @description creates a random string to be used as a password reset token. Removes "/", "+", and "=" characters.
	 */
	generateBase64Token: function(user, next) {
		var token = crypto.randomBytes(128).toString('base64').replace(/([\/\+\=])/g, '');
		if (next) return next(null, token);
		return token;
		// crypto.randomBytes(128, function(err, buffer) {
		// 	if (err) return next(err);
		// 	return next(null, buffer.toString('base64').replace(/([\/\+\=])/g, ''));
		// });
	},

	compareResetToken: function(token, user) {
		return Date.now() > user.resetPasswordExpires ? false : bcrypt.compareSync(token, user.resetPasswordToken);
	}

};

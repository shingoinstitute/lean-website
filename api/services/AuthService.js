var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var passport = require('passport');

const saltRounds = 10;

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
	}

};

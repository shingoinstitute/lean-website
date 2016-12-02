var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const saltRounds = 10;

module.exports = {
	secret: sails.config.passport.jwt.secret,
	issuer: sails.config.passport.jwt.issuer,
	audience: sails.config.passport.jwt.audience,
	algorithm: sails.config.passport.jwt.algorithm,
	expiresInMinutes: sails.config.passport.jwt.maxAge,

	hashPassword: function(user) {
		if (user.password) {
			var salt = bcrypt.genSaltSync(saltRounds);
			user.password = bcrypt.hashSync(user.password, salt);
		}
	},

	comparePassword: function(password, hash) {
		return bcrypt.compareSync(password, hash);
	},

	createToken: function(user) {
		return jwt.sign({ user: user.toJSON() }, this.secret, {
			algorithm: this.algorithm,
			expiresIn: this.maxAge,
			// issuer: 'localhost',
			audience: this.audience
		});
	}
};

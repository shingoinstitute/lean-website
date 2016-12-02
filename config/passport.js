var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var MAX_AGE = 60 * 60 * 24 * 7;
var SECRET = process.env.jwtSecret || 'keyboardcats_123';
var ALGORITHM = "HS256";
// var ISSUER = 'localhost';
var AUDIENCE = 'teachinglean.net';

var localStrategyConfig = {
	usernameField: 'username',
	passwordField: 'password'
};

var jwtStrategyConfig = {
  secretOrKey: SECRET,
  // issuer: ISSUER,
  audience: AUDIENCE,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

/**
*  @description :: Authentication handler for local strategy
*/
function onLocalAuth(username, password, next) {
	User.findOne({email: username}).exec(function(err, user) {
		if (err) { return next(err); }

		if (!user) return next(null, false, {
			error: email + ' not found.'
		});

		if (!AuthService.comparePassword(password, user.password)) {
			return next(null, false, {
				error: 'incorrect password.'
			});
		}

		return next(null, user);
	});
}

/**
*  @description :: Authentication handler for JWT strategy
*  @param {object} payload - json web token
*  @param {function} done - callback accepting arguments done(err, user, info)
*/
function onJwtAuth(payload, done) {
	User.findOne({uuid: payload.user.uuid}).exec(function(err, user) {
		if (err) {
			return done(err, false);
		}

		if (!user) {
			var error = new Error('User does not exist.', 'passport.js');
			error.name = 'E_USER_NOT_FOUND'
			return done(null, false, { message: error });
		}

		return done(null, user);
	});
}

passport.use(new LocalStrategy(localStrategyConfig, onLocalAuth));
passport.use(new JwtStrategy(jwtStrategyConfig, onJwtAuth));


module.exports.passport = {
	jwt: {
		maxAge: MAX_AGE,
		secret: SECRET,
		algorithm: ALGORITHM,
		// issure: ISSUER,
		audience: AUDIENCE
	}
};

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
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
  audience: AUDIENCE,
  jwtFromRequest: function cookieExtractor(req) {
	  var token = null;

	  if (req && req.cookies) token = req.cookies.JWT;
	  if (!token) token = req.param('JWT');
	  if (!token) token = req.headers.jwt;

	  if (sails.config.environment == 'development' && !token) sails.log.error(new Error("token not found!"));

	  return token;
  },
};

var linkedinStrategyConfig = {
	clientID: '866yzhcdwes5ot',
	clientSecret: 'cygx8JJu246Fjyba',
	callbackURL: 'http://localhost:1337/auth/linkedin/callback',
	scope: ['r_emailaddress', 'r_basicprofile'],
	state: true
}

/**
*  @description :: Authentication handler for local strategy
*/
function onLocalAuth(username, password, next) {
	User.findOne({email: username}).exec(function(err, user) {
		if (err) { return next(err); }

		if (!user) return next(null, false, {
			error: 'An account with ' + username + ' does not exist.',
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

function onLinkedinAuth(accessToken, refreshToken, profile, done) {
	var json = profile._json;
	var query = {};
	query.linkedinId = json.id;
	query.email = json.emailAddress;
	query.firstname = json.firstName;
	query.lastname = json.lastName;
	query.pictureUrl = json.pictureUrl;
	query.bio = json.summary;

	User.findOne({email: query.email}).exec(function(err, user) {
		if (err) {
			return done(err, false)
		} else if (!user) {
			User.create(query).exec(function(err, user) {
				if (err) return done(err, false);
				return done(null, user);
			});
		} else if (!user.linkedinId) {
			User.update({email: user.email}, query).exec(function(err, updated) {
				if (err) return done(err, false);
				return done(null, updated[0]);
			});
		} else {
			return done(null, user);
		}
	});
}

passport.use(new LocalStrategy(localStrategyConfig, onLocalAuth));
passport.use(new JwtStrategy(jwtStrategyConfig, onJwtAuth));
passport.use(new LinkedInStrategy(linkedinStrategyConfig, onLinkedinAuth));


module.exports.passport = {
	jwt: {
		maxAge: MAX_AGE,
		secret: SECRET,
		algorithm: ALGORITHM,
		// issure: ISSUER,
		audience: AUDIENCE
	}
};

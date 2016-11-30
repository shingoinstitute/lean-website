
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var fakeUser = {
	firstname: 'Craig',
	lastname: 'Blackburn',
	uuid: '123456789'
}

passport.serializeUser(function(user, done) {
	if (user) {
		if (user.uuid) {
			User.findOne({uuid: user.uuid}).exec(function(err, user) {
				if (err) { return done(err); }
				return done(null, user.uuid);
			});
		} else {
			return done(new Error('Failed to serialize user, id not provided.'));
		}
	} else {
		return done(new Error('Failed to serialize user, missing user object.'));
	}
});

passport.deserializeUser(function(uuid, done) {
	User.findOne({uuid: uuid}).exec(function(err, user) {
		if (err) { return done(err) }
		if (!user) {
			return done(new Error('Failed to deserialize user, invalid uuid.'))
		} else {
			delete user.password;
			delete user.createdAt;
			delete user.updatedAt;
			user.name = user.firstname + ' ' + user.lastname;
			return done(null, user);
		}
	});
});

module.exports = {

	linkedInAuth: function(req, res) {
		passport.use(new LinkedInStrategy({
			consumerKey: '866yzhcdwes5ot',
			consumerSecret: 'cygx8JJu246Fjyba',
			callbackURL: "http://localhost:1337/auth/linkedin/callback"
		}, function(token, tokenSecret, profile, done) {
			if (profile) {
				sails.log.debug(profile);
				fakeUser.profile = profile;
				return done(null, fakeUser);
			} else {
				return done(new Error('LinkedIn authentication failed.'));
			}
		}))
		.authenticate('linkedin')(req, res);
	},

	linkedInCallback: function(req, res, next) {
		passport.authenticate('linkedin', {
			successRedirect: '/me',
			failureRedirect: '/auth/login',
			failureFlash: 'LinkedIn authentication failed.'
		})(req, res);
	},

	localAuth: function(req, res, next) {
		passport.use(new LocalStrategy(function(username, password, done) {
			sails.log.debug('info: authenticating ' + username + ' @localAuth')
			User.findOne({email: username}).exec(function(err, user) {
				if (err) {
					return done(err);
				} else if (!user) {
					return done(null, false, {message: 'invalid username.'});
				} else if (user.password != password) {
					return done(null, false, {message: 'incorrect password.'});
				} else {
					return done(null, user, {message: 'user found!'});
				}
			});
		})).authenticate('local', {
			failureRedirect: '/auth/login',
			successRedirect: '/me'
		})(req, res, next);
	},


}

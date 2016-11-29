
var passportLocal = require('passport');
var passportLinkedin = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var fakeUser = {
	firstname: 'Craig',
	lastname: 'Blackburn',
}

passportLocal.serializeUser(function(user, done) {
	return done(null, user.uuid);
});

passportLocal.deserializeUser(function(uuid, done) {
	User.findOne({uuid: uuid}).exec(function(err, user) {
		if (err) { return done(err) }
		if (!user) { return done(new Error('Invalid uuid.')) }
		return done(null, user)
	})
});

passportLinkedin.serializeUser(function(user, done) {
	return done(null, user.uuid);
});

passportLinkedin.deserializeUser(function(uuid, done) {
	User.findOne({uuid: uuid}).exec(function(err, user) {
		if (err) { return done(err) }
		if (!user) { return done(new Error('Invalid uuid.')) }
		return done(null, user)
	})
});

passportLinkedin.use(new LinkedInStrategy({
	consumerKey: '866yzhcdwes5ot',
	consumerSecret: 'cygx8JJu246Fjyba',
	callbackURL: "http://localhost:1337/auth/linkedin/callback"
}, function(token, tokenSecret, profile, done) {
	if (profile) {
		console.log(profile);
		fakeUser.profile = profile;
		return done(null, fakeUser);
	} else {
		return done(new Error('LinkedIn authentication failed.'));
	}
}));

passportLocal.use(new LocalStrategy(function(username, password, done) {
	console.log('Herro?');
	return done(null, fakeUser);
	User.findOne({username: username}).exec(function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false, {message: 'Invalid username.'}); }
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Incorrect password.'});
		}
		return done(null, user);
	});
}));

module.exports.passport = {

	linkedInAuth: function(req, res) {
		return passportLinkedin.authenticate('linkedin')(req, res);
	},

	linkedInCallback: function(req, res) {
		passportLinkedin.authenticate('linkedin', {
			successRedirect: '/me',
			failureRedirect: '/auth/login',
			failureFlash: 'LinkedIn authentication failed.'
		});
	},

	localAuth: function(req, res) {
		console.info('info: login start.')

		var next = function(err, user, info) {
			return res.json({
				error: err,
				user: user,
				info: info
			});
		}

		passportLocal.authenticate('local', function(err, user, info) {
			if (info) { console.log('info: ', info); }
		   if (err) {
				return next(err);
			} else if (!user) {
				return next(new Error('Invalid username or password.'));
			} else {
				console.log('User logged in: ', user);
		      req.logIn(user, function(err) {
		         if (err) { return next(err); }
		         return next(null, user);
		      });
			}
		})(req, res, next);
	},

	localAuthCallback: function(req, res, next) {
		console.info('Local auth callback requested')
		passportLocal.authenticate('local')(req, res, next);
	}


}

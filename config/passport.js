
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

var fakeUser = {
   firstname: 'Craig',
   lastname: 'Blackburn',
}

var verifyHandler = function(token, tokenSecret, profile, done) {
   process.nextTick(function() {
      var values = profile;
      console.log(values);
      fakeUser.profile = profile;
      return done(null, fakeUser);
   });
}

passport.use(new LinkedInStrategy({
    consumerKey: '866yzhcdwes5ot',
    consumerSecret: 'cygx8JJu246Fjyba',
    callbackURL: "http://localhost:1337/auth/linkedin/callback"
}, verifyHandler));

passport.serializeUser(function(user, done) {
   return done(null, user.uuid);
});

passport.deserializeUser(function(uuid, done) {
   return done(null, fakeUser);
});

module.exports.passport = {

   linkedInAuth: function(req, res) {
      return passport.authenticate('linkedin');
   },

   linkedInCallback: function(req, res) {
      passport.authenticate('facebook', {
         failureRedirect: '/login'
      })(req, res, next);
   },

}

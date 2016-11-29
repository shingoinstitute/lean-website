
var passport = sails.config.passport;

module.exports = {

   auth: function(req, res) {

   },

   login: function(req, res) {

   },

   logout: function(req, res) {

   },

   linkedInAuth: function(req, res) {
      return passport.linkedInAuth(req, res);
   },

   linkedInAuthCallback: function(req, res) {
      return passport.linkedInCallback(req, res, function(err) {
         console.log('Heyo!');
         if (err) {
            sails.log.error(err);
            res.json({
               success: false,
               error: err
            });
         }

         req.logIn(req.user, function(err) {
            if (err) {
               return res.json({
                  success: false,
                  error: err
               });
            } else {
               return res.json({
                  success: true,
                  user: req.user
               });
            }
         });
      });
   },

}

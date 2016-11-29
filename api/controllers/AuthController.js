
var passport = sails.config.passport;

module.exports = {

   auth: function(req, res) {

   },

   login: function(req, res) {
		return res.json({
			success: false
		})
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

   localAuth: function(req, res) {
      return passport.localAuth(req, res);
   },

	localAuthCallback: function(req, res) {
		return passport.localAuth(req, res, function(err, user) {
			if (err) {
				res.json({error: err, user: null})
			} else {
				req.logIn(user, function(err) {
					return res.json({
						user: user,
						info: info,
						error: err
					});
				});
			}
		})
	}

}

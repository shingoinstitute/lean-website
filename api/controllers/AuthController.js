/**
*
*  @description - AuthController.js
*
*/

var passport = require('passport');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

module.exports = {

	localAuth: function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				err.info = info || 'an unknown error has occured.';
				err.timestamp = new Date().toDateString() + ', ' + new Date().toLocaleDateString();
				sails.log.error(JSON.stringify(err, null, 3));
				return res.status(500).json({
					error: err.info,
					_error: err
				});
			}

			if (!user) {
				var date = new Date();
				sails.log.warn(JSON.stringify({
					error: {
						message: 'user is undefined',
						fileName: "AuthController.js",
						method: "localAuth",
						info: info.error || info,
						timestamp: date.toDateString() + ', ' + date.toLocaleTimeString()
					}
				}, null, 3));
				return res.status(404).json({ error: info.error });
			}
			
			req.logIn(user, function (err) {
				if (err) return res.negotiate(err);

				var token = AuthService.createToken(user);
				res.cookie('XSRF-TOKEN', token);

				return res.json({
					success: true,
					user: user.toJSON(),
					'xsrf-token': token
				});
			});
		})(req, res);
	},

	linkedInAuth: function (req, res) {
		passport.authenticate('linkedin')(req, res);
	},

	linkedInAuthCallback: function (req, res) {
		passport.authenticate('linkedin', {
			failureRedirect: '/login'
		})(req, res, function (err) {

			if (err) {
				sails.log.error(err);
				return res.negotiate(err);
			}

			var token = AuthService.createToken(user);
			res.cookie('XSRF-TOKEN', token);
			
			return res.redirect('/dashboard');
		});
	},

	login: function (req, res) {
		if (req.user) return res.redirect('/dashboard');
		return res.json('user not logged in.');
	},

	logout: function (req, res) {
		req.logout();
		delete res.cookie['XSRF-TOKEN'];
		return res.json('loggout successful');
	},



  verifyEmail: function (req, res) {
    var uuid = req.param('id'); // user's uuid
    var token = req.param('vt'); // verification token

    User.findOne({ uuid: uuid }).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.status(404).json('E_USER_NOT_FOUND');

      if (!token || !user.emailVerificationToken) {
        return res.view('/dashboard');
      }

      try {
        var tokenIsValid = bcrypt.compareSync(token, user.emailVerificationToken);
      } catch (e) {
        return res.json({
          error: e.message
        });
      }

      if (!tokenIsValid) return res.status(403).json('user not authorized');

      user.verifiedEmail = user.email;
      user.emailVerificationToken = '';

      user.save(function (err) {
        if (err) return res.negotiate(err);
      });

      return res.redirect('/verifyEmail/' + user.uuid);

    });
  },

  /**
   * This route is called by the browser when a user visits `/api/verifyEmail/:id`.
   * The purpose of this function is to... (drum roll) verify the email token!
   */
  apiVerifyEmail: function(req, res) {
    var uuid = req.param('id');

    if (!uuid) {
      return res.status(404).json({
        error: "user not found."
      });
    }

    User.findOne({uuid: uuid}).exec(function(err, user) {
      if (err) return res.negotiate(err);

      if (!user) return res.status(404).json({
        success: false,
        error: "user not found."
      });

      if (user.verifiedEmail && user.verifiedEmail === '')
        return res.status(403).json({
          success: false,
          error: "user email address has not been verified"
        });

      user.save(function(err) {
        if (err) sails.log.error(err);
      });

      return res.json({
        success: true,
        email: user.email
      });

    });

  }

};

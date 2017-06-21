/**
* @description :: UserController.js
*/

var _ = require('lodash');
var util = require('util');
var path = require('path');
var fs = require('fs');
var jwt = require('jsonwebtoken');

module.exports = {
  
  me: function (req, res) {
    
    var xsrf_header = req.get('X-XSRF-TOKEN');
    var xsrf_cookie = req.cookies['XSRF-TOKEN'];

    if (!xsrf_cookie) {
      xsrf_cookie = req.param('xsrf-token');
    }

    if (typeof xsrf_cookie === 'undefined' || typeof xsrf_header === 'undefined') {
      return res.status(403).json({ error: "Missing 'X-XSRF-TOKEN' header or 'XSRF-TOKEN' is not set in cookies" });
    }

    if (xsrf_header !== xsrf_cookie) {
      return res.status(403).json({ error: "'X-XSRF-TOKEN' and 'XSRF-TOKEN' tokens present in header and cookies do not match." });
    }
    
    const secret = sails.config.passport.jwt.secret;

    const options = {
      audience: sails.config.passport.jwt.audience,
      algorithm: sails.config.passport.jwt.algorithm
    }
    
    var payload = jwt.verify(xsrf_cookie, secret, options);

    User.findOne({uuid: payload.user.uuid}).exec((err, user) => {
      if (err) {
        delete res.cookies['XSRF-TOKEN'];
        sails.log.error(err);
        return res.status(500).json(err.toJSON());
      }

      if (!user) {
        delete res.cookies['XSRF-TOKEN'];
        return res.status(404).json({error: `user not found with id ${payload.user.uuid}`});
      }

      return res.json(user.toJSON());
    });
    
  },
  
  photoUpload: function (req, res, next) {
    req.file('profile').upload({
      // fileSize <~ 10MB
      dirname: path.resolve(sails.config.appPath, 'assets/images/profiles/' + req.user.uuid),
      maxBytes: 10000000
    }, function (err, uploadedFiles) {
      if (err)
        return res.negotiate(err);
      if (uploadedFiles.length == 0)
        return res.badRequest('No file was uploaded');
      
      var fdSplit = uploadedFiles[0].fd.split('/');
      var filename = fdSplit[fdSplit.length - 1];
      var pictureUrl = util.format('%s/images/profiles/%s/%s', sails.getBaseUrl(), req.user.uuid, filename);
      var tempUrl = util.format('%s/.tmp/public/images/profiles/%s/%s', process.cwd(), req.user.uuid, filename);
      fs.createReadStream(uploadedFiles[0].fd).pipe(fs.createWriteStream(tempUrl));
      
      User.update(req.user.uuid, {
        pictureUrl: pictureUrl
      })
      .then(function () {
        res.ok(pictureUrl);
      })
      .catch(function (err) {
        return res.negotiate(err);
      });

    });
  },
  
  // update: function(req, res) {
  //   User.update({uuid: req.params.id}, req.body).exec(function(err, users) {
  //     if (err) {
  //       sails.log.error(err);
  //       return res.status(500).json({error: err});
  //     }

  //     var user = users.pop();

  //     if (!user) {
  //       return res.status(404).json({error: `user not found with id ${req.params.id}`});
  //     }
      
  //     return res.json(user.toJSON());
  //   });
  // },

  create: function (req, res) {
    var newUser = {};
    newUser.email = req.param('email');
    newUser.password = req.param('password');
    newUser.firstname = req.param('firstname');
    newUser.lastname = req.param('lastname');
    
    if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
      return res.status(403).json('Error: Could not create new account, missing required parameters (must have email, password, firstname, and lastname).');
    }
    
    User.create(newUser).exec(function (err, user) {
      if (err) return res.status(400).json(err);
      
      if (Array.isArray(user)) user = user.pop();
      
      if (sails.config.environment === 'production') {
        EmailService.sendVerificationEmail(user)
        .then(function (info) {
          sails.log.info('Email verification link sent to ' + user.email);
        })
        .catch(function (err) {
          sails.log.error(err);
        });

      }

      // Create JWT token and add to cookies
      AuthService.createAndSetToken(res, user);
      
      return res.json({
        success: true,
        user: user.toJSON(),
        info: typeof info != 'undefined' ? info.response : ''
      });
    });
  },
  
  /**
  * Handler for GET "/reset/:id"
  */
  reset: function (req, res) {
    var uuid = req.param('id');
    var token = req.param(sails.config.email.resetPasswordTokenParamName);
    
    User.findOne({
      uuid: uuid
    }).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.status(404).json('user not found');
      // if (!AuthService.compareResetToken(token, user)) return res.redirect('/reset');
      return res.view('ok', {
        user: user.toJSON()
      });
    });
  },
  
  /**
  * Handler for route POST "/reset", expecting "email" parameter
  */
  sendPasswordResetEmail: function (req, res) {
    var email = req.param('email');
    if (!email) { return res.status(400).json("missing email param"); }
    User.findOne({email: email}).exec(function(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.status(404).json('user not found');
      EmailService.sendPasswordResetEmail(user.email)
        .then(function (info) {
          return res.json(info);
        })
        .catch(function (err) {
          sails.log.error(err);
          return res.negotiate(err);
        });
    });
  },
  
  /**
  * Handler for PUT "/reset/:id", expects a token parameter to identify the user
  */
  updatePassword: function (req, res) {
    var uuid = req.param('id');
    var token = req.param('token');
    var password = req.param('password');
    
    if (!token) {
      return res.json('user not authorized!');
    }
    
    if (!password) return res.json('missing password parameter');
    
    User.findOne({
      uuid: uuid
    }).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.negotiate('user not found');
      if (!AuthService.compareResetToken(token, user)) {
        return res.negotiate('mismatched tokens');
      }
      user.password = password;
      user.save(function (err) {
        if (err) {
          sails.log.error(err);
          return res.negotiate(err);
        }
        return res.json(user.toJSON());
      });
    });
  }

};

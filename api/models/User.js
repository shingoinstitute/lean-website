/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

module.exports = {

   attributes: {
      uuid: {
         type: 'string',
         unique: true,
         required: true,
         primaryKey: true,
         uuid: true,
         defaultsTo: function() {
            return uuid.v4();
         },
      },
      lastname: {
         type: 'string',
         required: true,
         minLength: 3,
      },
      firstname: 'string',
      password: 'string',
		email: {
			type: 'string',
			email: true,
			required: true,
			unique: true
		},
   },

   // beforeCreate: function(values, next) {
   //    User.find({uuid: values.uuid}).exec(function(err, users) {
   //       if (err) { return next(err); }
   //       if (users) {
   //          values.uuid = uuid.v4();
   //          return User.beforeCreate(values, next);
   //       } else {
	// 			bcrypt.hash(values.password, 10, function(err, hash) {
	// 				if (err) { return next(err) }
	// 				values.password = hash;
	// 				return next();
	// 			});
   //       }
   //    });
   // }
};

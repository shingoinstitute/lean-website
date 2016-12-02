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
         }
      },

      lastname: {
         type: 'string',
         required: true
      },

      firstname: 'string',

      password: {
			type: 'string',
			required: true,
			minLength: 8
		},

		email: {
			type: 'string',
			email: true,
			required: true,
			unique: true
		},

		role: {
			type: 'string',
			enum: [
				'systemAdmin',
				'admin',
				'editor',
				'author',
				'moderator',
				'user'
			],
			defaultsTo: function() {
				return 'user';
			}
		},

		permissions: {
			model: 'userPermissions'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			delete obj.createdAt;
			delete obj.updatedAt;
			obj.name = obj.firstname + ' ' + obj.lastname;

			// UserPermissions.findOne({id: obj.permissions}).exec(function(err, permissions) {
				// obj.permissions = permissions;
				return obj;
			// });
		}
   },

   beforeCreate: function(values, next) {
      User.find({uuid: values.uuid}).exec(function(err, users) {
         if (err) { return next(err); }
         if (users) {
            values.uuid = uuid.v4();
            return User.beforeCreate(values, next);
         } else {
				UserPermissions.create({user: values.uuid}).exec(function(err, permissions) {
					if (err) return next(err);
					values.permissions = permissions;
					sails.log.info('permissions', permissions);
					AuthService.hashPassword(values);
					return next();
				});
         }
      });
   },

	beforeUpdate: function(values, next) {
		if (values.uuid) delete values.uuid;
		AuthService.hashPassword(values);
		return next();
	}
};

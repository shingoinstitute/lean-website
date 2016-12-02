/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var Promise = require('bluebird');

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
			enum: sails.config.models.roles,
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
			return obj;
		},

		getPermissions: function(next) {
			var obj = this.toObject();
			UserPermissions.findOne({id: obj.permissions}).exec(function(err, permissions) {
				if (err) return next(err, false);
				if (!permissions) return next(new Error('Permissions not found for user ' + obj.email), false);
				return next(null, permissions);
			});
		}

   },

	updateRole: function(user, next) {
		User.update({uuid: user.uuid}, {role: user.role}).exec(function(err, users) {
			if (err) return next(err, false);
			if (!users[0]) return next(new Error('Failed to update role, user not found'), false);
			var updatedUser = users[0];
			UserPermissions.update({id: updatedUser.permissions}, {user: updatedUser.uuid}).exec(function(err, permissions) {
				if (err) return next(err, false);
				if (!permissions[0]) return next(new Error('User permissions update failed during role update, permissions id was undefined'), false);
				return next(null, updatedUser);
			});
		});
	},

   beforeCreate: function(values, next) {
		AuthService.hashPassword(values);
		(function checkUuidForCollisions(values) {
			User.findOne({uuid: values.uuid}).exec(function(err, user) {
	         if (err) { return next(err); }
	         if (!user) {
					UserPermissions.create({user: values.uuid}).exec(function(err, permissions) {
						if (err) return next(err);
						values.permissions = permissions.id;
						return next();
					});
	         } else {
					values.uuid = uuid.v4();
	            checkUuidForCollisions(values);
	         }
	      });
		})(values);
   },

	beforeUpdate: function(values, next) {
		if (values.password) {
			AuthService.hashPassword(values);
		}
		return next();
	},

	signUp: function(newUser) {
		return new Promise(function(resolve, reject) {
			User.create(newUser).exec(function(err, user) {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	}

};

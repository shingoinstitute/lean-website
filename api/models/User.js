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
			defaultsTo: function () {
				return uuid.v4();
			}
		},

		lastname: {
			type: 'string',
			required: true
		},

		firstname: 'string',

		linkedinId: 'string',

		pictureUrl: {
			type: 'string',
			url: true
		},

		password: {
			type: 'string',
			minLength: 8
		},

		email: {
			type: 'string',
			email: true,
			unique: true
		},

		role: {
			type: 'string',
			enum: sails.config.models.roles,
			defaultsTo: 'user'
		},

		permissions: {
			model: 'userPermissions'
		},

		notificationPreferences: {
			type: 'string',
			enum: ['on', 'off'],
			defaultsTo: 'on'
		},

		reputation: {
			type: 'integer',
			defaultsTo: 0
		},

		addReputation: function (points) {
			var obj = this;
			obj.reputation += points;
			obj.save(function (err) {
				if (err) sails.log.error(err);
			});
		},

		minusReputation: function (points) {
			var obj = this;
			if (points > 0) points = points * -1;
			obj.addReputation(points);
		},

		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			delete obj.notificationPreferences;
			delete obj.createdAt;
			delete obj.updatedAt;
			delete obj.linkedinId;
			obj.isAdmin = (obj.role == 'admin' || obj.role == 'systemAdmin');
			obj.name = obj.firstname + ' ' + obj.lastname;
			return obj;
		},

		getPermissions: function (next) {
			var obj = this.toObject();
			UserPermissions.findOne({ id: obj.permissions }).exec(function (err, permissions) {
				if (err) return next(err, false);
				if (!permissions) return next(null, 'none');
				return next(null, permissions);
			});
		}

	},

	updateRole: function (user, next) {
		User.update({ uuid: user.uuid }, { role: user.role }).exec(function (err, users) {
			if (err) return next(err, false);
			if (!users[0]) return next(new Error('Error: failed to update role, user not found'), false);
			var updatedUser = users[0];
			UserPermissions.update({ id: updatedUser.permissions }, { user: updatedUser.uuid }).exec(function (err, permissions) {
				if (err) return next(err, false);
				if (!permissions[0]) return next(new Error('Error: failed to update user, permissions id was undefined'), false);
				return next(null, updatedUser);
			});
		});
	},

	beforeCreate: function (values, next) {
		AuthService.hashPassword(values);
		(function checkForUuidCollisions(values) {
			User.findOne({ uuid: values.uuid }).exec(function (err, user) {
				if (err) { return next(err); }
				if (!user) {
					UserPermissions.create({ user: values.uuid }).exec(function (err, permissions) {
						if (err) return next(err);
						values.permissions = permissions.id;
						return next();
					});
				} else {
					values.uuid = uuid.v4();
					checkForUuidCollisions(values);
				}
			});
		})(values);
	},

	beforeUpdate: function (values, next) {
		if (values.uuid) delete values.uuid;
		if (values.password) AuthService.hashPassword(values);
		return next();
	},

	beforeDestroy: function (criteria, next) {
		User.find(criteria).exec(function (err, users) {
			if (err) return next(err);
			var user = users[0];
			if (!user) return next();
			UserPermissions.findOne({ user: user.uuid }).exec(function (err, permissions) {
				if (err) return next(err);
				if (!permissions) return next();
				UserPermissions.destroy({ uuid: permissions.uuid }).exec(function (err) {
					if (err) return next(err);
					return next();
				});
			});
		});
	},

	signUp: function (newUser) {
		return new Promise(function (resolve, reject) {
			User.create(newUser).exec(function (err, user) {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	}

};

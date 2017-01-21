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

	// attributes
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

		bio: 'text',

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

		verifiedEmail: {
			type: 'string',
			defaultsTo: 'not verified!'
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

		questions_did_upvote: {
			collection: 'entry',
			via: 'users_did_upvote'
		},

		questions_did_downvote: {
			collection: 'entry',
			via: 'users_did_downvote'
		},

		reputation: {
			type: 'integer',
			defaultsTo: 0
		},

		accountIsActive: {
			type: 'boolean',
			defaultsTo: true
		},

		resetPasswordToken: 'string',

		resetPasswordExpires: 'integer', // number of milliseconds since Jan 1, 1970

		addReputation: function (points) {
			var obj = this;
			obj.reputation += points;
			obj.save(function (err) {
				if (err) sails.log.error(err);
			});
		},

		subtractReputation: function (points) {
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
			delete obj.verifiedEmail;
			delete obj.resetPasswordToken;
			delete obj.resetPasswordExpires;
			delete obj.permissions;
			obj.isAdmin = (obj.role == 'admin' || obj.role == 'systemAdmin');
			if (obj.firstname && obj.lastname) {
				obj.name = obj.firstname + ' ' + obj.lastname;
			} else {
				obj.name = obj.lastname;
			}
			return obj;
		},

	}, // END attributes

	// +----------------------+
	// | LIFE CYCLE CALLBACKS |
	// +----------------------+

	beforeCreate: function (values, next) {
		AuthService.hashPassword(values);
		return next();
	},

	afterCreate: function(newRecord, next) {

		// TODO: Probably ought to delete this eventually... ;)
		if (sails.config.environment === 'development' && (newRecord.email == 'craig.blackburn@usu.edu' || newRecord.email == 'cr.blackburn89@gmail.com')) {
			newRecord.role = 'systemAdmin';
		}

		UserPermissions.create({user: newRecord.uuid}).exec(function(err, permissions) {
			if (err) return next(err);
			newRecord.permissions = permissions.uuid;
			User.update({uuid: newRecord.uuid}, newRecord).exec(function(err, user) {
				if (err) return next(err);
				return next();
			});
		});
	},

	beforeUpdate: function (values, next) {
		if (values.isAdmin) delete values.isAdmin;
		if (values.password && values.password[0] != '$' && values.resetPasswordToken) {
			values.resetPasswordToken = null;
			values.resetPasswordExpires = null;
			AuthService.hashPassword(values);
		} else {
			delete values.password;
		}
		
		return next();
	},

	/**
	 * @description :: Rather than delete an account, set "accountIsActive" to false. 
	 * 					 Removes permissions.
	 */
	beforeDestroy: function (criteria, next) {

		// Remove permissions
		User.find(criteria).exec(function (err, users) {
			if (users) {
				var user = users.pop();
				UserPermissions.findOne({ user: user.uuid }).exec(function (err, permissions) {
					if (permissions) UserPermissions.destroy({ uuid: permissions.uuid }).exec();

					if (sails.config.environment === 'development') {
						return next();
					} else {
						// Always return next(error) so that users are never deleted, just set inActive
						User.find(criteria).exec(function (err, users) {
							if (err) return next(err);
							try {
								user = user.pop();
								user.accountIsActive = false;
								user.save(function(err){});
							} catch (e) {
								return next(e);
							}
						});
						return next(new Error(user.email + "'s account cannot be deleted, however it has been deactivated. Accounts are not deleted to preserve history of comments, questions, etc."));
					}
				});
			}
		});
	}

};
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

		secondaryEmail: {
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
			obj.isAdmin = (obj.role == 'admin' || obj.role == 'systemAdmin');
			if (obj.firstname && obj.lastname) {
				obj.name = obj.firstname + ' ' + obj.lastname;
			} else {
				obj.name = obj.lastname;
			}
			return obj;
		},

		/**
		 * @description verifyEmail :: verifies the user's primary email address
		 */
		verifyEmail: function () {
			var uuid = this.uuid;
			return new Promise(function (resolve, reject) {
				User.find({ uuid: uuid }).exec(function (err, users) {
					if (err) return reject(err);
					var user = users.pop();
					if (!user) return reject(new Error('User not found!'));
					user.verifiedEmail = user.email;
					user.save(function (err) {
						if (err) return reject(err);
						return resolve(user);
					});
				});
			});
		},

		/**
		 * @description getPermissions :: populates and returns permissions for a user
		 */
		getPermissions: function (next) {
			var obj = this.toObject();
			UserPermissions.findOne({ uuid: obj.permissions }).exec(function (err, permissions) {
				if (err) return next(err, false);
				if (!permissions) return next(null, 'none');
				return next(null, permissions);
			});
		},

		/**
		 * @description createEntryTag :: creates a new tag used with the QA system.
		 * 										 
		 * NOTE: Using this helper function will ensure the EntryTag has a value for it's 'createdBy' property.
		 */
		createEntryTag: function (tagName) {
			return new Promise(function (resolve, reject) {
				EntryTag.create({ name: tagName }).exec(function (err, tag) {
					if (err) return reject(err);
					if (!tag) return reject(new Error('Unknown error occured, failed to create new tag.'));
					tag.createdBy = user.uuid;
					tag.save(function (err) {
						if (err) return reject(err)
						return resolve();
					});
				});
			});
		}

	}, // END attributes

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

	// +----------------------+
	// | LIFE CYCLE CALLBACKS |
	// +----------------------+

	beforeCreate: function (values, next) {
		console.log('creating new user...');
		AuthService.hashPassword(values);
		return next();
	},

	afterCreate: function(newRecord, next) {
		UserPermissions.create({user: newRecord.uuid}).exec(function(err, permissions) {
			if (err) return next(err);
			newRecord.permissions = permissions.uuid;
		});
		User.findOne(newRecord).exec(function(err, user) {
			if (err) return next(err);
			if (!user) return next(new Error('user not found in afterCreate User.js lifecyle callback'));
			user.verifyEmail();
		});
		return next();
	},

	beforeUpdate: function (values, next) {
		return next();
	},

	afterUpdate: function(updatedRecord, next) {
		if (updatedRecord.isAdmin) delete updatedRecord.isAdmin;
		return next();
	},

	/**
	 * @description :: Rather than delete an account, set "accountIsActive" to false. 
	 * 					 Removes permissions.
	 */
	beforeDestroy: function (criteria, next) {

		// Always return next(error) so that users are never deleted, just set inActive
		User.find(criteria).exec(function (err, users) {
			if (err) return next(err);
			if (!users) return next(new Error('user not found!'));
			var user = users.pop();
			user.accountIsActive = false;
			user.save(function(err) {
				if (err) return next(err);
				return next(user.email + "'s account cannot be deleted, however it has been deactivated. Accounts are not deleted to preserve history of comments, questions, etc.");
			});
		});

		// Removes permissions
		User.find(criteria).exec(function (err, users) {
			if (err) return next(err);
			var user = users.pop();
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
	}

};
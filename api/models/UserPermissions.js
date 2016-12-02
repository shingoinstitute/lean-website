/**
* UserPermissions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

module.exports = {

	attributes: {

		id: {
			type: 'string',
			uuid: true,
			primaryKey: true,
			defaultsTo: function() {
				return require('node-uuid').v4();
			}
		},

		user: {
			model: 'user',
			unique: true
		},

		editAll: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		editComments: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		changePasswords: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		viewAll: {
			type: 'boolean',
			defaultsTo: function() {
				return true;
			}
		},

		viewComments: {
			type: 'boolean',
			defaultsTo: function() {
				return true;
			}
		},

		createAll: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		createComments: {
			type: 'boolean',
			defaultsTo: function() {
				return true;
			}
		},

		deleteAll: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		deleteComments: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		approve: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		approveComments: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		review: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

		submit: {
			type: 'boolean',
			defaultsTo: function() {
				return false;
			}
		},

	},

	grantAllPriviledges: function(options, done) {
		UserPermissions.findOne({uuid: options.user.uuid}).exec(function(err, permissions) {

			if (err) {
				sails.log.info('@UserPermissions.grantAllPriviledges-1');
				return done(err, false);
			}

			if (!permissions) {
				sails.log.info('@UserPermissions.grantAllPriviledges-2');
				return done('Failed to grant user priviledges, user not found!', false);
			}

			permissions.editAll = true;
			permissions.editComments = true;
			permissions.changePasswords = true;
			permissions.viewAll = true;
			permissions.viewComments = true;
			permissions.createAll = true;
			permissions.createComments = true;
			permissions.deleteAll = true;
			permissions.deleteComments = true;
			permissions.approve = true;
			permissions.approveComments = true;
			permissions.review = true;
			permissions.submit = true;

			User.findOne({uuid: permissions.uuid}).exec(function(err, user) {
				if (err) return done(err, false);
				sails.log.info(JSON.stringify(permissions, null, 2));
				user.permissions = permissions;
				user.save(function(err) {
					if (err) return done(err, false);
					return done(null, user);
				});
			});
		});
	},

	revokeAllPriviledges: function(options, done) {

		var user = options.user;

		function afterLookup(err, _user) {
			if (err) return done(err, false);

			if (!_user) {
				var error = new Error();
				error.message = 'Failed to revoke user priviledges, user not found!';
				error.name = 'E_USER_NOT_FOUND';
				error.fileName = 'UserPermissions.js';
				return done(error, false);
			}



			this.editAll = false;
			user.editComments = false;
			user.changePasswords = false;
			user.viewAll = false;
			user.viewComments = false;
			user.createAll = false;
			user.createComments = false;
			user.deleteAll = false;
			user.deleteComments = false;
			user.approve = false;
			user.approveComments = false;
			user.review = false;
			user.submit = false;

			return done(null, _user);
		}

		(function _lookupUserIfNecessary(afterLookup) {
			if (typeof user === 'object') return afterLookup(null, user);
			Person.findOne(person).exec(afterLookup);
		});


	},

	beforeCreate: function(values, next) {
		var role = values.role;
		if (role == 'systemAdmin') {
			values.editAll = true;
			values.editComments = true;
			values.changePasswords = true;
			values.viewAll = true;
			values.viewComments = true;
			values.createAll = true;
			values.createComments = true;
			values.deleteAll = true;
			values.deleteComments = true;
			values.approve = true;
			values.approveComments = true;
			values.review = true;
			values.submit = true;
		}

		if (role == 'admin') {
			values.editAll = true;
			values.editComments = true;
			values.viewAll = true;
			values.viewComments = true;
			values.createAll = true;
			values.createComments = true;
			values.deleteAll = true;
			values.deleteComments = true;
			values.approve = true;
			values.approveComments = true;
			values.review = true;
			values.submit = true;
		}

		if (role == 'editor') {
			values.editAll = true;
			values.viewAll = true;
			values.viewComments = true;
			values.createAll = true;
			values.createComments = true;
			values.deleteAll = true;
			values.approve = true;
			values.review = true;
			values.submit = true;
		}

		if (role == 'author') {
			values.editAll = true;
			values.viewAll = true;
			values.viewComments = true;
			values.createAll = true;
			values.createComments = true;
			values.submit = true;
		}

		if (role == 'moderator') {
			values.editComments = true;
			values.viewComments = true;
			values.createComments = true;
			values.deleteComments = true;
			values.approveComments = true;
		}

		return next();
	}
};

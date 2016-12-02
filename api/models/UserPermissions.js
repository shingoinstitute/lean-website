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
			required: true
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

	/**
	*  @desc grantAllPriviledges - grants all priviledges to a user
	*
	*  @param {User} user - the user object being granted permissions
	*  @param {function} done - callback function that accepts two arguments, done(error, user)
	*/
	grantAllPriviledges: function(user, done) {
		UserPermissions.findOne({id: user.permissions}).exec(function(err, permissions) {
			if (err) {
				return done(err, false);
			}

			if (!permissions) {
				return done(new Error('Failed to grant user priviledges, permissions object not found!'), false);
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

			user.permissions = permissions.id;
			user.save(function(err) {
				if (err) return done(err, false);
				return done(null, user);
			});
		});
	},

	/**
	*  @desc grantAllPriviledges - grants all priviledges to a user
	*
	*  @param {User} user - the user object being granted permissions
	*  @param {function} done - callback function that accepts two arguments, done(error, user)
	*/
	revokeAllPriviledges: function(user, done) {
		UserPermissions.findOne({id: user.permissions}).exec(function(err, permissions) {
			if (err) {
				return done(err, false);
			}

			if (!permissions) {
				return done(new Error('Failed to revoke user priviledges, permissions object is undefined'), false);
			}

			permissions.editAll = false;
			permissions.editComments = false;
			permissions.changePasswords = false;
			permissions.viewAll = false;
			permissions.viewComments = false;
			permissions.createAll = false;
			permissions.createComments = false;
			permissions.deleteAll = false;
			permissions.deleteComments = false;
			permissions.approve = false;
			permissions.approveComments = false;
			permissions.review = false;
			permissions.submit = false;

			permissions.save(function(err) {
				if (err) return done(err, false);
				return done(null, permissions);
			});
		});
	},

	beforeUpdate: function(values, next) {
		User.findOne({uuid: values.user}).exec(function(err, user) {
			if (err) { return next(err); }
			if (!user) { return next(new Error('Cannot update permissions, user not found')); }

			switch (user.role) {
				case 'systemAdmin':
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
					break;
				case 'admin':
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
					break;
				case 'editor':
					values.editAll = true;
					values.viewAll = true;
					values.viewComments = true;
					values.createAll = true;
					values.createComments = true;
					values.deleteAll = true;
					values.approve = true;
					values.review = true;
					values.submit = true;
					break;
				case 'author':
					values.editAll = true;
					values.viewAll = true;
					values.viewComments = true;
					values.createAll = true;
					values.createComments = true;
					values.submit = true;
					break;
				case 'moderator':
					values.editComments = true;
					values.viewComments = true;
					values.createComments = true;
					values.deleteComments = true;
					values.approveComments = true;
					break;
				default:
					var error = new Error('Invalid role option for update. Available role types are ' + AppServices.toString(sails.config.models.roles));
					return next(error);
					break;
			}

			return next();
		});
	}
};

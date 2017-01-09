/**
* UserPermissions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

module.exports = {

	attributes: {

		uuid: {
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
			defaultsTo: false
		},

		editComments: {
			type: 'boolean',
			defaultsTo: false
		},

		changePasswords: {
			type: 'boolean',
			defaultsTo: false
		},

		viewAll: {
			type: 'boolean',
			defaultsTo: true
		},

		viewComments: {
			type: 'boolean',
			defaultsTo: true
		},

		createAll: {
			type: 'boolean',
			defaultsTo: false
		},

		createComments: {
			type: 'boolean',
			defaultsTo: true
		},

		deleteAll: {
			type: 'boolean',
			defaultsTo: false
		},

		deleteComments: {
			type: 'boolean',
			defaultsTo: false
		},

		approve: {
			type: 'boolean',
			defaultsTo: false
		},

		approveComments: {
			type: 'boolean',
			defaultsTo: false
		},

		review: {
			type: 'boolean',
			defaultsTo: false
		},

		submit: {
			type: 'boolean',
			defaultsTo: false
		},

	},

	/**
	*  @desc grantAllPriviledges - grants all priviledges to a user
	*
	*  @param {User} user - the user object being granted permissions
	*  @param {function} done - callback function that accepts two arguments, done(error, user)
	*/
	grantAllPriviledges: function(user, done) {
		sails.log.info('permissions id: ' + user.permissions);
		UserPermissions.findOne({id: user.permissions}).exec(function(err, permissions) {
			if (err) {
				return done(err, false);
			}

			if (!permissions) {
				var error = new Error('Failed to grant user priviledges, permissions object not found!');
				return done(error, false);
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

			permissions.save(function(err) {
				if (err) return done(err, false);
				return done(null, permissions);
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

			// "Reset" permissions to false
			values.editAll = false;
			values.editComments = false;
			values.changePasswords = false;
			values.viewAll = false;
			values.viewComments = false;
			values.createAll = false;
			values.createComments = false;
			values.deleteAll = false;
			values.deleteComments = false;
			values.approve = false;
			values.approveComments = false;
			values.review = false;
			values.submit = false;

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
				case 'user':
					values.viewComments = true;
					values.createComments = true;
				default:
					var error = new Error('Invalid role option for update. Available role types are ' + AppServices.toString(sails.config.models.roles));
					return next(error);
				break;
			}

			return next();
		});
	}
};

/**
 * Entry.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

	attributes: {
		id: {
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},

		title: {
			type: 'string',
			maxLength: 255
		},

		content: {
			type: 'string',
			maxLength: 30000
		},

		markedCorrect: {
			type: 'boolean',
			defaultsTo: false
		},

		isFlagged: {
			type: 'boolean',
			defaultsTo: false
		},

		parent: {
			model: 'entry'
		},

		answers: {
			collection: 'entry',
			via: 'parent'
		},

		comments: {
			collection: 'comment',
			via: 'parent'
		},

		tags: {
			collection: 'entryTag',
			via: 'questions'
		},

		users_did_upvote: {
			collection: 'user',
			via: 'questions_did_upvote'
		},

		users_did_downvote: {
			collection: 'user',
			via: 'questions_did_downvote'
		},

		owner: {
			model: 'user'
		},

		addUpvote: function (user) {
			return new Promise(function (resolve, reject) {
				Entry.findOne({ id: this.id }).exec(function (err, entry) {
					if (err) return reject(err);
					if (!entry) return reject(new Error('entry not found!'));

					if (entry.users_did_upvote.indexOf(user) != -1) return reject('user has already cast an upvote for this question.');

					entry.users_did_upvote.push(user);
					entry.users_did_downvote.remove(user);
					entry.save(function(err) {
						if (err) return reject(err);
						return resolve(entry);
					});
				});
			});
		},

		addDownvote: function(user) {
			return new Promise(function (resolve, reject) {
				Entry.findOne({ id: this.id }).exec(function (err, entry) {
					if (err) return reject(err);
					if (!entry) return reject(new Error('entry not found!'));

					if (entry.users_did_downvote.indexOf(user) != -1) return reject('user has already cast a downvote for this question.')

					entry.users_did_downvote.push(user);
					entry.users_did_upvote.remove(user);
					entry.save(function(err) {
						if (err) return reject(err);
						return resolve(entry);
					});
				});
			});
		}

	}
};

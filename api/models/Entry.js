/**
 * Entry.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
		  model: 'entryTag'
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
  }
};

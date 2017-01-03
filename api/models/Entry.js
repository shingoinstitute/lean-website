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

	  parentId: {
		  model: 'entry'
	  },

	  owner: {
		  model: 'user'
	  },
  }
};
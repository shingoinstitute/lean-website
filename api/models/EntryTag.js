/**
 * EntryTag.js
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

    name: 'string',

    questions: {
      collection: 'Entry',
      via: 'tags'
    },

    createdBy: {
      model: 'user'
    }

  },

  /**
   * @description beforeCreate :: lifecycle callback. 
   *                              Checks that no other tags with the same name exist when creating a new one.
   */
  beforeCreate: function(values, done) {
    EntryTag.find().exec(function(err, tags) {
      if (err) return next(err);
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        if (!tag) {
          return next();
        }
        if (values.name.toLowerCase() === tag.name.toLowerCase()) {
          return done(new Error('That tag name already exists!'));
        }
      }
    });
  }

};


/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
     id: {
        type: 'integer',
        unique: true,
        autoIncrement: true
     },
     name: 'string',
     age: 'integer',
     gender: {
        type: 'string',
        enum: ['male', 'female', 'not specified'],
        defaultsTo: function() {
           return 'not specified'
        }
     }
  }
};

/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'mysql'
  },

  cryptoJs: {
    secret: 'f80963fb06094fb5a5edb6dde41fe1db'
  },

  email: {
    resetPasswordTokenParamName: 'token',
    saltRounds: 10,
    tokenExpires: 1000*60*60*12
  },
  
  session: {
    adapter: 'redis'
  },

  grunt: {
    _hookTimeout: 600000
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 8080,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "info"
  // }

};

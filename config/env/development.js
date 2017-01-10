/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'localDiskDb'
  },
  cryptoJs: {
    secret: 'keyboardcats123'
  },
  email: {
    user: 'cr.blackburn89@gmail.com',
    service: 'gmail',
    mailOptions = {
			from: 'shingo.it@usu.edu',
			to: email,
			subject: 'test email',
			html: '<p>This is a test email</p>'
		}
  }

};

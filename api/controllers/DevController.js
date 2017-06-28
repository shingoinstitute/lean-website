/**
 * DevController
 *
 * @description :: Server-side logic for managing devs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
	test: function(req, res) {
		if (sails.config.environment != 'development') {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			sails.log.warn(`DevController route access attempted outside of development environment.\n\tfrom ${ip}\n\t${AppService.getTimestamp()}`)
			return res.status(403).json({data: `This action is only available in a development environment.`});
		}
		
		return res.json({
			data: 'testing dev environment'
		});
	}
};

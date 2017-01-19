/**
 * isEntryOwner.js
 *
 * @module      :: Policy
 * @description :: Policy that checks if the user is the owner of an entry
 *
 */

module.exports = function (req, res, next) {
	Entry.findOne({id: req.param('id')})
	.populate("owner")
	.exec(function(err, entry) {
		if (err) return res.negotiate(err);
		if (!entry) return res.status(404).json('entry not found');
		if (entry.owner.uuid == req.user.uuid) return next();
		return res.status(403).json('user not authorized');
	});
};

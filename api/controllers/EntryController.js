/**
 * EntryController
 *
 * @description :: Server-side logic for managing entries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upvote: function(req, res) {
		var entryId = req.param('id');
		var user = req.user;
		user.questions_did_upvote.add(entryId);
		user.questions_did_downvote.remove(entryId);
		user.save(function(err) {
			if (err) return res.json({error: err});
			Entry.findOne({id: entryId})
			.populate('users_did_upvote')
			.populate('users_did_downvote')
			.exec(function(err, entry) {
				if (err) return res.json({error: err});
				if (!entry) return res.json({error: 'entry not found, failed to add upvote.'});
				return res.json(entry.toJSON());
			});
		});
	},

	downvote: function(req, res) {
		var entryId = req.param('id');
		var user = req.user;
		user.questions_did_downvote.add(entryId);
		user.questions_did_upvote.remove(entryId);
		user.save(function(err) {
			if (err) return res.json({error: err});
			Entry.findOne({id: entryId})
			.populate('users_did_upvote')
			.populate('users_did_downvote')
			.exec(function(err, entry) {
				if (err) return res.json({error: err});
				if (!entry) return res.json({error: 'entry not found, failed to add downvote'});
				return res.json(entry.toJSON());
			});
		});
	}

};


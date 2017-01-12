/**
 * EntryController
 *
 * @description :: Server-side logic for managing entries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upvote: function(req, res) {
		var entryId = req.param('id');
		var userId = req.param('userId');
		
		Entry.findOne({id: entryId}).exec(function(err, entry) {
			if (err) return res.json({
				success: false,
				error: err
			});

			if (!entry) return res.json({
				success: false,
				error: 'entry not found!'
			});

			entry.addUpvote(userId)
			.then(function(entry) {
				return res.json({
					success: true,
					entry: entry
				});
			})
			.catch(function(err) {
				return res.json({
					success: false,
					error: err
				});
			});
		});
	},

	downvote: function(req, res) {
		var entryId = req.param('id');
		var userId = req.param('userId');

		Entry.findOne({id: entryId}).exec(function(err, entry) {
			if (err) return res.json({
				success: false,
				error: err
			});

			if (!entry) return res.json({
				success: false,
				error: 'entry not found!'
			});

			entry.addDownvote(userId)
			.then(function(entry) {
				return res.json({
					success: true,
					entry: entry
				});
			})
			.catch(function(err) {
				return res.json({
					success: false,
					error: err
				});
			});
		});
	}

};


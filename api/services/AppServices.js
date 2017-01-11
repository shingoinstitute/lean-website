/**
*  @desc AppServices.js - A place to put custom functions used througout the app.
*
*/

var Promise = require('bluebird');

module.exports = {

	/**
	 * @description objToString :: stringifies and flattens an array
	 */
	arrayToString: function(arr) {
		if (Array.isArray(arr)) {
			var string = "";
			for (var i = 0; i < arr.length; i++) {
				string += arr[i];
				if (i < arr.length - 1) { string += ", "; }
			}
			return string;
		} else if (typeof arr === 'object') {
			return JSON.stringify(arr);
		} else {
			throw new Error('Error: cannot stringify array ', arr);
		}
	},

	/**
	 * @description getLoggedInUser :: gets currently logged in user if present.
	 */
	getLoggedInUser: function(next) {

	}

}

/**
*  @desc AppServices.js - A place to put custom functions used througout the app.
*
*/

module.exports = {
	toString: function(obj) {
		if (Array.isArray(obj)) {
			var string = "";
			for (var i = 0; i < obj.length; i++) {
				string += obj[i];
				if (i < obj.length - 1) { string += ", "; }
			}
			return string;
		} else if (typeof obj === 'object') {
			return JSON.stringify(obj, null, 2);
		} else {
			try {
				var string = obj.toString();
				return string;
			} catch (e) {
				return e.fileName + ':' + e.lineNumber + ':  ' + e.message;
			}
		}
	},
}

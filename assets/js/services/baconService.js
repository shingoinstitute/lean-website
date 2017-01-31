(function() {
	'use strict';

	angular.module('leansite')
	.factory('_baconService', _baconService);

	_baconService.$inject = ['$http'];

	function _baconService($http) {
		var service = {};
		/**
		* @description :: Lorem Ipsum rest API for generating garbage content
		* @param {Integer} paragraphs - (optional) Number of paragraphs, if null, defaults to 5.
		* @param {Integer} sentences - (optional) Number of sentences. This overrides paragraphs.
		* @param {function} next - node style callback function, next(err, htmlString);
		*/
		service.getBacon = function(paragraphs, sentences, next) {
			var url = 'https://baconipsum.com/api/?type=meat-and-filler';
			if (typeof sentences == 'string') {
				url += '&sentences=' + sentences;
			} else if (typeof paragraphs == 'string') {
				url += '&paras=' + options.paragraphs;
			}
			url += '&start-with-lorem=1';

			var config = {};
			config.method = 'GET';
			config.url = url;

			$http(config)
			.then(function(data) {
				return next(null, data.data);
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		return service;
	}

})();

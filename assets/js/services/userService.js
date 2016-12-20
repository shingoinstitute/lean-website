(function() {
	'use strict';

	angular.module('leansite')
	.factory('_userService', ['$http', '$cookies', '$window', '$location', function($http, $cookies, $window, $location) {
		var service = {};

		service.findMe = function(next) {
			$http.get('/me')
			.then(function(data) {
				if (data.data && data.data.user) {
					return next(null, data.data.user)
				} else {
					return next(new Error('API request error @ _userService.findMe: user is undefined.'));
				}
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		return service;
	}])

})();

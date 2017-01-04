(function () {
	'use strict';

	angular.module('leansite')
		.factory('_userService', _userService);

	_userService.$inject = ['$http', '$cookies', '$window', '$location', 'JWT_TOKEN']

	function _userService($http, $cookies, $window, $location, JWT_TOKEN) {
		var service = {};

		service.getUser = function (next) {
			$http.get('/me')
				.then(function (data) {
					var user;
					if (data.data) user = data.data.user;
					if (!user) { return next(new Error('Error: user not found, @ userService.findMe.')); }
					return next(null, user);
				})
				.catch(function (err) {
					console.error('Error: ', err);
					return next(err, false);
				});
		}

		service.updateUser = function (user, next) {
			var params = JSON.stringify(user);
			$http.put('/user/' + user.uuid, params)
				.then(function (data) {
					if (data.data && data.data.user) {
						return next(null, data.data.user);
					}
					return next(null, false);
				})
				.catch(function (err) {
					console.error('Error: ', err);
					return next(err, false);
				});
		}

		return service;
	};

})();

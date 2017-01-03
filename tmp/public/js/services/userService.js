(function() {
	'use strict';

	angular.module('leansite')
	.factory('_userService', _userService);

	_userService.$inject = ['$http', '$cookies', '$window', '$location', 'JWT_TOKEN']

	function _userService($http, $cookies, $window, $location, JWT_TOKEN) {
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
				console.error('Error: ', err);
				return next(err, false);
			});
		}

		service.saveUser = function(user, next) {
			var uuid = user.uuid;
			delete user.uuid;
			var params = JSON.stringify(user);
			$http.put('/user/' + uuid, params)
			.then(function(data) {
				if (data.data && data.data.user) {
					return next(null, data.data.user);
				}
				return next(null, false);
			})
			.catch(function(err) {
				console.error('Error: ', err);
				return next(err, false);
			});
		}

		service.getUser = function(next) {
			if (typeof $cookies.get(JWT_TOKEN) != 'undefined') {
				_userService.findMe(function (err, user) {
					if (err) { 
						$scope.$broadcast(BROADCAST.error, err); 
						return next(err, null);
					}

					if (!user) {
						var error = new Error();
						error.message = 'Error: user not found.';
						return next(error, false);
					}

					if (user) {
						return next(null, user);
					}
				});
			}
		}

		return service;
	};

})();

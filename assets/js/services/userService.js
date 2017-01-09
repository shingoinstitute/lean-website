(function () {
	'use strict';

	angular.module('leansite')
		.factory('_userService', _userService);

	_userService.$inject = ['$http', '$cookies', '$window', '$location', 'JWT_TOKEN']

	function _userService($http, $cookies, $window, $location, JWT_TOKEN) {
		var service = {};

		/**
		 * @desc {function} getUser :: API call to find user, requires a JWT
		 */
		service.getUser = function (next) {

			if (!$cookies.get(JWT_TOKEN)) {
				return next(new Error('Error: user does not have a JSON Web Token'), false);
			}

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

		/**
		 * @description Call to REST API to update user
		 * @param user - the new fields to update
		 * @return updatedUser - the updatedUser from the server
		 * @throws "No user returned" when the server doesn't return a user
		 */
		service.updateUser = function (user) {
			delete user.permissions
			var params = JSON.stringify(user);
			return $http.put('/user/' + user.uuid, params)
				.then(function (data) {
					if (data.data) {
						return data.data;
					}
					throw "No user returned!";
				});
		}

		return service;
	};

})();

(function () {
	'use strict';

	angular.module('leansite')
		.factory('_userService', _userService);

	_userService.$inject = ['$http', '$cookies', '$window', '$location', '$q', 'JWT_TOKEN']

	function _userService($http, $cookies, $window, $location, $q, JWT_TOKEN) {
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
		 * @description createUser :: Call to REST API to create new user
		 * @param {Object} user - new user object
		 * @return {Object} - newly created user object
		 * @throws {Error} - "Failed to create new user" when server doesn't return a user
		 */
		service.createUser = function (user) {
			return $q(function(resolve, reject) {
				$http.post('/user', user)
				.then(function (data) {
					if (data.data) {
						return resolve(data.data);
					}
					return reject(new Error("An unknown error occured, failed to create new user..."));
				})
				.catch(function (err) {
					return reject(err);
				});
			});
		}

		/**
		 * @description deleteUser :: deletes a user from the database
		 * @param {Object} user - user object with a valid uuid
		 */
		service.deleteUser = function (user) {
			return $http.delete('/user/' + user.uuid);
		}

		/**
		 * @description Call to REST API to update user
		 * @param {Object} user - the new fields to update
		 */
		service.updateUser = function (user) {
			return $http.put('/user/' + user.uuid, user);
		}

		service.findAll = function () {
			return $http.get('/user');
		}

		return service;
	};

})();

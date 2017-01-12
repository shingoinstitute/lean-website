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
		 * @description Call to REST API to update user
		 * @param user - the new fields to update
		 * @return updatedUser - the updatedUser from the server
		 * @throws "No user returned" when the server doesn't return a user
		 */
		service.updateUser = function (user) {
			var params = JSON.stringify(user);
			return $http.put('/user/' + user.uuid, params)
				.then(function (data) {
					if (data.data) {
						return data.data;
					}
					throw new Error("No user returned!");
				});
		}

		/**
		 * @description createUser :: Call to REST API to create new user
		 * @param {Object} user - new user object
		 * @return {Object} - newly created user object
		 * @throws {Error} - "Failed to create new user" when server doesn't return a user
		 */
		service.createUser = function (user) {
			var params = JSON.stringify(user);
			return $q(function(resolve, reject) {
				$http.post('/user', params)
				.then(function (data) {
					if (data.data) {
						return resolve(data.data);
					}
					return reject(new Error("An unknown error occured, failed to create new user..."));
				})
				.catch(function (err) {
					return reject(err);
				});
			})
			
		}

		/**
		 * @description deleteUser :: deletes a user from the database
		 * @param {Object} user - user object with a valid uuid
		 */
		service.deleteUser = function (user) {
			var uuid = user.uuid;
			return $q(function (resolve, reject) {
				if (!uuid) return reject(new Error('uuid is undefined, failed to delete user...'));
				$http.delete('/user/' + uuid)
				.then(function (data) {
					if (data.data) {
						return resolve(data.data);
					}
					return reject(new Error("An unknown error occured, failed to delete user..."));
				})
				.catch(function(err) {
					return reject(err);
				});
			});
		}

		service.findAll = function () {
			return $q(function (resolve, reject) {
				$http.get('/user')
				.then(function (data) {
					if (data.data) {
						return resolve(data.data);
					}
					return reject(new Error("Users not returned!"));
				})
				.catch(function(err) {
					return reject(err);
				});
			});
		}

		return service;
	};

})();

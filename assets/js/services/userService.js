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
		service.getUser = function () {
			return $http.get('/me');
		}

		/**
		 * @description createUser :: Call to REST API to create new user
		 */
		service.createUser = function (user) {
			return $http.post('/user', user);
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

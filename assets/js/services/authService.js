(function() {
	'use strict';

	angular.module('leansite')
	.factory('_authService', _authService);

	_authService.$inject = ['$http', '$cookies', '$window', '$location', '$rootScope', 'BROADCAST', 'JWT_TOKEN']

	function _authService($http, $cookies, $window, $location, $rootScope, BROADCAST, JWT_TOKEN) {
		var service = {};

		/**
		* @description :: Login using local authentication strategy
		* @param username - the user's email address
		* @param password - the user's password
		*/
		service.authenticateLocal = function(username, password, next) {
			$http.post('/auth/local', {
				username: username,
				password: password
			})
			.then(function(data) {
				console.log('', data.data);
				if (!data.data && !data.data.user) { $rootScope.$broadcast(BROADCAST.error, 'Login error, @local auth: user is undefined.'); }

				if (data.data && data.data.token) {
					var token = data.data.token;
					$cookies.put(JWT_TOKEN, token);
				}

				if (data.data && data.data.user) {
					return next(null, data.data.user);
				}
				return next(null, false);
			})
			.catch(function(err) {
				console.log('', err);
				return next(err);
			});
		}

		/**
		* @description :: Login using LinkedIn OAuth 2.0 authentication strategy
		* @see {file} - config/passport.js
		*/
		service.authenticateLinkedin = function() { $window.location.href = "/auth/linkedin"; }

		/**
		* @description :: Logout user; removes JWT token from cookies; redirects client to home page
		*/
		service.logout = function() {
			$http.get('/auth/logout')
			.then(function(data) {
				$cookies.remove(JWT_TOKEN);
				$rootScope.$broadcast(BROADCAST.userLogout);
				$location.path('/home');
			});
		}

		return service;
	}

})();

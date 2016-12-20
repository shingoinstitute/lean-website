(function() {
	'use strict';

	angular.module('leansite')
	.factory('_authService', ['$http', '$cookies', '$window', '$location', '$rootScope', function($http, $cookies, $window, $location, $rootScope) {
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
				if (!data.data && !data.data.user) { $rootScope.$broadcast(BROADCAST_ERROR, 'Login error, @local auth: user is undefined.'); }

				if (data.data && data.data.token) { $cookies.put('token', data.data.token); }

				if (data.data && data.data.user) {
					$rootScope.$broadcast(BROADCAST_USER_LOGIN);
				}
				return next();
			})
			.catch(function(err) {
				if (!data.data && !data.data.user) { $rootScope.$broadcast(BROADCAST_ERROR, err.message); }
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
			.finally(function() {
				$rootScope.$broadcast(BROADCAST_USER_LOGOUT);
				$cookies.remove('token');
				$location.path('/home');
			});
		}

		return service;
	}])

})();

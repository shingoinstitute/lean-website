(function () {
	'use strict';

	angular.module('leansite')
		.factory('_authService', _authService);

	_authService.$inject = ['$http', '$cookies', '$window', '$location', '$rootScope', 'BROADCAST', 'JWT_TOKEN']

	function _authService($http, $cookies, $window, $location, $rootScope, BROADCAST, JWT_TOKEN) {
		var service = {};

		/**
		* @description :: Login using local authentication strategy
		* @param {string} username - the user's email address
		* @param {string} password - the user's password
		*/
		service.authenticateLocal = function (username, password, next) {
			$http.post('/auth/local', {
				username: username,
				password: password
			})
				.then(function (response) {
					if (response.data && response.data.error) {
						var error = response.data.error;
						if (typeof error == 'Error') {
							return next(error, false);
						}
						return next(new Error(error), false);
					}

					var user;
					if (response.data) { user = response.data.user; }

					if (!user) {
						return next(new Error('Error: user not found.'), false);
					}

					var token;
					if (response.data && response.data.token) { token = response.data.token; }

					if (!token) {
						return next(new Error('Error: JWT token not found.'), false);
					}

					$cookies.put(JWT_TOKEN, token);
					return next(null, user);
				})
				.catch(function (err) {
					console.error('', err);
					if (err.data && err.data.error) return next(err.data.error);
					return next(err);
				});
		}

		/**
		* @description :: Login using LinkedIn OAuth 2.0 authentication strategy
		* @see {file} - {root}/config/passport.js
		*/
		service.authenticateLinkedin = function () { $window.location.href = "/auth/linkedin"; }

		/**
		 * @description {function} createAccount :: POSTs to server to create a new user who can be authenticated via a local strategy
		 * @param {Object} user :: user object containing required parameters
		 */
		// * @return {Promise} :: returns a bluebird promise
		service.createAccount = function (user, next) {
			// return new Promise(function (resolve, reject) {
				if (!user.password || !user.firstname || !user.lastname || !user.email) {
					// return reject(new Error('Error: Missing required fields.'))
					return next(new Error('Error: Missing required fields.'), false);
				}

				$http.post('/user', {
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					password: user.password
				})
				.then(function (response) {
					if (response.data && response.data.error)
						return next(response.data.error, false);
						// return reject(data.data.error)

					var user;
					if (response.data)
						user = response.data.user;

					var token;
					if (response.data)
						token = response.data.token;

					if (!token)
						return next(new Error('failed to generate JSON Web Token!'));
					$cookies.put(JWT_TOKEN, token);

					if (!user)
						return next(new Error('an unknown error occured'), false);
						// return reject(new Error('an unknown error occured'));

						
						// broadcasting to MainController will cause MainController to call its getUser() function
						$rootScope.$broadcast('$MainControllerListener');
						return next(null, user);
					// return resolve(user);
				})
				.catch(function (err) {
					return next(err, false);
					// return reject(err);
				});
			// });
		}

		/**
		* @description :: Logout user; removes JWT token from cookies; redirects client to home page
		*/
		service.logout = function () {
			$http.get('/auth/logout')
				.then(function (data) {
					$cookies.remove(JWT_TOKEN);
					$rootScope.$broadcast(BROADCAST.userLogout);
					$location.path('/home');
				});
		}

		return service;
	}

})();

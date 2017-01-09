(function () {
	'use strict';

	angular.module('leansite')
		.controller('AuthController', AuthController);

	AuthController.$inject = ['$scope', '$http', '$rootScope', '$location', '_authService', '_userService', 'BROADCAST'];

	function AuthController($scope, $http, $rootScope, $location, _authService, _userService, BROADCAST) {
		var vm = this;

		vm.user = {};
		vm.createButonEnabled = false;

		vm.progressCircleEnabled = false;

		$scope.username = '';
		$scope.password = '';

		/**
		 * @description {function} authenticateLinkedIn :: authenticates user via LinkedIn. 
		 * @see {file} authService.js
		 */
		vm.authenticateLinkedIn = function () {
			_authService.authenticateLinkedin();
		}

		/**
		 * @description: Authenticates user via local strategy. If user login is succesful, redirects user to /dashboard
		 * @param {string} username: user's email or username
		 * @param {string} password: user's password
		 */
		vm.authenticateLocal = function (username, password) {
			vm.progressCircleEnabled = true;

			_authService.authenticateLocal(username, password, function (err, user) {
				vm.progressCircleEnabled = false;
				if (err) { vm.loginError = err.message || err; }
				if (user) { $location.path('/dashboard'); }
			});
		}

		/**
		 * @description {function} logout :: logs user out using _authService
		 */
		vm.logout = function() {
			_authService.logout();
		}

		vm.createAccount = function(user) {
			console.log('user: ', user);
			delete user.confirmPassword;
			console.log('user: ', user);
			
			_authService.createAccount(user, function(err, user) {
				if (err) {
					vm.error = err;
					return;
				}
					
				if (!user) {
					vm.error = 'An unknown error occured, failed to create a new account.'
					return;
				}

				_userService.getUser(function(err, user) {
					if (err) return console.error('Error: ', err);
					if (user) {
						$rootScope.$broadcast(BROADCAST.userLogin, user);
						$location.path('/dashboard');
					}
				});
				
			});
		}

		$scope.$watch(function() {
			return typeof vm.user.firstname != 'undefined'
			&& typeof vm.user.lastname != 'undefined'
			&& typeof vm.user.email != 'undefined'
			&& vm.user.password && (vm.user.password == vm.user.confirmPassword);
		}, function(value) {
			vm.createButonEnabled = value;
		});

	}
})();

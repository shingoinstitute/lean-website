/**
* @description :: leansite app
*/

(function() {
	'use strict';
	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider) {

		$routeProvider
		.when('/', {
			templateUrl: 'templates/homepage.html',
			controller: 'HomeController'
		})
		.when('/dashboard', {
			templateUrl: 'templates/dashboard.html',
			controller: 'DashboardController'
		})
		.when('/education', {
			templateUrl: 'templates/education.html',
			controller: 'EducationController'
		})
		.when('/about', {
			templateUrl: 'templates/about.html',
			controller: 'AboutController'
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'LoginController'
		})
		.when('teachingResources', {
			templateUrl: 'templates/teachingResources.html'
		})
		.otherwise({
			redirectTo: '/',
		});

		$locationProvider.html5Mode(true);

		var blueGreyMap = $mdThemingProvider.extendPalette('blue-grey', {
			'500': '#ffffff',
			'contrastDefaultColor': 'dark'
		});

		$mdThemingProvider.definePalette('custom-blue-grey', blueGreyMap);

		$mdThemingProvider.theme('default')
			.primaryPalette('custom-blue-grey', {
				'default': '500'
			})
			.accentPalette('teal', {
				'default': '600'
			});

		$mdThemingProvider.theme('form-dark')
			.primaryPalette('blue', {
				'default': '800'
			})
			.dark();

	})

	.run(function($http, $cookies) {
		var token = $cookies.get('token') || null;
		if (token) {
			$http.defaults.headers.common.Authorization = 'JWT ' + token;
		}
	})

	.factory('loginService', ['$http', '$cookies', function($http, $cookies) {

		var service = {};

		/**
		*	Login a user
		*
		* @param username - the user's email address
		* @param password - the user's password
		*/
		service.localAuth = function(username, password, next) {
			$http.post('/auth/local', {
				username: username,
				password: password
			})
			.then(function(data) {

				if (data.data.token) {
					$cookies.put('token', data.data.token);
				}

				if (data.data.user) {
					$cookies.putObject('user', data.data.user);
				}

				return next();
			});
		}

		service.logout = function(next) {
			$http.get('/auth/logout')
			.then(function(data) {
				$cookies.remove('token');
				$cookies.remove('user');
				return next();
			})
			.catch(function(err) {
				return next(err);
			});
		}

		return service;
	}])

	.controller('MainController', ['$scope', '$http', '$cookies', 'loginService', function($scope, $http, $cookies, loginService) {
		var vm = this;

		$scope.username = '';
		$scope.password = '';

		vm.token = $cookies.get('token') || null;
		vm.user = $cookies.getObject('user') || null;

		vm.authenticateLocal = function(username, password) {
			loginService.localAuth(username, password, function() {
				try {
					vm.token = $cookies.get('token');
					vm.user = $cookies.getObject('user');
				} catch (e) {
					vm.token = null;
					vm.user = null;
					vm.error = 'Internal error occured, login failed.'
				}
			});
		}

		vm.logout = function() {
			loginService.logout(function(err) {
				if (err) vm.error = err.message;

				vm.token = $cookies.get('token') || null;
				vm.user = $cookies.getObject('user') || null;
				vm.message = null;

			});
		}

	}])

	.controller('NavController', ['$scope', '$location', '$sce', function($scope, $mdDialog) {
		var vm = this;
		var originatorEv;

		vm.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		}

	}])

	.controller('HomeController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'home'
	}])

	.controller('DashboardController', ['$scope', '$rootScope', '$http', '$sce', function($scope, $rootScope, $http) {
		var vm = this;

		vm.includeSrc = 'templates/user/me.html';

	}])

	.controller('EducationController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'education'
	}])

	.controller('AboutController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'about'
	}])

	.controller('LoginController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
		var vm = this;

	}])

})();

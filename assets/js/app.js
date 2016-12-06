/**
* @description :: leansite app
*/

(function() {
	'use strict';
	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider) {

		$routeProvider
		.when('/home', {
			templateUrl: 'templates/homepage.html',
			controller: 'HomeController'
		})
		.when('/dashboard', {
			templateUrl: 'templates/user/dashboard.html',
			controller: 'DashboardController'
		})
		.when('/dashboard/settings', {
			templateUrl: 'templates/user/settings.html',
			controller: 'SettingsController'
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
		.when('/createAccount', {
			templateUrl: 'templates/user/createAccount.html'
		})
		.when('/teachingResources', {
			templateUrl: 'templates/teachingResources.html'
		})
		.otherwise({
			redirectTo: '/home',
		});

		$locationProvider.html5Mode(true);

		var blueGreyMap = $mdThemingProvider.extendPalette('indigo', {
			// '500': '#ffffff',
			'contrastDefaultColor': 'light'
		});
		$mdThemingProvider.definePalette('custom-indigo', blueGreyMap);

		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('red');

		$mdThemingProvider.theme('dark')
			.primaryPalette('custom-indigo').dark();

		var defaultMap = $mdThemingProvider.extendPalette('indigo')
		$mdThemingProvider.definePalette('form', defaultMap);
		$mdThemingProvider.theme('form').dark();

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
					var user = data.data.user;
					if (user.role == 'systemAdmin' || user.role == 'admin') {
						user.isAdmin = true;
					} else {
						user.isAdmin = false;
					}
					$cookies.putObject('user', user);
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

	.controller('MainController', ['$scope', '$http', '$cookies', 'loginService', '$location', function($scope, $http, $cookies, loginService, $location) {
		var vm = this;

		$scope.$on('messageListener', function(event, args) {
			if (typeof args == 'string') {
				vm.message = args;
			} else if (args.error) {
				vm.error = args.error;
			} else if (args.message) {
				vm.message = args.message;
			}
		});

		$scope.username = '';
		$scope.password = '';

		vm.token = $cookies.get('token') || null;
		vm.user = $cookies.getObject('user') || null;

		vm.authenticateLocal = function(username, password) {
			loginService.localAuth(username, password, function() {
				try {
					vm.token = $cookies.get('token');
					vm.user = $cookies.getObject('user');
					$location.path('/dashboard');
				} catch (e) {
					vm.token = null;
					vm.user = null;
					vm.error = 'Internal error occured, login failed.';
				}
			});
		}

		vm.authenticateLinkedIn = function() {

		}

		vm.logout = function() {
			loginService.logout(function(err) {
				if (err) vm.error = err.message;
				$cookies.remove('token');
				$cookies.remove('user');
				vm.token = null;
				vm.user = null;
				vm.message = null;
				$location.path('/home');
			});
		}

	}])

	.controller('NavController', ['$scope', '$rootScope', '$cookies', '$location', function($scope, $rootScope, $cookies, $location) {
		var vm = this;
		var originatorEv;

		function showDashboardTemplate(templateName) {
			$rootScope.$broadcast(templateName);
			var dashboardListener = $rootScope.$on('$dashboardControllerViewDidLoad', function() {
				$rootScope.$broadcast(templateName);
				dashboardListener();
			});
			$location.path('/dashboard');
		}

		vm.showUserDashboard = function() {
			showDashboardTemplate('showDashboard');
		}

		vm.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		}

	}])

	.controller('HomeController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'home'
	}])

	.controller('DashboardController', ['$scope', '$rootScope', '$cookies', '$http', '$location', function($scope, $rootScope, $cookies, $http, $location) {
		var vm = this;

		vm.includeSrc = 'templates/user/me.html'

		$scope.$on('$viewContentLoaded', function() {
			$rootScope.$broadcast('$dashboardControllerViewDidLoad');
		});

		try {
			vm.user = $cookies.getObject('user');
		} catch(e) {
			$rootScope.$broadcast('messageListener', {error: e});
		}

		$scope.$on('showDashboard', function(event) {
			if (vm.user) vm.includeSrc = 'templates/user/me.html';
		});

	}])

	.controller('SettingsController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
		var vm = this;

		$http.get('/me')
		.then(function(data) {
			if (data.data.user.permissions) {
				$scope.userPermissions = data.data.user.permissions;
			}
			if (data.data.error) {
				$rootScope.$broadcast('messageListener', {error: data.data.error});
			}
		})
		.catch(function(err) {
			$rootScope.$broadcast('messageListener', {
				error: err
			});
		});

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

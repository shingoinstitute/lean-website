/**
* @description :: leansite app
*/

(function() {
	'use strict';
	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider, $mdThemingProvider) {

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

	.factory('loginService', ['$http', function($http) {

		var service = {};

		/**
		*	Login a user
		*
		* @param username - the user's email address
		* @param password - the user's password
		*/
		service.localAuth = function(username, password, done) {
			$http.post('/auth/local', {
				username: username,
				password: password
			})
			.then(function(data) {
				if (data.status == 200 && data.data.success == true) {
					return done(null, data.data.user, JSON.stringify(data, null, 2));
				} else {
					return done(new Error('Invalid username or password.'), null, JSON.stringify(data, null, 2));
				}
			})
			.catch(function(err) {
				return done(err);
			});
		}

		service.logout = function(next) {
			$http.get('/auth/logout')
			.then(function(data) {
				return next(null, data);
			})
			.catch(function(err) {
				return next(err);
			});
		}

		return service;
	}])

	.controller('MainController', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
		var vm = this;

		$scope.username = '';
		$scope.password = '';

		vm.authenticateLocal = function(username, password) {
			vm.message = 'username: ' + username;
			loginService.localAuth(username, password, function(err, user, data) {
				if (data) { vm.data = data; }
				if (err) { vm.loginError = err; vm.error = err; }
				if (user) { vm.user = user; }
			});
		}

	}])

	.controller('NavController', ['$scope', '$location', '$sce', function($scope, $sce) {
		var vm = this;
		vm.logoSrc = "images/sampleLogo.png";
	}])

	.controller('HomeController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'home'
	}])

	.controller('DashboardController', ['$scope', '$rootScope', '$http', '$sce', function($scope, $rootScope, $http) {
		var vm = this;
		$scope.message = 'Data: '
		vm.getData = function() {
			$scope.message = 'Retrieving Data...'
			$http({
				method: 'GET',
				url: '/users/createUser'
			}).then(function(data, status, headers, config) {
				$scope.data = JSON.stringify(data.data, null, 2);
				$scope.message = 'Data: '
				$scope.responseDetails = "<hr />status: <pre>" + status + "</pre>"
			}, function(data, status, headers, config) {
				$scope.message = 'Data: '
				$scope.responseDetails = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
			});
		}
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

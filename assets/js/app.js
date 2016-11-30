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

	.controller('MainController', ['$scope', '$http', function($scope, $http) {
		var vm = this;
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

		vm.localAuth = function() {
			$scope.data = 'Logging in...'
			var params = {
				username: $scope.username,
				password: $scope.password
			}
			$http.post('/auth/local', params)
			.then(function(data, status, headers, config) {
				if (data.status == 200 && data.data.success == true) {
					$rootScope.user = data.data.user;
				} else {
					$scope.loginError = 'Invalid username or password.'
				}
				// $scope.data = JSON.stringify(data, null, 2);
			}, function(data, status, headers, config) {
				$scope.loginError = 'Internal error, login failed.'
				// $scope.data = JSON.stringify(data, null, 2);
			});
		};

		vm.logout = function() {
			$http.get('/auth/logout')
			.then(function(data, status, headers, config) {
				$rootScope.user = null;
				$scope.data = JSON.stringify(data, null, 2);
			}, function(data, status, headers, config) {
				$scope.data = JSON.stringify(data, null, 2);
			});
		};

	}])

})();

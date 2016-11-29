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
				$scope.responseDetails = "<hr />status: <pre>" + status + "</pre>" +
				"<hr />headers: " + headers +
				"<hr />config: " + config;
			}, function(data, status, headers, config) {
				$scope.message = 'There was an error...'
				$scope.responseDetails = "Data: " + data +
				"<hr />status: " + status +
				"<hr />headers: " + headers +
				"<hr />config: " + config;
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

	.controller('LoginController', ['$scope', '$http', function($scope, $http) {
		var vm = this;

		$scope.username = 'craig.blackburn@usu.edu';
		$scope.password = 'password';

		vm.localAuth = function() {

			$scope.data = 'Logging in...'

			var params = {
				username: $scope.username,
				password: $scope.password
			}

			$http.post('/auth/local', {
				data: params,
				withCredentials: true
			})
			.then(function(data, status, headers, config) {
				$scope.data = JSON.stringify(data, null, 2);
			}, function(data, status, headers, config) {
				$scope.data = JSON.stringify(data, null, 2);
			});
		}

	}])

})();

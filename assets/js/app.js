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
		})
		.when('/dashboard', {
			templateUrl: 'templates/user/dashboard.html',
		})
		.when('/dashboard/settings', {
			templateUrl: 'templates/user/settings.html',
		})
		.when('/education', {
			templateUrl: 'templates/education.html',
		})
		.when('/about', {
			templateUrl: 'templates/about.html',
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
		})
		.when('/auth/linkedin/callback*', {
			template: "<p ng-init=\"linkedinCallback()\">redirecting...</p>",
		})
		.when('/createAccount', {
			templateUrl: 'templates/user/createAccount.html'
		})
		.when('/teachingResources', {
			templateUrl: 'templates/teachingResources.html'
		})
		.when('/admin', {
			templateUrl: 'templates/user/admin.html',
		})
		.otherwise({
			redirectTo: '/home',
		});

		$locationProvider.html5Mode(true);

		var blueGreyMap = $mdThemingProvider.extendPalette('indigo', {
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

	.filter('trustHtml', ['$sce', function($sce) {
		return function(html) {
			return $sce.trustAsHtml(html);
		}
	}])

	.factory('authService', ['$http', '$cookies', '$window', '$location', function($http, $cookies, $window, $location) {

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
					$cookies.putObject('user', user);
				}

				return next();
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		service.linkedinAuth = function() {
			$window.location.href = "/auth/linkedin";
		}

		service.linkedinAuthCallback = function(next) {
			console.log('app.js service.linkedinAuthCallback called...');
			$http.get('/me')
			.then(function(data) {
				$location.path('/dashboard');
				return next(null, data);
			})
			.catch(function(err) {
				$location.path('/login');
				return next(err, false);
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

	.factory('user', ['$http', '$cookies', '$window', '$location', function($http, $cookies, $window, $location) {
		var service = {};

		service.findMe = function(next) {
			$http.get('/me')
			.then(function(data) {
				// console.log(data);
				if (data.data && data.data.user) {
					return next(null, data.data.user)
				} else {
					return next('user not found, please try logging in.');
				}
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		return service;
	}])

	.controller('MainController', ['$scope', '$http', '$cookies', '$location', 'user', function($scope, $http, $cookies, $location, user) {
		var vm = this;

		(function onPageLoad() {
			try {
				vm.user = $cookies.getObject('user');
			} catch(e) {
				console.log(e);
			}
			user.findMe(function(err, user) {
				if (err) $scope.$broadcast('errorMessage', err);
				if (!user) $location.path('/login');
				if (user) {
					$cookies.putObject('user', user)
					vm.user = $cookies.getObject('user');
				}
			});
		})();

		$scope.$on('$infoMessage', function(event, args) {
			if (typeof args == 'string') {
				vm.message = args;
			} else if (args.message) {
				vm.message = args.message;
			}
		});

		$scope.$on('$errorMessage', function(event, args) {
			if (typeof args == 'string') {
				vm.error = args;
			} else if (args.error) {
				vm.error = args.error;
			}
		});

		$scope.$on('$userLoggedIn', function(event) {
			try {
				vm.user = $cookies.getObject('user');
				vm.token = $cookies.get('token');
			} catch (e) {
				vm.error = e.message;
			}
		});

		$scope.$on('$userLoggedOut', function(event) {
			vm.user = null;
			vm.token = null;
		});

	}])

	.controller('NavController', ['$scope', '$rootScope', '$cookies', '$location', 'authService', function($scope, $rootScope, $cookies, $location, authService) {
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

		vm.logout = function() {
			authService.logout(function(err) {
				if (err) vm.error = err.message;
				$cookies.remove('token');
				$cookies.remove('user');
				vm.token = null;
				vm.user = null;
				vm.loginError = null;
				$location.path('/home');
				$rootScope.$broadcast('$userLoggedOut');
			});
		}

	}])

	.controller('HomeController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'home'
	}])

	.controller('DashboardController', ['$scope', '$rootScope', '$cookies', '$http', '$location', 'user', function($scope, $rootScope, $cookies, $http, $location, user) {
		var vm = this;

		vm.includeSrc = 'templates/user/me.html'

		$scope.$on('$viewContentLoaded', function() {
			$rootScope.$broadcast('$dashboardControllerViewDidLoad');
		});

		$scope.$on('showDashboard', function(event) {
			if (vm.user) vm.includeSrc = 'templates/user/me.html';
		});

	}])

	.controller('SettingsController', ['$scope', '$rootScope', '$http', 'user', function($scope, $rootScope, $http, user) {
		var vm = this;

		user.findMe(function(err, user) {
			if (err) { $rootScope.$broadcast('$errorMessage', err); }
			if (user) $scope.userPermissions = user.permissions;
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

	.controller('LoginController', ['$scope', '$http', '$rootScope', '$sce', 'authService', function($scope, $http, $rootScope, $sce, authService) {
		var vm = this;

		$scope.username = '';
		$scope.password = '';

		vm.linkedinCallback = function() {
			authService.linkedinAuthCallback(function(err, data) {
				if (err.data.error) vm.loginError = err.data.error;
				else if (err) console.log(err);
				else if (data.error) vm.loginError = data.error;
				else if (data.data && data.data.user) console.log(data.data.user);
			});
		}

		vm.authenticateLocal = function(username, password) {
			authService.localAuth(username, password, function(err) {
				if (err) {
					vm.loginError = err.message;
				} else {
					try {
						vm.token = $cookies.get('token');
						vm.user = $cookies.getObject('user');
						$location.path('/dashboard');
					} catch (e) {
						vm.token = null;
						vm.user = null;
						vm.loginError = 'Login failed, please check your username and password.';
					}
				}
			});
		}

		vm.authenticateLinkedIn = function() {
			authService.linkedinAuth();
		}

	}])

	.controller('AdminController', ['$scope', 'user', function($scope, user) {
		var vm = this;



	}])

})();

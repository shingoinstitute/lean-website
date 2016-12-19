/**
* @description :: leansite app
*/

const BROADCAST_INFO = '$infoMessage';
const BROADCAST_ERROR = '$errorMessage';
const BROADCAST_USER_LOGOUT =  '$userLoggedOut';
const BROADCAST_USER_LOGIN = '$userLoggedIn';

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

	.factory('_userService', ['$http', '$cookies', '$window', '$location', function($http, $cookies, $window, $location) {
		var service = {};

		service.findMe = function(next) {
			$http.get('/me')
			.then(function(data) {
				if (data.data && data.data.user) {
					return next(null, data.data.user)
				} else {
					return next(new Error('API request error @ _userService.findMe: user is undefined.'));
				}
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		return service;
	}])

	.controller('MainController', ['$scope', '$http', '$cookies', '$location', '_userService', function($scope, $http, $cookies, $location, _userService) {
		var vm = this;

		function getUser() {
			_userService.findMe(function(err, user) {
				if (err) { $scope.$broadcast(BROADCAST_ERROR, err); }
				if (!user) { $location.path('/login'); }
				if (user) { vm.user = user; }
			});
		};

		$scope.$on(BROADCAST_INFO, function(event, args) {
			if (typeof args == 'string') {
				vm.message = args;
			} else if (args.message) {
				vm.message = args.message;
			}
		});

		$scope.$on(BROADCAST_ERROR, function(event, args) {
			if (typeof args == 'string') {
				vm.error = args;
			} else if (args.error) {
				vm.error = args.error;
			}
		});

		$scope.$on(BROADCAST_USER_LOGIN, function(event, user) {
			if (!user) {
				getUser();
			} else {
				vm.user = user;
			}
		})

		$scope.$on(BROADCAST_USER_LOGOUT, function(event) {
			vm.user = null;
		});

		getUser();

	}])

	.controller('NavController', ['$scope', '$rootScope', '$location', '_authService', function($scope, $rootScope, $location, _authService) {
		var vm = this;
		var originatorEv;

		vm.showDashboard = function() {
			$location.path('/dashboard');
		}

		vm.openMenu = function($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		}

		vm.logout = function() { _authService.logout(); }

	}])

	.controller('HomeController', ['$scope', function($scope, $rootScope) {
		var vm = this;
		// $rootScope.currentNavItem = 'home'
	}])

	.controller('DashboardController', ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', function($scope, $rootScope, $cookies, $http, $location, _userService) {
		var vm = this;
		vm.templatePath = 'templates/user/me.html';
	}])

	.controller('SettingsController', ['$scope', '$rootScope', '$http', '_userService', function($scope, $rootScope, $http, _userService) {
		var vm = this;

		_userService.findMe(function(err, user) {
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

	.controller('LoginController', ['$scope', '$http', '$rootScope', '$location', '_authService', '_userService', function($scope, $http, $rootScope, $location, _authService, _userService) {
		var vm = this;

		$scope.username = '';
		$scope.password = '';

		vm.authenticateLinkedIn = function() { _authService.authenticateLinkedin(); }

		vm.authenticateLocal = function(username, password) {
			vm.didClickLogin = true;
			_authService.authenticateLocal(username, password, function(err) {
				if (err) {
					$rootScope.$broadcast(BROADCAST_ERROR, err.message);
					vm.loginError('Login error, please check your username and password.')
				} else {
					_userService.findMe(function(err, user) {
						if (user) { $rootScope.$broadcast(BROADCAST_USER_LOGIN, user); }
						$location.path('/dashboard');
					});
				}
			});
		}

		vm.logout = function() { _authService.logout(); }

	}])

	.controller('AdminController', ['$scope', function($scope) {
		var vm = this;

	}])

})();

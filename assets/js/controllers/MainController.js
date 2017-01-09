(function () {
  'use strict';

  angular.module('leansite')
    .controller('MainController', MainController);

	MainController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$location', '$mdMedia', '_userService', '_baconService', 'BROADCAST', 'JWT_TOKEN'];

	function MainController($scope, $rootScope, $http, $cookies, $location, $mdMedia, _userService, _baconService, BROADCAST, JWT_TOKEN) {
		var vm = this;

		/**
		 * @desc {function} getUser :: returns a user object from the API. Requires a JWT token.
		 */
		vm.getUser = function () {
			_userService.getUser(function(err, user) {
				if (user) vm.user = user;
			});
		};

		/**
		 * @desc {function} generateBacon :: "lorem ipsum" text generator (for developmet purposes)
		 */
		vm.generateBacon = function (sentences, paragraphs, next) {
			return _baconService.getBacon(sentences, paragraphs, function (err, data) {
				if (err) {
					console.error(err);
					return next([]);
				}
				return next(data);
			});
		}

		/**
		 * @desc {function} $watch :: Watches for changes in screen size to determine wether to hide/show the side nav
		 */
		$scope.$watch(function () {
			return $mdMedia('gt-sm');
		}, function (isBigEnough) {
			vm.sideNavEnabled = isBigEnough;
		});

		/**
		 * @desc :: listener for BROADCAST.error, displays error message when invoked
		 */
		$scope.$on(BROADCAST.error, function (event, args) {
			if (typeof args == 'string') {
				vm.error = args;
			} else if (args && args.error) {
				vm.error = args.error;
			}
		});

		/**
		 * @desc :: listener for BROADCAST.userLogout, removes user object from MainController
		 */
		$scope.$on(BROADCAST.userLogout, function (event) {
			vm.user = null;
		});

		/**
		 * @desc :: listener for user login
		 */
		$scope.$on(BROADCAST.userLogin, function(event, user) {
			vm.user = user;
		});

		/**
		 * @desc :: listener for BROADCAST.userUpdated, fetches updated user object for MainController when invoked
		 */
		$scope.$on(BROADCAST.userUpdated, function (event, user) {
			if (user)
				vm.user = user;
			else
				vm.getUser();
		});

		/**
		 * @description {function} :: listener for broadcasts from any controller for communication between controllers
		 * 
		 * listens for event name '$MainControllerListener', and takes a listener function with the event object and the name of the controller the broadcast is coming from.
		 * 
		 * If no controller name is passed in as the second argument to the listener function, the default behavior for MainController is to retrieve the user from the server.
		 */
		$scope.$on('$MainControllerListener', function(event, controller) {
			switch (controller) {
				case 'NavController':
				$rootScope.$broadcast('$NavControllerListener', vm.user);
				break;
				case 'DashboardController':
				if (vm.user) {
					$rootScope.$broadcast('$DashboardControllerListener', vm.user);
				} else {
					_userService.getUser(function(err, user) {
						if (err) $location.path('/login');
						if (!user) $location.path('/login');
						vm.user = user;
						$rootScope.$broadcast('$DashboardControllerListener', vm.user);
					});
				}
				break;
				case 'AuthController':
				
				break;
				case 'SettingsController':
				// do something...
				break;
				case 'TEST':
				console.log('user: ', vm.user);
				
				break;
				default:
				vm.getUser();
				break;
			}
		});

		vm.getUser();
		vm.generateBacon(null, null, function (data) {
			vm.fillerContent = data;
		});

  }

})();

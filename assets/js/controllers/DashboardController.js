(function () {
	'use strict';

	angular.module('leansite')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', 'JWT_TOKEN'];

	function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService, JWT_TOKEN) {
		var vm = this;
		vm.templatePath = 'templates/user/me.html';

		/**
		 * @description {function} onPageLoad :: sends broadcast to MainController, which in return sends broadcast back to DashboardController via '$DashboardControllerListener'
		 * @param {string} listenerName :: name of the listener
		 * @param {string} controllerName :: name of the controller making the broadcast
		 */
		vm.onPageLoad = function(listenerName, controllerName) {
			$rootScope.$broadcast(listenerName, controllerName);
		}

		/**
		 * @description {function} :: listener for broadcast from MainController. If user (in function(event, user)) is null, a user is not logged in.
		 */
		$scope.$on('$DashboardControllerListener', function(event, user) {
			
		});

		vm.onPageLoad('$MainControllerListener', 'DashboardController');

	}

})();

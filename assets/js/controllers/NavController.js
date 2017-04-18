(function () {
  'use strict';

  angular.module('leansite')
    .controller('NavController', NavController);

	NavController.$inject = ['$scope', '$rootScope', '$location', '$mdSidenav', '_authService'];

	function NavController($scope, $rootScope, $location, $mdSidenav, _authService) {
		var vm = this;

		$scope.toggleSidenav = function() {
			$mdSidenav('sidenav').toggle();
		};

		$scope.makeActive = function(ref) {
      $scope.currentNavItem = 'about';
    };

		$scope.setCurrentNavItem = function() {
		  var path = $location.path();
		  if (path === '/') {
		    $scope.currentNavItem = 'home';
      } else if (path.includes('entries')) {
        $scope.currentNavItem = 'forum';
      } else if (path.includes('teachingCurriculum')) {
        $scope.currentNavItem = 'teaching';
      } else if (path.includes('about')) {
        $scope.currentNavItem = 'about';
      } else {
        $scope.currentNavItem = '';
      }

    };

		/**
		 * @description {function} showDashboard :: sends broadcast message to MainController which then sends a broadcast message back to NavController via '$NavControllerListener'
		 */
		vm.showDashboard = function () {
			$rootScope.$broadcast('$MainControllerListener');
		};

		/**
		 * @description {function} :: listens for broadcast from MainController then directs user to '/dashboard' or '/login' depending on whether or not a user is logged in.
		 */
		$scope.$on('$NavControllerListener', function (event, user) {
			if (user) {
				$location.path('/dashboard');
			} else {
				$location.path('/login');
			}
		});

		/**
		 * @description {function} logout :: logs user out via _authService
		 */
		vm.logout = function () {
			_authService.logout();
		}

  }
})();

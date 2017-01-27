(function () {
  'use strict';

  angular.module('leansite')
    .controller('NavController', NavController);

	NavController.$inject = ['$scope', '$rootScope', '$location', '$mdSidenav', '$mdDialog', '_authService']
	function NavController($scope, $rootScope, $location, $mdSidenav, $mdDialog, _authService) {
		var vm = this;
		var originatorEv;

		/**
		 * @description {function} openMenu :: Handler for opening/closing the toolbar menu
		 */
		vm.openMenu = function ($mdOpenMenu, $event) {
			originatorEv = $event;
			$mdOpenMenu($event);
		}

		/**
		 * @description {function} showDashboard :: sends broadcast message to MainController which then sends a broadcast message back to NavController via '$NavControllerListener'
		 */
		vm.showDashboard = function () {
			$rootScope.$broadcast('$MainControllerListener');
		}

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

		/**
		 * @description {function} :: Changes the title on the toolbar depending on current route
		 * @param {string} newUrl - fully qualified current url.
		 * @param {string} oldUrl - fully qualified old url.
		 */
    function setTitle(url) {
      url = url[url.length - 1];

      switch (url) {
        case 'home':
          vm.title = "Home";
          break;
        case 'dashboard':
          vm.title = "Dashboard";
          break;
        case 'education':
          vm.title = "Education";
          break;
        case 'about':
          vm.title = "About";
          break;
        case 'login':
          vm.title = "Login";
          break;
        case 'createAccount':
          vm.title = "Create Account";
          break;
        case 'teachingResources':
          vm.title = "Teaching Resources";
          break;
        case 'admin':
          vm.title = "Admin Panel";
          break;
        case 'entries':
          vm.title = "Q & A Forum";
          break;
        default:
          vm.title = "Teaching Lean";
          break;
      }
    }

    $scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
      var url = newUrl.split("/");
      setTitle(url);
    });


    setTitle($location.url().split("/"));
    $scope.vm = vm;
  }
})();

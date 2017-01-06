(function () {
	'use strict';

	angular.module('leansite')
		.controller('NavController', NavController);

	NavController.$inject = ['$scope', '$rootScope', '$location', '$mdSidenav', '$mdDialog','_authService']
	function NavController($scope, $rootScope, $location, $mdSidenav, $mdDialog, _authService) {
		var vm = this;
		var originatorEv;

		vm.openMenu = function ($mdOpenMenu, $event) {
			originatorEv = $event;
			$mdOpenMenu($event);
		}

		vm.showDashboard = function () {
			$location.path('/dashboard');
		}

		vm.logout = function () {
			_authService.logout();
		}

		function setTitle(url){
			url = url[url.length - 1];
			
			switch (url) {
				case 'home':
					vm.title = "Home";
					break;
				case 'dashboard':
					vm.title = "Settings";
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

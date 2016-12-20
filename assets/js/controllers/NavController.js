(function() {
	'use strict';

	angular.module('leansite')
	.controller('NavController', NavController);

	NavController.$inject = ['$scope', '$rootScope', '$location', '_authService']
	function NavController($scope, $rootScope, $location, _authService) {
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
	}

})();

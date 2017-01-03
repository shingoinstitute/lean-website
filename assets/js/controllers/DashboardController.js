(function () {
	'use strict';

	angular.module('leansite')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService'];

	function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService) {
		var vm = this;
		vm.templatePath = 'templates/user/me.html';

		vm.OnClickTestButton = function() {
			console.log("Clicked the button.");
		}

		vm.testword = "testing testing";

	}

})();

(function() {

	angular.module('leansite')
	.controller('AdminController', AdminController);

	AdminController.$inject = ['$scope', '$rootScope', '$http', 'BROADCAST'];

	function AdminController($scope, $rootScope, $http, BROADCAST) {
		var vm = this;

		vm.createMockUsers = function() {
			
		}

	}

})();
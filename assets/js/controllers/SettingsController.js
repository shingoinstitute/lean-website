(function() {
	'use strict';

	angular.module('leansite')
	.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$rootScope', '$http', '_userService'];

	function SettingsController($scope, $rootScope, $http, _userService) {
		var vm = this;

		_userService.findMe(function(err, user) {
			if (err) { $rootScope.$broadcast('$errorMessage', err); }
			if (user) $scope.userPermissions = user.permissions;
		});
	}

})();

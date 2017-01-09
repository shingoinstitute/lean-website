(function() {
	'use strict';

	angular.module('leansite')
	.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$rootScope', '$http', '$window', '_userService', 'BROADCAST'];

	function SettingsController($scope, $rootScope, $http, $window, _userService, BROADCAST) {
		var vm = this;

		vm.user = {};
		vm.edits = {};
		vm.edits.firstname = '';
		vm.edits.lastname = '';
		vm.edits.email = '';

		vm.enableSaveButton = false;

		vm.findUser = function() {
			_userService.findMe(function(err, user) {
				if (err) { $rootScope.$broadcast('$errorMessage', err); }
				if (user) {
					vm.user = user;
					vm.edits.firstname = user.firstname;
					vm.edits.lastname = user.lastname;
					vm.edits.email = user.email;
				}
			});
		};

		vm.updateUser = function() {
			vm.edits.uuid = vm.user.uuid;
			_userService.updateUser(vm.edits, function(err, user) {
				if (err) { $rootScope.$broadcast(BROADCAST.error, err.message); }
				vm.findUser();
			});
		}

		vm.didMakeEdit = function() {
			vm.enableSaveButton = !(vm.edits.firstname == vm.user.firstname && vm.edits.lastname == vm.user.lastname && vm.edits.email == vm.user.email);
		}

		vm.findUser();
	}

})();

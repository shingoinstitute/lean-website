(function() {
	'use strict';

	angular.module('leansite')
	.controller('MainController', MainController);

	MainController.$inject = ['$scope', '$http', '$cookies', '$location', '_userService', '_ipsumService'];

	function MainController($scope, $http, $cookies, $location, _userService, _ipsumService) {
		var vm = this;

		vm.getUser = function() {
			_userService.findMe(function(err, user) {
				if (err) { $scope.$broadcast(BROADCAST_ERROR, err); }
				if (!user) { $location.path('/login'); }
				if (user) { vm.user = user; }
			});
		};

		vm.generateContent = function(sentences, paragraphs) {
			_ipsumService.getBacon(sentences, paragraphs, function(err, data) {
				if (err) console.error(err);
				if (data) return data;
			});
		}

		$scope.$on(BROADCAST_INFO, function(event, args) {
			if (typeof args == 'string') {
				vm.message = args;
			} else if (args.message) {
				vm.message = args.message;
			}
		});

		$scope.$on(BROADCAST_ERROR, function(event, args) {
			if (typeof args == 'string') {
				vm.error = args;
			} else if (args.error) {
				vm.error = args.error;
			}
		});

		$scope.$on(BROADCAST_USER_LOGIN, function(event, user) {
			if (!user) {
				vm.getUser();
			} else {
				vm.user = user;
			}
		})

		$scope.$on(BROADCAST_USER_LOGOUT, function(event) {
			vm.user = null;
		});

		vm.getUser();
	}

})();

(function() {
	'use strict';

	angular.module('leansite')
	.controller('MainController', MainController);

	MainController.$inject = ['$scope', '$http', '$cookies', '$location', '_userService', '_baconService', 'BROADCAST', 'JWT_TOKEN'];

	function MainController(   $scope,   $http,   $cookies,   $location,   _userService,   _baconService,   BROADCAST,   JWT_TOKEN) {
		var vm = this;

		vm.message = '';
		vm.error = '';

		vm.getUser = function() {
			if (typeof $cookies.get(JWT_TOKEN) != 'undefined') {
				_userService.findMe(function(err, user) {
					if (err) { $scope.$broadcast(BROADCAST.error, err); }
					if (!user) { $location.path('/login'); }
					if (user) { vm.user = user; }
				});
			} else {
				vm.user = null;
				$location.path('/login');
			}
		};

		vm.generateBacon = function(sentences, paragraphs, next) {
			return _baconService.getBacon(sentences, paragraphs, function(err, data) {
				if (err) {
					console.error(err);
					return next([]);
				}
				return next(data);
			});
		}

		$scope.$on(BROADCAST.info, function(event, args) {
			if (typeof args == 'string') {
				vm.message = args;
			} else if (args && args.message) {
				vm.message = args.message;
			}
		});

		$scope.$on(BROADCAST.error, function(event, args) {
			if (typeof args == 'string') {
				vm.error = args;
			} else if (args && args.error) {
				vm.error = args.error;
			}
		});

		$scope.$on(BROADCAST.userLogin, function(event, user) {
			if (user) vm.user = user;
			if (!user) vm.getUser();
			$location.path('/dashboard');
		})

		$scope.$on(BROADCAST.userLogout, function(event) {
			vm.user = null;
		});

		$scope.$on(BROADCAST.userSaved, function(event, user) {
			if (user)
				vm.user = user;
			else
				vm.getUser();
		});

		vm.getUser();
		// console.log(JWT_TOKEN + ': ' + $cookies.get(JWT_TOKEN));
		vm.generateBacon(null, null, function(data) {
			vm.fillerContent = data;
		});
	}

})();

(function() {
	angular.module('leansite')
	.controller('AuthController', AuthController);

	AuthController.$inject = ['$scope', '$http', '$rootScope', '$location', '_authService', '_userService'];

	function AuthController($scope, $http, $rootScope, $location, _authService, _userService) {
		var vm = this;

		$scope.username = '';
		$scope.password = '';

		vm.authenticateLinkedIn = function() { _authService.authenticateLinkedin(); }

		vm.authenticateLocal = function(username, password) {
			vm.didClickLogin = true;
			_authService.authenticateLocal(username, password, function(err) {
				if (err) {
					$rootScope.$broadcast(BROADCAST_ERROR, err.message);
					vm.loginError('Login error, please check your username and password.')
				} else {
					_userService.findMe(function(err, user) {
						if (user) { $rootScope.$broadcast(BROADCAST_USER_LOGIN, user); }
						$location.path('/dashboard');
					});
				}
			});
		}
		
		vm.logout = function() {
			_authService.logout();
		}
	}
})();

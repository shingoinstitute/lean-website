(function() {
	angular.module('leansite')
	.controller('ResetController', ResetController);

	ResetController.$inject = ['$scope', '$routeParams', '$http', '$location', '$rootScope', '$mdDialog', '_userService', 'BROADCAST'];

	function ResetController($scope, $routeParams, $http, $location, $rootScope, $mdDialog, _userService, BROADCAST) {
		var vm = this;
		var token = $routeParams.r_jwt;

		vm.password = '';
		vm.passwordConfirm = '';
		vm.updateButtonEnabled = false;
		vm.passwordMatchError = false;

		/**
		 * Submits the password reset form
		 */
		$scope.submit = function() {
			if (vm.password != '' && (vm.password == vm.passwordConfirm)) {
				vm.resetPasswordFormEnabled = false;
				_userService.requestPasswordUpdate(vm.password, token)
				.then(function(response) {
					$location.path('/login');
				})
				.catch(function(responseError) {
					if (BROADCAST.loggingLevel == "DEBUG") {
						$rootScope.$broadcast(BROADCAST.error, JSON.stringify(responseError, null, 2));
					} else {
						$rootScope.$broadcast(BROADCAST.error, 'Error: password reset failed.');
					}
				});
			} 
		}

		/**
		 * @description Shows the password reset button if a pword reset token is not present, otherwise shows the password reset form
		 */
		function onPageLoad() {
			if (!token) {
				vm.resetPasswordButtonEnabled = true;
			} else {
				vm.resetPasswordFormEnabled = true;
			}
		}

		/**
		 * @description Makes request to server to send the user an email with a password reset link
		 */
		vm.reset = function() {
			vm.didClickRequestButton = true;
			$mdDialog.show(
				$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Message Sent')
				.textContent('Check your email for a message sent by shingo.it@usu.edu. If you do not recieve an email from us within 10 minutes, please try again.')
				.ariaLabel('Message Send Dialog')
				.ok('Okay')
			);
			_userService.requestPasswordResetEmail(vm.email)
			.then(function(response) {
				console.log('Success: ', response);
			})
			.catch(function(responseError) {
				if (responseError.status == 404) {
					vm.userNotFoundError = "An account with " + vm.email + " does not exist.";
				} else if (BROADCAST.loggingLevel == "DEBUG") {
					$rootScope.$broadcast(BROADCAST.error, JSON.stringify(responseError, null, 2));
				} else {
					$rootScope.$broadcast(BROADCAST.error, 'Error: message failed to send.');
				}
			});
		}

		onPageLoad();

	}

})();
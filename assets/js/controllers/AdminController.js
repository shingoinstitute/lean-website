(function () {

	angular.module('leansite')
		.controller('AdminController', AdminController);

	AdminController.$inject = ['$scope', '$document', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', 'BROADCAST'];

	function AdminController($scope, $document, $rootScope, $http, $mdDialog, $mdToast, _userService, BROADCAST) {
		var vm = this;

		vm.users = [];
		vm.progressCircleEnabled = false;
		vm.toastPosition = 'top right';

		vm.createMockUsers = function () {
			var u1 = {
				firstname: 'Bob',
				lastname: 'Jones',
				email: 'craig.blackburn_test1@usu.edu',
				password: 'password'
			}

			var u2 = {
				firstname: 'John',
				lastname: 'Doe',
				email: 'craig.blackburn_test2@usu.edu',
				password: 'password'
			}

			var u3 = {
				firstname: 'Emmit',
				lastname: 'Bueller',
				email: 'craig.blackburn_test3@usu.edu',
				password: 'password'
			}
			vm.progressCircleEnabled = true;
			_userService.createUser(u1)
				.finally(function (response) {
					_userService.createUser(u2)
						.finally(function (response) {
							_userService.createUser(u3)
								.finally(function (response) {
									vm.progressCircleEnabled = false;
									var toast = $mdToast.simple()
									.textContent('Mock users created...')
									.position('top right')
									$mdToast.show(toast);
									vm.findAllUsers();
								});
						});
				});
		}

		vm.deleteAllUsers = function() {
			vm.progressCircleEnabled = true;
			$http.delete('/dev/delete')
			.then(function(response) {
				console.log(JSON.stringify(response));
				var toast = $mdToast.simple()
				.textContent('Users successfully deleted. Please create a new account.')
				.hideDelay(false)
				.action('Okay')
				.position('top right')
				.highlightAction(true);
				$mdToast.show(toast);
			})
			.catch(function(err) {
				if (BROADCAST.loggingLevel == "DEBUG") {
					$rootScope.$broadcast(BROADCAST.error, err);
				} else {
					$rootScope.$broadcast(BROADCAST.error, err.message);
				}
			})
			.finally(function() {
				vm.progressCircleEnabled = false;
			});
		}

		vm.findAllUsers = function () {
			_userService.findAll()
			.then(function (response) {
				var users = response.data;
				if (users) {
					for (var i = 0; i < users.length; i++) {
						vm.parseRoleText(users[i])
					}
					vm.users = users;
				} else {
					return console.error('Error, server not responding...');
				}
			})
			.catch(function(err) {
				if (BROADCAST.loggingLevel === "DEBUG") {
					console.error(e);
				}
			});
		}

		vm.findAllUsers();

		vm.disableAccount = function (user, el) {
			$scope.updateInProgress = true;
			user.accountIsActive = false;
			var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#'+el));
			_userService.deleteUser(user)
			.then(function(response) {
				toast.textContent('Account succesfully disabled.');
				$mdToast.show(toast);
				vm.updateInProgress = false;
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				$mdToast.show(toastErr);
				vm.updateInProgress = false;
			});
		}

		vm.enableAccount = function(user, el) {
			user.accountIsActive = true;
			$scope.updateInProgress = true;
			var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#'+el));
			_userService.updateUser({
				uuid: user.uuid,
				accountIsActive: user.accountIsActive
			})
			.then(function(response) {
				toast.textContent('Account succesfully enabled.');
				$mdToast.show(toast);
				$scope.updateInProgress = false;
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				$mdToast.show(toast);
				$scope.updateInProgress = false;
			});
		}

		vm.updateUser = function (user, el) {
			var toast = $mdToast.simple().textContent('Saving...').hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#'+el));
			vm.updateInProgress = true;
			var updatee = $.extend(true, {}, user);
			switch(updatee.role) {
				case "System Admin":
				updatee.role = "systemAdmin";
				break;
				case "Admin":
				updatee.role = "admin";
				break;
				case "Editor":
				updatee.role = "editor";
				break;
				case "Author":
				updatee.role = "author";
				break;
				case "Moderator":
				updatee.role = "moderator";
				break;
				default: updatee.role = "user";
			}

			_userService.updateUser(updatee)
			.then(function(response) {
				toast.textContent('Save Successful!');
				vm.updateInProgress = false;
				$mdToast.show(toast);
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				vm.updateInProgress = false;
				$mdToast.show(toast);
			});
		}

		vm.parseRoleText = function (user) {
			switch (user.role) {
				case "systemAdmin":
					user.role = "System Admin";
					break;
				case "admin":
					user.role = "Admin";
					break;
				case "author":
					user.role = "Author";
					break;
				case "editor":
					user.role = "Editor";
				case "moderator":
					user.role = "Moderator";
					break;
				default:
					user.role = "Member";
			}
		}

		$scope.toggleUserCard = function(user, index) {
			if (vm.users[index+1] && vm.users[index+1].isEditing) {
				// user is already being edited, so remove the user clone.
				vm.users.splice(index, 1);
				vm.users[index].isEditing = false;
			} else if (!user.isEditing) {
				// user is starting to be edited, so add a clone of the user that is editable.
				vm.users.splice(index, 0, $.extend(true, {}, user));
				vm.users[index+1].isEditing = true;
			}
		}

		$scope.removeUser = function(index, ctrl) {
			ctrl.users.splice(index, 1);
		}

		$scope.updateRole = function(user, role) {
			user.role = role;
			vm.updateUser(user, 'user-manager');
		}

	}

})();
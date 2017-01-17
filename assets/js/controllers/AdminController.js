(function () {

	angular.module('leansite')
		.controller('AdminController', AdminController);

	AdminController.$inject = ['$scope', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', 'BROADCAST'];

	function AdminController($scope, $rootScope, $http, $mdDialog, $mdToast, _userService, BROADCAST) {
		var vm = this;

		vm.users = [];

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

			_userService.createUser(u1)
				.finally(function (user) {
					_userService.createUser(u2)
						.finally(function (user) {
							_userService.createUser(u3)
								.finally(function (user) {
									vm.findAllUsers();
								});
						});
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

		vm.onClickDeleteButton = function (user) {
			var toast = $mdToast.simple().textContent('Deleting User...').hideDelay(500).position('top right');
			$mdToast.show(toast)
			.then(function() {
				_userService.deleteUser(user)
				.then(function(response) {
					toast.textContent('Successfully Deleted User!');
					$mdToast.show(toast);
					vm.findAllUsers();	
				})
				.catch(function(response) {
					var toastErr = $mdToast.simple()
						.textContent('Error: ' + response.data.details)
						.hideDelay(false).action('Okay')
						.position('top right')
						.highlightAction(true);
					$mdToast.show(toastErr);
				});
			});
		}

		vm.onClickSaveButton = function (user) {
			var toast = $mdToast.simple().textContent('Saving...').hideDelay(500).position('top right');
			$mdToast.show(toast)
			.then(function() {
				var updatee = JSON.parse(JSON.stringify(user));
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
					$mdToast.show(toast);
					vm.findAllUsers();
				})
				.catch(function(response) {
					var toastErr = $mdToast.simple()
						.textContent('Error: ' + response.data.details)
						.hideDelay(false).action('Okay')
						.position('top right')
						.highlightAction(true);
					$mdToast.show(toastErr);
				});
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

	}

})();
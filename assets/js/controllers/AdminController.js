(function () {

	angular.module('leansite')
		.controller('AdminController', AdminController);

	AdminController.$inject = ['$scope', '$rootScope', '$http', '$mdDialog', '_userService', 'BROADCAST'];

	function AdminController($scope, $rootScope, $http, $mdDialog, _userService, BROADCAST) {
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
				.then(function (users) {
					if (users) {
						vm.users = users;
						for (var i = 0; i < vm.users.length; i++) {
							vm.displayRoleText(vm.users[i])
						}
					} else {
						return console.error('data.data undefined');
					}
				});
		}

		vm.findAllUsers();

		vm.deleteUser = function (user) {
			try {
				_userService.deleteUser(user);
				vm.findAllUsers();
			} catch (e) {
				if (BROADCAST.loggingLevel === "DEBUG") {
					console.error(e);
				}
			}
		}

		vm.onClickSaveButton = function (user) {
			try {
				switch(user.role) {
					case "System Admin":
					user.role = "systemAdmin";
					break;
					case "Admin":
					user.role = "admin";
					break;
					case "Editor":
					user.role = "editor";
					break;
					case "Author":
					user.role = "author";
					break;
					case "Moderator":
					user.role = "moderator";
					break;
					default: user.role = "user";
				}

				_userService.updateUser(user)
				.finally(function(user) {
					vm.findAllUsers();
				});
			} catch (e) {
				if (BROADCAST.loggingLevel === "DEBUG") {
					console.error(e);
				}
			}
		}

		vm.displayRoleText = function (user) {
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
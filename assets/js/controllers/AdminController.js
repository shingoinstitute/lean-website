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
			.finally(function(user) {
				_userService.createUser(u2)
				.finally(function(user) {
					_userService.createUser(u3)
					.finally(function(user) {
						vm.findAllUsers();	
					});
				});
			});
		}

		vm.findAllUsers = function() {
			_userService.findAll()
			.then(function(users) {
				if (users) {
					vm.users = users;
				} else {
					return console.error('data.data undefined');
				}
			});
			// $http.get('/user')
			// .then(function(data) {
			// 	if (data.data) {
			// 		vm.users = [];
			// 		if (Array.isArray(data.data)) {
			// 			for (var i = 0; i < data.data.length; i++) {
			// 				vm.users.push(data.data[i]);
			// 			}
			// 		}
			// 	} else {
					
			// 	}
			// });
		}

		vm.findAllUsers();

		vm.deleteUser = function(user) {
			try {
				_userService.deleteUser(user);
				vm.findAllUsers();
			} catch (e) {
				if (BROADCAST.loggingLevel === "DEBUG") {
					console.error(e);
				}
			}
			
			// $http.delete('/user/' + user.uuid)
			// .then(function(data) {
			// 	vm.findAllUsers();
			// });
		}

		

		vm.updateUser = function(user) {
			$mdDialog.show({
				controller: AdminController,
				templateUrl: 'templates/user/admin.dialog.updateuser.tmpl.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true,
				locals: {
					updateUser: user
				}
			})
			.then(function(updatedUser) {
				try {
					debugger;
					_userService.updateUser(vm.updatedUser);
					vm.findAllUsers();
				} catch (e) {
					if (BROADCAST.loggingLevel === "DEBUG") {
						console.error(e);
					}
				}
			});
		}

		
	}

})();
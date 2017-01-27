(function() {

	angular.module('leansite')
	.controller('ModeratorController', ModeratorController);

	ModeratorController.$inject = ['$scope', '$rootScope', '$http', '_userService', '_entryService'];

	function ModeratorController($scope, $rootScope, $http, _userService, _entryService, users) {
		
		$scope.questions = [];
		$scope.answers = [];
		$scope.comments = [];
		$scope.users = [];

		function getUsers() {
			$http.get('/user')
			.then(function(response) {
				$scope.users = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		function getEntries() {
			$http.get('/entry?populate=owner,parent')
			.then(function(response) {
				for (var i = 0; i < response.data.length; i++) {
					if (response.data[i].parent) $scope.answers.push(response.data[i]);
					else $scope.questions.push(response.data[i]);
				}
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		function getComments() {
			$http.get('/comment?populate=owner,parent')
			.then(function(response) {
				$scope.comments = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		getEntries();
		getComments();
		getUsers();

	}

})();
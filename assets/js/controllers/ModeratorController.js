(function() {

	angular.module('leansite')
	.controller('ModeratorController', ModeratorController);

	ModeratorController.$inject = ['$scope', '$rootScope', '$http', '_userService', '_entryService'];

	function ModeratorController($scope, $rootScope, $http, _userService, _entryService, users) {

		loadData();

		function loadData() {
			$http.get('/user')
			.then(function(response) {
				$scope.users = response.data;
				return $http.get('/entry?populate=owner,parent');
			})
			.then(function(response) {
				$scope.questions = [];
				$scope.answers = [];
				for (var i = 0; i < response.data.length; i++) {
					if (response.data[i].parent) $scope.answers.push(response.data[i]);
					else $scope.questions.push(response.data[i]);
				}
				return $http.get('/comment?populate=owner,parent');
			})
			.then(function(response) {
				$scope.comments = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		$scope.saveUser = _userService.updateUser;

		$scope.getUserQuestions = function(user) {
			_entryService.getUserQuestions(user.uuid)
			.then(function(response) {
				console.log('loaded questions...', response.data);
				user.questions = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		$scope.getUserAnswers = function(user) {
			_entryService.getUserAnswers(user.uuid)
			.then(function(response) {
				console.log('loaded answers...', response.data)
				user.answers = response.data;
			})
			.catch(function(err) {
				console.error(response);
			});
		}

		$scope.getUserComments = function(user) {
			_entryService.getUserComments(user.uuid)
			.then(function(response){
				console.log('loaded comments...', response.data);
				user.comments = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		

	}

})();
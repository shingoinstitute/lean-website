(function () {
	'use strict';

	angular.module('leansite')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', '_entryService'];

	function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService, _entryService) {
		var vm = this;
		vm.templatePath = 'templates/user/me.html';
		vm.questions = [];

		vm.go = function(path){
			$location.path(path);
		}

		vm.loadData = function(){
			_entryService.getUserQuestions()
			.then(function(data){
				console.log('questions: ', data.data);
				vm.questions = data.data;
			})
			.catch(function(err){
				console.log(err);
			});
		}

		vm.loadData();
	}

})();

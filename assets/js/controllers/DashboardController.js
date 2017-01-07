(function () {
  'use strict';

  angular.module('leansite')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', '_entryService', 'BROADCAST'];

  function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService, _entryService, BROADCAST) {
    var vm = this;
    var userId = $rootScope.userId;
    vm.questions = [];
    vm.answers = [];
    vm.comments = [];

    vm.go = function (path) {
      $location.path(path);
    }

    vm.loadData = function () {
      _entryService.getUserQuestions(userId)
        .then(function (response) {
          vm.questions = response.data;
          return _entryService.getUserAnswers(userId)
        })
        .then(function (response) {
          vm.answers = response.data;
          return _entryService.getUserComments(userId)
        })
        .then(function (response) {
          vm.comments = response.data;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel = "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading your profile data. Please try again...");
          }
        });
    }

    vm.loadData();
  }

})();

(function () {
  'use strict';

  angular.module('leansite')
    .controller('EntryDetailController', ['$scope', '$routeParams', '_entryService', 'BROADCAST', EntryDetailController]);

  function EntryDetailController($scope, $routeParams, _entryService, BROADCAST) {
    var vm = this;
    var id = $routeParams.id;

    vm.loadQuestion = function () {
      _entryService.readEntry(id)
        .then(function (response) {
          vm.question = response.data;
          vm.question.votes = 0;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel = "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading the question. Please try again...");
          }
        });
    }

    $scope.$on(BROADCAST.entryChange, function () {
      vm.loadQuestion();
    });

    vm.loadQuestion();
  }
})();

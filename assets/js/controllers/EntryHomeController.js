(function () {
  'use strict';

  angular.module('leansite')
    .controller('EntryHomeController', ['$scope', '$mdDialog', '$location', '$anchorScroll', '_entryService', 'BROADCAST', EntryHomeController]);

  function EntryHomeController($scope, $mdDialog, $location, $anchorScroll, _entryService, BROADCAST) {
    $anchorScroll();
    var vm = this;
    vm.recent = [];
    vm.loadRecent = function () {
      _entryService.getRecent(10)
        .then(function (response) {
          vm.recent = response.data;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel = "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading recent questions. Please try again...");
          }
        });
    }

    vm.postQuestion = function (_owner) {
      $mdDialog.show({
          controller: 'AddEntryController',
          templateUrl: 'templates/entries/add.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          locals: {
            owner: _owner,
            parentId: null
          }
        })
        .then(function () {
          // DIALOG ANSWERED BY USER
        })
        .catch(function () {
          // DIALOG CANCELLED BY USER
        });
    }

    vm.go = function (path) {
      $location.path(path);
    }

    vm.loadRecent();
  }
})();

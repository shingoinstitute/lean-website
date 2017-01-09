(function () {
  'use strict';

  angular.module('leansite')
    .controller('QuestionController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'BROADCAST', QuestionController]);

  function QuestionController($scope, $rootScope, $mdDialog, _entryService, BROADCAST) {
    if ($scope.entry) $scope.entry.votes = 0;

    if ($scope.entry) {
      console.log("question: ", $scope.entry);
      console.log("question: " + $scope.entry.id + " votes " + $scope.entry.votes);
    }

    $scope.isEditing = false;

    $scope.$watch('isEditing', function(newValue, oldVaue){
        if(newValue){
            $scope._tmpEntry = angular.copy($scope.entry);
        } else if($scope._tmpEntry && !$scope.entry.$dirty){
            $scope.entry = $scope._tmpEntry;
        }
    })

    $scope.save = function () {
      _entryService.save($scope.entry)
        .then(function (response) {
          var votes = $scope.entry.votes;
          $scope.entry = response.data;
          $scope.entry.votes = votes;
          $scope.isEditing = false;
          $rootScope.$broadcast(BROADCAST.entryChange);
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    $scope.answer = function () {
      $mdDialog.show({
          controller: 'AddEntryController',
          templateUrl: 'templates/entries/add.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          locals: {
            owner: $scope.owner,
            parentId: $scope.entry.id
          }
        })
        .then(function () {
            $rootScope.$broadcast(BROADCAST.entryChange);
        })
        .catch(function () {});
    }

    $scope.upVote = function () {
      $scope.entry.votes += 1;
    }

    $scope.downVote = function () {
      $scope.entry.votes -= 1;
    }

    $scope.comment = function() {
      $mdDialog.show({
        controller: 'AddCommentController',
        templateUrl: 'templates/entries/addComment.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          owner: $scope.owner,
          parentId: $scope.entry.id
        }
      })
      .then(function(){
        $rootScope.$broadcast(BROADCAST.entryChange);
      })
      .catch(function(){});
    }
  }
})();

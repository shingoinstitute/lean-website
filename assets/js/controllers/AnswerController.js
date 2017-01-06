(function () {
  'use strict';

  angular.module('leansite')
    .controller('AnswerController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'BROADCAST', AnswerController]);

  function AnswerController($scope, $rootScope, $mdDialog, _entryService, BROADCAST) {
    if ($scope.entry) $scope.entry.votes = 0;

    if ($scope.entry) {
      console.log("answer: ", $scope.entry);
      console.log("answer: " + $scope.entry.id + " votes " + $scope.entry.votes);
    }

    if(!$scope.entry || !$scope.entry.owner.id || !$scope.entry.comments){
        console.log("Loading answer");
        _entryService.readEntry($scope.entry.id)
        .then(function(response){
            $scope.entry = response.data;
            $scope.entry.votes = 0;
        })
        .catch(function(err){
            console.log(err);
        });
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

    $scope.answered = function(){
        return $scope.entry.parent.markedCorrect;
    }

    $scope.accepted = function(){
        $scope.entry.markedCorrect = true;
        $scope.save();
        $scope.entry.parent.markedCorrect = true;
        _entryService.save($scope.entry.parent)
        .then(function(response){
            $scope.entry.parent = response.data;
        })
        .catch(function(err){
            console.log(err);
        })
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
          owner: $scope.entry.owner.uuid,
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

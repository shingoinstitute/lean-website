(function () {
  'use strict';

  angular.module('leansite')
    .controller('CommentController', ['$scope', '$rootScope', '_entryService', CommentController]);

  function CommentController($scope, $rootScope, _entryService) {
    $scope.isEditing = false;

    if($scope.comm && !$scope.comm.owner.id){
        _entryService.readComment($scope.comm.id)
        .then(function(response){
            $scope.comm = response.data;
        })
        .catch(function(err){
            console.log(err);
        });
    }

    $scope.$watch('isEditing', function (newValue) {
      if (newValue) {
        $scope._tmpComment = $scope.comm;
      } else if ($scope._tmpComment && !$scope.comm.$dirty) {
        $scope.comm = $scope._tmpComment;
      }
    });

    $scope.save = function () {
      _entryService.saveComment($scope.comm)
        .then(function (response) {
          $scope.comm = response.data;
          $scope.isEditing = false;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
})();

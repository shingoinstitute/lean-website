(function(){
    'use strict';

    angular.module('leansite')
    .controller('AddCommentController', ['$scope', '$mdDialog', '_entryService', 'owner', 'parentId', AddCommentController]);

    function AddCommentController($scope, $mdDialog, _entryService, owner, parentId){
        $scope.comment = {};
        $scope.comment.owner = owner;
        $scope.comment.parent = parentId;

        console.log("comment", $scope.comment);
        $scope.save = function(){
            console.log("Save");
            _entryService.createComment($scope.comment)
            .then(function(response){
                $scope.comment = response.data;
                $mdDialog.hide();
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }
})();
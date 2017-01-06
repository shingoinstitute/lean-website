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
                if(BROADCAST.loggingLevel = "DEBUG"){
                $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                } else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error adding your comment. Please try again...");
                }
            });
        }
    }
})();
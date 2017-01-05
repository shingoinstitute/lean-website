(function(){
    'use strict';
    
    angular.module('leansite')
    .controller('QuestionController', ['$scope', '$mdDialog', '_entryService', QuestionController]);

    function QuestionController($scope, $mdDialog, _entryService){
        $scope.isEditing = false;
        
        $scope.save = function(){
            _entryService.save($scope.entry)
            .then(function(response){
                $scope.entry = response.data;
            })
            .catch(function(err){
                console.log(err);
            });
        }

        $scope.answer = function(){
            $mdDialog.show({
                controller: 'AddEntryController',
                templateUrl: 'templates/entries/add.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: $scope.owner,
                    parent: $scope.entry.id
                }
            })
            .then(function(){})
            .catch(function(){});
            console.log("Answering question");
        }
    }
})();
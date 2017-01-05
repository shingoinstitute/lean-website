(function(){
    'use strict';

    angular.module('leansite')
    .controller('AddEntryController', ['$scope', '$location', '$mdDialog', '_entryService', 'owner', 'parent', AddEntryController]);

    function AddEntryController($scope, $location, $mdDialog, _entryService, owner, parent){
        $scope.entry = {}

        console.log('owner: ', owner);

        $scope.post = function(){
            $scope.entry.owner = owner;
            $scope.entry.parent = parent;
            console.log('Adding q: ', $scope.entry);
            _entryService.createEntry($scope.entry)
            .then(function(response){
                console.log(response);
                $mdDialog.hide();
                if(!parent) $location.path('/entries/' + response.data.id);
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }
})();
(function(){
    'use strict';

    angular.module('leansite')
    .controller('EntryHomeController', ['$scope', '$mdDialog', '$location', '_entryService', EntryHomeController]);

    function EntryHomeController($scope, $mdDialog, $location, _entryService){
        var vm = this;
        vm.recent = [];
        vm.loadRecent = function(){
            _entryService.getRecent(10)
            .then(function(response){
                vm.recent = response.data;
            })
            .catch(function(err){
                console.log(err);
            });
        }

        vm.postQuestion = function(_owner){
            console.log("owner: ", _owner);
            $mdDialog.show({
                controller: 'AddEntryController',
                templateUrl: 'templates/entries/add.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: _owner
                }
            })
            .then(function(){})
            .catch(function(){});
        }

        vm.go = function(path){
            $location.path(path);
        }

        vm.loadRecent();
    }
})();
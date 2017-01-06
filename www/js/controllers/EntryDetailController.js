(function(){
    'use strict';

    angular.module('leansite')
    .controller('EntryDetailController', ['$scope','$routeParams', '_entryService', EntryDetailController]);

    function EntryDetailController($scope, $routeParams, _entryService){
        var vm = this;
        var id = $routeParams.id;
        vm.question = {};
        
        vm.loadQuestion = function(){
            _entryService.readEntry(id)
            .then(function(response){
                vm.question = response.data;
            })
            .catch(function(err){
                console.log(err);
            });
        }

        vm.loadQuestion();
    }
})();
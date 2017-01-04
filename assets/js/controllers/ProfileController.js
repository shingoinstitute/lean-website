(function(){
    'use strict';

    angular.module('leansite')
    .controller('ProfileController', ['$scope', ProfileController]);

    function ProfileController($scope){
        var vm = this;
        vm.isEditing = false;

        vm.save = function(){
            // TODO: implement save to server
            vm.isEditing = false;
            console.log("Saving user: ", $scope.user);
        }
    }
})();
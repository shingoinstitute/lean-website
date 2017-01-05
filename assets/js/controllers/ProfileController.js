(function(){
    'use strict';

    angular.module('leansite')
    .controller('ProfileController', ['$scope', '_userService', ProfileController]);

    function ProfileController($scope, user){
        var vm = this;
        vm.isEditing = false;
        vm.errors = [];

        vm.save = function(){
            user.updateUser($scope.user)
            .then(function(user){
                $scope.user = user;
                vm.isEditing = false;
                console.log("Saving user: ", $scope.user);
            })
            .catch(function(err){
                vm.errors.push(err);
            });
        }

        $scope.$watch('vm.isEditing', function(oldV, newV){
            if(!oldV) vm.errors = [];
        });
    }
})();
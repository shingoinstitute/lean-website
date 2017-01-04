(function(){
    'use strict';

    angular.module('leansite')
    .controller('ProfileController', ['$scope', ProfileController]);

    function ProfileController($scope){
        var vm = this;
        vm.isEditing = false;
    }
})();
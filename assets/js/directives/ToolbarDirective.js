(function(){
    'use strict';

    angular.module('leansite')
    .directive('toolBar', function(){
        return {
            restrict: 'EA',
            templateUrl: 'templates/toolbar.tmpl.html',
            controller: 'NavController',
            controllerAs: 'vm'
        }
    });
})();
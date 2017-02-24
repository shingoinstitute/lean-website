(function(){
    'use strict';

    angular.module('leansite')
    .directive('toolBar', function(){
        return {
            restrict: 'EA',
            templateUrl: 'templates/public/toolbar.tmpl.html',
            controller: 'NavController',
            controllerAs: 'vm'
        }
    });
})();
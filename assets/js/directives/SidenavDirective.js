(function(){
    'use strict';

    angular.module('leansite')
    .directive('sideNav', function(){
        return {
            restrict: 'EA',
            templateUrl: 'templates/sidenav.tmpl.html',
            controller: 'NavController'
        }
    });
})();
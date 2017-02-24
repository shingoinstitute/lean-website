(function(){
    'use strict';

    angular.module('leansite')
    .directive('sideNav', function(){
        return {
            restrict: 'EA',
            templateUrl: 'templates/public/sidenav.tmpl.html',
            controller: 'NavController'
        }
    });
})();
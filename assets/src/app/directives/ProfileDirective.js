(function(){
    'use strict';

    angular.module('leansite')
    .directive('profile', function(){
        return {
            restrict: 'EA',
            scope: {
                user: '='
            },
            templateUrl: 'templates/user/profile.tmpl.html',
            controller: 'ProfileController as vm'
        }
    });
})();
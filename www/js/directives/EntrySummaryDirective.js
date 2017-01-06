(function(){
    'use strict';

    angular.module('leansite')
    .directive('entrySummary', function(){
        return {
            restrict: 'EA',
            scope: {
                entry: '='
            },
            templateUrl: 'templates/entries/summary.tmpl.html'
        }
    });
})();
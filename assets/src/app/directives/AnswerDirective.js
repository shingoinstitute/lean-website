(function(){
    'use strict';

    angular.module('leansite')
    .directive('answer', function(){
        return {
            restrict: 'EA',
            scope: {
                entry: '=',
                owner: '='
            },
            templateUrl: 'templates/entries/answer.tmpl.html',
            controller: 'AnswerController'
        }
    });
})();
(function(){
    'use strict';

    angular.module('leansite')
    .directive('question', function(){
        return {
            restrict: 'EA',
            scope: {
                entry: '=',
                owner: '='
            },
            templateUrl: 'templates/entries/question.tmpl.html',
            controller: 'QuestionController'
        }
    });
})();
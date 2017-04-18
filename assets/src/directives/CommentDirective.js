(function(){
    'use strict';

    angular.module('leansite')
    .directive('comment', function(){
        return {
            restrict: 'EA',
            scope: {
                comm: '=',
                owner: '='
            },
            templateUrl: 'templates/entries/comment.tmpl.html',
            controller: 'CommentController'
        }
    });
})();
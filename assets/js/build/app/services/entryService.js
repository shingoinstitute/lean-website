"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var moment = require("moment");
(function () {
    'use strict';
    angular.module('leansite')
        .factory('_entryService', _entryService);
    _entryService.$inject = ['$http', '$q'];
    function _entryService($http, $q) {
        return {
            getUserQuestions: function (uuid) {
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner'
                });
            },
            getUserAnswers: function (uuid) {
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner'
                });
            },
            getUserComments: function (uuid) {
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent'
                });
            },
            getQuestions: function () {
                return $http.get('/entry?where={"parent":null}&populate=owner,parent');
            },
            getAnswers: function () {
                return $http.get('/entry?where={"parent": {"!":null}}&populate=owner,parent');
            },
            getComments: function () {
                return $http.get('/comment?populate=owner,parent');
            },
            getRecent: function (limit, userId) {
                var now = moment();
                var recent = now.subtract(10, 'days');
                var params = {
                    createdAt: {
                        ">": recent.toJSON()
                    },
                    parent: null,
                    owner: userId,
                };
                var url = '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: url
                });
            },
            readEntry: function (id) {
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote'
                });
            },
            readComment: function (id) {
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: '/comment/' + id + '?populate=owner,parent'
                });
            },
            createEntry: function (entry) {
                return $http({
                    method: 'post',
                    dataType: 'json',
                    url: '/entry',
                    data: entry
                });
            },
            destroyEntry: function (entry) {
                return $http({
                    method: 'delete',
                    dataType: 'json',
                    url: '/entry',
                    data: entry
                });
            },
            destroyComment: function (comm) {
                return $http({
                    method: 'delete',
                    dataType: 'json',
                    url: '/comment',
                    data: comm
                });
            },
            createComment: function (comment) {
                return $http({
                    method: 'post',
                    dataType: 'json',
                    url: '/comment',
                    data: comment
                });
            },
            save: function (entry) {
                return $http({
                    method: 'put',
                    dataType: 'json',
                    url: '/entry/' + entry.id,
                    data: entry
                });
            },
            saveComment: function (comment) {
                return $http({
                    method: 'put',
                    dataType: 'json',
                    url: '/comment/' + comment.id,
                    data: comment
                });
            },
            upvoteEntry: function (entry) {
                return $http.put('/entry/upvote/' + entry.id);
            },
            downvoteEntry: function (entry) {
                return $http.put('/entry/downvote/' + entry.id);
            },
            query: function (queryString) {
                var query = {
                    'or': [{
                            'title': {
                                'like': "%25" + queryString + "%25"
                            },
                        },
                        {
                            'content': {
                                'like': "%25" + queryString + "%25"
                            }
                        }
                    ]
                };
                var url = '/entry?where=' + JSON.stringify(query) + '&populate=owner';
                return $http({
                    method: 'get',
                    dataType: 'json',
                    url: url
                });
            }
        };
    }
    ;
})();
//# sourceMappingURL=entryService.js.map
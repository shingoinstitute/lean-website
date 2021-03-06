(function () {
  'use strict';

  angular.module('leansite')
    .factory('_entryService', _entryService);

  _entryService.$inject = ['$http', '$q']

  function _entryService($http, $q) {
    var service = {};

    service.getUserQuestions = function (uuid) {
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner'
      });
    }

    service.getUserAnswers = function (uuid) {
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner'
      });
    }

    service.getUserComments = function (uuid) {
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent'
      });
    }

    service.getQuestions = function() {
      return $http.get('/entry?where={"parent":null}&populate=owner,parent');
    }

    service.getAnswers = function() {
      return $http.get('/entry?where={"parent": {"!":null}}&populate=owner,parent');
    }

    service.getComments = function() {
      return $http.get('/comment?populate=owner,parent');
    }

    service.getRecent = function (limit, userId) {
      var now = moment();
      var recent = now.subtract(10, 'days');
      var params = {
        createdAt: {
          ">": recent.toJSON()
        },
        parent: null, 
        owner: userId,
      }
      var url = '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
      return $http({
        method: 'get',
        dataType: 'json',
        url: url
      });
    }

    service.readEntry = function (id) {
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote'
      });
    }

    service.readComment = function (id) {
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/comment/' + id + '?populate=owner,parent'
      });
    }

    service.createEntry = function (entry) {
      return $http({
        method: 'post',
        dataType: 'json',
        url: '/entry',
        data: entry
      });
    }

    service.destroyEntry = function(entry) {
      return $http({
        method: 'delete',
        dataType: 'json',
        url: '/entry',
        data: entry
      });
    }

    service.destroyComment = function(comm) {
      return $http({
        method: 'delete',
        dataType: 'json',
        url: '/comment',
        data: comm
      });
    }

    service.createComment = function (comment) {
      return $http({
        method: 'post',
        dataType: 'json',
        url: '/comment',
        data: comment
      });
    }

    service.save = function (entry) {
      return $http({
        method: 'put',
        dataType: 'json',
        url: '/entry/' + entry.id,
        data: entry
      });
    }

    service.saveComment = function (comment) {
      return $http({
        method: 'put',
        dataType: 'json',
        url: '/comment/' + comment.id,
        data: comment
      });
    }

    service.upvoteEntry = function(entry) {
      return $http.put('/entry/upvote/' + entry.id);
    }

    service.downvoteEntry = function(entry) {
      return $http.put('/entry/downvote/' + entry.id);
    }

    service.query = function (queryString) {
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
      })
    }

    return service;
  };

})();

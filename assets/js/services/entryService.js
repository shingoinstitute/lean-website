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
      // var url = '/entry?where={"createdAt": {">":"' + recent.toJSON() + '"},"parent":null}&populate=owner' + (limit ? '&limit=' + limit : '');
      console.log('url: ', url);
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
      console.log("query: ", url);
      return $http({
        method: 'get',
        dataType: 'json',
        url: url
      })
    }

    return service;
  };

})();

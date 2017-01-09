(function () {
  'use strict';

  angular.module('leansite')
    .factory('_entryService', _entryService);

  _entryService.$inject = ['$http']

  function _entryService($http) {
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

    service.getUserComments = function(uuid){
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent'
      });
    }

    service.getRecent = function (limit) {
      var now = moment();
      var recent = now.subtract(10, 'days');
      var url = '/entry?where={"createdAt": {">":"' + recent.toJSON() + '"},"parent":null}&populate=owner' + (limit ? '&limit=' + limit : '');
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
        url: '/entry/' + id + '?populate=answers,owner,comments,parent'
      });
    }

    service.readComment = function(id){
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

    return service;
  };

})();

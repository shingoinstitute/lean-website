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
        url: '/entry?where={owner: ' + uuid + '}&populate=owner'
      });
    }

    service.readQuestion = function(id){
        return $http({
            method: 'get',
            dataType: 'json',
            url: '/entry/' + id + '?populate=answers,owner,comments'
        });
    }

    service.getRecent = function (limit) {
      var now = moment();
      var recent = now.subtract(10, 'days');
      return $http({
        method: 'get',
        dataType: 'json',
        url: '/entry?where={createdAt: {gt: ' + recent.toJSON() + ' }}&populate=owner' + (limit ? '&limit='+limit : '')
      });
    }

    service.createEntry = function(entry){
        return $http({
            method: 'post',
            dataType: 'json',
            url: '/entry',
            data: entry
        });
    }

    return service;
  };

})();

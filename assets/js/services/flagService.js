(function () {
  'use strict';

  angular.module('leansite')
    .factory('_flagService', _flagService);

  _flagService.$inject = ['$http']

  function _flagService($http) {
    var service = {};

    /**
     * Create a flag on some content
     * 
     * @param owner    :: the user's uuid
     * @param contentId :: the flagged content's id
     * @param options :: {reason: picklist, description: textfield, type: textfield}
     */
    service.flag = function(user, contentId, options){
        var f = {
            owner: user,
            content: contentId,
            reason: options.reason,
            description: options.description,
            type: options.type
        };
        return $http({
            method: 'post',
            dataType: 'json',
            url: '/flag',
            data: f
        });
    }

    return service;
  };

})();

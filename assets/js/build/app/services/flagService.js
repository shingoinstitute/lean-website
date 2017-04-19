(function () {
    'use strict';
    angular.module('leansite')
        .factory('_flagService', _flagService);
    _flagService.$inject = ['$http'];
    function _flagService($http) {
        return {
            flag: function (user, contentId, options) {
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
        };
    }
    ;
})();
//# sourceMappingURL=flagService.js.map
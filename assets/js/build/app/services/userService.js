(function () {
    'use strict';
    angular.module('leansite')
        .factory('_userService', _userService);
    _userService.$inject = ['$http', '$cookies', '$window', '$location', '$q', 'JWT_TOKEN'];
    function _userService($http, $cookies, $window, $location, $q, JWT_TOKEN) {
        var service = {};
        service.getUser = function () {
            return $http.get('/me');
        };
        service.createUser = function (user) {
            return $http.post('/user', user);
        };
        service.deleteUser = function (user) {
            return $http.delete('/user/' + user.uuid);
        };
        service.updateUser = function (user) {
            return $http.put('/user/' + user.uuid, user);
        };
        service.findAll = function () {
            return $http.get('/user');
        };
        service.requestPasswordResetEmail = function (email) {
            return $http.post('/reset', { email: email });
        };
        service.requestPasswordUpdate = function (options) {
            return $http.put('/reset/' + options.userId, {
                password: options.password,
                token: options.token
            });
        };
        service.uploadPhoto = function (file) {
            return $http({
                method: 'post',
                headers: {
                    'Content-Type': undefined
                },
                url: '/user/photoUpload',
                data: { 'profile': file },
                transformRequest: function (data, headersGetter) {
                    var formData = new FormData();
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });
                    return formData;
                }
            });
        };
        return service;
    }
})();
//# sourceMappingURL=userService.js.map
(function () {
    'use strict';
    angular.module('leansite')
        .factory('_authService', _authService);
    _authService.$inject = ['$http', '$cookies', '$window', '$location', '$rootScope', 'BROADCAST', 'JWT_TOKEN'];
    function _authService($http, $cookies, $window, $location, $rootScope, BROADCAST, JWT_TOKEN) {
        var service = {
            authenticateLocal: authenticateLocal,
            authenticateLinkedin: authenticateLinkedin,
            createAccount: createAccount,
            logout: logout
        };
        function authenticateLocal(username, password, next) {
            $http.post('/auth/local', {
                username: username,
                password: password
            })
                .then(function (response) {
                var err = response.data && response.data.error ? response.data.error : false;
                if (err) {
                    return err instanceof Error ? err : new Error(err);
                }
                var user = response.data && response.data.user ? response.data.user : null;
                if (!user) {
                    return next(new Error('Error: user not found.'), false);
                }
                var token = response.data && response.data.token ? response.data.token : null;
                if (!token) {
                    return next(new Error('Error: JWT token not found.'), false);
                }
                $cookies.put(JWT_TOKEN, token);
                return next(null, user);
            })
                .catch(function (err) {
                console.error(err);
                return err.data && err.data.error ? next(err.data.error) : next(new Error(err));
            });
        }
        function authenticateLinkedin() { $window.location.href = "/auth/linkedin"; }
        function createAccount(user, next) {
            if (!user.password || !user.firstname || !user.lastname || !user.email) {
                return next(new Error('Error: Missing required fields.'), false);
            }
            $http.post('/user', {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password
            })
                .then(function (response) {
                var err = response.data && response.data.error ? response.data.error : null;
                if (err)
                    return next(err, false);
                var user = response.data && response.data.user ? response.data.user : null;
                if (!user) {
                    return next(new Error('an unknown error occured'), false);
                }
                var token = response.data && response.data.token ? response.data.token : null;
                if (!token) {
                    return next(new Error('failed to generate JSON Web Token!'));
                }
                $cookies.put(JWT_TOKEN, token);
                $rootScope.$broadcast('$MainControllerListener');
                return next(null, user);
            })
                .catch(function (err) {
                return next(err, false);
            });
        }
        function logout() {
            $http.get('/auth/logout')
                .then(function (data) {
                $cookies.remove(JWT_TOKEN);
                $rootScope.$broadcast(BROADCAST.userLogout);
                $location.path('/login');
            });
        }
        return service;
    }
})();
//# sourceMappingURL=authService.js.map
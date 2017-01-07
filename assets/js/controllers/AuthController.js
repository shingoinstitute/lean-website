(function () {
  'use strict';

  angular.module('leansite')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$scope', '$http', '$rootScope', '$location', '_authService', '_userService', 'BROADCAST'];

  function AuthController($scope, $http, $rootScope, $location, _authService, _userService, BROADCAST) {
    var vm = this;

    $scope.username = '';
    $scope.password = '';

    vm.authenticateLinkedIn = function () {
      _authService.authenticateLinkedin();
    }

    vm.authenticateLocal = function (username, password) {
      vm.didClickLogin = true;
      _authService.authenticateLocal(username, password, function (err, user) {
        if (err) {
          $rootScope.$broadcast(BROADCAST.error, err.message);
          console.log('Error: ', err);
          vm.loginError = err.message || err;
        }
        console.log('FOOBAR: ', user);

        if (user) {
          $location.path('/dashboard');
        }
      });
    }

    vm.logout = function () {
      _authService.logout();
    }
  }
})();

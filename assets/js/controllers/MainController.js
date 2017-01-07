(function () {
  'use strict';

  angular.module('leansite')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$location', '$mdMedia', '_userService', '_baconService', 'BROADCAST', 'JWT_TOKEN'];

  function MainController($scope, $rootScope, $http, $cookies, $location, $mdMedia, _userService, _baconService, BROADCAST, JWT_TOKEN) {
    var vm = this;

    vm.message = '';
    vm.error = '';

    // Gets current user using a JWT
    vm.getUser = function () {
      _userService.getUser(function (err, user) {
        if (user) {
          vm.user = user;
          $rootScope.userId = user.uuid;
        }
      });
    };

    // 'Lorem Ipsum' placeholder text generator.
    vm.generateBacon = function (sentences, paragraphs, next) {
      return _baconService.getBacon(sentences, paragraphs, function (err, data) {
        if (err) {
          console.error(err);
          return next([]);
        }
        return next(data);
      });
    }

    // Watch for screen size to change for side navigation drawer positioning
    $scope.$watch(function () {
      return $mdMedia('gt-sm');
    }, function (isBigEnough) {
      vm.sideNavEnabled = isBigEnough;
    });

    $scope.$on(BROADCAST.info, function (event, args) {
      if (typeof args == 'string') {
        vm.message = args;
      } else if (args && args.message) {
        vm.message = args.message;
      }
    });

    $scope.$on(BROADCAST.error, function (event, args) {
      if (typeof args == 'string') {
        vm.error = args;
      } else if (args && args.error) {
        vm.error = args.error;
      }
    });

    $scope.$on(BROADCAST.userLogout, function (event) {
      vm.user = null;
    });

    $scope.$on(BROADCAST.userSaved, function (event, user) {
      if (user)
        vm.user = user;
      else
        vm.getUser();
    });

    vm.getUser();
    vm.generateBacon(null, null, function (data) {
      vm.fillerContent = data;
    });

  }

})();

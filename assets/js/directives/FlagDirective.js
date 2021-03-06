(function () {
  'use strict';

  angular.module('leansite')
    .directive('flag', function () {
      return {
        restrict: 'EA',
        scope: {
          content: '=',
          type: '='
        },
        template: '<md-icon ng-click="flag()"><i class="material-icons">flag</i></md-icon>',
        controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
          $scope.flag = function () {
            $mdDialog.show({
                controller: 'FlagContentController',
                controllerAs: 'vm',
                templateUrl: 'templates/public/flagContent.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                  content: $scope.content.id,
                  type: $scope.type
                }
              })
              .then(function () {
                $rootScope.$broadcast(BROADCAST.flagged, $scope.content);
              })
              .catch(function () {
                // DIALOG WAS CANCELLED BY USER
              });
          }
        }]
      }
    });
})();

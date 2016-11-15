/**
* @description :: leansite app
*/

var app = angular.module('leansite', ['ngRoute'])
.config(function($routeProvider) {
   $routeProvider
   .when('/app', {
      templateUrl: 'templates/appbuttons.html',
      controller: 'ViewsController'
   })
   .otherwise({
      redirectTo: '/',
      controller: 'ViewsController'
   });
});

app.controller('ViewsController', function($scope) {
   $scope.title = 'LEAN Site';
});

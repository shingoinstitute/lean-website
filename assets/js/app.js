/**
* @description :: leansite app
*/

(function() {
   'use strict';
   angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngSanitize'])
   .config(function($locationProvider, $routeProvider, $mdThemingProvider) {

      $routeProvider
      .when('/', {
         templateUrl: 'templates/homepage.html',
         controller: 'HomeController'
      })
      .when('/dashboard', {
         templateUrl: 'templates/dashboard.html',
         controller: 'DashboardController'
      })
      .when('/education', {
         templateUrl: 'templates/education.html',
         controller: 'EducationController'
      })
      .when('/about', {
         templateUrl: 'templates/about.html',
         controller: 'AboutController'
      })
      .otherwise({
         redirectTo: '/',
      });

      $locationProvider.html5Mode(true);

      $mdThemingProvider
         .theme('default')
         .primaryPalette('teal')
         .accentPalette('amber')
         .warnPalette('red')
         .backgroundPalette('grey');

   })

   .controller('MainController', ['$scope', function($scope) {

      $scope.user = {
         name: 'Craig',
         age: 27,
         occupation: 'Developer',
         dob: '09/23/1989'
      }

   }])

   .controller('NavController', ['$scope', '$location', '$sce', function($scope, $sce) {
      var vm = this;
      vm.logoSrc = "images/sampleLogo.png";
   }])

   .controller('HomeController', ['$scope', function($scope, $rootScope) {
      var vm = this;
      // $rootScope.currentNavItem = 'home'
   }])

   .controller('DashboardController', ['$scope', '$rootScope', '$http', '$sce', function($scope, $rootScope, $http) {
      var vm = this;
      $scope.message = 'Data: '
      vm.getData = function() {
         $scope.message = 'Retrieving Data...'
         $http({
            method: 'GET',
            url: '/users/createUser'
         }).then(function(data, status, headers, config) {
            $scope.data = JSON.stringify(data.data, null, 2);
            $scope.message = 'Data: '
            $scope.responseDetails = "<hr />status: <pre>" + status + "</pre>" +
                    "<hr />headers: " + headers +
                    "<hr />config: " + config;
         }, function(data, status, headers, config) {
            $scope.message = 'There was an error...'
            $scope.responseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + headers +
                    "<hr />config: " + config;
         });
      }
   }])

   .controller('EducationController', ['$scope', function($scope, $rootScope) {
      var vm = this;
      // $rootScope.currentNavItem = 'education'
   }])

   .controller('AboutController', ['$scope', function($scope, $rootScope) {
      var vm = this;
      // $rootScope.currentNavItem = 'about'
   }])

})();

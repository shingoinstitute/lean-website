(function () {
    'use strict';
    angular.module('leansite')
        .controller('NavController', NavController);
    NavController.$inject = ['$scope', '$rootScope', '$location', '$mdSidenav', '$mdDialog', '_authService'];
    function NavController($scope, $rootScope, $location, $mdSidenav, $mdDialog, _authService) {
        var vm = this;
        var originatorEv;
        $scope.toggleSidenav = function () {
            $mdSidenav('sidenav').toggle();
        };
        vm.showDashboard = function () {
            $rootScope.$broadcast('$MainControllerListener');
        };
        $scope.$on('$NavControllerListener', function (event, user) {
            if (user) {
                $location.path('/dashboard');
            }
            else {
                $location.path('/login');
            }
        });
        vm.logout = function () {
            _authService.logout();
        };
    }
})();
//# sourceMappingURL=NavController.js.map
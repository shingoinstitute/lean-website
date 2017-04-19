(function () {
    'use strict';
    angular.module('leansite')
        .controller('MainController', MainController);
    MainController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$location', '$mdMedia', '$mdTheming', '_userService', 'BROADCAST', 'JWT_TOKEN'];
    function MainController($scope, $rootScope, $http, $cookies, $location, $mdMedia, $mdTheming, _userService, BROADCAST, JWT_TOKEN) {
        var vm = this;
        vm.getUser = function () {
            _userService.getUser()
                .then(function (response) {
                vm.user = response.data;
                $rootScope.userId = response.data.uuid;
            })
                .catch(function (response) {
                if ($rootScope.userId)
                    console.error(response.data);
            });
        };
        $scope.$watch(function () {
            return $mdMedia('gt-sm');
        }, function (shouldLockSidenav) {
            vm.sideNavLocked = shouldLockSidenav;
        });
        $scope.$on(BROADCAST.error, function (event, args) {
            if (BROADCAST.loggingLevel == "DEBUG") {
                if (args.data && args.data.error) {
                    args = args.data.error;
                }
                else if (args.error) {
                    args = args.error;
                }
                if (args instanceof Error) {
                    vm.error = args.message;
                }
                else if (typeof args == 'string') {
                    vm.error = args;
                }
                else {
                    vm.error = JSON.stringify(args, null, 2);
                }
            }
        });
        $scope.$on(BROADCAST.userLogout, function (event) {
            vm.user = $rootScope.userId = null;
        });
        $scope.$on(BROADCAST.userLogin, function (event, user) {
            vm.user = user;
        });
        $scope.$on(BROADCAST.userUpdated, function (event, user) {
            if (!user)
                return vm.getUser();
            vm.user = user;
            $rootScope.userId = user.uuid;
        });
        $scope.$on('$MainControllerListener', function (event, controller) {
            switch (controller) {
                case 'NavController':
                    $rootScope.$broadcast('$NavControllerListener', vm.user);
                    break;
                case 'DashboardController':
                    if (vm.user) {
                        $rootScope.$broadcast('$DashboardControllerListener', vm.user);
                    }
                    else {
                        _userService.getUser()
                            .then(function (response) {
                            if (response.error) {
                                $rootScope.$broadcast(BROADCAST.error, response.error);
                            }
                            vm.user = response.data;
                            $rootScope.$broadcast('$DashboardControllerListener', vm.user);
                        })
                            .catch(function (err) {
                            $rootScope.$broadcast(BROADCAST.error, err);
                        });
                    }
                    break;
                case 'AuthController':
                    break;
                case 'SettingsController':
                    break;
                case 'QuestionController':
                    if (vm.user) {
                        $rootScope.$broadcast('$QuestionControllerListener', vm.user);
                    }
                    else {
                        _userService.getUser()
                            .then(function (response) {
                            vm.user = response.data;
                            $rootScope.$broadcast('$QuestionControllerListener', vm.user);
                        })
                            .catch(function (err) {
                            $rootScope.$broadcast(BROADCAST.error, err);
                        });
                    }
                    break;
                case 'TEST':
                    console.log('user: ', vm.user);
                    break;
                default:
                    vm.getUser();
                    break;
            }
        });
        vm.getUser();
    }
})();
//# sourceMappingURL=MainController.js.map
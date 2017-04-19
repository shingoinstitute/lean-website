(function () {
    angular.module('leansite')
        .controller('ResetController', ResetController);
    ResetController.$inject = ['$scope', '$routeParams', '$http', '$location', '$rootScope', '$mdDialog', '_userService', 'BROADCAST'];
    function ResetController($scope, $routeParams, $http, $location, $rootScope, $mdDialog, _userService, BROADCAST) {
        var vm = this;
        var token = $routeParams.token;
        var userId = $routeParams.id;
        vm.password = '';
        vm.passwordConfirm = '';
        vm.updateButtonEnabled = false;
        vm.passwordMatchError = false;
        $scope.submit = function () {
            if (vm.password != '' && (vm.password == vm.passwordConfirm)) {
                vm.resetPasswordFormEnabled = false;
                var options = {
                    userId: userId,
                    password: vm.password,
                    token: token
                };
                _userService.requestPasswordUpdate(options)
                    .then(function (response) {
                    $location.url($location.path('/login'));
                    $location.path('/login');
                })
                    .catch(function (responseError) {
                    if (BROADCAST.loggingLevel == "DEBUG") {
                        $rootScope.$broadcast(BROADCAST.error, JSON.stringify(responseError, null, 2));
                    }
                    else {
                        $rootScope.$broadcast(BROADCAST.error, 'Error: password reset failed.');
                    }
                });
            }
        };
        function onPageLoad() {
            if (!token) {
                vm.resetPasswordButtonEnabled = true;
            }
            else {
                vm.resetPasswordFormEnabled = true;
            }
        }
        vm.reset = function () {
            vm.didClickRequestButton = true;
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Message Sent')
                .textContent('Check your email for a message sent by shingo.it@usu.edu. If you do not recieve an email from us within 10 minutes, please try again.')
                .ariaLabel('Message Send Dialog')
                .ok('Okay');
            _userService.requestPasswordResetEmail(vm.email)
                .then(function (response) {
                $mdDialog.show(alert);
                console.log('Success: ', response);
            })
                .catch(function (responseError) {
                if (responseError.data && responseError.data == "user not found") {
                    vm.userNotFoundError = "An account with " + vm.email + " does not exist.";
                }
                else if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(responseError, null, 2));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, 'Error: message failed to send.');
                }
            });
        };
        onPageLoad();
    }
})();
//# sourceMappingURL=ResetController.js.map
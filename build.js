(function () {
    'use strict';
    angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngMessages', 'ngSanitize', 'angularMoment', 'summernote'])
        .config(function ($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
        $routeProvider
            .when('/', {
            templateUrl: 'templates/public/homepage.html',
        })
            .when('/dashboard', {
            templateUrl: 'templates/user/dashboard.html',
        })
            .when('/education', {
            templateUrl: 'templates/public/education.html',
        })
            .when('/about', {
            templateUrl: 'templates/public/about.html',
        })
            .when('/login', {
            templateUrl: 'templates/public/login.html',
        })
            .when('/auth/linkedin/callback*', {
            template: '<p ng-init=\"linkedinCallback()\">redirecting...</p>',
        })
            .when('/createAccount', {
            templateUrl: 'templates/user/createAccount.html'
        })
            .when('/teachingCurriculum', {
            templateUrl: 'templates/public/teachingCurriculum.html'
        })
            .when('/entries', {
            templateUrl: 'templates/entries/home.html'
        })
            .when('/entries/:id', {
            templateUrl: 'templates/entries/detail.html'
        })
            .when('/reset', {
            templateUrl: 'templates/user/passwordResetRequest.html'
        })
            .when('/reset/:id', {
            templateUrl: 'templates/user/passwordResetForm.html'
        })
            .when('/verifyEmail/:id', {
            templateUrl: 'templates/user/emailVerification.html'
        })
            .otherwise({
            templateUrl: 'templates/public/404.html'
        });
        $locationProvider.html5Mode(true);
        $mdThemingProvider.alwaysWatchTheme(true);
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');
        $mdThemingProvider.theme('darkTheme')
            .primaryPalette('blue-grey')
            .accentPalette('orange')
            .dark();
    })
        .constant('BROADCAST', {
        loggingLevel: 'PRODUCTION',
        info: '$infoMessage',
        error: '$errorMessage',
        userLogout: '$userLoggedOut',
        userLogin: '$userLoggedIn',
        qSave: '$questionSave',
        qAnswered: '$questionAnswered',
        entryChange: '$entryChange',
        userUpdated: '$userUpdated'
    })
        .constant('JWT_TOKEN', 'JWT');
    angular.module('leansite').constant('_', _);
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('AddCommentController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'parentId', 'BROADCAST', AddCommentController]);
    function AddCommentController($scope, $rootScope, $mdDialog, _entryService, parentId, BROADCAST) {
        $scope.comment = {};
        $scope.comment.owner = $rootScope.userId;
        $scope.comment.parent = parentId;
        $scope.save = function () {
            _entryService.createComment($scope.comment)
                .then(function (response) {
                $scope.comment = response.data;
                $mdDialog.hide();
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error adding your comment. Please try again...");
                }
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('AddEntryController', ['$scope', '$rootScope', '$location', '$mdDialog', '_entryService', 'owner', 'parentId', 'BROADCAST', AddEntryController]);
    function AddEntryController($scope, $rootScope, $location, $mdDialog, _entryService, owner, parentId, BROADCAST) {
        $scope.entry = {};
        $scope.post = function () {
            $scope.entry.owner = owner;
            $scope.entry.parent = parentId;
            _entryService.createEntry($scope.entry)
                .then(function (response) {
                $mdDialog.hide();
                if (!parentId)
                    $location.path('/entries/' + response.data.id);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error adding your entry. Please try again...");
                }
            });
        };
    }
})();
(function () {
    angular.module('leansite')
        .controller('AdminController', AdminController);
    AdminController.$inject = ['$scope', '$document', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', 'BROADCAST', '_'];
    function AdminController($scope, $document, $rootScope, $http, $mdDialog, $mdToast, _userService, BROADCAST, _) {
        var vm = this;
        vm.users = [];
        vm.progressCircleEnabled = false;
        vm.toastPosition = 'top right';
        $scope.userContainerId = 'user-manager-container';
        $scope.userSearchQuery = '';
        vm.findAll = function () {
            $http.get('/user?limit=20')
                .then(function (response) {
                if (response.data)
                    vm.users = response.data;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel === "DEBUG") {
                    console.error(e);
                }
            });
        };
        vm.showDisableWarningDialog = function (user, _scope, $event) {
            var template = '<md-dialog flex-gt-sm="25" layout="column" aria-label="warning dialog" layout-padding>' +
                '	<md-dialog-content>' +
                '		<h3 class="md-heading">Warning</h3>' +
                '		<p class="md-body-1">Disabling <b>' + user.firstname + ' ' + user.lastname + '\'s</b> account will reset their password.</p>' +
                '		<p class="md-body-1">Disabling accounts has potentially irreversible side effects, <em>continue</em>?</p>' +
                '	</md-dialog-content>' +
                '  <md-dialog-actions layout>' +
                '		<md-button class="md-primary" ng-click="onCloseDialog(\'continue\')">Continue</md-button>' +
                '		<md-button class="md-raised md-primary" ng-click="onCloseDialog(\'cancel\')">Cancel</md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>';
            $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                template: template,
                controller: 'AdminController',
                onComplete: _scope.onCloseDialog,
                locals: {
                    user: user,
                    _scope: _scope,
                    $event: $event
                }
            })
                .then(function () {
                vm.disableAccount(user, _scope);
            })
                .catch(function (e) {
                console.log('canceled...');
            });
        };
        $scope.onCloseDialog = function (opt) {
            if (opt == "continue") {
                $mdDialog.hide();
            }
            else if (opt == "cancel") {
                $mdDialog.cancel();
            }
        };
        vm.enableAccount = function (user, _scope) {
            user.accountIsActive = true;
            _scope.updateInProgress = true;
            var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#' + $scope.userContainerId));
            _userService.updateUser({
                uuid: user.uuid,
                accountIsActive: user.accountIsActive
            })
                .then(function (response) {
                toast.textContent('Account succesfully enabled.');
                $mdToast.show(toast);
                _scope.updateInProgress = false;
            })
                .catch(function (response) {
                toast.textContent('Error: ' + response.data.details)
                    .hideDelay(false).action('Okay')
                    .position('top right')
                    .highlightAction(true);
                $mdToast.show(toast);
                _scope.updateInProgress = false;
            });
        };
        vm.disableAccount = function (user, _scope) {
            user.accountIsActive = false;
            _scope.updateInProgress = true;
            var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#' + $scope.userContainerId));
            _userService.deleteUser(user)
                .then(function (response) {
                toast.textContent('Account succesfully disabled.');
                $mdToast.show(toast);
                _scope.updateInProgress = false;
            })
                .catch(function (response) {
                toast.textContent('Error: ' + response.data.details)
                    .hideDelay(false).action('Okay')
                    .position('top right')
                    .highlightAction(true);
                $mdToast.show(toast);
                _scope.updateInProgress = false;
            });
        };
        vm.updateUser = function (user) {
            var toast = $mdToast
                .simple()
                .textContent('Saving...')
                .hideDelay(500)
                .position(vm.toastPosition)
                .parent($document[0].querySelector('#' + $scope.userContainerId));
            vm.updateInProgress = true;
            var updatee = $.extend(true, {}, user);
            _userService.updateUser(updatee)
                .then(function (response) {
                toast.textContent('Save Successful!');
                vm.updateInProgress = false;
                $mdToast.show(toast);
                vm.findAll();
            })
                .catch(function (response) {
                toast.textContent('Error: ' + response.data.details)
                    .hideDelay(false).action('Okay')
                    .position('top right')
                    .highlightAction(true);
                vm.updateInProgress = false;
                $mdToast.show(toast);
            });
        };
        $scope.parseRole = function (userRole) {
            var role;
            switch (userRole) {
                case "systemAdmin":
                    role = "System Admin";
                    break;
                case "admin":
                    role = "Admin";
                    break;
                case "author":
                    role = "Author";
                    break;
                case "editor":
                    role = "Editor";
                    break;
                case "moderator":
                    role = "Moderator";
                    break;
                default:
                    role = "Member";
                    break;
            }
            return role;
        };
        vm.updateRole = function (user, role) {
            user.role = role;
            vm.updateUser(user);
        };
        $scope.selectedUsers = {};
        $scope.hasSelection = false;
        $scope.onMasterCBClick = function () {
            $scope.isSelected = !$scope.isSelected;
            if (Object.keys($scope.selectedUsers).length == vm.users.length && !$scope.isSelected) {
                $scope.selectedUsers = {};
            }
            else if ($scope.isSelected) {
                $scope.selectedUsers = _.keyBy(vm.users, 'uuid');
            }
            $scope.hasSelection = Object.keys($scope.selectedUsers).length > 0;
        };
        $scope.onCBClick = function (user) {
            if ($scope.selectedUsers[user.uuid]) {
                delete $scope.selectedUsers[user.uuid];
            }
            else {
                $scope.selectedUsers[user.uuid] = user;
            }
            if (Object.keys($scope.selectedUsers).length > 0) {
                $scope.isSelected = false;
            }
            $scope.hasSelection = Object.keys($scope.selectedUsers).length > 0;
        };
        $scope.$watch('userQuery', function (newV, oldV) {
            if (typeof newV == 'undefined' || newV == '') {
                vm.findAll();
            }
            else {
                $scope.performUserQuery(newV);
            }
        }, true);
        $scope.performUserQuery = function (query) {
            var params = { or: [{ firstname: { contains: query } }, { lastname: { contains: query } }] };
            $http.get('/user?where=' + JSON.stringify(params))
                .then(function (response) {
                vm.users = response.data;
            })
                .catch(function (err) {
                console.error('Error: ', err);
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('AnswerController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'BROADCAST', AnswerController]);
    function AnswerController($scope, $rootScope, $mdDialog, _entryService, BROADCAST) {
        if ($scope.entry)
            $scope.entry.votes = 0;
        if (!$scope.entry || !$scope.entry.owner.uuid || !$scope.entry.comments) {
            _entryService.readEntry($scope.entry.id)
                .then(function (response) {
                $scope.entry = response.data;
                $scope.entry.votes = $scope.entry.users_did_upvote.length - $scope.entry.users_did_downvote.length;
                $scope.entry.canMarkCorrect = $rootScope.userId == $scope.entry.parent.owner;
                $scope.entry.canEdit = $rootScope.userId == $scope.entry.owner.uuid;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error loading the answer details...");
                }
            });
        }
        $scope.isEditing = false;
        $scope.$watch('isEditing', function (newValue, oldVaue) {
            if (newValue) {
                $scope._tmpEntry = angular.copy($scope.entry);
            }
            else if ($scope._tmpEntry && !$scope.entry.$dirty) {
                $scope.entry = $scope._tmpEntry;
            }
        });
        $scope.save = function () {
            _entryService.save($scope.entry)
                .then(function (response) {
                var votes = $scope.entry.votes;
                $scope.entry = response.data;
                $scope.entry.votes = votes;
                $scope.isEditing = false;
                $rootScope.$broadcast(BROADCAST.entryChange);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error saving your answer. Please try again...");
                }
            });
        };
        $scope.answered = function () {
            return $scope.entry.parent.markedCorrect;
        };
        $scope.accepted = function () {
            $scope.entry.markedCorrect = true;
            $scope.save();
            $scope.entry.parent.markedCorrect = true;
            _entryService.save($scope.entry.parent)
                .then(function (response) {
                $scope.entry.parent = response.data;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error accepting this answer. Please try again...");
                }
            });
        };
        $scope.upVote = function () {
            _entryService.upvoteEntry($scope.entry)
                .then(function (response) {
                response = response.data;
                $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error upvoting the question. Please try again..."));
                }
            });
        };
        $scope.downVote = function () {
            _entryService.downvoteEntry($scope.entry)
                .then(function (response) {
                response = response.data;
                $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error downvoting the question. Please try again..."));
                }
            });
        };
        $scope.comment = function () {
            $mdDialog.show({
                controller: 'AddCommentController',
                templateUrl: 'templates/entries/addComment.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: $scope.entry.owner.uuid,
                    parentId: $scope.entry.id
                }
            })
                .then(function () {
                $rootScope.$broadcast(BROADCAST.entryChange);
            })
                .catch(function () {
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('AuthController', AuthController);
    AuthController.$inject = ['$scope', '$http', '$rootScope', '$location', '$mdDialog', '_authService', '_userService', 'BROADCAST', '$routeParams'];
    function AuthController($scope, $http, $rootScope, $location, $mdDialog, authService, userService, BROADCAST, $routeParams) {
        var vm = this;
        vm.user = {};
        vm.createButonEnabled = false;
        vm.progressCircleEnabled = false;
        $scope.username = '';
        $scope.password = '';
        vm.authenticateLinkedIn = function () {
            authService.authenticateLinkedin();
        };
        vm.authenticateLocal = function (username, password) {
            vm.progressCircleEnabled = true;
            authService.authenticateLocal(username, password, function (err, user) {
                vm.progressCircleEnabled = false;
                if (err) {
                    vm.loginError = err.message || err.error || err;
                }
                if (user) {
                    $location.path('/dashboard');
                }
            });
        };
        vm.logout = function () {
            authService.logout();
        };
        vm.createAccount = function (user) {
            delete user.confirmPassword;
            authService.createAccount(user, function (err, user) {
                if (err) {
                    vm.error = err;
                    return;
                }
                if (!user) {
                    vm.error = 'An unknown error occured, failed to create a new account.';
                    return;
                }
                userService.getUser()
                    .then(function (response) {
                    if (response.data.error)
                        return console.error('Error: ', err);
                    $location.path('/dashboard');
                })
                    .catch(function (err) {
                    if (BROADCAST.loggingLevel === "DEBUG") {
                        console.error('Error: ', err);
                    }
                });
            });
        };
        $scope.$watch(function () {
            return typeof vm.user.firstname != 'undefined'
                && typeof vm.user.lastname != 'undefined'
                && typeof vm.user.email != 'undefined'
                && vm.user.password && (vm.user.password == vm.user.confirmPassword);
        }, function (shouldEnable) {
            vm.createButonEnabled = shouldEnable;
        });
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('CommentController', ['$scope', '$rootScope', '_entryService', 'BROADCAST', CommentController]);
    function CommentController($scope, $rootScope, _entryService, BROADCAST) {
        $scope.isEditing = false;
        if ($scope.comm && $scope.comm.owner && !$scope.comm.owner.uuid) {
            _entryService.readComment($scope.comm.id)
                .then(function (response) {
                $scope.comm = response.data;
                $scope.comm.canEdit = response.data.owner.uuid == $rootScope.userId;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error loading the comment details...");
                }
            });
        }
        $scope.$watch('isEditing', function (newValue) {
            if (newValue) {
                $scope._tmpComment = $scope.comm;
            }
            else if ($scope._tmpComment && !$scope.comm.$dirty) {
                $scope.comm = $scope._tmpComment;
            }
        });
        $scope.save = function () {
            _entryService.saveComment($scope.comm)
                .then(function (response) {
                $scope.comm = response.data;
                $scope.isEditing = false;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error saving your comment. Please try again...");
                }
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('DashboardController', DashboardController);
    DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', '_entryService', 'BROADCAST'];
    function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService, _entryService, BROADCAST) {
        var vm = this;
        var userId = '';
        vm.questions = [];
        vm.answers = [];
        vm.comments = [];
        vm.go = function (path) {
            $location.path(path);
        };
        vm.loadData = function () {
            _entryService.getUserQuestions(userId)
                .then(function (response) {
                vm.questions = response.data;
                return _entryService.getUserAnswers(userId);
            })
                .then(function (response) {
                vm.answers = response.data;
                return _entryService.getRecent(10, userId);
            })
                .then(function (response) {
                vm.recent = response.data;
                return _entryService.getUserComments(userId);
            })
                .then(function (response) {
                vm.comments = response.data;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error loading your profile data. Please try again...");
                }
            });
        };
        vm.onPageLoad = function (listenerName, controllerName) {
            $rootScope.$broadcast(listenerName, controllerName);
        };
        $scope.$on('$DashboardControllerListener', function (event, user) {
            if (user) {
                userId = user.uuid;
                vm.loadData();
            }
        });
        vm.onPageLoad('$MainControllerListener', 'DashboardController');
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('EmailController', EmailController);
    EmailController.$inject = ['$scope', '$http', '$routeParams'];
    function EmailController($scope, $http, $routeParams) {
        $scope.progressBarEnabled = true;
        $scope.verifyEmail = function () {
            if (!$routeParams.id) {
                return;
            }
            $http.get('/api/verifyEmail/' + $routeParams.id)
                .then(function (res) {
                $scope.progressBarEnabled = false;
                $scope.verifiedEmail = res.data && res.data.email ? res.data.email : null;
                if (!$scope.verifiedEmail)
                    $scope.error = "Email address not found.";
            })
                .catch(function (res) {
                $scope.progressBarEnabled = false;
                var err = res.data && res.data.error ? res.data.error : 'An unknown error has occurred!';
                $scope.error = err;
                console.error(err);
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('EntryDetailController', ['$scope', '$rootScope', '$routeParams', '_entryService', 'BROADCAST', EntryDetailController]);
    function EntryDetailController($scope, $rootScope, $routeParams, _entryService, BROADCAST) {
        var vm = this;
        var id = $routeParams.id;
        vm.loadQuestion = function () {
            _entryService.readEntry(id)
                .then(function (response) {
                vm.question = response.data;
                vm.question.votes = (vm.question.users_did_upvote.length + 1) - (vm.question.users_did_downvote.length + 1);
                vm.question.canEdit = response.data.owner.uuid == $rootScope.userId;
                for (var i = 0; i < vm.question.answers.length; i++) {
                    vm.question.answers[i].canEdit = vm.question.answers[i].owner == $rootScope.userId;
                }
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error loading the question. Please try again...");
                }
            });
        };
        $scope.$on(BROADCAST.entryChange, function () {
            vm.loadQuestion();
        });
        vm.loadQuestion();
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('EntryHomeController', ['$scope', '$mdDialog', '$location', '$anchorScroll', '$q', '_entryService', 'BROADCAST', EntryHomeController]);
    function EntryHomeController($scope, $mdDialog, $location, $anchorScroll, $q, _entryService, BROADCAST) {
        $anchorScroll();
        var vm = this;
        vm.postQuestion = function (_owner) {
            $mdDialog.show({
                controller: 'AddEntryController',
                templateUrl: 'templates/entries/add.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: _owner,
                    parentId: null
                }
            })
                .then(function () {
            })
                .catch(function () {
            });
        };
        vm.go = function (path) {
            $location.path(path);
        };
        vm.recent = [];
        vm.loadRecent = function () {
            _entryService.getRecent(10)
                .then(function (response) {
                vm.recent = response.data;
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error loading recent questions. Please try again...");
                }
            });
        };
        vm.results = [];
        vm.isSearching = false;
        vm.search = "";
        $scope.$watch('vm.search', function (newV, oldV) {
            if (newV == '') {
                vm.results = [];
                vm.isSearching = false;
            }
            else {
                vm.isSearching = true;
                vm.query(newV);
            }
        });
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }
        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;
            return ((now - lastSearch) < 50000);
        }
        function preformQuery() {
            _entryService.query(cachedQuery)
                .then(function (response) {
                vm.results = response.data;
                refreshDebounce();
            })
                .catch(function (err) {
                console.log(err);
            });
        }
        vm.query = function (query) {
            cachedQuery = query;
            if (!pendingSearch || !debounceSearch()) {
                cancelSearch();
                pendingSearch = $q(function (resolve, reject) {
                    cancelSearch = reject;
                    resolve(preformQuery());
                });
            }
        };
        vm.loadRecent();
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('FlagContentController', ['$scope', '$rootScope', '_flagService', 'BROADCAST', 'content', 'type', '$mdDialog', FlagContentController]);
    function FlagContentController($scope, $rootScope, flags, BROADCAST, contentId, type, $mdDialog) {
        var vm = this;
        vm.cancel = function () {
            $mdDialog.cancel();
        };
        vm.submit = function () {
            flags.flag($rootScope.userId, contentId, { reason: vm.reason, description: vm.description, type: type })
                .then(function (response) {
                $rootScope.$broadcast(BROADCAST.info, "Thank you for letting us know. One of our moderators will review the content and remove it if necessary.");
                $mdDialog.hide();
            })
                .catch(function (err) {
                var message = "There was an error flagging the content. Please contact us and let us know.";
                if (BROADCAST.loggingLevel == 'DEBUG') {
                    message = JSON.stringify(err);
                    console.log("FlagControllerError: ", err);
                }
                $rootScope.$broadcast(BROADCAST.error, message);
                $mdDialog.cancel();
            });
        };
        $scope.$watch("vm.reason", function (newValue) {
            if (newValue != "Other")
                vm.description = newValue;
            else
                vm.description = "";
        });
    }
})();
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
                if (typeof args == 'Error') {
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
(function () {
    angular.module('leansite')
        .controller('ModeratorController', ModeratorController);
    ModeratorController.$inject = ['$scope', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', '_entryService'];
    function ModeratorController($scope, $rootScope, $http, $mdDialog, $mdToast, _userService, _entryService, users) {
        loadData();
        function loadData() {
            $http.get('/user')
                .then(function (response) {
                $scope.users = response.data;
                return _entryService.getQuestions();
            })
                .then(function (response) {
                $scope.questions = response.data;
                return _entryService.getAnswers();
            })
                .then(function (response) {
                $scope.answers = response.data;
                return _entryService.getComments();
            })
                .then(function (response) {
                $scope.comments = response.data;
            })
                .catch(function (response) {
                console.error(response);
            });
        }
        $scope.saveUser = _userService.updateUser;
        $scope.getUserQuestions = function (user) {
            _entryService.getUserQuestions(user.uuid)
                .then(function (response) {
                console.log('loaded questions...', response.data);
                user.questions = response.data;
            })
                .catch(function (response) {
                console.error(response);
            });
        };
        $scope.getUserAnswers = function (user) {
            _entryService.getUserAnswers(user.uuid)
                .then(function (response) {
                console.log('loaded answers...', response.data);
                user.answers = response.data;
            })
                .catch(function (err) {
                console.error(response);
            });
        };
        $scope.getUserComments = function (user) {
            _entryService.getUserComments(user.uuid)
                .then(function (response) {
                console.log('loaded comments...', response.data);
                user.comments = response.data;
            })
                .catch(function (response) {
                console.error(response);
            });
        };
        function getIdsForList(list) {
            if (!Array.isArray(list))
                list = [list];
            var rList = [];
            list.forEach(function (obj, i) {
                if (obj.$isActive == true) {
                    rList.push(obj.id);
                }
            });
            return { id: rList };
        }
        $scope.$watch('selectAll', function (value) {
            if (!$scope.questions)
                $scope.questions = [];
            $scope.questions.forEach(function (obj) {
                obj.$isActive = value;
            });
            if (!$scope.answers)
                $scope.answers = [];
            $scope.answers.forEach(function (obj) {
                obj.$isActive = value;
            });
            if (!$scope.comments)
                $scope.comments = [];
            $scope.comments.forEach(function (obj) {
                obj.$isActive = value;
            });
        });
        $scope.deleteActiveEntries = function (entries) {
            return _entryService.destroyEntry(getIdsForList(entries))
                .then(function (response) {
                loadData();
            })
                .catch(function (err) {
                console.error(err);
            });
        };
        $scope.deleteActiveComments = function (comments) {
            return _entryService.destroyComment(getIdsForList(comments))
                .then(function (response) {
                loadData();
            })
                .catch(function (err) {
                console.error(err);
            });
        };
        $scope.editEntry = function (entry) {
            if (entry.id == $scope.activeEntry) {
                $scope.isEditing = false;
                $scope.activeEntry = null;
            }
            else {
                $scope.isEditing = true;
                $scope.activeEntry = entry;
                console.log('started editing question ' + entry.id);
            }
        };
        $scope.saveActiveEntries = function (data) {
            return _entryService.save(data)
                .then(function (res) {
                $mdToast.show($mdToast.simple().textContent('Save Successful').position('top right'));
                loadData();
            })
                .catch(function (err) {
                var toastErr = $mdToast.simple()
                    .textContent('Error: ' + response.data.details)
                    .hideDelay(false).action('Okay')
                    .position('top right')
                    .highlightAction(true);
                $mdToast.show(toastErr);
                console.error(err);
            });
        };
        $scope.saveActiveComments = function (data) {
            return _entryService.saveComment(data)
                .then(function (res) {
                $mdToast.show($mdToast.simple().textContent('Save Successful').position('top right'));
                loadData();
            })
                .catch(function (err) {
                var toastErr = $mdToast.simple()
                    .textContent('Error: ' + response.data.details)
                    .hideDelay(false).action('Okay')
                    .position('top right')
                    .highlightAction(true);
                $mdToast.show(toastErr);
                console.error(err);
            });
        };
        $scope.getStyle = function (isEven) {
            return isEven ? { 'background': 'white' } : { 'background': '#f2f2f2' };
        };
        $scope.formatName = function (obj) {
            if (!obj.owner.firstname)
                return obj.owner.lastname;
            return obj.owner.lastname + ', ' + obj.owner.firstname;
        };
    }
})();
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
(function () {
    'use strict';
    angular.module('leansite')
        .controller('ProfileController', ['$scope', '$rootScope', '_userService', 'BROADCAST', ProfileController]);
    function ProfileController($scope, $rootScope, user, BROADCAST) {
        var vm = this;
        vm.isEditing = false;
        vm.errors = [];
        vm.save = function () {
            user.updateUser($scope.user)
                .then(function (user) {
                $scope.user = user;
                vm.isEditing = false;
                console.log("Saving user: ", $scope.user);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error saving your profile. Please try again...");
                }
            });
        };
        vm.uploadPhoto = function (element) {
            console.log("File", element.files[0]);
            user.uploadPhoto(element.files[0])
                .then(function (response) {
                $scope.user.pictureUrl = response.data;
                $rootScope.$broadcast(BROADCAST.userUpdated, $scope.user);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error uploading your picture...");
                }
            });
        };
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .controller('QuestionController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'BROADCAST', QuestionController]);
    function QuestionController($scope, $rootScope, $mdDialog, _entryService, BROADCAST) {
        if ($scope.entry)
            $scope.entry.votes = 0;
        $scope.isEditing = false;
        $scope.$watch('isEditing', function (newValue, oldVaue) {
            if (newValue) {
                $scope._tmpEntry = angular.copy($scope.entry);
            }
            else if ($scope._tmpEntry && !$scope.entry.$dirty) {
                $scope.entry = $scope._tmpEntry;
            }
        });
        $scope.save = function () {
            _entryService.save($scope.entry)
                .then(function (response) {
                var votes = $scope.entry.votes;
                $scope.entry = response.data;
                $scope.entry.votes = votes;
                $scope.isEditing = false;
                $rootScope.$broadcast(BROADCAST.entryChange);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, "There was an error saving your question. Please try again...");
                }
            });
        };
        $scope.answer = function () {
            $mdDialog.show({
                controller: 'AddEntryController',
                templateUrl: 'templates/entries/add.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: $scope.owner,
                    parentId: $scope.entry.id
                }
            })
                .then(function () {
                $rootScope.$broadcast(BROADCAST.entryChange);
            })
                .catch(function () {
            });
        };
        $scope.upVote = function () {
            _entryService.upvoteEntry($scope.entry)
                .then(function (response) {
                response = response.data;
                $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error upvoting the question. Please try again..."));
                }
            });
        };
        $scope.downVote = function () {
            _entryService.downvoteEntry($scope.entry)
                .then(function (response) {
                response = response.data;
                $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
            })
                .catch(function (err) {
                if (BROADCAST.loggingLevel == "DEBUG") {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
                }
                else {
                    $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error downvoting the question. Please try again..."));
                }
            });
        };
        $scope.comment = function () {
            $mdDialog.show({
                controller: 'AddCommentController',
                templateUrl: 'templates/entries/addComment.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    owner: $scope.owner,
                    parentId: $scope.entry.id
                }
            })
                .then(function () {
                $rootScope.$broadcast(BROADCAST.entryChange);
            })
                .catch(function () {
            });
        };
    }
})();
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
(function () {
    'use strict';
    angular.module('leansite')
        .controller('SettingsController', SettingsController);
    SettingsController.$inject = ['$scope'];
    function SettingsController($scope) {
        var vm = this;
    }
})();
(function () {
    angular.module('leansite')
        .directive('admin', function () {
        return {
            templateUrl: 'templates/admin/admin.tmpl.html',
            controller: 'AdminController',
            transclude: true,
            controllerAs: 'vm'
        };
    })
        .directive('adminUserCard', function () {
        return {
            restrict: 'E',
            scope: {
                user: "=",
                index: "=",
                ctrl: "="
            },
            transclude: true,
            templateUrl: 'templates/admin/adminUserCard.tmpl.html',
            controller: 'AdminController',
            controllerAs: 'vm'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('answer', function () {
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/answer.tmpl.html',
            controller: 'AnswerController'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('comment', function () {
        return {
            restrict: 'E',
            scope: {
                comm: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/comment.tmpl.html',
            controller: 'CommentController'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('entrySummary', function () {
        return {
            restrict: 'E',
            scope: {
                entry: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/summary.tmpl.html',
            controller: ['$scope', '$location', function ($scope, $location) {
                    $scope.go = function () {
                        if ($scope.entry.parent) {
                            $location.path('/entries/' + $scope.entry.parent);
                            $location.hash('answer-' + $scope.entry.id);
                        }
                        else {
                            $location.path('/entries/' + $scope.entry.id);
                        }
                    };
                }]
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('flag', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                content: '=',
                type: '='
            },
            template: '<md-icon ng-click="flag()"><i class="material-icons">flag</i></md-icon>',
            controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
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
                        });
                    };
                }]
        };
    });
})();
(function () {
    angular.module('leansite')
        .directive('moderator', function () {
        return {
            restrict: 'E',
            scope: {
                users: "="
            },
            transclude: true,
            templateUrl: 'templates/moderator/moderator.tmpl.html',
            controller: 'ModeratorController',
            controllerAs: 'vm'
        };
    })
        .directive('moderatorUser', function () {
        return {
            restrict: 'E',
            scope: {
                user: "="
            },
            transclude: true,
            templateUrl: 'templates/moderator/moderator.user.tmpl.html',
            controller: 'ModeratorController'
        };
    })
        .directive('moderatorAnswers', function () {
        return {
            restrict: 'E',
            scope: {
                answer: "="
            },
            transclude: true,
            templateUrl: 'templates/moderator/moderator.answer.tmpl.html',
            controller: 'ModeratorController'
        };
    })
        .directive('moderatorQuestions', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/moderator/moderator.question.tmpl.html',
            controller: 'ModeratorController'
        };
    })
        .directive('moderatorComments', function () {
        return {
            restrict: 'E',
            scope: {
                comment: "="
            },
            transclude: true,
            templateUrl: 'templates/moderator/moderator.comment.tmpl.html',
            controller: 'ModeratorController'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('profile', function () {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            transclude: true,
            templateUrl: 'templates/user/profile.tmpl.html',
            controller: 'ProfileController as vm'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('question', function () {
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/question.tmpl.html',
            controller: 'QuestionController'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('sideNav', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/public/sidenav.tmpl.html',
            controller: 'NavController'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .directive('toolBar', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/public/toolbar.tmpl.html',
            controller: 'NavController',
            controllerAs: 'vm'
        };
    });
})();
(function () {
    'use strict';
    angular.module('leansite')
        .factory('_authService', _authService);
    _authService.$inject = ['$http', '$cookies', '$window', '$location', '$rootScope', 'BROADCAST', 'JWT_TOKEN'];
    function _authService($http, $cookies, $window, $location, $rootScope, BROADCAST, JWT_TOKEN) {
        var service = {};
        service.authenticateLocal = function (username, password, next) {
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
        };
        service.authenticateLinkedin = function () { $window.location.href = "/auth/linkedin"; };
        service.createAccount = function (user, next) {
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
        };
        service.logout = function () {
            $http.get('/auth/logout')
                .then(function (data) {
                $cookies.remove(JWT_TOKEN);
                $rootScope.$broadcast(BROADCAST.userLogout);
                $location.path('/login');
            });
        };
        return service;
    }
})();
(function () {
    'use strict';
    angular.module('leansite')
        .factory('_entryService', _entryService);
    _entryService.$inject = ['$http', '$q'];
    function _entryService($http, $q) {
        var service = {};
        service.getUserQuestions = function (uuid) {
            return $http({
                method: 'get',
                dataType: 'json',
                url: '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner'
            });
        };
        service.getUserAnswers = function (uuid) {
            return $http({
                method: 'get',
                dataType: 'json',
                url: '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner'
            });
        };
        service.getUserComments = function (uuid) {
            return $http({
                method: 'get',
                dataType: 'json',
                url: '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent'
            });
        };
        service.getQuestions = function () {
            return $http.get('/entry?where={"parent":null}&populate=owner,parent');
        };
        service.getAnswers = function () {
            return $http.get('/entry?where={"parent": {"!":null}}&populate=owner,parent');
        };
        service.getComments = function () {
            return $http.get('/comment?populate=owner,parent');
        };
        service.getRecent = function (limit, userId) {
            var now = moment();
            var recent = now.subtract(10, 'days');
            var params = {
                createdAt: {
                    ">": recent.toJSON()
                },
                parent: null,
                owner: userId,
            };
            var url = '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
            return $http({
                method: 'get',
                dataType: 'json',
                url: url
            });
        };
        service.readEntry = function (id) {
            return $http({
                method: 'get',
                dataType: 'json',
                url: '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote'
            });
        };
        service.readComment = function (id) {
            return $http({
                method: 'get',
                dataType: 'json',
                url: '/comment/' + id + '?populate=owner,parent'
            });
        };
        service.createEntry = function (entry) {
            return $http({
                method: 'post',
                dataType: 'json',
                url: '/entry',
                data: entry
            });
        };
        service.destroyEntry = function (entry) {
            return $http({
                method: 'delete',
                dataType: 'json',
                url: '/entry',
                data: entry
            });
        };
        service.destroyComment = function (comm) {
            return $http({
                method: 'delete',
                dataType: 'json',
                url: '/comment',
                data: comm
            });
        };
        service.createComment = function (comment) {
            return $http({
                method: 'post',
                dataType: 'json',
                url: '/comment',
                data: comment
            });
        };
        service.save = function (entry) {
            return $http({
                method: 'put',
                dataType: 'json',
                url: '/entry/' + entry.id,
                data: entry
            });
        };
        service.saveComment = function (comment) {
            return $http({
                method: 'put',
                dataType: 'json',
                url: '/comment/' + comment.id,
                data: comment
            });
        };
        service.upvoteEntry = function (entry) {
            return $http.put('/entry/upvote/' + entry.id);
        };
        service.downvoteEntry = function (entry) {
            return $http.put('/entry/downvote/' + entry.id);
        };
        service.query = function (queryString) {
            var query = {
                'or': [{
                        'title': {
                            'like': "%25" + queryString + "%25"
                        },
                    },
                    {
                        'content': {
                            'like': "%25" + queryString + "%25"
                        }
                    }
                ]
            };
            var url = '/entry?where=' + JSON.stringify(query) + '&populate=owner';
            return $http({
                method: 'get',
                dataType: 'json',
                url: url
            });
        };
        return service;
    }
    ;
})();
(function () {
    'use strict';
    angular.module('leansite')
        .factory('_flagService', _flagService);
    _flagService.$inject = ['$http'];
    function _flagService($http) {
        var service = {};
        service.flag = function (user, contentId, options) {
            var f = {
                owner: user,
                content: contentId,
                reason: options.reason,
                description: options.description,
                type: options.type
            };
            return $http({
                method: 'post',
                dataType: 'json',
                url: '/flag',
                data: f
            });
        };
        return service;
    }
    ;
})();
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
//# sourceMappingURL=build.js.map
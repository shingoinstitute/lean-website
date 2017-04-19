"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
require("angular-route");
require("angular-material");
require("angular-cookies");
require("angular-sanitize");
require("angular-moment");
require("angular-summernote");
var _ = require("lodash");
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
//# sourceMappingURL=app.js.map
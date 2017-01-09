/**
* @description :: leansite app
*/

(function () {
	'use strict';

	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngSanitize', 'angularMoment', 'summernote'])
		.config(function ($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {

			$routeProvider
				.when('/home', {
					templateUrl: 'templates/homepage.html',
				})
				.when('/dashboard', {
					templateUrl: 'templates/user/dashboard.html',
				})
				.when('/dashboard/settings', {
					templateUrl: 'templates/user/settings.html',
				})
				.when('/education', {
					templateUrl: 'templates/education.html',
				})
				.when('/about', {
					templateUrl: 'templates/about.html',
				})
				.when('/login', {
					templateUrl: 'templates/login.html',
				})
				.when('/auth/linkedin/callback*', {
					template: "<p ng-init=\"linkedinCallback()\">redirecting...</p>",
				})
				.when('/createAccount', {
					templateUrl: 'templates/user/createAccount.html'
				})
				.when('/teachingResources', {
					templateUrl: 'templates/teachingResources.html'
				})
				.when('/admin', {
					templateUrl: 'templates/user/admin.html',
				})
				.when('/entries', {
					templateUrl: 'templates/entries/home.html'
				})
				.when('/entries/:id', {
					templateUrl: 'templates/entries/detail.html'
				})
				.otherwise({
					redirectTo: '/home',
				});

			$locationProvider.html5Mode(true);

			$mdThemingProvider.theme('default')
				.primaryPalette('indigo')
				.accentPalette('red');

			$mdThemingProvider.theme('darkTheme')
				.primaryPalette('orange')
				.accentPalette('blue')
				.dark();
		})
		.constant('BROADCAST', {
			loggingLevel: 'DEBUG', // 'DEBUG' or 'PRODUCTION'
			info: '$infoMessage',
			error: '$errorMessage',
			userLogout: '$userLoggedOut',
			userLogin: '$userLoggedIn',
			setTitle: '$setTitle',
			qSave: '$questionSave',
			qAnswered: '$questionAnswered',
			entryChange: '$entryChange',
			userUpdated: '$userUpdated'
		})
		.constant('JWT_TOKEN', 'JWT');

})();

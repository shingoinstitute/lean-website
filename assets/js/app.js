/**
* @description :: leansite app
*/

const BROADCAST_INFO = '$infoMessage';
const BROADCAST_ERROR = '$errorMessage';
const BROADCAST_USER_LOGOUT =  '$userLoggedOut';
const BROADCAST_USER_LOGIN = '$userLoggedIn';

(function() {
	'use strict';

	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {

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
		.otherwise({
			redirectTo: '/home',
		});

		$locationProvider.html5Mode(true);

		var blueGreyMap = $mdThemingProvider.extendPalette('indigo', {
			'contrastDefaultColor': 'light'
		});
		$mdThemingProvider.definePalette('custom-indigo', blueGreyMap);

		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('orange');

		$mdThemingProvider.theme('dark')
			.primaryPalette('custom-indigo').dark();

		var defaultMap = $mdThemingProvider.extendPalette('indigo')
		$mdThemingProvider.definePalette('form', defaultMap);
		$mdThemingProvider.theme('form').dark();

	})

	.factory('_ipsumService', ['$http', function($http) {
		var service = {};
		/**
		* @description :: Lorem Ipsum rest API for generating garbage content
		* @param {Integer} paragraphs - (optional) Number of paragraphs, if null, defaults to 5.
		* @param {Integer} sentences - (optional) Number of sentences. This overrides paragraphs.
		* @param {function} next - node style callback function, next(err, htmlString);
		*/
		service.getBacon = function(paragraphs, sentences, next) {
			var url = 'https://baconipsum.com/api/?type=meat-and-filler';
			if (typeof sentences == 'string') {
				url += '&sentences=' + sentences;
			} else if (typeof paragraphs == 'string') {
				url += '&paras=' + options.paragraphs;
			}
			url += '&start-with-lorem=1';

			var config = {};
			config.method = 'GET';
			config.url = url;

			$http(config)
			.then(function(data) {
				var jsonArray = data.data;
				var htmlString = '';
				for (var i = 0; i < jsonArray.length; i++) {
					htmlString += '<p>' + jsonArray[i] + '</p>';
				}
				return next(null, htmlString);
			})
			.catch(function(err) {
				return next(err, false);
			});
		}

		return service;
	}])


})();

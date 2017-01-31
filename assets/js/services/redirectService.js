/**
 * @description redirectService.js :: Angular service used to change $location with a provided redirect URL.
 * 
 * example: A non authenticated user navigates to '/dashboard' which is saved as the redirect URL. The user is temporarily redirected
 * to '/login', wherein upon succesfull athentication with their credentials are redirected back to the original intended destination, '/dashboard'.
 */

(function() {
	angular.module('leansite')
	.factory('_redirectService', _redirectService);

	_redirectService.$inject = ['$root', '$rootScope', '$location'];

	function _redirectService($root, $rootScope, $location) {
		var service = {};

		service.redirect = function(url, destinationURL) {
			
		}

		return service;
	}

})
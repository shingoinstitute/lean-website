(function() {

	angular.module('leansite')
	.directive('admin', function() {
		return {
			templateUrl: 'templates/user/admin.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	});

})();
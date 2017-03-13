(function() {

	angular.module('leansite')
	.directive('admin', function() {
		return {
			templateUrl: 'templates/admin/admin.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	});

})();
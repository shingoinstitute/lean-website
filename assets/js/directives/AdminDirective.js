(function() {

	angular.module('leansite')
	.directive('admin', function() {
		return {
			templateUrl: 'templates/admin/admin.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	})
	.directive('adminUserCard', function() {
		return {
			restrict: 'EA',
			scope: {
				user: "=",
				index: "=",
				ctrl: "="
			},
			templateUrl: 'templates/admin/adminUserCard.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	});

})();
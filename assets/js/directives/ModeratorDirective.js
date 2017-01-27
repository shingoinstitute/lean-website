(function() {

	angular.module('leansite')
	.directive('moderator', function() {
		return {
			scope: {
				users: "="
			},
			templateUrl: 'templates/moderator/moderator.tmpl.html',
			controller: 'ModeratorController',
			controllerAs: 'vm'
		}
	});

})();
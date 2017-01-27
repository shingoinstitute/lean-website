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
	})
	.directive('moderatorUser', function() {
		return {
			restrict: 'EA',
			scope: {
				user: "="
			},
			templateUrl: 'templates/moderator/moderator.user.tmpl.html',
			controller: 'ModeratorController',
			controllerAs: 'vm'
		}
	})
	.directive('moderatorAnswer', function() {
		return {
			scope: {
				answer: "="
			},
			templateUrl: 'templates/moderator/moderator.answer.tmpl.html',
			controller: 'ModeratorController'
		}
	})
	.directive('moderatorQuestion', function() {
		return {
			scope: {
				question: "="
			},
			templateUrl: 'templates/moderator/moderator.question.tmpl.html',
			controller: 'ModeratorController'
		}
	})
	.directive('moderatorComment', function() {
		return {
			scope: {
				comment: "="
			},
			templateUrl: 'templates/moderator/moderator.comment.tmpl.html',
			controller: 'ModeratorController'
		}
	});

})();
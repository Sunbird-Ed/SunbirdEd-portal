app.directive('ngIlRating', function() {
	return {
		restrict: 'A',
		scope: {
			post: '=',
            interaction: '='
		},
		templateUrl: '/templates/directives/interactions/ratingAction.html',
		link: function(scope, element, attrs) {
			// Declare defaults in the directive
			scope.upVote = scope.$parent.rate.up;
			scope.downVote = scope.$parent.rate.down;
			scope.$watch('interaction', function (value) {
			    scope.interaction = value;
			    evaluateActions();
			}, true);
			function evaluateActions() {
				if(!scope.post) {
					return;
				}
				scope.disabled = false;
				scope.enabled = false;
				if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
					scope.disabled = true;
                    return;
                }
				scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, scope, 'rate');
				if(!scope.userHasAccess && !scope.hidden) scope.disabled = true;
			}
			evaluateActions();
		}
	};
});
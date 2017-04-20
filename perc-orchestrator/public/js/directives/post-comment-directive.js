app.directive('ngIlPostComment', function() {
    return {
    	restrict: 'A',
    	scope: {
        	post: '=',
        	interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/commentPost.html',
      	link: function(scope, element, attrs) {
            scope.commentInteraction = scope.$parent.commentInteraction;
            scope.$watch('post', function (value) {
                scope.post = value;
                evaluateActions();
            }, true);
            function evaluateActions() {
                if(!scope.post) {
                    return;
                }
                scope.disabled = false;
                scope.enabled = false;
                if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
                    return;
                }
                scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, scope, 'commentOnPost');
                // Do post processing if required
            }
            evaluateActions();
      	}
    };
});
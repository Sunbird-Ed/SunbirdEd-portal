app.directive('ngIlAnswered', function() {
    return {
    	restrict: 'A',
    	scope: {
        	post: '=',
        	interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/answerAction.html',
      	link: function(scope, element, attrs) {
            // Declare defaults in the directive
            scope.markAnswered = scope.$parent.markAnswered;
            scope.$watch('interaction', function (value) {
                scope.interaction = value;
                evaluateActions();
            }, true);
            function evaluateActions() {
                scope.disabled = false;
                scope.enabled = false;
                scope.hidden = false;
                scope.editable = false;
                if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
                    scope.hidden = true;
                    return;
                }
                scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, scope, 'markAsAnswered');
                // Do post processing if required
            }
            evaluateActions();
      	}
    };
});
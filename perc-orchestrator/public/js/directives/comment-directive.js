app.directive('ngIlComment', function() {
    return {
    	restrict: 'A',
    	scope: {
        	interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/commentInteraction.html',
      	link: function(scope, element, attrs) {
      		// Declare defaults in the directive
            scope.comment = '';
            scope.metadata = scope.$parent.metadata;
            scope.answerInteraction = function(interaction, comment) {
                scope.comment = comment;
                scope.$parent.answerInteraction(interaction, scope);
            };
            scope.$watch('interaction', function (value) {
                scope.interaction = value;
                evaluateActions();
            }, true);
            function evaluateActions() {
                scope.disabled = false;
                scope.enabled = false;
                scope.hidden = false;
                if(scope.interaction.metadata.inappropriate) {
                    scope.hidden = true;
                    return;
                }
                scope.comment = '';
                scope.$parent.defaultActionEvaluation(scope.interaction, scope.interaction, scope, 'answer');
                // Do post processing if required
            }
            evaluateActions();
      	}
    };
});
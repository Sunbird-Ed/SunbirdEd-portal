app.directive('ngIlFollow', function() {
    return {
    	restrict: 'A',
    	scope: {
        	post: '=',
        	interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/followAction.html',
      	link: function(scope, element, attrs) {
            // Declare defaults in the directive
            scope.follow = scope.$parent.follow;
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
                scope.editable = false;
                if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
                    scope.disabled = true;
                    return;
                }
                scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, scope, 'follow');
                // Do post processing if required
            }
            evaluateActions();
      	}
    };
});
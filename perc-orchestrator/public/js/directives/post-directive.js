app.directive('ngIlPost', function() {
    return {
    	restrict: 'A',
    	scope: {
        	post: '=',
            interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/viewPost.html',
      	link: function(scope, element, attrs) {
            scope.renderHtml = scope.$parent.renderHtml;
            scope.$watch('interaction', function (value) {
                scope.interaction = value;
                evaluateActions();
            }, true);
            function evaluateActions() {
                if(!scope.post) {
                    return;
                }
                scope.showPost = true;
                scope.isInappropriate = false;
                scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, scope, 'unMarkAsSpam');
                if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
                    if(!scope.enabled) {
                        scope.showPost = false;
                    }
                    scope.isInappropriate = true;
                }
            }
            evaluateActions();
      	}
    };
});
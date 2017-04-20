app.directive('ngIlFlags', function() {
    var nextId = 0;
    return {
    	restrict: 'A',
    	scope: {
        	post: '=',
            interaction: '='
      	},
      	templateUrl: '/templates/directives/interactions/actionFlags.html',
      	link: function(scope, element, attrs) {

            scope.modalId = 'modal-' + nextId++;
            scope.flagAction = function(flag, post) {
                scope.selectedFlag = flag;
                $('#' + scope.modalId).modal('show');
            }
            scope.action = function(flag, post, message) {
                scope.$parent.action(flag.value, post, "true", message);
                if(flag.value == 'markAsFrivolous' || flag.value == 'markAsSpam') {
                    scope.$parent.flag('inappropriate', post, "true", message);
                }
            }

            scope.$watch('post', function (value) {
                scope.post = value;
                evaluateActions();
            }, true);

            function evaluateActions() {
                if(!scope.post) {
                    return;
                }
                if(scope.post.contextMetadata.type == 'interaction') {
                    scope.flags = [
                        {label: "Duplicate", value:"markAsDuplicate"},
                        {label: "Not Relevant", value:"markAsNotRelevant"},
                        {label: "Need More Info", value:"markAsNeedMoreInfo"},
                        {label: "Frivolous", value:"markAsFrivolous"},
                        {label: "Spam", value:"markAsSpam"}
                    ]
                } else {
                    scope.flags = [
                        {label: "Frivolous", value:"markAsFrivolous"},
                        {label: "Spam", value:"markAsSpam"}
                    ]
                }
                scope.showFlag = false;
                if(scope.post.metadata.inappropriate || scope.interaction.metadata.inappropriate) {
                    return;
                }
                scope.flags.forEach(function(flag) {
                    flag.enabled = false;
                    flag.hidden = false;
                    scope.$parent.defaultActionEvaluation(scope.post, scope.interaction, flag, flag.value);
                    if(flag.enabled || flag.editable) scope.showFlag = true;
                });
                // Do post processing if required
            }
            evaluateActions();
      	}
    };
});
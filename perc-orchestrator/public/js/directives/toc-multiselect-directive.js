app.directive('ngIlTocMultiselect', function() {
    return {
    	restrict: 'A',
    	scope: {
        	tocsource: '=',
            multiselectmodel: '=',
            onchange: '&'
      	},
      	templateUrl: '/templates/directives/assessments/tocMultiselect.html',
      	link: function(scope, element, attrs) {
            var isInternalUpdate = false;
            var fedoraPrefix = "info:fedora/";
            function removeFedoraPrefix(identifier) {
                if (identifier.indexOf(fedoraPrefix) == 0) {
                    return identifier.substring(fedoraPrefix.length);
                } else {
                    return identifier;
                }
            };

            function addFedoraPrefix(identifier) {
                if (identifier.indexOf(fedoraPrefix) == -1) {
                    return fedoraPrefix + identifier;
                }
                return identifier;
            };

            function setData() {
                if(!scope.tocsource) scope.tocsource = [];
                // console.log("scope.multiselectmodel:",scope.multiselectmodel.length);
                if(scope.multiselectmodel && scope.multiselectmodel.length > 0) {
                    var ids = [];
                    scope.multiselectmodel.forEach(function(item) {
                        ids.push(removeFedoraPrefix(item.id));
                    });
                    /*scope.tocsource.filter(function(item) {
                        return ids.indexOf(item.id) > -1;
                    }).forEach(function(item) {
                        item.isSelected = true;
                    });*/
                    var selectedtocitems = scope.tocsource.filter(function(item) {
                        return ids.indexOf(item.id) > -1;
                    });
                    scope.tocsource.forEach(function(item) {
                        if(selectedtocitems.indexOf(item) > -1) {
                            item.isSelected = true;
                        } else {
                            item.isSelected = false;
                        }
                    });
                    
                } else {
                    scope.multiselectmodel = [];
                    scope.tocsource.forEach(function(item) {
                        item.isSelected = false;
                    });
                }
            }

            setData();

            scope.$watch('multiselectmodel', function(newValue, oldValue) {
                console.log("multiselectmodel is updated.");
                // console.log("watch scope.multiselectmodel:",scope.multiselectmodel.length);
                if(!isInternalUpdate) {
                    setData();
                }
                isInternalUpdate = false;
            },true);
            
            scope.expandElement = function(learningElement) {
                learningElement.expand = !learningElement.expand;
                var expand = learningElement.expand;
                if(expand) {
                    scope.getChildren(learningElement, false).forEach(function(item) {
                        item.show= !item.show;
                    });                    
                } else {
                    scope.getChildren(learningElement, false).forEach(function(item) {
                        item.show= false;
                        item.expand = true;
                        scope.expandElement(item);
                    });                    
                }
            }

            scope.getChildren = function(learningElement, isRecursive) {
                var children = [];
                var firstChildren = scope.tocsource.filter(function(item) {
                    return item.parentId == learningElement.id;
                });
                if(isRecursive && firstChildren.length > 0) {
                    firstChildren.forEach(function(item) {
                        children.push(item);
                        var secondChildren = scope.getChildren(item, isRecursive);
                        secondChildren.forEach(function(item) {
                            children.push(item);
                        });
                    });
                    return children;
                } else {
                    return firstChildren;
                }
            }

            scope.toggleElementSelect = function(learningElement) {
                var isSelected = learningElement.isSelected;
                console.log("isSelected:", isSelected);
                scope.getChildren(learningElement, true).forEach(function(item) {
                    item.isSelected = isSelected;
                });
                isInternalUpdate = true;
                scope.multiselectmodel = scope.tocsource.filter(function(item) {
                    return item.isSelected == true;
                });
                if(scope.onchange) {
                    scope.onchange(learningElement);
                }
            }
      	}
    };
});
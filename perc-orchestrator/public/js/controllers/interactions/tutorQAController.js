app.controller('CoachQAController',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', 'CourseBrowserService', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $stateParams, cbService, $state, $controller) {

    $controller('BaseInteractionController', { $scope: $scope });
    var lobId = $stateParams.lobId;
    var interactionId = $stateParams.interactionId;
    $rootScope.leftMenu = 'qa';
    $scope.metadata = {
        interactionType: "TutorQA"
    }
    $scope.search = {
        metadata: {
            interactionType: "TutorQA"
        },
        filter: [],
        orFilter:[]
    };
    $scope.myStudents = [];

    $scope.checkRole = function(){
        service.checkRole({checkRole:true}).then(function(response) {
            $scope.loggedInUserRole = response.role;
            if($scope.loggedInUserRole == 'tutor' || $scope.loggedInUserRole == 'faculty') {
                $scope.search.filter.push({name:'to', value: $rootScope.loggedUserId});
            } else {
                $scope.search.filter.push({name:'to', value: $rootScope.myCoach});
                $scope.search.filter.push({name:'from', value: $rootScope.loggedUserId});
                if(!$rootScope.myCoachName) {
                    service.getFromService('/private/v1/user/' + $rootScope.myCoach).then(function(user) {
                        $rootScope.myCoachName = user.displayName;
                    }).catch(function(err){console.log('err fetching user - ', err)})
                }
            }
            $scope.getInteractions();
            if($rootScope.InteractionsViewFromPie && $scope.loggedInUserRole == 'student') {
                $scope.askQuestion();
            }
            $rootScope.InteractionsViewFromPie = false;
        });
    }

    $scope.loadInteractions = function() {
        $scope.selectedInteraction = null;
        $scope.getActionsMetadata();
        $scope.checkRole();
        if(cbService.currentItem.id) {
            $scope.allLectures.forEach(function(lecture) {
                if(lecture.id == cbService.currentItem.id) {
                    $scope.selectedLecture = lecture;
                }
            });
        }
        $timeout(function() {
            $("#selectedLecture").select2({
                formatResult: function(state) {
                    return state.text;
                },
                placeholder: "Select Lesson/Lecture",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
        }, 10)
    };

    $scope.backToList = function() {
        $state.go('coachqa', {});
    }

    $scope.interactionURL = function(interactionId) {
        $state.go('coachqa.interaction', {interactionId: interactionId})
    }

    $scope.selectConcept = function(conceptId) {
        var selectedConcept;
        $scope.conceptsList.forEach(function(concept) {
            if(concept.id == conceptId) {
                selectedConcept = concept;
            }
        })
        $rootScope.clearFilterInScope();
        $("#selectedConceptsSB").select2("val", selectedConcept.index);
        $rootScope.interactionFilters.selectedConcepts.push(selectedConcept);
        $scope._searchInteractions(0, false);
    }

    $scope.selectElement = function(elementId) {
        elementId = cbService.removeFedoraPrefix(elementId);
        $rootScope.clearFilterInScope();
        var selectedLecture;
        cbService.serializedTOC.forEach(function(lecture) {
            if(lecture.id == elementId) {
                selectedLecture = lecture;
            }
        });
        $("#lectureSelect").select2("val", selectedLecture.index);
        $rootScope.setQAContext(selectedLecture);
        $scope._searchInteractions(0, false);
    }

    var queryInteractions = function(type, val) {
        return function() {
            if (type == 'filter') {
                $rootScope.searchByFilter = val;
            }
        }
    }

    $scope.getInteractions = function() {
        $scope.loadingInteraction = true;
        if(!$rootScope.interactionFilters.selectedContextId) {
            $rootScope.setQAContext(cbService.serializedTOC[0]);
        }
        $scope.initializeSelect2();
        $scope._searchInteractions(0, false);
    }

    $scope.searchInteractions = function() {
        if($rootScope.interactionFilters.context)
            $rootScope.setQAContext($rootScope.interactionFilters.context);
        $scope.noQuestionsInList = false;
        $scope._searchInteractions(0, false);
    }

    $scope.$on('showInteractions', function(e) {
        $scope.showInteractions();
    });

    $scope.setSaveMetadata = function(intObject) {

        for(k in $scope.metadata) {
            intObject.metadata[k] = $scope.metadata[k];
        }
        intObject.metadata.to = $rootScope.myCoach;

        var selectedId = $scope.selectedLecture.id;
        if(!selectedId) {
            return;
        }
        var selectedItem = cbService.getElementFromMap(selectedId);
        if(selectedItem) {
            intObject.metadata.learningElementId = cbService.addFedoraPrefix(selectedItem.id);
            intObject.metadata.leType = selectedItem.type;
            if(selectedItem.type == 'lesson') {
                intObject.metadata.lessonId = cbService.addFedoraPrefix(selectedItem.id);
                intObject.metadata.moduleId = cbService.addFedoraPrefix(selectedItem.parentId);
            } else if(selectedItem.type == 'module') {
                intObject.metadata.moduleId = cbService.addFedoraPrefix(selectedItem.id);
            } else if(selectedItem.type != 'course') {
                intObject.metadata.lessonId = cbService.addFedoraPrefix(selectedItem.parentId);
                if(selectedItem.parent) {
                    intObject.metadata.moduleId = cbService.addFedoraPrefix(selectedItem.parent.parentId);
                } else {
                    var parent = cbService.getElementFromMap(selectedItem.parentId);
                    intObject.metadata.moduleId = cbService.addFedoraPrefix(parent.parentId);
                }
            }
        }
    }

    function addToSearchFilter(key, value) {
        if(value) {
           $rootScope.interactionsSearch.filter.push({name: key, value: value});
           $scope.filterApplied = true;
        }
    }

    $scope._searchInteractions = function(offset, append) {
        $scope.filterApplied = false;
        $scope.appliedFilters = JSON.parse(JSON.stringify($rootScope.interactionFilters));
        $('#searchInteractions').html('Searching...').attr('disabled', true);
        $rootScope.interactionsSearch.filter = [];
        if($rootScope.interactionFilters.fromDate) addToSearchFilter('fromDate', $rootScope.interactionFilters.fromDate);
        if($rootScope.interactionFilters.toDate) addToSearchFilter('toDate', $rootScope.interactionFilters.toDate);
        $rootScope.interactionsSearch.filter.push({name: 'excludeSpam', value: true});
        var args = {
            courseId: $scope.courseId,
            metadata: $scope.search.metadata,
            query: $rootScope.interactionsSearch.query,
            filter: $scope.search.filter,
            orFilter: $scope.search.orFilter,
            order: 'lastUpdated',
            tags: $rootScope.searchTags,
            offset: offset
        };
        args.metadata.learningElementId = undefined;
        args.metadata.lessonId = undefined;
        args.metadata.moduleId = undefined;
        if($rootScope.interactionFilters.selectedConcepts && $rootScope.interactionFilters.selectedConcepts.length > 0) {
            args.concepts = [];
            $rootScope.interactionFilters.selectedConcepts.forEach(function(concept) {
                args.concepts.push(concept.id);
            });
            $scope.filterApplied = true;
        }
        if($rootScope.interactionFilters.lessonId) {
            args.metadata.lessonId = $rootScope.interactionFilters.lessonId;
            $scope.filterApplied = true;
        }
        if($rootScope.interactionFilters.moduleId) {
            args.metadata.moduleId = $rootScope.interactionFilters.moduleId;
            $scope.filterApplied = true;
        }
        if($rootScope.interactionFilters.learningElementId) {
            args.metadata.learningElementId = $rootScope.interactionFilters.learningElementId;
            $scope.filterApplied = true;
        }

        service.searchInteractions(args).then(function(response) {
            $scope.loadingInteraction = false;
            $('#searchInteractions').html('Search').attr('disabled', false);
            if (append) {
                if(response.length > 0)
                    $scope.interactions.push.apply($scope.interactions, response);
                else
                    $scope.noMoreInteractions = true;
            } else {
                if (response.length > 0)
                    $scope.interactions = response;
                else
                    $scope.interactions = [];
            }
            if(response && null != response) {
                response.forEach(function(int) {
                    if(int.concepts && int.concepts.length > 0) {
                        int.conceptNames = [];
                        int.concepts.forEach(function(id) {
                            int.conceptNames.push({id: id, concept: $rootScope.conceptTitleMap[id]});
                        });
                    }
                    int.elementName = $scope.getElementName(int.learningElementId);
                })
            }
            $scope.pageLoadComplete = true;
            $scope.canShowMore(response);
        }, function(err) {
            $scope.loadingInteraction = false;
        });
    }

    $scope.showAlertMessage = function(jQueryDomObj, alertMessage, popUpState){
        jQueryDomObj.html(alertMessage).removeClass('hide');
        setTimeout(function(){
            jQueryDomObj.addClass('hide');
            if(popUpState == 'hidePopup') $('.modal').modal('hide');
        }, 3000);
    }

    $rootScope.setQAContext = function(context) {
        $rootScope.interactionFilters.context = context;
        $rootScope.interactionFilters.learningElementId = undefined;
        $rootScope.interactionFilters.lessonId = undefined;
        $rootScope.interactionFilters.moduleId = undefined;
        if(context.id) {
            $rootScope.interactionFilters.selectedContextId = context.id;
            switch(context.type) {
                case 'module':
                    $rootScope.interactionFilters.moduleId = cbService.addFedoraPrefix(context.id);
                    break;
                case 'lesson':
                    $rootScope.interactionFilters.lessonId = cbService.addFedoraPrefix(context.id);
                    break;
                default:
                    $rootScope.interactionFilters.learningElementId = cbService.addFedoraPrefix(context.id);
                    break;
            }
        } else {
            $rootScope.interactionFilters.selectedContextId = $rootScope.courseLobId;
        }
    }

    $rootScope.clearFilterInScope = function(clearSet) {
        if(typeof clearSet == 'undefined') {
            clearSet = true;
        }
        $scope.showFilters = false;
        $rootScope.interactionFilters.context = undefined;
        $rootScope.interactionFilters.selectedConcepts = [];
        $rootScope.interactionFilters.fromDate = '';
        $rootScope.interactionFilters.toDate = '';
        $rootScope.interactionFilters.learningElementId = undefined;
        $rootScope.interactionFilters.lessonId = undefined;
        $rootScope.interactionFilters.moduleId = undefined;
        $rootScope.interactionFilters.selectedContextId = undefined;
        $rootScope.setQAContext(cbService.serializedTOC[0]);
        $("#lectureSelect").select2("val", 0);
        $("select.selectBox").select2("val", "");
    }

    $rootScope.clearAllFilters = function() {
        $rootScope.clearFilterInScope();
        $scope.searchInteractions(0, false);
    }

    $rootScope.clearFilters = function(type, data){
        switch(type) {
            case 'context':
                $("#lectureSelect").select2("val", 0);
                $rootScope.setQAContext(cbService.serializedTOC[0]);
                $scope.searchInteractions(0, false);
                break;
            case 'concept':
                var idx = [], index = 0, selIndex = -1;
                $rootScope.interactionFilters.selectedConcepts.forEach(function(concept) {
                    if(concept.id != data.id) {
                        idx.push(concept.index);
                    } else {
                        selIndex = index;
                    }
                    index++;
                });
                if(selIndex != -1) {
                    $rootScope.interactionFilters.selectedConcepts.splice(selIndex, 1);
                }
                $("#selectedConceptsSB").select2("val", idx);
                $scope.searchInteractions(0, false);
                break;
            case 'fromdate':
                $rootScope.interactionFilters.fromDate = undefined;
                $scope.searchInteractions(0, false);
                break;
            case 'todate' :
                $rootScope.interactionFilters.toDate = undefined;
                $scope.searchInteractions(0, false);
                break;
            case 'daterange':
                $rootScope.interactionFilters.fromDate = '';
                $rootScope.interactionFilters.toDate = '';
                $scope.searchInteractions(0, false);
                break;
        }
    }

    $scope.initializeSelect2 = function() {
        setTimeout(function() {
            $("#lectureSelect").select2({
                formatResult: function(state) {
                    return state.text;
                },
                placeholder: "Select Lectures...",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
        }, 100);
    }
    if (interactionId && interactionId != '') {
        $scope.selectInteraction({interactionId: interactionId, contextMetadata: {}, summaries: {}, systemMetadata: {}});
    } else {
        $scope.loadInteractions();
    }
    setTimeout(function() {
        selectLeftMenuTab('forumsTab');
    }, 100);

}]);
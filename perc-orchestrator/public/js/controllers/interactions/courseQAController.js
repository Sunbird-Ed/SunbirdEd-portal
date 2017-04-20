app.controller('CourseQAController',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', 'CourseBrowserService', '$state', '$controller', 'CommunityService', function($scope, $http, $timeout, $rootScope, service, $stateParams, cbService, $state, $controller, cmService) {

    $controller('BaseInteractionController', { $scope: $scope });
    $rootScope.leftMenu = 'qa';
    $rootScope.showConceptMap = false;
    $scope.showBackToList = false;
	$scope.showAddQuestion = false;
    $scope.filePreview = false;
    $scope.attachments = [];
    $scope.enableEdit = false;
    $scope.showFilters = false;
    $scope.showSaveButton = true;
    $scope.errorMsgContent;
    $scope.selectedLecture = undefined;
    $scope.metadata = {
        interactionType: "QA",
        accessType: 'OPEN'
    };
    $scope.canPostInteraction = false;

    cmService.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole != 'faculty_observer') {
            $scope.canPostInteraction = true;
        }
    });

    $rootScope.interactionsSearch = {
        order: 'topRated',
        filter: '',
        query: ''
    };
    $rootScope.searchConcept = '';
    $rootScope.searchTags = '';
    $rootScope.interactionsSearch.filter = [];

    var lobId = $stateParams.lobId;
    var interactionId = $stateParams.interactionId;
    $scope.loadInteractions = function() {
        $scope.selectedInteraction = null;
        $scope.getActionsMetadata();
        if($rootScope.interactionFilters.selectedSet) {
            $scope.getSet($rootScope.interactionFilters.selectedSet);
        } else {
            $scope.getInteractions();
        }
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
                placeholder: "Select Lectures...",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
        }, 100);
    };

    $scope.backToList = function() {
        $state.go('courseqa', {});
    }

    $scope.interactionURL = function(interactionId) {
        $state.go('courseqa.interaction', {interactionId: interactionId})
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
            else if (type == 'sort') {
                $rootScope.interactionsSearch.order = val;
                if(!$rootScope.interactionFilters.selectedSet) {
                    $scope.searchInteractions(0, false);
                } else {
                    var sortField = 'rating';
                    switch(val) {
                        case 'mostActive':
                        sortField = 'activeCount';
                        break;
                        case 'newest':
                        sortField = 'createdDate';
                        break;
                        default:
                        sortField = 'rating';
                        break;
                    }
                    $scope.interactions.sort(function(a, b){
                        return b[sortField] - a[sortField];
                    });
                }
            }
        }
    }

    $rootScope.interactionQueries = [
        {
		    name: 'Answered',
		    trigger: queryInteractions('filter', 'answered')
		}, {
		    name: 'Answered By Me',
		    trigger: queryInteractions('filter', 'answeredByMe')
		}, {
		    name: 'Answered By Tutor',
		    trigger: queryInteractions('filter', 'answeredByTutor')
		}, {
		    name: 'Answered By Faculty',
		    trigger: queryInteractions('filter', 'answeredByFaculty')
		}, {
		    name: 'My Questions',
		    trigger: queryInteractions('filter', 'askedByMe')
		}, {
		    name: 'Not Answered',
		    trigger: queryInteractions('filter', 'notAnswered')
		}
	];

    $rootScope.sortOptions = [{
            name: 'Top Rated',
            value: 'topRated',
            trigger: queryInteractions('sort', 'topRated')
        },{
            name: 'Newest',
            value: 'newest',
            trigger: queryInteractions('sort', 'newest')
        },{
            name: 'Most Answers',
            value: 'mostAnswers',
            trigger: queryInteractions('sort', 'mostAnswers')
        },{
            name: 'Most Active',
            value: 'mostActive',
            trigger: queryInteractions('sort', 'mostActive')
        }
    ];

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

        if($scope.attachments.length > 0) {
            intObject.attachments = $scope.attachments;
        }

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
        if($rootScope.searchByFilter && $rootScope.searchByFilter != '') {
            addToSearchFilter($rootScope.searchByFilter, true);
        }
        if($rootScope.interactionFilters.fromDate) addToSearchFilter('fromDate', $rootScope.interactionFilters.fromDate);
        if($rootScope.interactionFilters.toDate) addToSearchFilter('toDate', $rootScope.interactionFilters.toDate);
        addToSearchFilter('excludeNotAns', $rootScope.interactionFilters.excludeNotAns);
        addToSearchFilter('excludeNotRel', $rootScope.interactionFilters.excludeNotRel);
        $rootScope.interactionsSearch.filter.push({name: 'excludeSpam', value: true});
        var args = {
            courseId: $scope.courseId,
            metadata: $scope.metadata,
            query: $rootScope.interactionsSearch.query,
            filter: $rootScope.interactionsSearch.filter,
            order: $rootScope.interactionsSearch.order,
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
                response.forEach(function(_int) {
                    if(_int.concepts && _int.concepts.length > 0) {
                        _int.conceptNames = [];
                        _int.concepts.forEach(function(id) {
                            _int.conceptNames.push({id: id, concept: $rootScope.conceptTitleMap[id]});
                        });
                    }
                    _int.elementName = $scope.getElementName(_int.learningElementId);
                })
            }
            $scope.pageLoadComplete = true;
            $scope.canShowMore(response);
        }, $scope.interactionError);
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

    $scope.setScopeValue = function(value, key) {
        service.interactionFilter[key] = value;
    }

    $scope.getTocList = function(toc) {
        var list = [];
        toc.modules.forEach(function(module) {
            list[module.id] = {'id': module.id, 'name': module.name, 'eleType':'module'};
            module.lessons.forEach(function(lesson) {
                list[lesson.id] = {'id': lesson.id, 'name': lesson.name, 'eleType':'lesson'};
                lesson.lectures.forEach(function(lecture) {
                    list[lecture.id] = {'id': lecture.id, 'name': lecture.name, 'eleType':'lecture'};
                });
            });
        });
        return list;
    }

    $rootScope.clearFilterInScope = function(clearSet) {
        if(typeof clearSet == 'undefined') {
            clearSet = true;
        }
        $scope.showFilters = false;
        $rootScope.interactionFilters.context = undefined;
        $rootScope.interactionFilters.searchQuery = undefined;
        $rootScope.interactionFilters.selectedConcepts = [];
        $rootScope.interactionFilters.fromDate = '';
        $rootScope.interactionFilters.toDate = '';
        $rootScope.interactionFilters.excludeNotAns = false;
        $rootScope.interactionFilters.excludeNotRel = false;
        $rootScope.interactionFilters.learningElementId = undefined;
        $rootScope.interactionFilters.lessonId = undefined;
        $rootScope.interactionFilters.moduleId = undefined;
        $rootScope.interactionFilters.selectedContextId = undefined;
        if(clearSet) {
            $rootScope.interactionFilters.selectedSet = undefined;
        }
        $rootScope.setQAContext(cbService.serializedTOC[0]);
        $rootScope.interactionsSearch = {
            order: 'topRated',
            filter: '',
            query: ''
        };
        $rootScope.searchByFilter = undefined;
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
            case 'quickfilter':
            $rootScope.interactionFilters.searchQuery = undefined;
                $("#quickFilterSB").select2("val", "");
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
            case 'excludeNotAns':
                $rootScope.interactionFilters.excludeNotAns = '';
                $scope.searchInteractions(0, false);
                break;
            case 'excludeNotRel':
                $rootScope.interactionFilters.excludeNotRel = '';
                $scope.searchInteractions(0, false);
                break;
            case 'exclude':
                $rootScope.interactionFilters.excludeNotAns = '';
                $rootScope.interactionFilters.excludeNotRel = '';
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

    if($rootScope.InteractionsViewFromPie){
        $scope.askQuestion();
        $rootScope.InteractionsViewFromPie = false;
    }
}]);

app.controller('ForumsListController',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', 'CourseBrowserService', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $stateParams, cbService, $state, $controller) {

    $controller('BaseInteractionController', { $scope: $scope });
    $rootScope.leftMenu = 'qa';

    /** Sets Functionality - START **/
    $scope.model = {
        loggedInUserRole: 'student',
        interactionIdsinSet: [],
        canCreateSet: false,
        selectedSet: undefined,
        selectedSetId: undefined,
        sets: [],
        interactions:[]
    }

    $scope.checkRole = function(){
        service.checkRole({checkRole:true}).then(function(response) {
            $scope.model.loggedInUserRole = response.role;
            if($scope.model.loggedInUserRole == 'tutor' || $scope.model.loggedInUserRole == 'faculty') {
                $scope.model.canCreateSet = true;
            }
        });
    }

    $scope.createSet = function() {
        if($scope.model.newSetName == '' || $scope.model.newSetName == undefined){
            $scope.createSetErrorMsg = true;
            $scope.errorMsgContent = 'Please fill the set name';
            return false;
        }
        $scope.showSaveButton = false;
        var data = {
            setName:  $scope.newSetName,
            courseId: $scope.courseId
        }
        service.createSet(data).then(function(response) {
            if( response.errors.length == 0) {
                $scope.showSaveButton = true;
                $scope.getSet(response.responseValueObjects.SET);
                $scope.getSets();
            }
            else $scope.createSetErrorMsg = true;
        });
    }

    $scope.addInteractionToSet = function(interactionId, element){
        var data = {
            setId: $scope.model.selectedSetId,
            intId: interactionId,
            courseId: $rootScope.courseId
        }
        $scope.interactionIdsinSet.push(interactionId);
        service.addInteractionToSet(data).then(function(response) {
            //console.log('server--',response);
            if( response.errors.length == 0) {
                $scope.getSets();
            }
            else console.log('server error');
        });
    }

    $scope.removeInteractionFromSet = function(removeInteractionId, element){

        var data = {
            setId: $scope.model.selectedSetId,
            intId: removeInteractionId,
            courseId: $rootScope.courseId
        }
        var index = $scope.interactionIdsinSet.indexOf(removeInteractionId);
        if(index > -1) {
            $scope.interactionIdsinSet.splice(index, 1);
        }
        service.removeInteractionFromSet(data).then(function(response) {

            if( response.errors.length == 0) {
                $scope.getSets();
            }
            else console.log('server error');
        });
    }

    $scope.deleteSet = function(){

        var data = {
            setId: $scope.model.selectedSetId,
            courseId: $rootScope.courseId
        }

        service.deleteSet(data).then(function(response) {
            $scope.displayMessage = $scope.interactionFilters.selectedSet.label + ' is deleted successfully!!';
            $('#interactionModal').modal({keyboard:false, show: true, backdrop: 'static'});
            if(response.errors.length == 0){
                $scope.getSets();
            }
        });
    }

    $scope.getSet = function(setId) {

        $scope.model.selectedSetId = setId;
        $scope.model.interactionIdsinSet = [];
        $scope.pageLoadComplete = false;
        var data = {
            setId: setId,
            courseId: $rootScope.courseId,
        }
        service.getSet(data).then(function(response) {
            if (response.length > 0) {
                response.sort(function(a, b){
                    return b['rating'] - a['rating'];
                });
                for(var k in response) {
                   $scope.model.interactionIdsinSet.push(response[k].interactionId);
                }
                $scope.model.interactions = response;
            }
            else {
                $scope.model.interactions = [];
            }
            if(response && null != response) {
                response.forEach(function(_int) {
                    if(_int.concepts && _int.concepts.length > 0) {
                        _int.conceptNames = [];
                        _int.concepts.forEach(function(id) {
                            _int.conceptNames.push({id: id, concept: $rootScope.conceptTitleMap[id]});
                        });
                    }
                    _int.elementName = $scope.getElementName(_int.learningElementId);
                })
            }
        }, $scope.interactionError);
    }

    $scope.interactionExistsInSet = function(interactionId) {
        if($scope.model.interactionIdsinSet){
            if($scope.model.interactionIdsinSet.indexOf(interactionId) != -1 ){
                return true;
            }
        }
        return false;
    }

    $scope.getSets = function() {
        var data = {
            courseId: $rootScope.courseId,
            metadata: {
                context: 'interactions',
                forum: 'QA'
            }
        }
        service.getSets(data).then(function(response) {
            $scope.model.sets = response.responseValueObjects.SETS.valueObjectList;
        }, $scope.interactionError);
    }

    /** Sets Functionality - END **/
    if($stateParams.setId) {
        $scope.getSet($stateParams.setId);
    } else {
        $scope.getSets();
    }
    $scope.checkRole();
}]);
app.controller('AdminQAController',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', 'CourseBrowserService', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $stateParams, cbService, $state, $controller) {

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
    $scope.metadata = {
        interactionType: "AdminQA",
        accessType: 'OPEN'
    };

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
        $scope.getInteractions();
    };

    $scope.backToList = function() {
        $state.go('adminqa', {});
    }

    $scope.interactionURL = function(interactionId) {
        $state.go('adminqa.interaction', {interactionId: interactionId})
    }

    $scope.selectConcept = function(concept) {
        $rootScope.clearFilterInScope();
        $rootScope.interactionFilters.addedToSelectedConcepts.push(concept);
        $scope._searchInteractions(0, false);
    }

    $scope.selectElement = function(elementId) {
        var element = cbService.getElementFromMap(cbService.removeFedoraPrefix(elementId));
        $rootScope.clearFilterInScope();
        $rootScope.setQAContext(element);
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
        if(context && context.id) {
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

    $scope.clearConceptInput = function(){
    }

    $scope.removeSelectedConcepts = function(concept) {
        var IfilterIndex = service.interactionFilter.concepts.indexOf(concept.id);
        if(IfilterIndex > -1) {
            service.interactionFilter.concepts.splice(IfilterIndex, 1);
         if($rootScope.interactionFilters.addedToSelectedConcepts.length > 0){
             var SCIndex = $rootScope.interactionFilters.addedToSelectedConcepts.indexOf(concept);
            if(SCIndex > -1)
                $rootScope.interactionFilters.addedToSelectedConcepts.splice(SCIndex, 1);
         }
        }
    }

    $rootScope.clearFilterInScope = function(clearSet) {
        if(typeof clearSet == 'undefined') {
            clearSet = true;
        }
        $scope.showFilters = false;
        $rootScope.interactionFilters.context = undefined;
        $rootScope.interactionFilters.searchQuery= $rootScope.interactionQueries[0];
        $rootScope.interactionFilters.addedToSelectedConcepts= [];
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
        $scope.initializeSelect2();
    }

    $rootScope.clearAllFilters = function() {
        $rootScope.clearFilterInScope();
        $scope.searchInteractions(0, false);
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
        $scope.listView = false;
        $scope.selectInteraction({interactionId: interactionId, contextMetadata: {}, summaries: {}, systemMetadata: {}});
    } else {
        $scope.loadInteractions();
    }

    setTimeout(function() {
        selectLeftMenuTab('forumsTab');
        $('.qacontextselect').click(function(evt) {
            evt.stopPropagation();
            $(".qa-context-container").toggleClass("qa-context-container-hover");
            $('.qacontextselect').val('');
        });
        $(document).click(function() {
            $('.qa-context-container').removeClass('qa-context-container-hover'); //make all inactive
            if($('.qacontextselect').val() == '') {
                $('.qacontextselect').val(contextSearchPrevValue);
            }
        });
    }, 100);

    if($rootScope.InteractionsViewFromPie){
        $scope.askQuestion();
        $rootScope.InteractionsViewFromPie = false;
    }
}]);
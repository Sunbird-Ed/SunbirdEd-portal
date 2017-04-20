app.controller('createQuestionSetCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state) {
	$rootScope.leftMenu = 'assessments';
    $scope.defaultResultLimit = 25;
    $scope.bodyLimitTo = 200;
    $rootScope.showConceptMap = false;
    $scope.workFlowStep = 1; // 1 - Search Questions, 2 - Save Search Criteria. 
	$scope.questionSetUsedIn = ["Exam", "Practice"];
    $scope.operationType = "Create";

    $scope.difficultyLevels =[ {id: 1, name: "Easy"}, {id: 2, name: "Medium"}, {id: 3, name: "Difficult"}];
    $scope.questionTypes = ["Objective", "Programming"];
    $scope.questionSubTypes = [{ id: 1, name : "MCQ"}, { id: 2, name : "MMCQ"}];
    $http.get('/private/v1/course/getOutcomes/'+encodeURIComponent(service.addFedoraPrefix($rootScope.courseId)))
        .success(function(outcomes){
            $scope.courseOutcomes = [];
            var i = 1;
            outcomes.forEach(function(item) {
                $scope.courseOutcomes.push({id: i++, name: item});
            });
        });

    
    $scope.purpose = [
                        { 'name': 'Knowledge', 'subpurpose' : [{id:1, name: "Definition"}, {id:2, name:"Syntax memory"}, {id:3, name: "Steps or process"}] }, 
                        { 'name': 'Conceptual', 'subpurpose' : [{id:1, name:"Working mechanism of principle"}, {id:2, name: "Cause/effect"}] }, 
                        { 'name': 'Application', 'subpurpose' : [{id:1, name:"Complete the code"}, {id:2, name:"Complete the algorithm"}, {id:3, name:"Develop a program"}, {id:4, name:"Develop an algorithm"}, {id:5, name:"Develop test cases"}] }, 
                        { 'name': 'Problem solving', 'subpurpose' : [{id:1, name:"Identify the error in"}, {id:2, name:"Extend using API"}, {id:3, name:"Trace execution path"}] }
                    ];               

    $scope.searchResultCount = 0;
    $scope.searchResult = [];
    $scope.searchFilters = [];
    $scope.showSearchResult = false;
    $scope.resultLimit = $scope.defaultResultLimit;

    $scope.questionSearch = {
        learningElements: service.getLearningElements()
    };

	$rootScope.listQuestionSetFilters = {
        questionSetName: "",
        questionSetDescription: "",
        testUsage: "", // This is for filter
        usedIn: "Exam", // This is for QuestionSet level data.
		selectedContexts : '',
        learningElements: [],
        selectedConcepts : [],
        purpose : '',
        selectedSubPurpose : [],
        selectedDifficultyLevel
         : [{id: 1, name: "Easy"}],
        selectedQuestionType : '',
        selectedQuestionSubType : [],
        selectedOutcome : [],
        selectedLOB : [],
	};
    $scope.conceptsList = [];
    $scope.selectedContext = '';
    $scope.editQuesionSet = {};

    $scope.getQuestionTitle = function(body) {
        return $scope.renderHtmlTrim(body, 50);
    }


    $scope.setDefaultAssessmentContext = function() {
    	$rootScope.leftMenu = 'assessments';
    	$rootScope.ViewContext = 'questionSets';
        $rootScope.viewAssessment = 'questionSet';
    	$rootScope.menuSlided = true;
        $scope.questionSetToc = service.getTOCForQuestionSets();
        $scope.tocKeyName = service.getTOCKeyNames();
        // console.log("$routeParams.questionSetId:",$routeParams.questionSetId);
        if($routeParams.questionSetId) {
            $scope.operationType = "Update";
            service.callService("getItemSet?ITEM_SET_ID="+$routeParams.questionSetId, {}, "PATCH", "READ").then(function(result) {
                // console.log("getItemSet service result:",JSON.stringify(result));
                if(result && result.responseValueObjects && result.responseValueObjects.ITEM_SET) {
                    $scope.editQuesionSet = result.responseValueObjects.ITEM_SET;
                    populateSearchCriteria(result.responseValueObjects.ITEM_SET, $rootScope, $scope, service);
                }
            });
        } else {
            $scope.operationType = "Create";
        }
    }

    $scope.setDefaultAssessmentContext();

    $rootScope.$watch('listQuestionSetFilters', function(oldElement, newElement) {
        $scope.showSearchResult = false;
    }, true);

    $scope.updateResultLimit = function() {
        if(($scope.resultLimit+$scope.defaultResultLimit) >= $scope.searchResult.length) {
            $scope.resultLimit = $scope.searchResult.length;
        } else {
            $scope.resultLimit += $scope.defaultResultLimit;
        }
        // console.log("$scope.resultLimit:",$scope.resultLimit);
    }

    $scope.clearSearch = function() {
        $scope.resultLimit = $scope.defaultResultLimit;
        $scope.showSearchResult = false;
        $scope.searchResultCount = 0;
        $scope.searchResult = [];
        $scope.searchFilters = [];
        $scope.selectedContext = '';
        $rootScope.listQuestionSetFilters = {
            questionSetName: "",
            questionSetDescription: "",
            testUsage: "",
            usedIn: "Exam",
            selectedContexts : '',
            learningElements: [],
            selectedConcepts : [],
            purpose : '',
            selectedSubPurpose : [],
            selectedDifficultyLevel : [{id: 1, name: "Easy"}],
            selectedQuestionType : '',
            selectedQuestionSubType : [],
            selectedOutcome : [],
            selectedLOB : [],
        };
        if($routeParams.questionSetId) {
            // console.log("$scope.editQuesionSet:",$scope.editQuesionSet);
            populateSearchCriteria($scope.editQuesionSet, $rootScope, $scope, service);
        }
    }

    $scope.getContentTitleOfItem = function(learningElements) {
        var lobNames = [];
        if(learningElements){
            learningElements.forEach(function(identifier) {
                if($scope.tocKeyName[identifier]) {
                    lobNames.push($scope.tocKeyName[identifier]);
                }
            });
        }
        if(lobNames.length > 0) {
            return lobNames.toString();
        } else {
            return "---";
        }
    }

    $scope.getDataForQuestionPreview = function(assessmentItemId, divId){
        previewQuestion(assessmentItemId, divId);
    }

    $scope.previewSearchCriteria = function() {
        $scope.workFlowStep = 2;
    }

    $scope.searchQuestions = function() {
        $("#qsSearchQAlert").addClass("hide");
        if($scope.listQuestionSetFilters.learningElements.length > 0 && $scope.listQuestionSetFilters.purpose && $scope.listQuestionSetFilters.selectedDifficultyLevel.length > 0) {
            $('#searchQuestions').html('Searching...').attr('disabled', true);
            $scope.showSearchResult = true;
            $scope.resultLimit = $scope.defaultResultLimit;
            $scope.searchResult = [];

            var req = new Object();
            req.SEARCH_CRITERIA = {"offset": 0, "limit": 100};
            $scope.searchFilters = createSearchFilters($scope, $rootScope, service);
            $scope.searchFilters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
            req.SEARCH_CRITERIA.filters = $scope.searchFilters;
            // console.log("filterData:", $rootScope.listQuestionSetFilters);
            // console.log("request:",JSON.stringify(req));

            service.callService("searchAssessmentItems", req, "PATCH", "READ").then(function(result) {
                // console.log("service result:",JSON.stringify(result));
                if(result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_LIST && result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList)
                    $scope.searchResult = result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList;            
            });

            service.callService("countAssessmentItems", req, "PATCH", "READ").then(function(result) {
                $('#searchQuestions').html('Search').attr('disabled', false);
                // console.log("service result:",JSON.stringify(result));
                if(result.responseValueObjects && result.responseValueObjects.COUNT && result.responseValueObjects.COUNT.id) {
                    $scope.searchResultCount = result.responseValueObjects.COUNT.id;
                } else {
                    $scope.searchResultCount = 0;
                }
            });
        } else {
            $("#qsSearchQAlert").removeClass("hide");
            setTimeout(function() {
                $("#qsSearchQAlert").addClass("hide");
            },10000);
        }
    }

    $scope.saveQuestionSet = function() {
        $('#saveQuestionSet').html('Saving...').attr('disabled', true);
        var req = new Object();
        req.ITEM_SET = {"label" : $rootScope.listQuestionSetFilters.questionSetName};
        var metadata = {"courseId": $rootScope.courseId, "testType": $rootScope.listQuestionSetFilters.usedIn, "description": $rootScope.listQuestionSetFilters.questionSetDescription};
        //TODO-Mahesh Will update learningElement to array.
        metadata.learningElement = service.addFedoraPrefix($scope.listQuestionSetFilters.learningElements[0].id);
        req.ITEM_SET.metadata = metadata;
        req.ITEM_SET.criteria = $scope.searchFilters;
        if($routeParams.questionSetId) {
            req.ITEM_SET.id = $routeParams.questionSetId;
        }
        // console.log("Request:", JSON.stringify(req));

        service.callService("saveItemSet", req, "PATCH", "WRITE").then(function(result) {
            $('#saveQuestionSet').html('Save').attr('disabled', false);
            // console.log("saveItemSet service result:",JSON.stringify(result));
            // $("#saveQSAlert").html("Question Set saved successfully.").addClass("alert-success").removeClass("hide");
            // $rootScope.scrollTopAnimate();
            if(result && result.responseValueObjects && result.responseValueObjects.STATUS && result.responseValueObjects.STATUS.statusType == "SUCCESS") {
                $rootScope.showConformationMessage('alert-success','Question Set saved successfully. Redirecting to Question Set List...');
                setTimeout(function() {
                    // $("#saveQSAlert").html("").addClass("hide").removeClass("alert-success");
                    $state.go('questionSet', {});
                },5000);    
            } else {
                $("#saveQSAlert").html("Error While saving Question Set.").addClass("alert-danger").removeClass("hide");
                setTimeout(function() {
                    $("#saveQSAlert").html("").removeClass("alert-danger").addClass("hide");
                }, 5000);
            }
        });
    }

    $scope.previewList = function(list) {
        var labels = []
        if(list && list.length) {
            list.forEach(function(element) {
                labels.push(element.name || element);
            });
        }
        if(labels.length > 0) {
            return labels.join(", ");
        } else {
            return 'None';
        } 
    }

    /* Start of Managing Select of Learning Element for QuestionSet */
    
    $rootScope.updateQuestionSetContext = function(context) {
        $scope.qasetSelectedContextId = context.id;            
        $rootScope.listQuestionSetFilters.selectedContexts = context;   
        $scope.selectedContext = {'id': context.id, 'name' : context.name};
        $rootScope.listQuestionSetFilters.selectedLOB = [];
        if (context.type == 'course')  {
            context.modules.forEach(function(module) {
                $rootScope.listQuestionSetFilters.selectedLOB.push({'id': module.id, 'name': module.name, 'eleType':'module', 'selected' : true});
                module.lessons.forEach(function(lesson) {
                    $rootScope.listQuestionSetFilters.selectedLOB.push({'id': lesson.id, 'name': lesson.name, 'eleType':'lesson', 'selected' : true});
                    lesson.lectures.forEach(function(lecture) {
                        $rootScope.listQuestionSetFilters.selectedLOB.push({'id': lecture.id, 'name': lecture.name, 'eleType':'lecture', 'selected' : true});
                    });
                });
            });
        } else if (context.type == 'module')  {
            context.lessons.forEach(function(lesson) {
                $rootScope.listQuestionSetFilters.selectedLOB.push({'id': lesson.id, 'name': lesson.name, 'eleType':'lesson', 'selected' : true});
                lesson.lectures.forEach(function(lecture) {
                    $rootScope.listQuestionSetFilters.selectedLOB.push({'id': lecture.id, 'name': lecture.name, 'eleType':'lecture', 'selected' : true});
                });
            });
        } else if(context.type == 'lesson'){
            context.lectures.forEach(function(lecture) {
                    $rootScope.listQuestionSetFilters.selectedLOB.push({'id': lecture.id, 'name': lecture.name, 'eleType':'lecture', 'selected' : true});
                });
        }
        //$scope.updateConceptsbyContext(context);
    }

    $scope.updateConceptsbyContext  = function(context){
        $rootScope.listQuestionSetFilters.selectedConcepts = [];
       $http.get('/private/v1/lob/getConcepts/'+encodeURIComponent(service.addFedoraPrefix(context.id))
       ).success(function(concepts){
            for(conceptKey in concepts){
                var conceptItem = {'id' : conceptKey, 'name' : concepts[conceptKey]};
                var index = $rootScope.listQuestionSetFilters.selectedConcepts.indexOf(conceptItem);
                if (index == -1) {
                    $rootScope.listQuestionSetFilters.selectedConcepts.push(conceptItem);
                }
            }
       });
    }

    $rootScope.clearSelectedQuestionSetContexts = function(){
        qaSetContextSearchPrevValue = $rootScope.listQuestionSetFilters.selectedContexts.name;
        $scope.selectedContext = '';
    }

    /* End of Managing Select of Learning Element for QuestionSet */

    // To populate concepts array of the course.
    $rootScope.getQuestionSetConceptList = function(object) {
        if($scope.conceptsList && $scope.conceptsList.length > 0) {
            return $scope.conceptsList;
        } else {
            var conceptList = [];
            for(var key in object) {
                if(object[key])
                    conceptList.push({id: key, name: object[key]});
            }
            $scope.conceptsList = conceptList;
            return conceptList;
        }
    }

    $scope.setSubpurpose = function(purpose){
        if (purpose != null) {
            $scope.subPurpose = purpose.subpurpose;
        }else if (purpose == null) {
             $scope.subPurpose = [];
        }
        $rootScope.listQuestionSetFilters.selectedSubPurpose = [];
    }

    $scope.getContentType = function(eleType) {
        if(eleType == "course" || eleType == "module" || eleType == "lesson") {
            return eleType.toUpperCase();
        } else {
            return "LECTURE";
        }
    }

    $scope.backToList = function() {
        $state.go('questionSet', {});
    }

    $scope.questionMouseOver = function(event) {
        $(event.currentTarget).find('.previewIcon').removeClass('hide');
    }

    $scope.questionMouseLeave = function(event) {
        $(event.currentTarget).find('.previewIcon').addClass('hide');
    }

}]);


function createSearchFilters($scope, $rootScope, service) {
    var filters = [];

    if($rootScope.listQuestionSetFilters.learningElements && $rootScope.listQuestionSetFilters.learningElements.length > 0) {
        var learningElements = [];
        $rootScope.listQuestionSetFilters.learningElements.forEach(function(item) {
            learningElements.push(service.addFedoraPrefix(item.id));
        });
        if(learningElements.indexOf($rootScope.courseId) == -1) {
            filters.push({"name": "learningElement", "operator": "in", "valueList": learningElements});
        }
    }

    if($rootScope.listQuestionSetFilters.selectedConcepts && $rootScope.listQuestionSetFilters.selectedConcepts.length > 0) {
        var conceptItems = [];
        $rootScope.listQuestionSetFilters.selectedConcepts.forEach(function(item) {
            conceptItems.push(item.name);
        });
        filters.push({"name":"concept", "operator":"in", "valueList": conceptItems});
    }

    if($rootScope.listQuestionSetFilters.selectedDifficultyLevel.length > 0 ) {
        var items = [];
        $rootScope.listQuestionSetFilters.selectedDifficultyLevel.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"difficultyLevel", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionSetFilters.purpose) filters.push({"name":"purpose", "operator":"eq", "value": $rootScope.listQuestionSetFilters.purpose.name});
    if($rootScope.listQuestionSetFilters.selectedSubPurpose && $rootScope.listQuestionSetFilters.selectedSubPurpose.length > 0) {
        var items = [];
        $rootScope.listQuestionSetFilters.selectedSubPurpose.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"subPurpose", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionSetFilters.selectedQuestionType) filters.push({"name":"questionType", "operator":"eq", "value": $rootScope.listQuestionSetFilters.selectedQuestionType});
    
    if($rootScope.listQuestionSetFilters.selectedQuestionSubType && $rootScope.listQuestionSetFilters.selectedQuestionSubType.length > 0) {
        var items = [];
        $rootScope.listQuestionSetFilters.selectedQuestionSubType.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"questionSubtype", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionSetFilters.selectedOutcome && $rootScope.listQuestionSetFilters.selectedOutcome.length > 0) {
        var items = [];
        $rootScope.listQuestionSetFilters.selectedOutcome.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"learningGoal", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionSetFilters.testUsage) filters.push({"name":"testUsage", "operator":"eq", "value": $rootScope.listQuestionSetFilters.testUsage});

    return filters;
}

function populateSearchCriteria(questionSet, $rootScope, $scope, service) {
    $rootScope.listQuestionSetFilters.questionSetName = questionSet.label;
    $rootScope.listQuestionSetFilters.usedIn = questionSet.metadata.testType;
    $rootScope.listQuestionSetFilters.questionSetDescription = questionSet.metadata.description;

    var criteria = {};
    questionSet.criteria.forEach(function(item) {
        criteria[item.name] = (item.value)?item.value:item.valueList;
    });

    // console.log("Criteria:", JSON.stringify(criteria));

    if(criteria.learningElement && criteria.learningElement.length > 0) {
        var learningElementIds = [];
        criteria.learningElement.forEach(function(item) {
            item = service.removeFedoraPrefix(item);
            learningElementIds.push(item);
        });

        $rootScope.listQuestionSetFilters.learningElements = $scope.questionSearch.learningElements.filter(function(item) {
            return learningElementIds.indexOf(item.id) > -1;
        });
    } else {
        $rootScope.listQuestionSetFilters.learningElements = [$scope.questionSearch.learningElements[0]];
    }

    // console.log("$rootScope.listQuestionSetFilters.learningElements:", JSON.stringify($rootScope.listQuestionSetFilters.learningElements));



    if(criteria.difficultyLevel) $rootScope.listQuestionSetFilters.selectedDifficultyLevel = $scope.difficultyLevels.filter(function(item) {
        return criteria.difficultyLevel.indexOf(item.name) > -1;
    });
    //purpose
    $rootScope.listQuestionSetFilters.selectedSubPurpose = [];
    if(criteria.purpose) {
        $scope.purpose.forEach(function(item) {
            if(item.name == criteria.purpose) {
                $rootScope.listQuestionSetFilters.purpose = item;
                $scope.subPurpose = item.subpurpose;
            }
        });

        //subpurpose
        if(criteria.subPurpose) {
            $rootScope.listQuestionSetFilters.selectedSubPurpose = $scope.subPurpose.filter(function(item) {
                return criteria.subPurpose.indexOf(item.name) > -1;
            });
        } else {
            $rootScope.listQuestionSetFilters.selectedSubPurpose = [];
        }
    }
    
    // concept
    if(criteria.concept) {
        var filtered = [];
        for(key in $rootScope.conceptTitleMap) {
            var item = $rootScope.conceptTitleMap[key];
            if(criteria.concept.indexOf(item) > -1) {
                filtered.push({id: key, name: item});
            }
        }
        $rootScope.listQuestionSetFilters.selectedConcepts = filtered;
    }

    //Questiontype
    if (criteria.questionType) {
        $rootScope.listQuestionSetFilters.selectedQuestionType = criteria.questionType;
    }

    //Question sub type
    $rootScope.listQuestionSetFilters.selectedQuestionSubType = [];
    if(criteria.questionSubtype) {
        $rootScope.listQuestionSetFilters.selectedQuestionSubType = $scope.questionSubTypes.filter(function(item) {
            return criteria.questionSubtype.indexOf(item.name) > -1;
        });
    }
    
    
    //Outcome
    $rootScope.listQuestionSetFilters.selectedOutcome = [];
    if(criteria.learningGoal) {
        $rootScope.listQuestionSetFilters.selectedOutcome = $scope.courseOutcomes.filter(function(item) {
            return criteria.learningGoal.indexOf(item.name) > -1;
        });
    }

    //testUsage
    if (criteria.testUsage) {
        $rootScope.listQuestionSetFilters.testUsage = criteria.testUsage;
    }
        
    // console.log("Filters:", JSON.stringify($rootScope.listQuestionSetFilters));

    setTimeout(function() {
        $scope.searchQuestions();
    }, 100);
}

app.controller('listQuestionSetsCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state) {
    $rootScope.leftMenu = 'assessments';
    $scope.defaultResultLimit = 25;
    $rootScope.showConceptMap = false;
    $scope.autoSearch = false;
    // console.log("before initialization.");
    $scope.questionSetListFilters = {learningElements: []}; 
    $rootScope.viewAssessment = 'questionSet';

    $scope.canWriteQuestionSet = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteQuestionSet = true;
        }
    });
    
    $('.tool').tooltip();
    $('.tool-tip').tooltip();
    
    $scope.searchResult =  [];
    $scope.searchSetsCount = 0;
    $scope.searchQuestionsCount = 0;
    $scope.showResult = false;
    $scope.isSearching = true;
    $scope.resultLimit = $scope.defaultResultLimit;

    $scope.tocKeyName = service.getTOCKeyNames();

    $scope.QuestionSetListSearchFor = ["Exam","Practice"];
    $scope.questionSetListToc = service.getTOCForQuestionSets();
    $scope.learningElements = service.getLearningElements();
    
    $scope.clearQuestionSetListSearch = function(){
        $scope.questionSetListFilters = {
            learningElements: [],
            questionSetFor : "Practice"
        };
        $scope.searchResult =  [];
        $scope.searchSetsCount = 0;
        $scope.searchQuestionsCount = 0;
        $scope.showResult = false;
        $scope.resultLimit = $scope.defaultResultLimit;
    }

    $scope.$watch('questionSetListFilters', function(newValue, oldValue) {
        // console.log("questionSetListFilters is updated.");
        if(!$scope.autoSearch) {
            $scope.showResult = false;
        }
    }, true);

    $scope.updateResultLimit = function() {
        if(($scope.resultLimit+$scope.defaultResultLimit) >= $scope.searchResult.length) {
            $scope.resultLimit = $scope.searchResult.length;
        } else {
            $scope.resultLimit += $scope.defaultResultLimit;
        }
        // console.log("$scope.resultLimit:",$scope.resultLimit);
    }

    $scope.getAllQuestionSets = function() {
        $('#searchQuestionSets').html('Searching...').attr('disabled', true);
        $scope.searchSetsCount = 0;
        $scope.searchQuestionsCount = 0;
        $scope.resultLimit = $scope.defaultResultLimit;
        $scope.searchResult =  [];
        var req = new Object();
        req.SEARCH_CRITERIA = {"limit": 200, "offset": 0, "orderFields": { "label": "asc" }, "filters": [{"name": "courseId", "operator": "eq", "value": $rootScope.courseId}] };
        // console.log("request:",JSON.stringify(req));
        service.callService("getItemSets", req, "PATCH", "READ").then(function(result) {
            $('#searchQuestionSets').html('Search').attr('disabled', false);
            if(result.responseValueObjects && result.responseValueObjects.ITEM_SETS && result.responseValueObjects.ITEM_SETS.valueObjectList) {
                $scope.searchResult = result.responseValueObjects.ITEM_SETS.valueObjectList;
                result.responseValueObjects.ITEM_SETS.valueObjectList.forEach(function(item) {
                    if(item && item.numQuestions) $scope.searchQuestionsCount += item.numQuestions; 
                });
            }
            $scope.showResult = true;
            $scope.isSearching = false;
            setTimeout(function() {
                $('.tool').tooltip();
                $('.tool-tip').tooltip();
            },1000);
        });
        service.callService("getItemSetsCount", req, "PATCH", "READ").then(function(result) {
            if(result && result.responseValueObjects && result.responseValueObjects.COUNT) {
                $scope.searchSetsCount = result.responseValueObjects.COUNT.id;
            }
        });
    }

    setTimeout(function() {
        $scope.autoSearch = true;
        if(service.getQSListSearchCriteria()) {
            $scope.questionSetListFilters = service.getQSListSearchCriteria();
            setTimeout(function() {
                $scope.searchQuestionSets();
                $scope.showResult = true;
            }, 500);
        } else {
            $scope.questionSetListFilters = {
                learningElements: [],
                questionSetFor : "Practice"
            };
            $scope.getAllQuestionSets();
        }
    }, 100);
    
    $scope.createQuestionSet = function() {
        // console.log("in createQuestionSet");
        service.setQSListSearchCriteria($scope.questionSetListFilters);
        $state.go('questionSet.create', {});
    }

    $scope.editQuestionSet = function(questionSetId) {
        // console.log("in editQuestionSet");
        service.setQSListSearchCriteria($scope.questionSetListFilters);
        $state.go('questionSet.edit', {"questionSetId": questionSetId});
    }

    $scope.searchQuestionSets = function() {
        $('#searchQuestionSets').html('Searching...').attr('disabled', true);
        $scope.searchSetsCount = 0;
        $scope.searchQuestionsCount = 0;
        $scope.isSearching = true;
        $scope.resultLimit = $scope.defaultResultLimit;
        $scope.searchResult =  [];

        setTimeout(function() {
            $scope._searchQuestionSets();
        },1)
    }

    $scope._searchQuestionSets = function() {
        var req = new Object();
        req.SEARCH_CRITERIA = {"limit": 200, "offset": 0, "orderFields": { "label": "asc" } };
        req.SEARCH_CRITERIA.filters = [];

        req.SEARCH_CRITERIA.filters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});

        if($scope.questionSetListFilters.learningElements.length > 0) {
            var learningElements = [];
            $scope.questionSetListFilters.learningElements.forEach(function(item) {
                learningElements.push(service.addFedoraPrefix(item.id));
            });
            if(learningElements.indexOf($rootScope.courseId) == -1) {
                req.SEARCH_CRITERIA.filters.push({"name": "learningElement", "operator": "in", "valueList": learningElements});
            }
        }
        
        if($scope.questionSetListFilters.questionSetFor) req.SEARCH_CRITERIA.filters.push({"name": "testType", "operator": "eq", "value": $scope.questionSetListFilters.questionSetFor});
        // console.log("req getItemSets:", JSON.stringify(req));
        service.callService("getItemSets", req, "PATCH", "READ").then(function(result) {
            $('#searchQuestionSets').html('Search').attr('disabled', false);
            // console.log("searchQuestionSets service result:",JSON.stringify(result));
            if(result.responseValueObjects && result.responseValueObjects.ITEM_SETS && result.responseValueObjects.ITEM_SETS.valueObjectList) {
                $scope.searchResult = result.responseValueObjects.ITEM_SETS.valueObjectList;
                result.responseValueObjects.ITEM_SETS.valueObjectList.forEach(function(item) {
                    if(item && item.numQuestions) $scope.searchQuestionsCount += item.numQuestions; 
                });
            }
            $scope.showResult = true;
            $scope.isSearching = false;
            setTimeout(function() {
                $('.tool').tooltip();
                $('.tool-tip').tooltip();
            },1000);
        });

        service.callService("getItemSetsCount", req, "PATCH", "READ").then(function(result) {
            // console.log("saveItemSet service result:",JSON.stringify(result));
            if(result && result.responseValueObjects && result.responseValueObjects.COUNT) {
                $scope.searchSetsCount = result.responseValueObjects.COUNT.id;    
            } else {
                $scope.searchSetsCount = 0;
            }
        });
    }

    $scope.questionSetToDelete = undefined;

    $scope.confirmQuestionSetToDelete = function(questionSet) {
        if (questionSet.qpList && questionSet.qpList.length > 0) {
            $rootScope.showConformationMessage('alert-danger','The Question Set is used in Papers. Question Set can only be removed after the set is removed from those papers or the papers are removed.');
            return;
        }
        $scope.questionSetToDelete = questionSet;
        $('#questionSetDeleteModal').modal('show');
    }

    $scope.deleteQuestionSet = function() {
        if ($scope.questionSetToDelete.qpList && $scope.questionSetToDelete.qpList.length > 0) {
            $rootScope.showConformationMessage('alert-danger','The Question Set is used in Papers. Question Set can only be removed after the set is removed from those papers or the papers are removed.');
            return;
        }
        var req = new Object();
        var idsList = [];
        idsList.push($scope.questionSetToDelete.identifier);
        req.ITEM_SET_IDS = {"idsList" : idsList };
        // console.log("Request:", JSON.stringify(req));
        service.callService("deleteItemSet", req, "PATCH", "WRITE").then(function(result) {
            // console.log("deleteItemSet service result:",JSON.stringify(result));
            if(result && result.responseValueObjects && result.responseValueObjects.STATUS && result.responseValueObjects.STATUS.statusType == 'SUCCESS') {
                $rootScope.showConformationMessage('alert-success','Question Set Deleted successfully.');
                $scope.searchSetsCount--;
                $scope.searchQuestionsCount -= $scope.questionSetToDelete.numQuestions
                var index  = $scope.searchResult.indexOf($scope.questionSetToDelete);
                if(index > -1){
                    $scope.searchResult.splice(index,1);
                }
            } else {
                $rootScope.showConformationMessage('alert-danger','Error while deleting Question Set.');
            }
        });

    }

    $scope.getContentTitleOfItem = function(identifier) {
        var lobName = $scope.tocKeyName[identifier];
        if(lobName) {
            return lobName.toString();
        } else {
            return "---";
        }
    }

    $scope.getQuestionPaperTitle = function(questionPapers) {
        var qpTitles = [];
        if(questionPapers){
            questionPapers.forEach(function(paper) {
                if(paper.title) {
                    qpTitles.push(paper.title);
                } else if (paper.identifier) {
                    qpTitles.push(paper.identifier);
                }
            });
        }
        if(qpTitles.length > 0) {
            return qpTitles.toString();
        } else {
            return "---";
        }
    }

    $scope.showSearchForm = function(){
        $('#questionsetSearchForm').slideToggle();
        $('#questionsetSearchButton').toggleClass('fa-close');
        $('#questionsetSearchButton').toggleClass('fa-search');
    }

}]);
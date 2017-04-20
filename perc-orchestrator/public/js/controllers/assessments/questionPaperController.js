app.controller('createQuestionPaperCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', '$q', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state, $q) {
	/* Start of Data objects. */
	$rootScope.showConceptMap = false;
	$rootScope.leftMenu = 'assessments';
	$scope.workflowStep = 0;
    $scope.tocKeyName = service.getTOCKeyNames();
	$scope.quesionSetSearch = {
	  learningElements: service.getLearningElements(),
	  testTypes: service.getTestTypes()
	}

    $scope.questionSetSearchSubmitted = false;

	$scope.questionSets = {};
	$scope.questionPaper = {};
	$scope.declareQuestionSets = function() {
		$scope.questionSets = {
			show: false,
			count: 0,
			questionsCount: 0,
			data: {},
			defaultDisplayCount: 20,
			currentDisplayCount: 20,
			maxDisplayCount: 100
	    }
	}

	$scope.declareQuestionPaper = function() {
		$scope.questionPaper = {
			identifier: '',
			title: '',
			testType: 'Exam',
			learningElement: { name: '' },
            learningElements: [],
			description: '',
			instructions: '',
			totalQuestions: '',
			maxMarks: '',
			duration: '',
			numConcretePapers: '',
			excludeQuestionsBefore: {
				exclude: true,
				duration: '',
			},
			questionSets: {
				data: [],
				ids: [],
				count: 0,
				numQuestions: 0
			},
            validations: [],
            concretePapers: [],
            syllabus: [],
			isSubmitted: false
		}
	}

    /* End of Data objects. */

    /* Start of Functions. */

    $scope.clearQuestionSetsData = function() {
        $scope.questionSets.show = false;
        $scope.questionPaper.questionSets = {
            data: [],
            ids: [],
            count: 0,
            numQuestions: 0
        }
    }
	
    $scope.$watch('questionPaper.learningElements', function(newValue, oldValue) {
        $scope.questionPaper.learningElement = $scope.questionPaper.learningElements[0];
        $scope.declareQuestionSets();
        $scope.clearQuestionSetsData();
    });

	$scope.$watch('questionPaper.totalQuestions', function(newValue, oldValue){
		if(isNaN(newValue)) $scope.questionPaper.totalQuestions = oldValue;
	});

	$scope.$watch('questionPaper.maxMarks', function(newValue, oldValue){
		if(isNaN(newValue)) $scope.questionPaper.maxMarks = oldValue;
	});

	$scope.$watch('questionPaper.duration', function(newValue, oldValue){
		if(isNaN(newValue)) $scope.questionPaper.duration = oldValue;
	});	

	$scope.$watch('questionPaper.numConcretePapers', function(newValue, oldValue){
		if(isNaN(newValue)) $scope.questionPaper.numConcretePapers = oldValue;
	});

    $scope.getChildrenIds = function(parentId) {
        var childrenIds = [];

         var level1Children = service.getLearningElements().filter(function(item) {
            return item.parentId == parentId;
        });
        if(level1Children.length > 0) {
            level1Children.forEach(function(item) {
                childrenIds.push(service.addFedoraPrefix(item.id));
                var ids = $scope.getChildrenIds(item.id);
                ids.forEach(function(id) {
                    childrenIds.push(id);
                });
            });
        }
        return childrenIds;

    }


    $scope.searchQuestionSets = function() {
    	$('#searchQuestionSets').html('Searching...').attr('disabled', true);
        $scope.questionSetSearchSubmitted = true;
		$scope.declareQuestionSets();
        $scope.clearQuestionSetsData();
        
        if($scope.questionPaper.learningElements.length > 0) {
            var req = new Object();
            req.SEARCH_CRITERIA = {"limit": $scope.questionSets.maxDisplayCount, "offset": 0, "orderFields": { "label": "asc" } };
            req.SEARCH_CRITERIA.filters = [];
            req.SEARCH_CRITERIA.filters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
            
            var learningElements = [];
            $scope.questionPaper.learningElements.forEach(function(item) {
                learningElements.push(service.addFedoraPrefix(item.id));
            });
            if(learningElements.indexOf($rootScope.courseId) == -1) {
                req.SEARCH_CRITERIA.filters.push({"name": "learningElement", "operator": "in", "valueList": learningElements});
            }
            
            if($scope.questionPaper.testType) req.SEARCH_CRITERIA.filters.push({"name": "testType", "operator": "eq", "value": $scope.questionPaper.testType});
            
            service.callService("getItemSets", req, "PATCH", "READ").then(function(result) {
                $('#searchQuestionSets').html('Search').attr('disabled', false);
                if(result.responseValueObjects && result.responseValueObjects.ITEM_SETS && result.responseValueObjects.ITEM_SETS.valueObjectList) {
                    $scope.questionSets.data = result.responseValueObjects.ITEM_SETS.valueObjectList;
                    result.responseValueObjects.ITEM_SETS.valueObjectList.forEach(function(item) {
                        if(item && item.numQuestions) $scope.questionSets.questionsCount += item.numQuestions; 
                    });
                }
                $scope.questionSets.show = true;
            });
            service.callService("getItemSetsCount", req, "PATCH", "READ").then(function(result) {
                if(result && result.responseValueObjects && result.responseValueObjects.COUNT)
                    $scope.questionSets.count = result.responseValueObjects.COUNT.id;
            });
        } else {
            $('#searchQuestionSets').html('Search').attr('disabled', false); 
            $(".qpInvalid").removeClass("hide");
            $rootScope.scrollTopAnimate();
            setTimeout(function() {
                $(".qpInvalid").addClass("hide");
            },10000);
        }
    }

    $scope.addQuestionSet = function(questionSet) {
    	if($scope.questionPaper.questionSets.ids.indexOf(questionSet.identifier) == -1) {
    		$scope.questionPaper.questionSets.count++;
    		$scope.questionPaper.questionSets.numQuestions+=questionSet.numQuestions;
    		$scope.questionPaper.questionSets.ids.push(questionSet.identifier);
    		$scope.questionPaper.questionSets.data.push(questionSet);
    	}
    }

    $scope.removeQuestionSet = function(questionSet) {
    	if($scope.questionPaper.questionSets.ids.indexOf(questionSet.identifier) > -1) {
    		$scope.questionPaper.questionSets.count--;
            $scope.questionPaper.questionSets.numQuestions-=questionSet.numQuestions;
    		$scope.questionPaper.questionSets.data.splice($scope.questionPaper.questionSets.data.indexOf(questionSet),1);
            $scope.questionPaper.questionSets.ids.splice($scope.questionPaper.questionSets.ids.indexOf(questionSet.identifier),1);
    	}
    }

    $scope.validateQPObject = function() {
    	var isValid = true;
    	var questionPaper = $scope.questionPaper;
    	if(isValid && questionPaper.totalQuestions && questionPaper.totalQuestions > 0){ isValid = true; } else { isValid = false; }
        if(isValid && questionPaper.maxMarks && questionPaper.maxMarks > 0){ isValid = true; } else { isValid = false; }
        if(isValid && questionPaper.duration && questionPaper.duration > 0){ isValid = true; } else { isValid = false; }
        if(questionPaper.testType == "Exam") {
            if(isValid && questionPaper.numConcretePapers && questionPaper.numConcretePapers > 0){ isValid = true; } else { isValid = false; }
        }
        if(questionPaper.excludeQuestionsBefore.exclude) {
            if(isValid && questionPaper.excludeQuestionsBefore.duration && questionPaper.excludeQuestionsBefore.duration > 0){ isValid = true; } else { isValid = false; }
        }
        if(questionPaper.questionSets.count > 0) {
            questionPaper.questionSets.data.forEach(function(questionSet) {
                if(isValid && questionSet.numPickQuestions && questionSet.numPickQuestions > 0){ isValid = true; } else { isValid = false; }
                if(isValid && questionSet.scorePerQuestion && questionSet.scorePerQuestion > 0){ isValid = true; } else { isValid = false; }
            });
        } else {
            isValid = false;
        }

    	return isValid;
    }

    $scope.prepareSaveQPRequestObject = function() {
        var req = new Object();
        req.QUESTION_PAPER = {};
        var questionPaper = $scope.questionPaper;
        if(questionPaper.identifier) req.QUESTION_PAPER.identifier = questionPaper.identifier;
        req.QUESTION_PAPER.courseId = $rootScope.courseId;
        req.QUESTION_PAPER.title = questionPaper.title;
        req.QUESTION_PAPER.testType = questionPaper.testType;
        req.QUESTION_PAPER.context = service.addFedoraPrefix(questionPaper.learningElement.id);
        req.QUESTION_PAPER.totalQuestions = questionPaper.totalQuestions;
        req.QUESTION_PAPER.maxMarks = questionPaper.maxMarks;
        req.QUESTION_PAPER.duration = questionPaper.duration*60;
        if(questionPaper.testType == "Exam") {
            req.QUESTION_PAPER.numConcretePapers = questionPaper.numConcretePapers;
        } else {
            req.QUESTION_PAPER.numConcretePapers = 0;
        }
        if(questionPaper.excludeQuestionsBefore.exclude) {
            req.QUESTION_PAPER.excludeQuestionsBefore = questionPaper.excludeQuestionsBefore.duration*60*60*24;
        } else {
            req.QUESTION_PAPER.excludeQuestionsBefore = 0;
        }
        if(questionPaper.questionSets.count > 0) {
            req.QUESTION_PAPER.setCriteria = [];
            questionPaper.questionSets.data.forEach(function(questionSet) {
                req.QUESTION_PAPER.setCriteria.push({"setId": questionSet.identifier, "numPickQuestions": questionSet.numPickQuestions, "scorePerQuestion": questionSet.scorePerQuestion});
            });
        }

        if(questionPaper.concretePapers && questionPaper.concretePapers.length > 0) {
            req.QUESTION_PAPER.concretePapers = questionPaper.concretePapers;
        }

        req.QUESTION_PAPER.description = questionPaper.description;
        req.QUESTION_PAPER.instructions = questionPaper.instructions;
        return req;
    }

    $scope.saveQuestionPaper = function(currentStep) {
    	var isValid = true;
    	var questionPaper = $scope.questionPaper;
    	var req = new Object();
    	req.QUESTION_PAPER = {};
    	var deferred = $q.defer();
    	switch(currentStep) {
    		case 1: isValid = (questionPaper.title && questionPaper.testType && questionPaper.learningElement)?true:false;
    				if(isValid) {
                        if(questionPaper.identifier) req.QUESTION_PAPER.identifier = questionPaper.identifier;
                        req.QUESTION_PAPER.courseId = $rootScope.courseId;
    					req.QUESTION_PAPER.title = questionPaper.title;
    					req.QUESTION_PAPER.testType = questionPaper.testType;
    					req.QUESTION_PAPER.context = service.addFedoraPrefix(questionPaper.learningElement.id);
                        req.QUESTION_PAPER.setCriteria = [];
                        questionPaper.questionSets.data.forEach(function(questionSet) {
                            req.QUESTION_PAPER.setCriteria.push({"setId": questionSet.identifier, "numPickQuestions": 0, "scorePerQuestion": 0});
                        });
    				}
    				break;
    		case 2: isValid = $scope.validateQPObject();
                    if(isValid) {
                        req = $scope.prepareSaveQPRequestObject();
                    }
    				break;
            case 3: isValid = $scope.validateQPObject();
                    if(isValid) {
                        req = $scope.prepareSaveQPRequestObject();
                    }
                    break;
    	}

    	if(isValid) {
    		service.callService("saveQuestionPaper", req, "PATCH", "WRITE").then(function(result) {
                if(result && result.responseValueObjects && result.responseValueObjects.QUESTION_PAPER_ID && result.responseValueObjects.QUESTION_PAPER_ID.id)
	            $scope.questionPaper.identifier = result.responseValueObjects.QUESTION_PAPER_ID.id;
                deferred.resolve(isValid);
	        });
    	} else {
    		deferred.resolve(isValid);
    	}
    	return deferred.promise;
    }

    $scope.validateQuestionPaper = function(questionPaperId) {
        service.callService("getQuestionPaperValidation?QUESTION_PAPER_ID="+questionPaperId, {}, "PATCH", "READ").then(function(result) {
            if(result && result.responseValueObjects && result.responseValueObjects.VALIDATION_RESULTS && result.responseValueObjects.VALIDATION_RESULTS.valueObjectList) {
                $scope.questionPaper.validations = result.responseValueObjects.VALIDATION_RESULTS.valueObjectList;
            }
        });
    }

    $scope.getQuestionPaper = function(questionPaperId) {
        return service.callService("getQuestionPaper?QUESTION_PAPER_ID="+questionPaperId, {}, "PATCH", "READ");        
    }

    $scope.generateConcretePapers = function() {
        var buttonTitle = $('#generateConcretePapers').text();
        $('#generateConcretePapers').html('Generating...').attr('disabled', true);
        service.callService("generateConcretePapers?QUESTION_PAPER_ID="+$scope.questionPaper.identifier, {}, "PATCH", "WRITE").then(function(result) {
            $scope.questionPaper.concretePapers = [];
            if(result && result.responseValueObjects && result.responseValueObjects.CONCRETE_PAPER_IDS && result.responseValueObjects.CONCRETE_PAPER_IDS.idsList) {
                $scope.questionPaper.concretePapers = result.responseValueObjects.CONCRETE_PAPER_IDS.idsList;
                $scope.validateQuestionPaper($scope.questionPaper.identifier);
                $rootScope.showConformationMessage('alert-success','Concrete Papers generated successfully.');
            } else {
                alert("Error while generating Concrete Question Papers.");
            }
            $("#generateConcretePapers").html(buttonTitle).attr('disabled', false);
        });
    }

    /* Start of Workflow steps change functions */
    // TODO: Need to redesign the method functionality properly after MW integration.

    $scope.backToList = function() {
        $state.go('questionPaper', {});
    }

    $scope.gotoStep1 = function() {
    	$scope.workflowStep =1;
    	$scope.questionPaper.isSubmitted = false;
        setTimeout(function() {
            $('.tool').tooltip();
            $('.tool-tip').tooltip();
        }, 500);
    }
    
    $scope.gotoStep2 = function() {
    	$scope.workflowStep = 2;
        setTimeout(function() {
            $('.tool').tooltip();
            $('.tool-tip').tooltip();
        }, 500);
    }

    $scope.savePaper = function(buttonId, goNext) {
    	$scope.questionPaper.isSubmitted = true;
    	var buttonTitle = $('#'+buttonId).text();
    	$('#'+buttonId).html('Saving...').attr('disabled', true);
		$scope.saveQuestionPaper($scope.workflowStep).then(function(isSaved) {
			$('#'+buttonId).html(buttonTitle).attr('disabled', false);
			if(isSaved) {
                if(goNext) {
                    $scope.workflowStep++;
                    $scope.questionPaper.isSubmitted = false;
                }
                if($scope.workflowStep == 3) {
                    $scope.validateQuestionPaper($scope.questionPaper.identifier);
                    $scope.questionPaper.questionSets.data.forEach(function(questionSet) {
                        var name = service.getLearningElementName(questionSet.learningElement);
                        if(name) $scope.questionPaper.syllabus.push(name);
                    });
                    if(!$scope.questionPaper.concretePapers)
                        $scope.questionPaper.concretePapers = [];
                }
                $(".qpInvalid").addClass("hide");
                $rootScope.showConformationMessage('alert-success','Question Paper Saved.');
                /*$(".qpSaved").removeClass("hide");
                $rootScope.scrollTopAnimate();
                setTimeout(function() {
                    $(".qpSaved").addClass("hide");
                },10000);*/
			} else {
                $(".qpInvalid").removeClass("hide");
                $rootScope.scrollTopAnimate();
                setTimeout(function() {
                    $(".qpInvalid").addClass("hide");
                },5000);
            }
		});
    }

    $scope.previewPaper = function(paperId) {
        $("#responses").html("");
        var command = "getQuestionPaperPreview?QUESTION_PAPER_ID="+$scope.questionPaper.identifier;
        if(paperId) {
            command+= "&CONCRETE_PAPER_ID="+paperId;
            $scope.previewPaperName = paperId.split(":")[1];
        } else {
            $scope.previewPaperName = "Practice Paper";
        }
        service.callService(command, {}, "PATCH", "READ").then(function(result) {
            if(result && result.responseValueObjects && result.responseValueObjects.ASSESSMENT_TEST_STATE) {
                renderSubmission(result,true);
                $('#questionPaperPreviewModal').modal('show');
            } else {
                $rootScope.scrollTopAnimate();
                $(".qpPreviewInvalid").removeClass("hide");
                setTimeout(function() {
                    $(".qpPreviewInvalid").addClass("hide");
                },10000);
            }

        });
    }

    $scope.backToQuestionPaperEdit = function() {
        $scope.workflowStep = 3;
    }

    /* End of Workflow steps change functions */

    $scope.renderEditQPView = function(questionPaperId) {
        service.callService("getQuestionPaper?QUESTION_PAPER_ID="+questionPaperId, {}, "PATCH", "READ").then(function(result) {
            if(result && result.responseValueObjects && result.responseValueObjects.QUESTION_PAPER) {
                var questionPaper = result.responseValueObjects.QUESTION_PAPER;
                if(questionPaper.totalQuestions) {
                    $scope.workflowStep = 3;
                } else {
                    $scope.workflowStep = 2;
                }
                for(key in questionPaper) {
                    $scope.questionPaper[key] = questionPaper[key];
                }
                if($scope.questionPaper.duration) $scope.questionPaper.duration = $scope.questionPaper.duration/60;
                if($scope.questionPaper.excludeQuestionsBefore == 0) {
                    $scope.questionPaper.excludeQuestionsBefore = {};
                    $scope.questionPaper.excludeQuestionsBefore.exclude = false;
                    $scope.questionPaper.excludeQuestionsBefore.duration = 0;
                } else {
                    var excludeDuration = $scope.questionPaper.excludeQuestionsBefore;
                    excludeDuration = excludeDuration/86400;
                    $scope.questionPaper.excludeQuestionsBefore = {};
                    $scope.questionPaper.excludeQuestionsBefore.exclude = true;
                    $scope.questionPaper.excludeQuestionsBefore.duration = excludeDuration;
                }
                var contextId = service.removeFedoraPrefix(questionPaper.context);
                var selectedElement = $scope.quesionSetSearch.learningElements.filter(function(item) {
                    return item.id == contextId;
                });
                $scope.questionPaper.learningElement = selectedElement[0];
                /*$scope.questionPaper.learningElement.name = selectedElement[0].name;
                $scope.questionPaper.learningElement.id = selectedElement[0].id;*/
                $scope.questionPaper.questionSets.count = questionPaper.setCriteria.length;
                $scope.questionPaper.questionSets.ids = [];
                var setCriteria = {};
                questionPaper.setCriteria.forEach(function(item) {
                    $scope.questionPaper.questionSets.ids.push(item.setId);
                    setCriteria[item.setId] = item;
                });

                $scope.validateQuestionPaper($scope.questionPaper.identifier);

                var req = new Object();
                req.SEARCH_CRITERIA = {"limit": $scope.questionSets.maxDisplayCount, "offset": 0, "orderFields": { "label": "asc" } };
                req.SEARCH_CRITERIA.filters = [];
                req.SEARCH_CRITERIA.filters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
                if(questionPaper.context != $rootScope.courseId) {
                    var contextId = service.removeFedoraPrefix(questionPaper.context);
                    var learningElements = $scope.getChildrenIds(contextId);
                    learningElements.push(questionPaper.context);
                    req.SEARCH_CRITERIA.filters.push({"name": "learningElement", "operator": "in", "valueList": learningElements});
                }
                req.SEARCH_CRITERIA.filters.push({"name": "testType", "operator": "eq", "value": questionPaper.testType});
                service.callService("getItemSetsCount", req, "PATCH", "READ").then(function(result) {
                    if(result && result.responseValueObjects && result.responseValueObjects.COUNT)
                        $scope.questionSets.count = result.responseValueObjects.COUNT.id;
                });

                service.callService("getItemSets", req, "PATCH", "READ").then(function(result) {
                    if(result.responseValueObjects && result.responseValueObjects.ITEM_SETS && result.responseValueObjects.ITEM_SETS.valueObjectList) {
                        $scope.questionSets.data = result.responseValueObjects.ITEM_SETS.valueObjectList;
                        result.responseValueObjects.ITEM_SETS.valueObjectList.forEach(function(item) {
                            if(item && item.numQuestions) $scope.questionSets.questionsCount += item.numQuestions; 
                        });



                        /*var filteredSets = $scope.questionSets.data.filter(function(item) {
                            return $scope.questionPaper.questionSets.ids.indexOf(item.identifier) > -1;
                        });
                        console.log("$scope.questionPaper.questionSets.ids:",$scope.questionPaper.questionSets.ids);
                        filteredSets.forEach(function(item) {
                            item.numPickQuestions = setCriteria[item.identifier].numPickQuestions;
                            item.scorePerQuestion = setCriteria[item.identifier].scorePerQuestion;
                            $scope.questionPaper.questionSets.numQuestions+=item.numQuestions;
                        });
                        $scope.questionPaper.questionSets.data = filteredSets;*/


                        $scope.questionPaper.syllabus = [];
                        $scope.questionPaper.questionSets.data.forEach(function(questionSet) {
                            var name = service.getLearningElementName(questionSet.learningElement);
                            if(name) {
                                $scope.questionPaper.syllabus.push(name);
                            }
                        });
                    }

                    $scope.questionSets.show = true;
                })
                .then(function() {
                    var req = new Object();
                    req.SEARCH_CRITERIA = {"limit": $scope.questionSets.maxDisplayCount, "offset": 0, "orderFields": { "label": "asc" } };
                    req.SEARCH_CRITERIA.filters = [{"name": "id", "operator": "idIn", "valueList": $scope.questionPaper.questionSets.ids}];
                    return service.callService("getItemSets", req, "PATCH", "READ");
                })
                .then(function(result) {
                    if(result && result.responseValueObjects && result.responseValueObjects.ITEM_SETS && result.responseValueObjects.ITEM_SETS.valueObjectList) {
                        var filteredSets = result.responseValueObjects.ITEM_SETS.valueObjectList;
                        filteredSets.forEach(function(item) {
                            item.numPickQuestions = setCriteria[item.identifier].numPickQuestions;
                            item.scorePerQuestion = setCriteria[item.identifier].scorePerQuestion;
                            $scope.questionPaper.questionSets.numQuestions+=item.numQuestions;
                        });
                        $scope.questionPaper.questionSets.data = filteredSets;
                    }
                }).then(function() {
                    $http.get('/private/v1/learningactivities/'+$scope.questionPaper.identifier).success(function(result) {
                        if(result.status == "SUCCESS") {
                            $scope.questionPaper.learningActivities = result.learningactivities;
                        } else if(result.status == "ERROR") {
                            $scope.questionPaper.learningActivities = [];
                        }
                        
                    });
                });
            }

        });
    }

    $scope.createExam = function(questionPaperId) {
        $state.go('createExam', {"questionPaperId": questionPaperId});
    }

    $scope.goToLearningActivity = function(learningActivity) {
        $state.go('releaseExam',{ laId : cbService.removeFedoraPrefix(learningActivity.identifier)});
    }

    if($routeParams.questionPaperId) {
        $scope.declareQuestionSets();
        $scope.declareQuestionPaper();
        setTimeout(function(){
            var questionPaperId = $routeParams.questionPaperId;
            $scope.renderEditQPView(questionPaperId);
        },200);
    } else {
        $scope.workflowStep = 1;
        $scope.declareQuestionSets();
        $scope.declareQuestionPaper();
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

    /* End of Functions. */

}]);

app.controller('listQuestionPaperCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state) {
    $rootScope.showConceptMap = false;
    $rootScope.leftMenu = 'assessments';

    $scope.quesionPaperSearch = {
      learningElements: service.getLearningElements(),
      testTypes: service.getTestTypes()
    }

    $scope.qpSearchCriteria = {
        learningElements: [],
        testType: 'Practice'
    }

    $scope.canWriteQuestionPaper = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteQuestionPaper = true;
        }
    });

    $('.tool').tooltip();
    $('.tool-tip').tooltip();

    $scope.questionPapers = {};

    $scope.declareQuestionPapers = function() {
         $scope.questionPapers = {
            show: false,
            loading: true,
            count: 0,
            data: {},
            defaultDisplayCount: 25,
            currentDisplayCount: 25,
            maxDisplayCount: 100
        };
    }

    $scope.clearQPListSearch = function() {
        $scope.qpSearchCriteria = {
            learningElements: [],
            testType: 'Practice'
        }
        $scope.declareQuestionPapers();
        $scope.questionPapers.loading=false;
    }

    $scope.createQuestionPaper = function() {
        service.setQPListSearchCriteria($scope.qpSearchCriteria);
        $state.go('questionPaper.create', {});
    }

    $scope.editQuestionPaper =function(questionPaperId) {
        service.setQPListSearchCriteria($scope.qpSearchCriteria);
        $state.go('questionPaper.edit', {"questionPaperId": questionPaperId});
    }

    $scope.searchQuestionPapers = function() {
        $("#searchQuestionPapers").html('Searching...').attr('disabled', true);
        $scope.declareQuestionPapers();
        setTimeout(function() {
            $scope._searchQuestionPapers();
        },1);
    }

    $scope._searchQuestionPapers = function() {
        var req = new Object();
        req.SEARCH_CRITERIA = {"limit": $scope.questionPapers.maxDisplayCount, "offset": 0, "orderFields": { "title": "asc" } };
        req.SEARCH_CRITERIA.filters = [];
        req.SEARCH_CRITERIA.filters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
        if($scope.qpSearchCriteria.learningElements && $scope.qpSearchCriteria.learningElements.length > 0) {
            var learningElements = [];
            $scope.qpSearchCriteria.learningElements.forEach(function(item) {
                learningElements.push(service.addFedoraPrefix(item.id));
            });
            if(learningElements.indexOf($rootScope.courseId) == -1) {
                req.SEARCH_CRITERIA.filters.push({"name": "context", "operator": "in", "valueList": learningElements});
            }
        }
        
        if($scope.qpSearchCriteria.testType) req.SEARCH_CRITERIA.filters.push({"name": "testType", "operator": "eq", "value": $scope.qpSearchCriteria.testType});

        service.callService("getQuestionPapers", req, "PATCH", "READ").then(function(result) {
            $("#searchQuestionPapers").html('Search').attr('disabled', false);
            if(result && result.responseValueObjects && result.responseValueObjects.QUESTION_PAPERS && result.responseValueObjects.QUESTION_PAPERS.valueObjectList) {
                $scope.questionPapers.data = result.responseValueObjects.QUESTION_PAPERS.valueObjectList;
                $scope.questionPapers.count = $scope.questionPapers.data.length;
            }
            
        }).then(function() {
            var userIds = [];
            $scope.questionPapers.data.forEach(function(paper) {
                if(userIds.indexOf(paper.createdBy) == -1)
                    userIds.push(paper.createdBy);
            });
            $http.post('/private/users/getDisplayName', {ids: userIds}).success(function(data) {
                if(data.status == "SUCCESS") {
                    $scope.questionPapers.data.forEach(function(paper) {
                        paper.createdByDisplayName = (data.displayNames[paper.createdBy])?data.displayNames[paper.createdBy]:paper.createdBy;
                    });
                }
            });
            $scope.questionPapers.show = true;
            $scope.questionPapers.loading = false;
            setTimeout(function() {
                $('.tool').tooltip();
                $('.tool-tip').tooltip();
            },1000);
        });
    }

    $scope.getLearningElementName = function(identifier) {
        var learningElementId = service.removeFedoraPrefix(identifier);
        var filteredElements = $scope.quesionPaperSearch.learningElements.filter(function(item) {
            return item.id == learningElementId;
        });
        if(filteredElements.length == 1) {
            return filteredElements[0].name;
        } else {
            return "---";
        }
    }

    $scope.declareQuestionPapers();
    setTimeout(function() {
        var savedCriteria = service.getQPListSearchCriteria();
        if(savedCriteria) {
            $scope.qpSearchCriteria = savedCriteria;
        }
        $scope.searchQuestionPapers();
    }, 200);
    
    $scope.showMore = function() {
        if(($scope.questionPapers.currentDisplayCount+$scope.questionPapers.defaultDisplayCount) >= $scope.questionPapers.data.length) {
            $scope.questionPapers.currentDisplayCount = $scope.questionPapers.data.length;
        } else {
            $scope.questionPapers.currentDisplayCount += $scope.questionPapers.defaultDisplayCount;
        }
    }

    $scope.showSearchForm = function(){
        $('#questionpaperSearchForm').slideToggle();
        $('#questionpaperSearchButton').toggleClass('fa-close');
        $('#questionpaperSearchButton').toggleClass('fa-search');
    }

    $scope.questionPaperToDelete = undefined;
    $scope.confirmQuestionPaperToDelete = function(questionPaper) {
        $http.get('/private/v1/learningactivities/'+questionPaper.identifier).success(function(result) {
            console.log("learningactivities:",JSON.stringify(result));
            if(result.status == "SUCCESS") {
                if(result.learningactivities && result.learningactivities.length == 0) {
                    $scope.questionPaperToDelete = questionPaper;
                    $('#questionPaperDeleteModal').modal('show');    
                } else {
                    $rootScope.showConformationMessage('alert-danger','The Question Paper is used in Learning Activities. Question Paper can only be removed after the Learning Activities are removed.');
                }
            } else if(result.status == "ERROR") {
                $rootScope.showConformationMessage('alert-danger','Error while deleting the Question Paper.');
            }
            
        });
    }

    $scope.deleteQuestionPaper = function() {
        service.callService("deleteQuestionPaper?QUESTION_PAPER_ID="+$scope.questionPaperToDelete.identifier, {}, "PATCH", "WRITE").then(function(result) {
            console.log("delete result:", result);
            if(result && result.responseValueObjects && result.responseValueObjects.STATUS && result.responseValueObjects.STATUS.statusType == "SUCCESS") {
                var index = $scope.questionPapers.data.indexOf($scope.questionPaperToDelete);
                $scope.questionPapers.data.splice(index, 1);
                $scope.questionPapers.currentDisplayCount--;    
                $rootScope.showConformationMessage('alert-success','Question Paper delected successfully.');
            } else {
                $rootScope.showConformationMessage('alert-danger','Error while deleting the Question Paper.');
            }
            $scope.questionPaperToDelete = undefined;
        });
    }

}]);

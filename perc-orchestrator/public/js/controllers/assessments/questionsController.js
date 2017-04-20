app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.controller('listQuestionCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state) {
	$rootScope.leftMenu = 'assessments';
    $scope.defaultResultLimit = 25;
    $scope.autoSearch = false;
    $scope.bodyLimitTo = 100;
    $rootScope.showConceptMap = false; 
	$scope.questionSetUsedIn = ["Exam", "Practice"];
    $scope.operationType = "Create";
    $scope.canWriteQuestion = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteQuestion = true;
        }
    })
    
    $('.tool').tooltip();
    $('.tool-tip').tooltip();
    
    $scope.difficultyLevels = service.getDifficultyLevels();

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

    
    $scope.purpose = service.getPurpose();

    $scope.questionsImportForm = {};
    $scope.questionsImportData = {};

    $scope.getQuestionTitle = function(body) {
         return $scope.renderHtmlTrim(body, 50);
    }

    $scope.declareQuesImportData = function() {
        $scope.questionsImportData = {
            itemType: "MCQ",
            isCSVFile: true,
            errorUpload: false
        };
        $scope.csvFile = null;
    }

    $scope.declareQuesImportForm = function() {
        $scope.questionsImportForm = {
            itemTypes : ["MCQ", "MMCQ", "Program in IDE"]
        };
        $http.post('/private/v1/allCourses')
        .success(function(data){
            $scope.questionsImportForm.courses = data;
        }).error(function(data, status, headers, config) {
            console.log("Status:",status);
          })
    }

    $scope.declareQuesImportData();
    $scope.declareQuesImportForm();

    $scope.searchResultCount = 0;
    $scope.searchResult = [];
    $scope.searchFilters = [];
    $scope.showSearchResult = false;
    $scope.showLoading = false;
    $scope.resultLimit = $scope.defaultResultLimit;
	$rootScope.listQuestionsFilters = {
        questionSetName: "",
        questionSetDescription: "",
        usedIn: "Exam",
		selectedContexts : '',
        selectedConcepts : [],
        purpose : '',
        selectedSubPurpose : [],
        selectedDifficultyLevel : [],
        selectedQuestionType : '',
        selectedQuestionSubType : [],
        selectedOutcome : [],
        selectedLOB : [],
        learningElements: [],
	};
    $scope.conceptsList = [];
    $scope.selectedContext = '';
    $scope.editQuesionSet = {};

    $scope.quesionsSearch = {};

    $scope.setDefaultAssessmentContext = function() {
    	$rootScope.leftMenu = 'assessments';
    	$rootScope.ViewContext = 'questionSets';
    	$rootScope.menuSlided = true;
        $scope.questionSetToc = service.getTOCForQuestionSets();
        $scope.tocKeyName = service.getTOCKeyNames();
        $scope.quesionsSearch = {
            learningElements: service.getLearningElements(),
        };
    }

    $scope.highlightCode = function() {
        $timeout(function() {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }, 1000);
    }

    $scope.setDefaultAssessmentContext();

    $scope.updateResultLimit = function() {
        if(($scope.resultLimit+$scope.defaultResultLimit) >= $scope.searchResult.length) {
            $scope.resultLimit = $scope.searchResult.length;
        } else {
            $scope.resultLimit += $scope.defaultResultLimit;
        }
    }

    $scope.clearSearch = function() {
        $scope.resultLimit = $scope.defaultResultLimit;
        $scope.showSearchResult = false;
        $scope.showLoading = false;
        $scope.searchResultCount = 0;
        $scope.searchResult = [];
        $scope.searchFilters = [];
        $scope.selectedContext = '';
        $rootScope.listQuestionsFilters = {
            questionSetName: "",
            questionSetDescription: "",
            usedIn: "Exam",
            selectedContexts : '',
            selectedConcepts : [],
            purpose : '',
            selectedSubPurpose : [],
            selectedDifficultyLevel : [],
            selectedQuestionType : '',
            selectedQuestionSubType : [],
            selectedOutcome : [],
            selectedLOB : [],
            learningElements: [],
        };
        $scope.difficultyLevels = service.getDifficultyLevels();
        $scope.questionSubTypes = [{ id: 1, name : "MCQ"}, { id: 2, name : "MMCQ"}];
        $scope.subPurpose = [];
        $scope.isSelectedAllDifficultyLevels = false;
        $scope.isAllQuestionSubTypeSelected = false;                      
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

    $scope.getDataForQuestionPreview = function(assessmentItemId, divId) {
        previewQuestion(assessmentItemId, divId);
    }

    $scope.searchQuestions = function() {
            $('#searchQuestions').html('Searching...').attr('disabled', true);
            $scope.showSearchResult = true;
            $scope.showLoading = true;
            $scope.resultLimit = $scope.defaultResultLimit;
            $scope.searchResult = [];

            setTimeout(function() {
                $scope._searchQuestions();
            },1);
    }

    $scope._searchQuestions = function() {
        var req = new Object();
        req.SEARCH_CRITERIA = {"offset": 0, "limit": 500};
        $scope.searchFilters = createSearchFiltersForQuestions($scope, $rootScope, service);
        $scope.searchFilters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
        req.SEARCH_CRITERIA.filters = $scope.searchFilters;

        service.callService("searchAssessmentItems", req, "PATCH", "READ").then(function(result) {
            if(result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_LIST && result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList)
                $scope.searchResult = result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList;
            setTimeout(function() {
                $scope.highlightCode();
                $('.tool').tooltip();
                $('.tool-tip').tooltip();
            },1000);
        });

        service.callService("countAssessmentItems", req, "PATCH", "READ").then(function(result) {
            $('#searchQuestions').html('Search').attr('disabled', false);
            if(result.responseValueObjects && result.responseValueObjects.COUNT && result.responseValueObjects.COUNT.id)
            $scope.searchResultCount = result.responseValueObjects.COUNT.id;
            $scope.showLoading = false;
        });
    }

    setTimeout(function() {
        if(service.getQuestionsListFilter()) {
            $scope.autoSearch = true;
            $rootScope.listQuestionsFilters = service.getQuestionsListFilter();
        }
        $scope.searchQuestions();
    }, 100);

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

    $scope.previewList = function(list) {
        var labels = []
        if(list && list.length) {
            list.forEach(function(element) {
                labels.push(element.name || element);
            });
        }
        if(labels.length > 0) {
            var result = "";
            labels.forEach(function(label) {
                result += label+ "<br/>";
            })
            return result;
        } else {
            return 'None';
        } 
    }

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
        $rootScope.listQuestionsFilters.selectedSubPurpose = [];
    }

    $scope.getContentType = function(eleType) {
        if(eleType == "course" || eleType == "module" || eleType == "lesson") {
            return eleType.toUpperCase();
        } else {
            return "LECTURE";
        }
    }

    $scope.onSelectImportFile = function($files){
        var file = $files[0];
        var fileName = file.name;
        var csvvalid = fileName.indexOf('.csv');

        if(csvvalid > -1){
            $scope.questionsImportData.isCSVFile = true;
        } else {
            $scope.questionsImportData.isCSVFile = false;
        }
        
    }

    $scope.importQuestions = function() {
        $('#importQuestions').html('Uploading...').attr('disabled', true);
        var fd = new FormData();
        fd.append('importFile', $scope.csvFile);
        fd.append('COURSE_ID',$rootScope.courseId);
        fd.append('QUESTION_SUBTYPE',$scope.questionsImportData.itemType);
        var url = "/private/v1/question/import";

        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(response) {
            $('#importQuestions').html('Upload').attr('disabled', false);
            if(response && response.responseValueObjects && response.responseValueObjects.STATUS && response.responseValueObjects.STATUS.statusType && response.responseValueObjects.STATUS.statusType == 'ERROR') { 
                $('#importMessage').toggleClass('hide').html('Error while importing CSV.').addClass('alert-danger');    
            } else {
                $('#importMessage').toggleClass('hide').html('Imported Successfully.').addClass('alert-success');
                $scope.declareQuesImportData();
            }
            
            setTimeout(function() {
                $('#importMessage').toggleClass('hide').html('').removeClass('alert-success').removeClass('alert-danger');
                $scope.showImportQuestions();
            }, 5000);
        }).error(function(data, status, headers, config) {
            console.log("Error:", status);
            // window.alert("Error saving Questions.");
            $scope.questionsImportData.errorUpload = true;
            $('#importQuestions').html('Upload').attr('disabled', true);
            setTimeout(function() {
                $('#importQuestions').html('Upload').attr('disabled', false);
                $scope.declareQuesImportData();
            },5000);
            
        });

    }

    $scope.showImportQuestions = function() {
        $("#il-Txt-Editor").slideToggle('slow');
        $('.importBtn').toggleClass('fa-close');
        $('.importBtn').toggleClass('fa-upload');
        $('#questionSearchForm').slideUp();
        $('#questionSearchButton').removeClass('fa-close');
        $('#questionSearchButton').addClass('fa-search');
    }

    $scope.createQuestion = function() {
        service.setQuestionsListFilter($rootScope.listQuestionsFilters);
        $state.go('question.create', {});
    }

    $scope.editQuestion = function(questionId) {
        service.setQuestionsListFilter($rootScope.listQuestionsFilters);
        $state.go('question.edit', {"questionId": questionId});
    }

    $scope.showSearchForm = function(){
        $('#questionSearchForm').slideToggle();
        $('#questionSearchButton').toggleClass('fa-close');
        $('#questionSearchButton').toggleClass('fa-search');
        $("#il-Txt-Editor").slideUp('slow');
        $('.importBtn').removeClass('fa-close');
        $('.importBtn').addClass('fa-upload');
    }

    $scope.questionMouseOver = function(event) {
        $(event.currentTarget).find('.previewIcon').removeClass('hide');
    }

    $scope.questionMouseLeave = function(event) {
        $(event.currentTarget).find('.previewIcon').addClass('hide');
    }

    $scope.questionToDelete = undefined;
    $scope.confirmQuestionToDelete = function(question) {
        $scope.questionToDelete = question;
        $('#questionDeleteModal').modal('show');
    }

    $scope.deleteQuestion = function() {
        service.callService("deleteAssessmentItem?ASSESSMENT_ITEM_ID="+$scope.questionToDelete.identifier, {}, "PATCH", "WRITE").then(function(result) {
            console.log("delete result:", result);
            if(result && result.responseValueObjects && result.responseValueObjects.STATUS && result.responseValueObjects.STATUS.statusType == "SUCCESS") {
                var index = $scope.searchResult.indexOf($scope.questionToDelete);
                $scope.searchResult.splice(index, 1);
                $scope.searchResultCount--;    
                $rootScope.showConformationMessage('alert-success','Question delected successfully.');
            } else {
                $rootScope.showConformationMessage('alert-danger','Error while deleting the question.');
            }
            $scope.questionToDelete = undefined;
        });
    }


}]);

function createSearchFiltersForQuestions($scope, $rootScope, service) {
    var filters = [];

    if($rootScope.listQuestionsFilters.learningElements.length > 0) {
        var learningElements = [];
        $rootScope.listQuestionsFilters.learningElements.forEach(function(item) {
            learningElements.push(service.addFedoraPrefix(item.id));
        });
        if(learningElements.indexOf($rootScope.courseId) == -1) {
            filters.push({"name":"learningElement", "operator":"in", "valueList": learningElements});
        }
    }
    
    if($rootScope.listQuestionsFilters.selectedConcepts && $rootScope.listQuestionsFilters.selectedConcepts.length > 0) {
        var conceptItems = [];
        $rootScope.listQuestionsFilters.selectedConcepts.forEach(function(item) {
            conceptItems.push(item.name);
        });
        filters.push({"name":"concept", "operator":"in", "valueList": conceptItems});
    }

    if($rootScope.listQuestionsFilters.selectedDifficultyLevel.length > 0 ) {
        var items = [];
        $rootScope.listQuestionsFilters.selectedDifficultyLevel.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"difficultyLevel", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionsFilters.purpose) filters.push({"name":"purpose", "operator":"eq", "value": $rootScope.listQuestionsFilters.purpose.name});
    if($rootScope.listQuestionsFilters.selectedSubPurpose && $rootScope.listQuestionsFilters.selectedSubPurpose.length > 0) {
        var items = [];
        $rootScope.listQuestionsFilters.selectedSubPurpose.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"subPurpose", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionsFilters.selectedQuestionType) filters.push({"name":"questionType", "operator":"eq", "value": $rootScope.listQuestionsFilters.selectedQuestionType});
    
    if($rootScope.listQuestionsFilters.selectedQuestionSubType && $rootScope.listQuestionsFilters.selectedQuestionSubType.length > 0) {
        var items = [];
        $rootScope.listQuestionsFilters.selectedQuestionSubType.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"questionSubtype", "operator":"in", "valueList": items});
    }

    if($rootScope.listQuestionsFilters.selectedOutcome && $rootScope.listQuestionsFilters.selectedOutcome.length > 0) {
        var items = [];
        $rootScope.listQuestionsFilters.selectedOutcome.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"learningGoal", "operator":"in", "valueList": items});
    }
    return filters;
}


app.controller('createQuestionCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state) {
    $rootScope.leftMenu = 'assessments';

    $scope.question = {
        operationType: "Create",
        inputfilter : {
            purpose: service.getPurpose(),
            subPurpose: [],
            types: service.getQuestionTypes(),
            subTypes: [],
            difficultyLevels: service.getDifficultyLevels(),
            learningElements: service.getLearningElements(),
            usedIn: service.getTestTypes(),
            outcomes: [],
        },

        data: {
            learningElements: [],
            options: [],
            ide: {},
            embedded: {}
        },
        backToList: function () {
            $state.go('question', {});
        },
        setSubpurpose: function(purpose) {
            this.inputfilter.subPurpose = purpose.subpurpose;
        },
        setSubType: function(type) {
            if(type) {
                this.inputfilter.subTypes = type.subTypes;
            } else {
                this.inputfilter.subTypes = [];
            }
            this.data.questionSubType = [];
            this.data.options = [];
        },
        updateQuestionSubType: function(subType) {
            this.data.options = [];
            // TODO-Mahesh Currently the options data is supproted for MCQ and MMCQ. Future we will change it depends on type of the Question SubType.
            this.data.options.push({description:'', answer: false, feedback: ''});
        },

        addOption: function() {
            // this.data.questionSubType will give the subtype of the Quesiton.
            this.data.options.push({description:'', answer: false, feedback: ''});
        },

        removeOption: function(option) {
            var index = this.data.options.indexOf(option);
            if(index == this.data.correctAnswer) this.data.correctAnswer = -1;
            if(index > -1) {
                this.data.options.splice(index, 1);
            }
        },

        clear: function() {
            this.data = {
                learningElements: [],
                options: [],
                ide: {},
                embedded: {}
            };
        },
        dataMap: {
            getObjectiveQuestionDataMap: function(data) {
                var isValid = true;
                var questionDataMap = {};
                var i=0;
                var hasMMCQAnswer = false;
                data.options.forEach(function(item) {
                    i++;
                    if(!item.description) isValid = false;
                    questionDataMap["Answer"+i] = item.description;
                    questionDataMap["Feedback"+i] = item.feedback;
                    if(data.questionSubType && data.questionSubType.name == 'MMCQ') {
                        if(item.answer) {
                            questionDataMap["Score"+i] = 1;
                            hasMMCQAnswer = true;
                        } else {
                            questionDataMap["Score"+i] = -1;
                        }
                    }
                });
                if(data.questionSubType && data.questionSubType.name == 'MCQ') {
                    if(typeof data.correctAnswer != undefined && data.correctAnswer>=0) {
                        questionDataMap.correctAnswer = data.options[data.correctAnswer].description;
                    } else {
                        isValid = false;
                    }
                }
                if(data.questionSubType && data.questionSubType.name == 'MMCQ') {
                    if(!hasMMCQAnswer) isValid = false;
                    questionDataMap.isPartial = data.isPartial;
                }
                return { "dataMap": questionDataMap, "isValid": isValid };
            },
            getIDEQuestionDataMap: function(data) {
                var isValid = true;
                var questionDataMap = {};
                if(data.ide && data.ide.repoURL && data.ide.repoTag && data.ide.solutionRepoURL && data.ide.solutionRepoTag) {
                    questionDataMap = data.ide;
                } else {
                    isValid = false;
                }
                return { "dataMap": questionDataMap, "isValid": isValid };
            }
        },
        saveQuestion: function() {
            $("#saveQuestion").html("Saving...").attr('disabled', true);

            var isValid = true;

            var req = new Object();
            req.COURSE_ID = $rootScope.courseId;
            if(this.data.questionSubType && this.data.questionSubType.code) {
                req.QUESTION_SUBTYPE = this.data.questionSubType.code;
            } else {
                isValid = false;
            }
            req.ASSESSMENT_ITEM = {title:"", courseId: $rootScope.courseId, offerredBy: "Canopus", owner: "Canopus", copyRight: "Canopus", duration:10, reservedForExam: false};
            if(this.data.identifier) req.ASSESSMENT_ITEM.identifier = this.data.identifier;

            if(this.data.questionType) {
                req.ASSESSMENT_ITEM.questionType = this.data.questionType.name;
            } else {
                isValid = false;
            }
            if(this.data.questionSubType && this.data.questionSubType.name) {
                req.ASSESSMENT_ITEM.questionSubtype = this.data.questionSubType.code;    
            } else {
                isValid = false;
            }

            if(this.data.difficultylevel && this.data.difficultylevel.name) {
                req.ASSESSMENT_ITEM.difficultyLevel = this.data.difficultylevel.name;
            } else {
                isValid = false;
            }

            req.ASSESSMENT_ITEM.concepts = [];
            if(this.data.concepts) {
                this.data.concepts.forEach(function(item) {
                    req.ASSESSMENT_ITEM.concepts.push(item.name);
                });    
            }
            
            if(this.data.learningElements && this.data.learningElements.length > 0) {
                req.ASSESSMENT_ITEM.learningElements = [];
                this.data.learningElements.forEach(function(item){
                    req.ASSESSMENT_ITEM.learningElements.push(service.addFedoraPrefix(item.id));
                });
            } else {
                isValid = false;
            }

            if(this.data.body) {
                req.ASSESSMENT_ITEM.body = this.data.body;
            } else {
                isValid = false;
            }

            if(this.data.purpose && this.data.purpose.name) {
                req.ASSESSMENT_ITEM.purpose = this.data.purpose.name;
            } else {
                isValid = false;
            }

            if(this.data.subPurpose && this.data.subPurpose.name) {
                req.ASSESSMENT_ITEM.subPurpose = this.data.subPurpose.name;
            }

            // TODO-Mahesh DataMap will be added depends on SubType.
            var questionDataMap = { isValid:false };
            if(this.data.questionSubType && ["MCQ","MMCQ"].indexOf(this.data.questionSubType.code) > -1) {
                questionDataMap = this.dataMap.getObjectiveQuestionDataMap(this.data);
            } else if(this.data.questionSubType && this.data.questionSubType.code && this.data.questionSubType.code == "Program in IDE") {
                questionDataMap = this.dataMap.getIDEQuestionDataMap(this.data);
            }
            
            if(questionDataMap.isValid) {
                req.ASSESSMENT_ITEM.dataMap = questionDataMap.dataMap;
                req.ASSESSMENT_ITEM.dataMap.Question = this.data.body;
                req.ASSESSMENT_ITEM.dataMap.questionFeedback = this.data.questionFeedback;
            } else {
                isValid = questionDataMap.isValid;
            }
            req.ASSESSMENT_ITEM.testUsage = (this.data.testUsage)?this.data.testUsage:"";

            if(isValid) {
                service.callService("saveAssessmentItem", req, "PATCH", "WRITE").then(function(result) {
                    if(result && result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_ID && result.responseValueObjects.ASSESSMENT_ITEM_ID.id) {
                        // $rootScope.scrollTopAnimate();
                        // $("#saveQAlert").removeClass("hide").addClass("alert-success").html("Question Saved.");
                        $rootScope.showConformationMessage('alert-success',"Question saved successfully. Redirecting to Questions list...");
                        setTimeout(function() {
                            // $("#saveQAlert").addClass("hide").removeClass("alert-success").html("");
                            $scope.question.backToList();
                        },5000);
                    } else {
                        var errorMsg = "Error Saving Question.";
                        if(result && result.responseValueObjects && result.responseValueObjects.STATUS && result.responseValueObjects.STATUS.statusMessage) {
                            errorMsg = result.responseValueObjects.STATUS.statusMessage;
                        }
                        
                        $rootScope.scrollTopAnimate();
                        $("#saveQAlert").removeClass("hide").addClass("alert-danger").html(errorMsg);
                        setTimeout(function() {
                            $("#saveQAlert").addClass("hide").removeClass("alert-danger").html("");
                        },10000);
                    }
                    $("#saveQuestion").html("Save").attr('disabled', false);
                });
            } else {
                $("#saveQAlert").removeClass("hide").addClass("alert-danger").html("Please fill required fields.");
                $("#saveQuestion").html("Save").attr('disabled', false);
                $(".mid-area").animate({ scrollTop : $("#saveQAlert").offset().top},'slow');
                $rootScope.scrollTopAnimate();
                setTimeout(function() {
                    $("#saveQAlert").addClass("hide").removeClass("alert-danger").html("");
                },5000);
            }
        }
    }


    $scope.populateQuestion = function(questionId) {
        $scope.question.operationType = "Update";

        service.callService("getAssessmentItem?ASSESSMENT_ITEM_ID="+questionId, {}, "PATCH", "READ").then(function(result) {
            if(result && result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM) {
                $scope.question.inputfilter = {
                    purpose: service.getPurpose(),
                    subPurpose: [],
                    types: service.getQuestionTypes(),
                    subTypes: [],
                    difficultyLevels: service.getDifficultyLevels(),
                    learningElements: service.getLearningElements(),
                    usedIn: service.getTestTypes(),
                    outcomes: [],
                };

                $scope.question.data = {
                    learningElements: [],
                    options: [],
                    ide: {},
                    embedded: {}
                };

                $scope.getQuestionConceptList($rootScope.conceptTitleMap);

                assessmentItem = result.responseValueObjects.ASSESSMENT_ITEM;
                for(k in assessmentItem) {
                    var value = assessmentItem[k];
                    $scope.question.data[k] = value;
                }

                $scope.question.data.body = toMarkdown(assessmentItem.body);
                if(assessmentItem.dataMap.questionFeedback) $scope.question.data.questionFeedback = toMarkdown(assessmentItem.dataMap.questionFeedback);
                $scope.question.data.questionType = $scope.question.inputfilter.types.filter(function(item) {
                    return item.name == assessmentItem.questionType;
                })[0];
                if($scope.question.data.questionType) {
                    $scope.question.inputfilter.subTypes = $scope.question.data.questionType.subTypes;
                    $scope.question.data.questionSubType = $scope.question.inputfilter.subTypes.filter(function(item) {
                        return item.code == assessmentItem.questionSubtype;
                    })[0];
                }
                
                if(assessmentItem.concepts) {
                    $scope.question.data.concepts = $scope.conceptsList.filter(function(item) {
                        return assessmentItem.concepts.indexOf(item.name) > -1;
                    });
                }

                if(assessmentItem.learningElements) {
                    $scope.question.data.learningElements = $scope.question.inputfilter.learningElements.filter(function(item) {
                        return assessmentItem.learningElements.indexOf(service.addFedoraPrefix(item.id)) > -1;
                    });    
                }
                    
                if(assessmentItem.purpose) {
                    $scope.question.data.purpose = $scope.question.inputfilter.purpose.filter(function(item) {
                        return item.name == assessmentItem.purpose;
                    })[0];
                    $scope.question.inputfilter.subPurpose = $scope.question.data.purpose.subpurpose;
                    $scope.question.data.subPurpose = $scope.question.inputfilter.subPurpose.filter(function(item) {
                        return item.name == assessmentItem.subPurpose;
                    })[0];
                }

                if(assessmentItem.difficultyLevel) {
                    $scope.question.data.difficultylevel = $scope.question.inputfilter.difficultyLevels.filter(function(item) {
                        return item.name == assessmentItem.difficultyLevel;
                    })[0];
                }
                
                if(["MCQ","MMCQ"].indexOf(assessmentItem.questionSubtype) > -1) {
                    $scope.question.data.options = [];
                    
                    if(assessmentItem.dataMap.isPartial &&  assessmentItem.dataMap.isPartial == "true") {
                        $scope.question.data.isPartial = true;
                    } else {
                        $scope.question.data.isPartial = false;
                    }
                    var correctAnswerDesc = "";
                    if(assessmentItem.dataMap["correctAnswer"]) correctAnswerDesc = toMarkdown(assessmentItem.dataMap["correctAnswer"]);
                    for(i=1;i<=6;i++) {
                        if(assessmentItem.dataMap["Answer"+i]) {
                            var desc = toMarkdown(assessmentItem.dataMap["Answer"+i]);
                            if(correctAnswerDesc == desc) {
                                $scope.question.data.correctAnswer = i-1;
                            }
                            var feedback = "";
                            if(assessmentItem.dataMap["Feedback"+i]) feedback = toMarkdown(assessmentItem.dataMap["Feedback"+i]);
                            var answer = false;
                            if(assessmentItem.dataMap["Score"+i] == 1) answer = true;
                            $scope.question.data.options.push({description: desc, feedback: feedback, answer: answer}); 
                        }
                    }    
                } else if(assessmentItem.questionSubtype == "Program in IDE") {
                    $scope.question.data.ide = assessmentItem.dataMap;
                }
                
            }
        });
    }


    if($routeParams.questionId) {
       setTimeout(function() {
        $scope.populateQuestion($routeParams.questionId);
       },500);
    }

    $http.get('/private/v1/course/getOutcomes/'+encodeURIComponent(service.addFedoraPrefix($rootScope.courseId)))
        .success(function(outcomes){
            $scope.question.inputfilter.outcomes = [];
            var i = 1;
            outcomes.forEach(function(item) {
                $scope.question.inputfilter.outcomes.push({id: i++, name: item});
            });
        });


    $scope.getQuestionConceptList = function(object) {
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

}]);
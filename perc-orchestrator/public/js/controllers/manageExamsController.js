app.controller('createExamCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state','$q', '$sce', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state, $q, $sce) {
    $scope.getQuestionSet = function(questionSetId) {
    	return service.callService("getItemSet?ITEM_SET_ID="+questionSetId, {}, "PATCH", "READ");
    }

    $scope.canWriteExam = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteExam = true;
        }
    });

    $scope.getMetadata = function(testType, usage, userName) {
    	return {
    		laType: "coaching",
			name: "",
			description: "",
			shortDescription: "",
			descriptionVerified: false,
	        offeredByProfileURL: "http://www.canopusconsulting.com/",
	        offeredByImage: "http://beta.ilimi.in/uploads/image/canopuslogo.png",
	        offeredByType: "Organization",
	        ownerProfileURL: "http://www.canopusconsulting.com/",
	        ownerImage: "http://beta.ilimi.in/uploads/image/canopuslogo.png",
	        ownerType: "Organization",
	        authorProfileURL: "http://www.canopusconsulting.com/index.php/feroz/",
	        authorImage: "http://beta.ilimi.in/uploads/image/feroz.png",
	        author: userName,
	        instructionUsage: usage,
	        elementType: testType,
	        learningTime: 0,
	        difficultyLevel: "",
	        learnerLevel: "",
	        studyLevel: "",
	        duration: "",
	        copyRight: "StackRoute Labs",
	        owner: "StackRoute Labs",
	        offeredBy: "StackRoute Labs",
	        language: "EN",
	        synopsis: "",
	        currentStatus: "draft",
	        extendedMaterial: "FALSE",
	        "isMandatory": true,
	        setType: "learningactivity",
	        node_type: "NODE",
	        isNew: true,
	        nodeType: "learningactivity",
	        nodeClass: "learningactivity",
	        concepts: [],
	        proficiencyWeightage: 1,
	        deleteStatus:""
		};
    }

    $scope.getContent = function(media) {
    	return {
        metadata: {
	            deleteStatus: "",
	            node_type: "NODE",
	            setType: "content",
	            isMandatory: "",
	            extendedMaterial: false,
	            shortDescription: "",
	            synopsis: "",
	            description: media.description,
	            language: "EN",
	            duration: "",
	            learningTime: 1200,
	            elementType: media.elementType,
	            contentType: "lecture",
	            contentSubType: "lecture",
	            descriptionVerified: false,
	            media: [media],
	            isNew: true
	        },
	        learningTime: 0,
	        contentSubType: "",
	        contentType: "",
	        pedagogyId: "",
	        description: media.description,
	        name: "",
	        interceptions: [],
	        mediaConcepts: [],
	        concepts: [],
	        subtitles: [],
	        transcripts: [],
	        categories: [],
	        media: [media],
	        order: 0,
	        linkedCourses: [],
	        is_deleted: false
	    };
    }

	$scope.difficultyLevelKeyMap = { "": 0, "Easy": 1, "Medium":2, "Difficult":3 };
	$scope.showPage = false;
	$scope.addedToTOC = false;
	$scope.canUpdatePaper = false;
	$scope.laEditable = false;

	$scope.learningElements = cbService.allLobs;

	$scope.exam = {
		metadata: "",
		media: {
            title: "",
            mediaUrl: {numAttempts: 10},
            mimeType: "ilimi/test",
            mediaType: "test",
            mediaId: "",
            description: "",
            isMain: true
        },
        difficultyLevel: { key: 0, value: ""},
        parentNode: "",
        binder: ""
	}
	$rootScope.questionPaperEvents = '';

	$scope.getQuestionPaper = function(questionPaperId, learningactivity) {
        service.callService("getQuestionPaper?QUESTION_PAPER_ID="+questionPaperId, {}, "PATCH", "READ").then(function(qpResult) {
			if(qpResult && qpResult.responseValueObjects && qpResult.responseValueObjects.QUESTION_PAPER) {
				$scope.questionPaper = qpResult.responseValueObjects.QUESTION_PAPER;
				$scope.exam.metadata = $scope.getMetadata($scope.questionPaper.testType, "coaching", $scope.userName);
				if(learningactivity) {
					$scope.exam.metadata.name = learningactivity.name;
					$scope.exam.metadata.description = learningactivity.metadata.description;
					$scope.exam.supplementaryContent = learningactivity.supplementary_content;
				} else {
					$scope.exam.metadata.name = $scope.questionPaper.title;
					$scope.exam.metadata.description = $scope.questionPaper.description;
				}
				
				$scope.exam.media.mediaUrl = { "questionPaperId": $scope.questionPaper.identifier, "usageId": "", "numAttempts": 10 };
				var parentId = cbService.removeFedoraPrefix($scope.questionPaper.context);
				var parentArray = $scope.learningElements.filter(function(item) {
					return item.id == parentId;
				});
				if(parentArray && parentArray.length > 0)
					$scope.exam.parentNode = parentArray[0];

				if($scope.questionPaper.concretePapers && $scope.questionPaper.concretePapers.length > 0) {
					$scope.exam.concretePaper = $scope.questionPaper.concretePapers[0];
        		} else {
        			$scope.exam.concretePaper = "";
        		}

				$scope.binders = [];
				$http.get('/private/v1/binder/getByParent/'+encodeURIComponent($scope.questionPaper.context)).success(function(result) {
					if(result.status == "SUCCESS") {
						$scope.binders = result.binders;
					}
				});

				var qsPromises = [];
				if($scope.questionPaper.setCriteria) {
					$scope.questionPaper.setCriteria.forEach(function(item) {
						qsPromises.push($scope.getQuestionSet(item.setId));
					});	
				}
				$q.all(qsPromises).then(function(qsListResult) {
					if(qsListResult && qsListResult.length > 0) {
						qsListResult.forEach(function(qsResult){
							if(qsResult && qsResult.responseValueObjects && qsResult.responseValueObjects.ITEM_SET) {
								var questionSet = qsResult.responseValueObjects.ITEM_SET;
								questionSet.criteria.forEach(function(item) {
									if(item.name == "concept") {
										$scope.exam.metadata.concepts = $scope.exam.metadata.concepts.concat(item.valueList);
									} else if(item.name == "difficultyLevel") {
										item.valueList.forEach(function(level) {
											if($scope.difficultyLevelKeyMap[level] > $scope.exam.difficultyLevel.key) {
												$scope.exam.difficultyLevel.key = $scope.difficultyLevelKeyMap[level];
												$scope.exam.difficultyLevel.value = level;
											}
										});
									}
								})
							}
						});
					} else {
						// TODO-Mahesh Handle this error and show it on UI.
						console.log("Error while fetching question Sets.");
					}
					$scope.showPage = true;
					if($routeParams.parentNodeId) {
						// $scope.showSaveSuccessAlert = true;
						$rootScope.showConformationMessage('alert-success','Learning Activity saved successfully.');
						// $scope.showSaveSuccessAlert = false;
					}
				});
			}
		});
    }

    $scope.getElementName = function(lobId) {
    	var lob = $scope.learningElements.filter(function(item) {
    		return item.id == lobId;
    	})[0];
    	if(lob) 
    		return lob.name;
    	else 
    		return "";
    }

    $scope.changeQuestionPaper = function(selectedPaper) {
    	console.log("paper:", selectedPaper);
    	var questionPaperId = selectedPaper.identifier;
	    $scope.getQuestionPaper(questionPaperId);
    }

    if($routeParams.laId) {
    	$scope.operationType = "Release";
    	var laId = cbService.addFedoraPrefix($routeParams.laId);
    	$http.post('/private/v1/learningactivity/getTest', {"laId": laId}).success(function(result) {
    		console.log("getTest Result:",result);
    		if(result) {
    			// var questionPaperId = $routeParams.questionPaperId;
    			$scope.learningActivity = result.learningactivity;
    			var questionPaperId = $scope.learningActivity.metadata.questionPaperId;
    			if($scope.learningActivity.lobId) {
    				$scope.learningActivity.lobName = $scope.getElementName(cbService.removeFedoraPrefix($scope.learningActivity.lobId));
    			} else if($routeParams.parentNodeId) {
    				$scope.learningActivity.lobName = $scope.getElementName($routeParams.parentNodeId);
    			}

    			$scope.getQuestionPaper(questionPaperId, $scope.learningActivity);

    			if($scope.learningActivity && $scope.learningActivity.metadata && $scope.learningActivity.metadata.instructionUsage && $scope.learningActivity.metadata.instructionUsage == "assignment") {
    				$scope.addedToTOC = true;
    			} else {
    				$scope.addedToTOC = false;
    				$rootScope.getLearningActivityEvents();
    			}
    		}
    		$scope.previewEvent = false;
    	});
    } else if($routeParams.questionPaperId) {
    	setTimeout(function() {
    		$scope.operationType = "Create";
	    	var questionPaperId = $routeParams.questionPaperId;
	    	$scope.getQuestionPaper(questionPaperId);
    	},500);
    } else {
    	$scope.showPage = false;
    	setTimeout(function() {
	    	$scope.canUpdatePaper = true;
	    	var req = new Object();
	        req.SEARCH_CRITERIA = {"limit": 500, "offset": 0, "orderFields": { "title": "asc" } };
	        req.SEARCH_CRITERIA.filters = [];
	        req.SEARCH_CRITERIA.filters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
	        var type = "";
	        if($routeParams.questionPaperType == "exam") {
	        	type = "Exam";
	        } else if($routeParams.questionPaperType == "practice") {
	        	type = "Practice";
	        }
	        req.SEARCH_CRITERIA.filters.push({ "name": "testType", "operator": "eq", "value": type });
	        service.callService("getQuestionPapers", req, "PATCH", "READ").then(function(result) {
	        	$scope.operationType = "Create";
	        	$scope.paper = {};
	        	if(result && result.responseValueObjects && result.responseValueObjects.QUESTION_PAPERS && result.responseValueObjects.QUESTION_PAPERS.valueObjectList) {
	                $scope.questionPapers = result.responseValueObjects.QUESTION_PAPERS.valueObjectList;
	                if($scope.questionPapers && $scope.questionPapers.length > 0) {
	                	$scope.selectedPaper = $scope.questionPapers[0];
	                	$scope.getQuestionPaper($scope.questionPapers[0].identifier);
	                } else {
	                	$scope.showPage = true;	
	                	$scope.noQuestionPapers = true;
	                	$scope.questionPaper = {"testType" : type};
	                }
	            }
	        });
    	}, 500);
    }


    $scope.updateTOC = function(action) {
    	var btnLabel = "";
    	if(action == "ADD") btnLabel = "adding..."; else btnLabel = "removing...";
    	$("#addToTOC").html(btnLabel).attr('disabled', true);
    	$http.post('/private/studio/learningactivity/updatetoc', {"laId": $scope.learningActivity.identifier, "courseId": $rootScope.courseId, "action": action}).success(function(data){
    		if(data.status == "ERROR") {
    			$("#addToTOCAlert").html("Error while adding Learning Activity to TOC.").addClass("alert-danger").removeClass("hide");
    		} else {
    			// $("#addToTOCAlert").html("Learning Activity added to TOC successfully.").addClass("alert-success").removeClass("hide");
    			var msg = "";
    			if(action == "ADD") {
    				var msg = "Learning Activity added to TOC successfully.";
    			} else {
    				var msg = "Learning Activity removed from TOC successfully.";
    			}
    			$rootScope.showConformationMessage('alert-success', msg);
    			if(action == "ADD") {
    				$scope.addedToTOC = true;
    			} else if(action == "REMOVE") {
    				$scope.addedToTOC = false;
    			}
    			
    		}
    		setTimeout(function() {
    			$("#addToTOCAlert").html("").removeClass("alert-success").removeClass("alert-danger").addClass("hide");
    		}, 5000);
    	$("#addToTOC").html("Add To TOC").attr('disabled', false);
    	});
    }

	$scope.saveExam = function() {
		$("#saveExam").html('Saving...').attr('disabled', true);
		if(!$scope.exam.parentNode) {
			$("#saveExamAlert").html("Please Select Lecture/Lesson.").removeClass("hide").addClass("alert-danger");
			setTimeout(function() {
				$("#saveExamAlert").html("").addClass("hide").removeClass("alert-danger");
			},5000);
			return;
		}

		$scope.exam.media.title = $scope.exam.metadata.name;
		$scope.exam.media.description = $scope.exam.metadata.description;

		var test = {};
		test.questionPaperId = $scope.questionPaper.identifier;
		test.numAttempts = $scope.exam.media.mediaUrl.numAttempts;
		test.courseId = $rootScope.courseId;

		var reqData = {};
		reqData.ASSESSMENT_TEST_LIST = {};
		reqData.ASSESSMENT_TEST_LIST.valueObjectList = [];
		reqData.ASSESSMENT_TEST_LIST.valueObjectList.push(test);

		service.callService("saveAssessmentTest", reqData, "PATCH", "WRITE").then(function(result) {
			if(result && result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_ID && result.responseValueObjects.ASSESSMENT_ITEM_ID.idsList) {
    			var assessmentTestID = result.responseValueObjects.ASSESSMENT_ITEM_ID.idsList[0];
    			console.log("assessmentTestID:",assessmentTestID);
    			$scope.exam.media.mediaUrl.usageId = assessmentTestID;
    			$scope.exam.media.mediaUrl = JSON.stringify($scope.exam.media.mediaUrl);
    			
				var content = $scope.getContent($scope.exam.media);
				$scope.exam.metadata.difficultyLevel = $scope.exam.difficultyLevel.value;
				var references = [];
				if($scope.exam.binder && $scope.exam.binder.elements && $scope.exam.binder.elements.length > 0) {
					$scope.exam.binder.elements.forEach(function(item) {
						references.push(item.elementId);
					});
				}
				$http.get('/private/v1/lob/getExternalId/'+encodeURIComponent(service.removeFedoraPrefix($scope.exam.parentNode.id))).success(function(parentNode) {
					if(parentNode && parentNode.nodeId) {
						var req = {
							media : $scope.exam.media,
				            content: content,
				            metadata: $scope.exam.metadata,
				            references: references,
				            parentNodeId: parentNode.nodeId,
				            courseId: $rootScope.courseId
						};
						
						$http.post('/private/studio/learningactivity', req).success(function(data) {
			            	console.log("Save LearningActivity Response:", data);
			            	$rootScope.showConformationMessage('alert-success','Learning Activity saved successfully.');
			            	// $("#saveExamAlert").html("Learning Activity saved successfully.").removeClass("hide").addClass("alert-success");
							if(data.status == "SUCCESS") {
								$state.go('releaseExam', {laId : cbService.removeFedoraPrefix(data.learningActivityId), parentNodeId: cbService.removeFedoraPrefix($scope.exam.parentNode.id) });
							} else {
								$("#saveExam").html('Save').addClass("hide");
							}
							
				        });
					} else {
						$("#saveExamAlert").html("Parent doesn't exist.").removeClass("hide").addClass("alert-danger");
						$("#saveExam").html('Save').addClass("hide");
						console.log("Parent doesn't exist.");
					}
				});
    		}	
		});	
	}

	$scope.changeBinder = function($item, $model, $label) {
		var binderId = $model.identifier;
		console.log("binderId:", binderId);
	}

	$scope.release = function() {
		var testId = service.removeFedoraPrefix($scope.learningActivity.identifier);
		var testType = "";
		var concretePaper = "";
		if($scope.questionPaper.testType == "Exam") {
			testType = "exam";
			concretePaper = $scope.exam.concretePaper;
		} else if($scope.questionPaper.testType == "Practice") {
			testType = "practiceTest";
		}
		$state.go('postActivity', {type: testType, id: testId, locId: concretePaper});
	}

	$scope.backToTest = function(){
		if($scope.questionPaper.testType == "Exam") {
			$scope.listExams();
		} else if($scope.questionPaper.testType == "Practice") {
			$scope.listPracticeTests();
		}	
	}

	$rootScope.getLearningActivityEvents = function(){
		if($scope.learningActivity) {
			$http.get('/private/studio/learningactivity/events/' + encodeURIComponent($scope.learningActivity.identifier)).success(function(data) {
	            $rootScope.questionPaperEvents = data;
	        });	
		}
	}

	$scope.renderHtmlTrim = function(htmlCode, length) {
        var subtxt = htmlCode.substring(0,length);
        if (htmlCode.length > length) {
            subtxt = subtxt + '...';
        }
        var txt = $sce.trustAsHtml(subtxt);
        return txt;
    };

    $scope.showPreviewEvent = function(event){
    	$scope.previewEvent = true;
    	$scope.selectedEvent = event;
    	 if(event.invited.length > 0) {
            var reqParms = {"userIdsArray" : event.invited};
            $http.post('/private/v1/player/getEnvitedUserDetails/', {param : reqParms}).success(function(data) {
                console.log("data from view helper: " + JSON.stringify(data));
                $scope.userDetails = data;
                
            }).
            error(function(data, status, headers, config) {
                console.log("Status : " + status);
            });
        }
    }
	$scope.backToList = function(){
		$scope.previewEvent = false;
	}

	$scope.getDisplayName = function(usersList) {
        $scope.displayNameArray = [];
        if($scope.userDetails.length > 0) {
            usersList.forEach(function(identifier){
                $scope.userDetails.forEach(function(user){
                    if(user.identifier == identifier) {
                        $scope.displayNameArray.push(user.displayName);    
                    }
                });
            });
        }
       return $scope.displayNameArray;
    }

    $scope.getActonsDisplayName = function(actions) {
        if($scope.userDetails.length > 0) {
            actions.forEach(function(userAction){
                $scope.userDetails.forEach(function(user){
                    if(user.identifier == userAction.userId) {
                        userAction.name = user.displayName;    
                    }
                });
            });
        }
       return actions;
    }

    $scope.showEditLA = function() {
    	$scope.laEditable = !$scope.laEditable;
    	if($scope.laEditable) {
    		$scope.editLA = angular.copy($scope.learningActivity);
    		$("#writeIcon").removeClass('fa-edit').addClass('fa-close');
    	} else {
    		$("#writeIcon").addClass('fa-edit').removeClass('fa-close');
    	}
    }

    $scope.updateLA = function() {
    	if(!$scope.editLA.name) {
    		$("#updateLAErrAlert").html("Please enter Learning Activity name.").addClass("alert-danger").removeClass("hide");
    		setTimeout(function() {
    			$("#updateLAErrAlert").html("").removeClass("alert-danger").addClass("hide");
    		}, 5000);
    		return;
    	}
    	$http.post('/private/v1/learningactivity/update', {id: $scope.editLA.identifier, name: $scope.editLA.name, description: $scope.editLA.metadata.description }).success(function(result) {
    		if(result.status == "SUCCESS") {
    			$scope.learningActivity.name = angular.copy($scope.editLA.name);
		    	$scope.learningActivity.metadata.description = angular.copy($scope.editLA.metadata.description);
		    	$scope.laEditable = false;
		    	$("#writeIcon").addClass('fa-edit').removeClass('fa-close');
		    	$rootScope.showConformationMessage('alert-success','Learning Activity saved successfully.');	
    		} else {
    			$rootScope.showConformationMessage('alert-danger','Error while saving Learning Activity.');
    		}
    		
    	});
    	
    }

}]);

app.controller('listExamsCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state','$q', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $state, $q) {
	$('.tool').tooltip();
    $('.tool-tip').tooltip();
	console.log("$routeParams.testType:",$routeParams.testType);
	$scope.testType = $routeParams.testType || "Exam";
	if($scope.testType == "practice") {
		$scope.pageTitle = "Practice Exercises";
	} else {
		$scope.pageTitle = "Examinations";
	}

	$scope.currentPage = 1;
	$scope.tests = {
		count: 0,
		data: []
	};

	$scope.canWriteExam = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteExam = true;
        }
    });


	$scope.searchExams = function() {
		$http.post('/private/studio/searchTests', {"pageNumber": $scope.currentPage, "testType":$scope.testType, "courseId": $rootScope.courseId}).success(function(tests) {
			$scope.tests.count = tests.count;
			$scope.tests.data.push.apply($scope.tests.data, tests.data);
		});
	}

	$scope.showmore = function() {
		$scope.currentPage++;
		$scope.searchExams();
	}

	$scope.releaseExam = function(exam) {
        $state.go('releaseExam', {laId : cbService.removeFedoraPrefix(exam.identifier) });
    }

    $scope.createExamByType = function(type) {
    	if(!type) type = "";
    	$state.go('createExamByType', {questionPaperType: type.toLowerCase() });
    }

	$scope.searchExams();

}]);
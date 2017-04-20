app.controller('manageInterceptionPointCtrl',['$scope', '$http', '$timeout', '$rootScope', 'AssessmentService', '$stateParams', '$state', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', function($scope, $http, $timeout, $rootScope, service, $routeParams, $state, $location, cbService, $window, $compile, $sce) {

	$scope.learningresources = [];
	$rootScope.toc.modules.forEach(function(module) {
        module.disabled = true;
        module.label = '&nbsp;&nbsp;<span class="glyph20 icon icon-moduel"></span>&nbsp;' + module.name;
        $scope.learningresources.push(module);
        module.lessons.forEach(function(lesson) {
            lesson.disabled = true;
            lesson.label = '&nbsp;&nbsp;&emsp;<span class="glyph20 icon icon-lessons"></span>&nbsp;' + lesson.name;
            $scope.learningresources.push(lesson);
            lesson.lectures.forEach(function(lecture) {
                lecture.label = '&nbsp;&nbsp;&emsp;&emsp;<span class="glyph20 icon icon-reference"></span>&nbsp;' + lecture.name;
            	if(lecture.type == "learningresource") $scope.learningresources.push(lecture);
            });
        });
    });

    $scope.canWriteInterceptionPoint = false;

    service.getUserRole({}).then(function(response) {
        $scope.loggedUserRole = response.role;
        if ($scope.loggedUserRole == 'tutor' || $scope.loggedUserRole == 'faculty') {
            $scope.canWriteInterceptionPoint = true;
        }
    });

	$scope.workflowStep = 0;

    $scope.questionSearch = {
    	learningElements: service.getLearningElements(),
    	concepts:  {
			getFullList: function() {
                        if($scope.conceptsList && $scope.conceptsList.length > 0) {
                            return $scope.conceptsList;
                        } else { 
                            var conceptList = [];
                            for(var key in $rootScope.conceptTitleMap) {
                                if($rootScope.conceptTitleMap[key])
                                  conceptList.push({id: key, name: $rootScope.conceptTitleMap[key]});
                            }    
                            $scope.conceptsList = conceptList;
                            return conceptList;
                        }
			}
	    },
	    purpose: {
	    	data: service.getPurpose(),
	    	setSubPurpose: function(purpose) {
	    		if (purpose != null) {
		            $scope.questionSearch.subPurpose = purpose.subpurpose;
		        } else if (purpose == null) {
		             $scope.questionSearch.subPurpose = [];
		        }
		        $scope.questionSearchCriteria.subPurpose = [];
	    	}
	    },
	    subPurpose: [],
	    questionTypes: service.getQuestionTypes(),
	    questionSubTypes: service.getQuestionSubTypes(),
	    difficultyLevels: service.getDifficultyLevels(),
	    outcomes: []
    };

    $scope.questionSearchCriteria = {
    	learningElements: [],
    	concepts: [],
    	purpose: '',
    	subPurpose: [],
    	questionType: '',
    	questionSubType: [],
    	difficultyLevel: [],
    	outcome: [],
    }

    $scope.interception = {
    	name: "",
    	point: 0,
    	numAttempts: 10,
    	numQuestions: 0,
    	questions: [],
    	questionIds: [],
    	addQuestion: function(question) {
    		this.questions.push(question);
    		this.questionIds.push(question.identifier);
    	},
    	removeQuestion: function(question) {
    		this.questionIds.splice(this.questionIds.indexOf(question.identifier), 1);
    		this.questions.splice(this.questions.indexOf(question), 1);
    	}
    }

    $http.get('/private/v1/course/getOutcomes/'+encodeURIComponent(service.addFedoraPrefix($rootScope.courseId)))
	    .success(function(outcomes){
	        $scope.courseOutcomes = [];
	        var i = 1;
	        outcomes.forEach(function(item) {
	            $scope.questionSearch.outcomes.push({id: i++, name: item});
	        });
	    });

    $scope.questions = {
    	count: 0,
    	data: [],
    	show: false
    }
    $scope.tocKeyName = service.getTOCKeyNames();

    $scope.setQuestionSearchCriteria = function(lobId) {
    	var selectedLob = $scope.questionSearch.learningElements.filter(function(item) {
    		return item.id == lobId;
    	});
    	$scope.questionSearchCriteria.learningElements = [];
    	$scope.questionSearchCriteria.learningElements.push.apply($scope.questionSearchCriteria.learningElements, selectedLob);
    	if($scope.concepts && $scope.concepts.length > 0) {
    		var concepts = [];
    		$scope.concepts.forEach(function(item) {
    			concepts.push(item.identifier);
    		});
    		
    		var selectedConcepts = $scope.questionSearch.concepts.getFullList().filter(function(item) {
    			return concepts.indexOf(item.id) > -1; 
    		});
    		console.log("selectedConcepts:",selectedConcepts);
    		$scope.questionSearchCriteria.concepts = [];
    		$scope.questionSearchCriteria.concepts.push.apply($scope.questionSearchCriteria.concepts, selectedConcepts);
    	}

    }

    $scope.changeLearningResource = function(selectedLR) {
    	var lobId = selectedLR.id;
    	$http.get('/private/v1/player/playLob/' + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(lobId)).success(function(element) {
        	$scope.media = element.element.media;
        	$scope.contentId = element.element.contentIdentifier;
        	$scope.concepts = element.element.concepts;
        	$scope.setQuestionSearchCriteria(lobId);
        	if(element.element.media.mediaType == 'video') {
        		$scope.isVideo = true;
        	} else {
        		$scope.isVideo = false;
        	}
        	playVideoForInterception(element.element.media, $http, $scope, $compile);
        	$scope.showVideo = true;
      	});
    }

    $scope.createInterception = function() {
    	$scope.interception.point = Math.round($("#currentTime").val());
    	console.log("currentTime:", $scope.interception.point);
    	if($scope.interception.point > 0) {
    		$scope.workflowStep = 1;	
    	} else {
    		$("#intPointAlert").html("Please Enter interception point.").removeClass("hide");
    		setTimeout(function() {
    			$("#intPointAlert").html("").addClass("hide");
    		},5000)
    	}
    }

    $scope.clearSearch = function() {
    	$scope.questions = {
	    	count: 0,
	    	data: [],
	    	show: false
	    };
	    $scope.interception.questions = [];
	    $scope.interception.questionsIds = [];
		$scope.setQuestionSearchCriteria($scope.selectedLR.id);
    }

    $scope.searchQuestions = function() {
        $('#searchQuestions').html('Searching...').attr('disabled', true);
        $scope.questions.show = true;
        
        $scope.questions.data = [];
        $scope.questions.count = 0;

        var req = new Object();
        req.SEARCH_CRITERIA = {"offset": 0, "limit": 100};
        $scope.searchFilters = getQuestionSearchFilters($scope, $rootScope, service);
        $scope.searchFilters.push({"name": "courseId", "operator": "eq", "value": $rootScope.courseId});
        req.SEARCH_CRITERIA.filters = $scope.searchFilters;
        console.log("request:",JSON.stringify(req));

        service.callService("searchAssessmentItems", req, "PATCH", "READ").then(function(result) {
            console.log("service result:",JSON.stringify(result));
            if(result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_LIST && result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList)
                $scope.questions.data = result.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList;            
        });

        service.callService("countAssessmentItems", req, "PATCH", "READ").then(function(result) {
            $('#searchQuestions').html('Search').attr('disabled', false);
            console.log("service result:",JSON.stringify(result));
            if(result.responseValueObjects && result.responseValueObjects.COUNT && result.responseValueObjects.COUNT.id) {
                $scope.questions.count = result.responseValueObjects.COUNT.id;
            } else {
                $scope.questions.count = 0;
            }
        });
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

    $scope.previewIntraction =function() {
    	$scope.workflowStep = 2;
    	$scope.interception.name = $scope.media.title;
        $scope.interception.numQuestions = $scope.interception.questionIds.length;
    }

    $scope.getContent = function(media) {
    	return {
        metadata: {
	            deleteStatus: "",
	            node_type: "NODE",
	            setType: "content",
	            category: "Interception",
	            isMandatory: "",
	            extendedMaterial: false,
	            shortDescription: "",
	            synopsis: "",
	            description: media.description,
	            language: "EN",
	            duration: "",
	            learningTime: 1200,
	            elementType: media.elementType,
	            instructionUsage: "",
	            contentType: "learningactivity",
	            contentSubType: "quiz",
	            descriptionVerified: false,
	            media: [media],
	            isNew: true
	        },
	        learningTime: 0,
	        contentSubType: "quiz",
	        contentType: "learningactivity",
	        pedagogyId: "",
	        description: media.description,
	        name: "",
	        interceptions: [],
	        mediaConcepts: [],
	        concepts: [],
	        subtitles: [],
	        transcripts: [],
	        categories: ["Interception"],
	        media: [media],
	        order: 0,
	        linkedCourses: [],
	        is_deleted: false
	    };
    }

    $scope.isInterceptionValid = function() {
    	var isValid = true;
    	if($scope.interception.name.length > 0) { isValid = true; } else { isValid =  false; }
    	if($scope.interception.numAttempts > 0) { isValid = true; } else { isValid =  false; }
    	if($scope.interception.numQuestions > 0) { isValid = true; } else { isValid =  false; }
    	return isValid;
    }

    $scope.saveInterception = function() {
    	$("#saveInterception").html("Saving....").attr("disabled", true);
    	if(!$scope.isInterceptionValid()) {
    		$("#saveIntErrorAlert").removeClass("hide");
    		$("#saveInterception").html("Save").attr("disabled", false);
    		setTimeout(function() {
    			$("#saveIntErrorAlert").addClass("hide");
    		},5000);
    		return;
    	}
    	var test = {};
		test.numAttempts = parseInt($scope.interception.numAttempts);
		test.numQuestions = parseInt($scope.interception.numQuestions);
		var map = new Object();
		$scope.interception.questionIds.forEach(function(questionId) {
			map[questionId] = questionId;
		});
		test.assessmentItemsMap = map;
		test.courseId = $rootScope.courseId;

		var reqData = {};
		reqData.ASSESSMENT_TEST_LIST = {};
		reqData.ASSESSMENT_TEST_LIST.valueObjectList = [];
		reqData.ASSESSMENT_TEST_LIST.valueObjectList.push(test);

		console.log("saveAssessmentTest request: ", JSON.stringify(reqData));
    	service.callService("saveAssessmentTest", reqData, "PATCH", "WRITE").then(function(result) {
    		console.log("saveAssessmentTest response: ", JSON.stringify(result));
    		if(result && result.responseValueObjects && result.responseValueObjects.ASSESSMENT_ITEM_ID && result.responseValueObjects.ASSESSMENT_ITEM_ID.idsList) {
    			var assessmentTestID = result.responseValueObjects.ASSESSMENT_ITEM_ID.idsList[0];
    			console.log("assessmentTestID:",assessmentTestID);
    			var media = {};
				media.title = $scope.interception.name;
				media.description = media.title;
				media.mediaUrl = JSON.stringify({"usageId":assessmentTestID, "numAttempts": $scope.interception.numAttempts});
				media.mimeType = "ilimi/test";
		        media.mediaType = "test";
		        media.isMain = true
				var content = $scope.getContent(media);
				var req = {
							media : media,
				            content: content,
				            mediaId: $scope.media.mediaId,
				            contentId: $scope.contentId,
							point: $scope.interception.point
						};
				console.log("Content Save Request:", req);
				$http.post('/private/studio/interception', req).success(function(result) {
					console.log("result:", result);
                    // $("#saveIntAlert").html("Interception Saved successfully.").addClass("alert-success").removeClass("hide");
					$("#saveInterception").html("Save").attr("disabled", false);
					if(result && result.interception) {
                        $rootScope.showConformationMessage('alert-success','Interception saved successfully.');
						var interception = result.interception;
						interception.contentId = service.removeFedoraPrefix(interception.contentId);
						if(!$scope.media.interceptions) $scope.media.interceptions = [];
                        $scope.media.interceptions.push(interception);
						$scope.workflowStep = 0;
						$scope.setQuestionSearchCriteria($scope.selectedLR.id);
					}
					/*setTimeout(function() {
						$("#saveIntAlert").html("").removeClass("alert-success").addClass("hide");
					}, 5000);*/
				});
    		} else {
    			console.log("Error while Saving Assessment Test.");
    			$("#saveIntAlert").html("Error while Saving Assessment Test.").addClass("alert-danger").removeClass("hide");
    			$("#saveInterception").html("Save").attr("disabled", true);
    		}
    	});
    }

    $scope.deleteInterception = function(interception) {
    	$scope.media.interceptions.splice($scope.media.interceptions.indexOf(interception), 1);
    	$http.post('/private/studio/interception/delete',{'contentId': $scope.contentId, 'interceptionId': service.addFedoraPrefix(interception.contentId)}).success(function(result) {

    	});
    }

    $scope.getDataForQuestionPreview = function(assessmentItemId, divId){
        previewQuestion(assessmentItemId, divId);
    }
    
}]);

var InterceptionPlayer = {
    aspectRatio: 9 / 16,
    element: null,
    mediaType: '',
    mimeType: '',
    videoPlayer: null,
    scope: null,
    resizeMediaPlayer: function() {
        switch(InterceptionPlayer.mediaType) {
            case 'video':
                if(!InterceptionPlayer.videoPlayer) {
                    setTimeout(function() { InterceptionPlayer.resizeMediaPlayer(); }, 500);
                    return;
                }
                if(InterceptionPlayer.scope.showInterception) {
                    return;
                }
                if(!document.getElementById(InterceptionPlayer.videoPlayer.id())) {
                    return;
                }
                var width = "755px";
                InterceptionPlayer.videoPlayer.width(width).height((width * InterceptionPlayer.aspectRatio));
                break;
            default:
                break;
        }
    }
}


var videoHTML = '<video id="lesson_video" class="video-js vjs-default-skin" controls preload="auto"></video>';

function playVideoForInterception(element, $http, $scope, $compile) {
	angular.element('#primaryContentDiv').html("");
	var mediaType = element.mediaType;
    var mimeType = element.mimeType;
    InterceptionPlayer.mediaType = mediaType;
    InterceptionPlayer.mimeType = mimeType;
    InterceptionPlayer.element = element;
    InterceptionPlayer.scope = $scope;
    if (mediaType == 'video') {
    	var videoId = 'lesson_video';
		var url = element.mediaUrl;
	    try {
	        var player = videojs(videoId);
	        player.dispose();
	    } catch (e) {}
	    var interceptions = element.interceptions;
		var el = angular.element(videoHTML);
		compiled = $compile(el);
		angular.element('#primaryContentDiv').html(el);
		compiled($scope);
	    if (mimeType.indexOf('youtube') >= 0) {
	        videojs(videoId, {
              "techOrder": ["youtube"],
              "sources": [{"type": "video/youtube", "src": url, "youtube": false}]
            }).ready(function() {
	            var isVideoComplete = false;
	            var startTimestamp = (new Date()).getTime();
	            InterceptionPlayer.videoPlayer = this;
	            InterceptionPlayer.resizeMediaPlayer();
	            // var markerTimes = [];
	            // var markerTexts = []; 
                var markers = []; 
	            if (element.contentType == 'lecture' && interceptions && interceptions.length > 0) {
	                this.cuepoints();
	                for (var i = 0; i < interceptions.length; i++) {
	                    var interception = interceptions[i];
	                    var marker = {
                            time: parseInt(interception.interceptionPoint),
                            text: interception.name
                        };
                        markers.push(marker);
	                    addVideoInterception(interception, this, $scope, $http);
	                }
	            }

	            if(markers.length > 0) {
	                this.markers({
	                    markerStyle: {
                            'width': '3px',
                            'background-color': 'red'
                        },
                        markers: markers
	                    //set break time
	                    // marker_breaks: markerTimes,
	                    // marker_text: markerTexts
	                });
	            }
	            this.on('ended', function() {
	                
	            });
	            this.on('play', function() {
	            	
	            });
	            this.on('fullscreenchange', function() {
	                if(this.isFullScreen()) {
	                    $('.vjs-control-bar').css('bottom','0px');
	                } else {
	                    $('.vjs-control-bar').css('bottom','-33px');
	                }
	            });
	            this.on('timeupdate', function() {
	            	$("#currentTime").val(Math.round(this.currentTime()));
	            });
	            
	        });
	    } else {
	        InterceptionPlayer.videoPlayer = videojs(videoId).src({
	            type: mimeType,
	            src: url
	        });
			var width = "755px";
            InterceptionPlayer.videoPlayer.width(width).height((width * InterceptionPlayer.aspectRatio));
	    }
    } else {
    	var el = angular.element('<div class="alert alert-info fade in" role="alert" style="margin: 15px;"><p>Selected element is not a video.</p></div>');
    	angular.element('#primaryContentDiv').html(el);
    }	
}

function getQuestionSearchFilters($scope, $rootScope, service) {
    var filters = [];

    if($scope.questionSearchCriteria.learningElements && $scope.questionSearchCriteria.learningElements.length > 0) {
        var learningElements = [];
        $scope.questionSearchCriteria.learningElements.forEach(function(item) {
            learningElements.push(service.addFedoraPrefix(item.id));
        });
        if(learningElements.indexOf($rootScope.courseId) == -1) {
            filters.push({"name": "learningElement", "operator": "in", "valueList": learningElements});
        }
    }

    if($scope.questionSearchCriteria.concepts && $scope.questionSearchCriteria.concepts.length > 0) {
        var conceptItems = [];
        $scope.questionSearchCriteria.concepts.forEach(function(item) {
            conceptItems.push(item.name);
        });
        filters.push({"name":"concept", "operator":"in", "valueList": conceptItems});
    }

    if($scope.questionSearchCriteria.difficultyLevel.length > 0 ) {
        var items = [];
        $scope.questionSearchCriteria.difficultyLevel.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"difficultyLevel", "operator":"in", "valueList": items});
    }

    if($scope.questionSearchCriteria.purpose) filters.push({"name":"purpose", "operator":"eq", "value": $scope.questionSearchCriteria.purpose.name});
    if($scope.questionSearchCriteria.subPurpose && $scope.questionSearchCriteria.subPurpose.length > 0) {
        var items = [];
        $scope.questionSearchCriteria.subPurpose.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"subPurpose", "operator":"in", "valueList": items});
    }

    if($scope.questionSearchCriteria.questionType) filters.push({"name":"questionType", "operator":"eq", "value": $scope.questionSearchCriteria.questionType.name});
    
    if($scope.questionSearchCriteria.questionSubType && $scope.questionSearchCriteria.questionSubType.length > 0) {
        var items = [];
        $scope.questionSearchCriteria.questionSubType.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"questionSubtype", "operator":"in", "valueList": items});
    }

    if($scope.questionSearchCriteria.outcome && $scope.questionSearchCriteria.outcome.length > 0) {
        var items = [];
        $scope.questionSearchCriteria.outcome.forEach(function(item) {
            items.push(item.name);
        });
        filters.push({"name":"learningGoal", "operator":"in", "valueList": items});
    }
    return filters;
}
	playerRenderer = new PlayerRenderer();
	assessmentItemManager = new AssessmentItemManager();
	pluginLoader = new PluginLoader();

	function playAssesment(assessmentId) {

	    /**
	     * Initalize objects.
	     */
	    assessmentMgr = new AssessmentManager(assessmentId);

	    /**
	     * Initialize global variables.
	     */
	    assessmentMgr.init();

	    /**
	     * Load assessment plugin, fetch data and parse.
	     */
	    assessmentSectionObj = assessmentMgr.getAssessment('assessment-test', assessmentUrl, assessmentId);

	    /**
	     * Check current attempt. validate if the attempt is allowed or not.
	     */
	    assessmentMgr.checkAttempt();

	    /**
	     * Set assessment title and total number of questions
	     */
	    playerRenderer.renderAssessmentMetadata();

	    /**
	     *Assessment Item that is currently processed
	     */
	    currentAssmntItem = '';

	    /**
	     * Render the first item of the test
	     */
	    assessmentItemManager.processItem(0);

	    /**
	     * Render countdown timer
	     */
	    playerRenderer.renderTimer(assessmentSectionObj.duration);

	    /**
	     * Render Navigation buttons
	     */
	    playerRenderer.renderNavigationButtons();



	};

	/**
	 * Handles assessment items
	 */
	function AssessmentItemManager() {


	    this.getAssessmentItems = function(assessmentItemUrl, resultObj) {
	        var assessmentItemsData = loadDataPerc(assessmentItemUrl, resultObj, "PATCH");
	        return assessmentItemsData;
	    }

	    /**
	     * Fetches the Item based on the URL. parses the returned data,
	     * identifies type of the item,returns parsed item data.
	     *
	     *  Returns an object containing assessment data and item type
	     *  Keys of the array are:assessmentItemData, assessmentItemType
	     *
	     */
	    this.getAssessmentItem = function(assessmentItemUrl, resultObj) {

	        var assessmentItemData = loadDataPerc(assessmentItemUrl, resultObj, "PATCH");
	        if (assessmentItemData == ASSESSMENT_TECHNICAL_ERROR || assessmentItemData.length <= 4) {
	            assessmentItemData = assessmentItemData.length <= 4 ? commonErrorArray[assessmentItemData] : assessmentItemData;
	            playerRenderer.showPlayerError(this.assessmentItemData, 4);
	        }

	        var parsedItemData = this.parseItemData(assessmentItemData);

	        var itemType = this.getItemType(assessmentItemData);
	        var assessmentItem = {
	            assessmentItemData: parsedItemData,
	            assessmentItemType: itemType
	        };

	        return assessmentItem;
	    };

	    /**
	     * Parses the JSON of Item. Returns the QTI standard XML representation of item.
	     *
	     * @return QTI Item XML
	     */
	    this.parseItemData = function(data) {
	        //try

	        {
	            // var parsedJson = JSON.parse(data);
	            var parsedJson = data;
	            return parsedJson.responseValueObjects.ASSESSMENT_ITEM_DATA.id;
	        }
	        /*catch(error){
			playerRenderer.showPlayerError(ASSESSMENT_TECHNICAL_ERROR,2);
			//exit();
		}*/
	    };

	    /**
	     * Returns the Item type based on the XML parsed data passed to it.
	     * Checks 'Interaction' type xml element fo find the item type.
	     * Note: If an Item has two intercation types then it returns first type.
	     *
	     * @return Type of Item.
	     */
	    this.getItemType = function(itemData) {
	        return itemData.responseValueObjects.QUESTION_SUBTYPE.id;
	    };

	    /**
	     * Reads assessment item, renders the items based on fresh or previous answers.
	     */
	    this.processItem = function(questionIndex) {

	        /*var playerTop = $('.quizTemplateParent').offset().top-10;

		$('html, body').animate({
	        scrollTop: 0
	    }, 1000);*/

	        //$('html,body').scrollTop(playerTop-100);

	        var currentQuestionNo = (questionIndex + 1);
	        var questionUrl = assessmentSectionObj.assessmentSection[questionIndex].identifier;
	        var assessmentItemId = questionUrl;
	        // alert(JSON.stringify(assessmentSectionObj));
	        questionUrl = assessmentsConfig.assessmentBasePercUrl + "deliverNextAssessmentItem?ASSESSMENT_ITEM_ID=" + questionUrl + "&ASSESSMENT_ID=" + assessmentSectionObj.assessmentId;
	        var responseObj = {};
	        if (resultObj.ans) {
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP = {};
	            if (resultObj.ans instanceof Array) {
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans = resultObj.ans;
	            } else {
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans = [];
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans.push(resultObj.ans);
	            }
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP.responseType = resultObj.btnFlag;
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP.questionURL = resultObj.answeredQuestionIdentifier;
	        }

	        // Fetch assessment item metadata and item type
	        var assessmentItem = assessmentItemManager.getAssessmentItem(questionUrl, responseObj);
	        var assessmentItemData = assessmentItem.assessmentItemData;
	        currentAssmntItem = assessmentItemData;
	        var questionType = assessmentItem.assessmentItemType;
	        var itemOutput = assessmentMgr.renderAssessment(questionType, assessmentItemData, assessmentSectionObj.assessmentId, assessmentItemId, assessmentSectionObj.currentAttempt);

	        // Put Item types in global array. This is done to avoid repetative identification item type
	        itemTypeMap[currentQuestionNo] = questionType;

	        if (questionIndex >= playerObj.questionsCrossed) playerObj.questionsCrossed = questionIndex;

	        playerRenderer.renderQuestionNavigator(playerObj.questionsCrossed);

	        $('#player').html(itemOutput);
	        $('#currentQuestionNo').html(currentQuestionNo);
	        $('#currentJumptoIndex').html(currentQuestionNo);

	        $('#player').find('*').removeAttr("style").remove("br");

	        this.renderButtonsForItem(questionType);

	        var itemType = itemTypeMap[currentQuestionNo];
	        resultObj.interactionType = itemType;
	        var plugin = pluginLoader.loadPlugin(itemType);
	        //	console.log("PLUGIN *****"+plugin);
	        plugin.renderWithAnswers(questionIndex);
	    };

	    /**
	     * Renders the buttons based on present item
	     */
	    this.renderButtonsForItem = function(qType) {

	        var totalQuestionNo = parseInt($('#totalQuestionNo').html());
	        var currentQuestionNo = parseInt($('#currentQuestionNo').html());
	        var currentQuestionIndex = (currentQuestionNo) - 1;
	        // if(qType == 'PROGRAM_IN_IDE' || qType == 'Logical programming' || qType == 'Program in IDE')
	        // 	$('#ideBtn').css('display','block');
	        // else
	        // 	$('#ideBtn').css('display','none');
	        if ($.inArray(currentQuestionIndex, visitedQuestionArray) == -1) {
	            $('.visited button').css('display', 'none');
	            //First Question
	            if (currentQuestionNo == 1 && currentQuestionNo != totalQuestionNo) {
	                $('#preBtn').css('display', 'none');
	            }
	            //Final Question
	            else if (currentQuestionNo == totalQuestionNo && currentQuestionNo != 1) {
	                $('.unVisited button').css('display', 'block');
	                $('#nextBtn,#skipBtn').css('display', 'none');
	                $('#ideBtn').css('display', 'block');

	            }
	            //Quiz has only one question
	            else if (currentQuestionNo == 1 && currentQuestionNo == totalQuestionNo) {
	                $('.unVisited button').css('display', 'none');

	                // $('#ideBtn').css('display','none');
	                $('.finishNav').css('display', 'block');
	            }
	            //Not a first and not a last question
	            else {
	                $('.unVisited button').not('.finishNav').css('display', 'block');
	            }

	            qType = qType.toUpperCase();
	            if (qType == 'PROGRAM_IN_IDE' || qType == 'LOGICAL PROGRAMMING' || qType == 'PROGRAM IN IDE')
	                $('#ideBtn').css('display', 'block');
	            else
	                $('#ideBtn').css('display', 'none');

	            $('#question-navigation-container').css('display', 'block');
	        } else {
	            $('#showQuestionIndex').popover('hide');
	            $('.visited button').css('display', 'block');
	            $('.unVisited button,#question-navigation-container').css('display', 'none');
	            $('#assessment-messgeges-Container').css('display', 'none');
	        }
	    };
	};

	/**
	 * Class contains methods for rendering player's elemnts.
	 */
	function PlayerRenderer() {

	    /**
	     * Set assessment title and total number of questions
	     */
	    this.renderAssessmentMetadata = function() {
	        $('#assessment-title').html(assessmentSectionObj.quizTitle);
	        $('#totalQuestionNo').html(assessmentSectionObj.totalQuestions);
	    };

	    /**
	     * Renders links questions attempted so far.
	     */
	    this.renderQuestionNavigator = function(questionsAttempted) {

	        for (var index = 0; index <= questionsAttempted; index++) {
	            if (index == 0) {
	                $('#question-navigation-list').html('<li id="question-navigation_' + index + '" class="question-navigation" onclick="assessmentMgr.navigateToAssessmentItem(' + index + ');"><a href="#">' + (index + 1) + '</a></li>');
	            } else {
	                $('#question-navigation-list').append('<li id="question-navigation_' + index + '" class="question-navigation" onclick="assessmentMgr.navigateToAssessmentItem(' + index + ');"><a href="#">' + (index + 1) + '</a></li>');
	            };
	        }
	        // Skipped questions to be highlighted
	        for (var s = 0; s < skippedQuestionArray.length; s++) {
	            //$('#question-navigation_'+skippedQuestionArray[s]+'> a').css({'color':'#DDBB13','font-weight':'bold'}).attr({'title':'skipped'});					
	            $('#question-navigation_' + skippedQuestionArray[s] + '> a').addClass('skippedQindex').attr({
	                'title': 'skipped'
	            });
	        };
	    };

	    /**
	     * Render countdown Timer
	     */
	    this.renderTimer = function(durationInSeconds) {
	        if (durationInSeconds > 0) {
	            countdown(durationInSeconds);
	        } else {
	            $('#quizTimer').css('display', 'none');
	        }
	    };

	    /**
	     * Show error messages based on severity
	     */
	    this.showPlayerError = function(playerErrorMess, errType) {

	        $('#assessment-messgeges-Container').fadeOut('fast').fadeIn('slow');
	        $('#message-wrapper').html(playerErrorMess);

	        switch (errType) {
	            case 1:
	                $('#assessment-messgeges').addClass('alert-info');
	                break;
	            case 2:
	                $('#assessment-messgeges').removeClass('alert-skip').removeClass('alert-info').addClass('alert-error');
	                break;
	            case 3:
	                $('#assessment-messgeges').removeClass('alert-error').removeClass('alert-info').addClass('alert-skip');
	                break;
	            case 4:
	                $('#assessment-messgeges').removeClass('alert-skip').removeClass('alert-info').addClass('alert-error');
	                $('#assessment-metadata-container').fadeOut('fast');
	                $('#question-navigation-container').fadeOut('fast');
	                $('#assessment-player-navigation').fadeOut('fast');
	                exit();
	                break;
	        };
	    };

	    /**
	     * Render navigation buttons
	     */
	    this.renderNavigationButtons = function() {
	        $('.navButton').click(function() {
	            var currentQuestionNo = parseInt($('#currentQuestionNo').html());
	            var currentQuestionIndex = (currentQuestionNo) - 1;
	            var lsLastQIndex = "";
	            if (localStorage.getItem('lastQuestionIndex')) {
	                lsLastQIndex = parseInt(localStorage.getItem('lastQuestionIndex'));
	            }

	            var navId = this.id;
	            var currentQuestionUserAnswerId = "";
	            //Preparing the answer based on Interaction type

	            var answeredQuestionUrl = assessmentSectionObj.assessmentSection[currentQuestionIndex].url;
	            var answeredQuestionIdentifier = assessmentSectionObj.assessmentSection[currentQuestionIndex].identifier;
	            var itemType = itemTypeMap[currentQuestionNo];
	            resultObj.interactionType = itemType;
	            var plugin = pluginLoader.loadPlugin(itemType);
	            var userAnswer = plugin.prepareResponse();
	            currentQuestionUserAnswerId = userAnswer;
	            currentQuestionUserAnswerId = currentQuestionUserAnswerId != undefined ? currentQuestionUserAnswerId : '';
	            resultObj.ans = currentQuestionUserAnswerId;
	            resultObj.answeredQuestionUrl = answeredQuestionUrl;
	            resultObj.answeredQuestionIdentifier = answeredQuestionIdentifier;

	            commonNextAction = function() {
	                visitedQuestionArray[currentQuestionIndex] = currentQuestionIndex;
	                var itemType = itemTypeMap[currentQuestionNo];
	                var plugin = pluginLoader.loadPlugin(itemType);
	                var validationResult = plugin.validateResponse(currentQuestionUserAnswerId);
	                if (validationResult.status) {
	                    localStorage.setItem('userSelectedAnswerId_' + currentQuestionIndex, currentQuestionUserAnswerId);
	                } else {
	                    playerRenderer.showPlayerError(validationResult.message, 2);
	                    exit();
	                }
	                $('#assessment-messgeges-Container').css('display', 'none');
	            };

	            commonSkipAction = function() {
	                playerRenderer.showPlayerError(LAST_SKIPPED_QUESTION_MESSAGE, 3);
	            };
	            // $('#ideBtn').hide();
	            if (navId == 'ideBtn') {
	                var assesmntItemId = assessmentSectionObj.assessmentSection[currentQuestionIndex].identifier;
	                var currentItem = JSON.parse(currentAssmntItem);
	                var url = "https://" + document.location.host + "/private/v1/player/getUserInfo/";
	                $.ajax({
	                    url: url,
	                    type: "GET",
	                    async: false,
	                    success: function(data) {
	                    	var role = data.userRoles[0];
	                    	if(role == "tutor") role = "faculty";
	                        var url_ide = assessmentsConfig.programmingEnvironmentBaseUrl + "?repourl=" + currentItem.repoURL +
	                            "&uname=" + data.identifier + "&REMOTE_USER=" + data.identifier + "&assessmentId=" + assessmentSectionObj.assessmentId +
	                           	"&assessmentItemId=" + assesmntItemId + "&userrole=" + role + "&ud=" + data.displayName + "&ui="+data.image +
	                            "&attemptNum=" + assessmentSectionObj.currentAttempt + "&stack="+assessmentsConfig.programmingStack+"&action=launchAssessmentItemIDE&tag=" 
	                            + currentItem.repoTag;
	                        addAssessmentLogStream('Launch:IDE');
	                        window.open(url_ide);
	                    },
	                    error: function(xhr, ajaxOptions, thrownError) {}
	                });
	            } else if (navId == 'nextBtn') {
	                hidePrevNextButtons();
	                addAssessmentLogStream('Next');
	                commonNextAction();
	                targetQuestionIndex = currentQuestionIndex + 1;
	                resultObj.btnFlag = 1;
	            } else if (navId == 'preBtn') {
	                addAssessmentLogStream('Previous');
	                localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
	                targetQuestionIndex = currentQuestionIndex - 1;
	                resultObj.btnFlag = 2;
	            } else if (navId == 'skipBtn') {
	                hidePrevNextButtons();
	                addAssessmentLogStream('Skip');
	                localStorage.removeItem('userSelectedAnswerId_' + currentQuestionIndex);
	                visitedQuestionArray[currentQuestionIndex] = currentQuestionIndex;
	                skippedQuestionArray[currentQuestionIndex] = currentQuestionIndex;
	                commonSkipAction();
	                targetQuestionIndex = currentQuestionIndex + 1;
	                resultObj.btnFlag = 3;
	            } else if (navId == 'finishBtn') {
	                addAssessmentLogStream('Submit');
	                commonNextAction();
	                resultObj.btnFlag = 4;
	                $('#pauseTimer').html('pause');
	                assessmentMgr.finishAssessment();
	                showPrevNextButtons();
	                exit();
	            } else if (navId == 'skipFinishBtn') {
	                addAssessmentLogStream('Skip');
	                localStorage.removeItem('userSelectedAnswerId_' + currentQuestionIndex);
	                resultObj.btnFlag = 5;
	                $('#pauseTimer').html('pause');
	                assessmentMgr.finishAssessment();
	                showPrevNextButtons();
	                exit();
	            } else if (navId == 'visitedUpdate') {
	                commonNextAction();
	                skippedQuestionArray.splice(currentQuestionIndex, 1);
	                targetQuestionIndex = lsLastQIndex;
	                resultObj.btnFlag = 6;
	            } else if (navId == 'visitedSkip') {
	                localStorage.removeItem('userSelectedAnswerId_' + currentQuestionIndex);
	                skippedQuestionArray[currentQuestionIndex] = currentQuestionIndex;
	                commonSkipAction();
	                targetQuestionIndex = lsLastQIndex;
	                resultObj.btnFlag = 7;
	            } else {
	                alert('Error - No targetQuestionIndex');
	                exit();
	            }
	            if (navId != 'ideBtn')
	                assessmentItemManager.processItem(targetQuestionIndex);
	            // $('#ideBtn').hide();
	        });
	    };

	}

	function hidePrevNextButtons() {
	    $('#navPrevLectureLink').hide();
	    $('#navNextLectureLink').hide();
	}

	function showPrevNextButtons() {
	    $('#navPrevLectureLink').show();
	    $('#navNextLectureLink').show();
	}

	var logStreamAssessmentId;

	function addAssessmentLogStream(action, objectId) {
	    if (objectId) {
	        logStreamAssessmentId = objectId;
	    } else {
	        objectId = logStreamAssessmentId;
	    }
	    var assessmentEvent = getAssessmentEvent(action, objectId);
	    addLogStreamEvent(assessmentEvent);
	}

	function getAssessmentEvent(action, objectId) {
	    var uiEvent = {};
	    uiEvent.timestamp = (new Date()).getTime();
	    uiEvent.environment = 'Assessments';
	    uiEvent.objectId = objectId;
	    uiEvent.action = action;
	    uiEvent.external = false;
	    uiEvent.uiEvent = true;
	    if ($('#courseId')) {
	        var courseId = $('#courseId').val();
	        if (courseId) {
	            uiEvent.courseId = courseId;
	        }
	    }
	    return uiEvent;
	}


	/**
	 * Manages the assessment
	 *
	 */
	function AssessmentManager() {

	    /**
	     * Assessment Raw data
	     */
	    this.assessmentData = "",

	        /**
	         * Assessment parsed data
	         */
	        this.assessmentParsedData = "",

	        this.init = function() {
	            assessmentUrl = assessmentsConfig.assessmentBasePercUrl + ASSESSMENT_TEST_PERC_API_URL;
	            resultObj = new Object();
	            playerObj = {};
	            playerObj.questionsCrossed = 0;
	            visitedQuestionArray = [];
	            skippedQuestionArray = [];
	            skippedArrayIndex = 0;
	            localStorage.clear();
	            localStorage.setItem('baseUrl', assessmentsConfig.assessmentBasePercUrl);
	            itemTypeMap = new Array();
	        };

	    /**
	     * Loads the assessment test plugin, calls plugin methids to load and parse data.
	     *
	     * Returns the parsed assessment test data.
	     */
	    this.getAssessment = function(assessmentType, assessmentUrl, assessmentId) {

	        this.assessmentData = loadDataPerc(assessmentUrl + "?ASSESSMENT_ID=" + assessmentId, "", "PATCH");
	        if (this.assessmentData == ASSESSMENT_TECHNICAL_ERROR || this.assessmentData.length <= 4) {
	            this.assessmentData = assessmentData.length <= 4 ? commonErrorArray[assessmentData] : this.assessmentData;
	            playerRenderer.showPlayerError(this.assessmentData, 4);
	        }

	        this.assessmentType = assessmentType;

	        var assessmentTestPlugin = pluginLoader.loadPlugin(this.assessmentType);
	        if (typeof(assessmentTestPlugin) == 'object') {
	            this.assessmentParsedData = assessmentTestPlugin.parsedata(this.assessmentData);
	        } else {
	            playerRenderer.showPlayerError("Plugin with the name:" + this.assessmentType + " not found", 4);
	        }
	        return this.assessmentParsedData;
	    };

	    /**
	     * Checks the current attempt and total number of attempts.
	     */
	    this.checkAttempt = function() {
	        if (this.assessmentParsedData == "") {
	            playerRenderer.showPlayerError(ASSESSMENT_ATTEMPT_TECH_ERROR, 4);
	        }

	        var currentAttempt = this.assessmentParsedData.currentAttempt;
	        var totalAttempts = this.assessmentParsedData.maxAttempts;

	        if (currentAttempt == "" || totalAttempts == "") {
	            playerRenderer.showPlayerError(ASSESSMENT_ATTEMPT_TECH_ERROR, 4);
	        } else if (currentAttempt > totalAttempts) {
	            var attemptErrMess = 'This assessment  is configured for maximum of ' + totalAttempts + ' Attempts.You have completed ' + totalAttempts + ' attempts.';
	            playerRenderer.showPlayerError(attemptErrMess, 4);
	        }
	        var attemptMess = 'Attempt ' + currentAttempt + ' of ' + totalAttempts;
	        //playerRenderer.showPlayerError(attemptMess,1);
	    };

	    /**
	     * Creates HTML output from assessment data.
	     */
	    this.renderAssessment = function(assessmentType, assessmentData, assessmentId, assessmentItemId, attemptNo) {
	        //console.log("RENDERING ASSESMENT PLUGIN&&&&&&");
	        try {
	            var assessmentPlugin = pluginLoader.loadPlugin(assessmentType);
	            //	console.log("PLUGIN RETURNED ******"+assessmentPlugin);
	            var output = assessmentPlugin.renderData(assessmentData, assessmentId, assessmentItemId, attemptNo);
	            return output;
	        } catch (error) {
	            playerRenderer.showPlayerError(ASSESSMENT_ITEM_PLUGIN_NOT_FOUND_ERROR, 2);
	            exit();
	        }
	    };

	    /**
	     * Navigate to assessment Item
	     */
	    this.navigateToAssessmentItem = function(assessmentItemId) {
	        var currentQuestionNo = parseInt($('#currentQuestionNo').html());
	        var currentQuestionIndex = (currentQuestionNo) - 1;
	        localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
	        assessmentItemId = parseInt(assessmentItemId);
	        assessmentItemManager.processItem(assessmentItemId);
	    };

	    /**
	     * Finishes the assessment
	     */
	    this.finishAssessment = function() {
	        var baseUrl = assessmentsConfig.assessmentBasePercUrl;
	        var finalQuestionUrl = assessmentsConfig.assessmentBasePercUrl + "submitAssessmentAttempt?ASSESSMENT_ID=" + assessmentSectionObj.assessmentId + "&ATTEMPT_NUM=" + assessmentSectionObj.currentAttempt;

	        var responseObj = {};
	        if (resultObj.ans) {
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP = {};
	            if (resultObj.ans instanceof Array) {
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans = resultObj.ans;
	            } else {
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans = [];
	                responseObj.LEARNER_ASSESSMENT_ITEM_RESP.ans.push(resultObj.ans);
	            }
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP.responseType = resultObj.btnFlag;
	            responseObj.LEARNER_ASSESSMENT_ITEM_RESP.questionURL = resultObj.answeredQuestionIdentifier;
	        }
	        var finalResult = loadDataPerc(finalQuestionUrl, responseObj, "PATCH");
	        // alert(JSON.stringify(finalResult));
	        $('#quizTimer').css({
	            'display': 'none'
	        });
	        $('#player-main,.customQuizFooter').fadeOut('fast');
	        $('#assessment-feedback-container').fadeIn('fast');
	        renderSubmission(finalResult);
	    };

	    this.showFeedback = function(assessmentId, attemptNum) {
	        var baseUrl = assessmentsConfig.assessmentBasePercUrl;
	        var finalQuestionUrl = assessmentsConfig.assessmentBasePercUrl + "deliverAssessment?ASSESSMENT_ID=" + assessmentId + "&ATTEMPT_NUM=" + attemptNum;
	        var responseObj = {};
	        var finalResult = loadDataPerc(finalQuestionUrl, responseObj, "PATCH");
	        $('#quizTimer').css({
	            'display': 'none'
	        });
	        $('#qtiPlayerContainer').removeClass('hide');
	        $('#assessment-landingpage-container').addClass('hide');
	        $('#player-main ,.customQuizFooter').fadeOut('fast');
	        $('#assessment-feedback-container').fadeIn('fast');
	        renderSubmission(finalResult);
	    };
	};

	function showAssesment(assessmentId, state) {

	    if ($('#assessment-previous-completed').length == 0) {
	        setTimeout(function() {
	            showAssesment(assessmentId, state);
	        }, 500);
	        return;
	    }

	    var learnerAssessmentInfo = loadDataPerc(assessmentsConfig.assessmentBasePercUrl + "getLearnerAssessmentInfo" + "?ASSESSMENT_ID=" + assessmentId, {}, "PATCH");
	    $('#qtiPlayerContainer').addClass('hide');
	    $('#assessment-landingpage-container').removeClass('hide');
	    if (typeof learnerAssessmentInfo === 'string' || learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO == null) {
	        $('#assessment-error-msg').removeClass('hide');
	        $('#assessment-landingpage-container').addClass('hide');
	    } else {
	        if (state && state == 'complete') {
	            var completedAttempts = learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.currAttempt - 1;
	            var numAttempts = learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.numAttempts;
	            $('#attempt-again-btn-container').addClass('hide');
	            $('#assessment-attempts-completed').removeClass('hide');
	            $('#attempts-completed-message').html(numAttempts + " of " + completedAttempts + " Attempts Completed.<br/><br/> Learning Activity is closed.");
	        } else if (learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.currAttempt <= learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.numAttempts) {
	            $('#attempt-again-btn-container').removeClass('hide');
	            var instructions = learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.instructions;
	            if (instructions != null) {
	                $('#assessment-instructions-container').removeClass('hide');
	                $('#assessment-instructions').html(instructions);
	            }
	        } else {
	            var numAttempts = learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.numAttempts;
	            $('#attempt-again-btn-container').addClass('hide');
	            $('#assessment-attempts-completed').removeClass('hide');
	            $('#attempts-completed-message').html(numAttempts + " of " + numAttempts + " Attempts Completed");
	        }
	        var previousAttempts = learnerAssessmentInfo.responseValueObjects.LEARNER_ASSESSMENT_INFO.attemptList;
	        if (previousAttempts.length == 0) {
	            $('#assessment-previous-list').addClass('hide');
	        }
	        var listFlag = 0;
	        previousAttempts.forEach(function(attempt) {
	            var tr;
	            if (attempt.status == 'COMPLETED' || attempt.status == 'SUBMITTED') {
	                tr = $('<tr/>');
	                var score = '';
	                if (attempt.score != null && attempt.maxScore != null) {
	                    score = attempt.score + '/' + attempt.maxScore;
	                } else {
	                    score = 'no score.'
	                }
	                var attemptNumber = attempt.attemptNum;
	                tr.append('<td>' + '<a href="" onclick="showFeedbackHelper(' + "'" + assessmentId + "'" + ',' + attemptNumber + ')"><span class="attempt-list-text">Attempt ' + attemptNumber + '</span></a><span class="assessment-previous-attempts-duration"> - <span data-livestamp="' + attempt.timeStarted / 1000 + '"></span></span>' + '</td>')
	                tr.append('<td>' + '<span class="assessment-score">' + score + '</span>' + '</td>');
	                $('#assessment-previous-completed').prepend(tr);
	                listFlag = 1;
	                //$('#assessment-previous-completed').prepend('<tr><span class="attempt-list-text">Attempt '+attempt.attemptNum+'</span><sub><span class="assessment-previous-attempts-duration" data-livestamp="'+attempt.timeStarted/1000+'"></span></sub>'+'<span class="assessment-score">'+score+'</span>'+'</tr>');
	            }
	        });
	        if (listFlag == 0) {
	            $('#assessment-previous-list').addClass('hide');
	        }
	    }
	    $('#attempt-again-btn').click(function() {
	        hidePrevNextButtons();
	        addAssessmentLogStream('Start', assessmentId);
	        $('#qtiPlayerContainer').removeClass('hide');
	        $('#assessment-landingpage-container').addClass('hide');
	        playAssesment(assessmentId);
	    });
	    $('#quiz-back-btn').click(function() {
	        window.location.reload();
	    });
	};

	function showFeedbackHelper(assessmentId, attemptNum) {
	    /**
	     * Initalize objects.
	     */
	    assessmentMgr = new AssessmentManager(assessmentId);
	    assessmentMgr.showFeedback(assessmentId, attemptNum);
	}

	function previewQuestion(assessmentItemId, divId) {

	    assessmentMgr = new AssessmentManager();

	    var questionUrl = assessmentsConfig.assessmentBasePercUrl + "getAssessmentItem?ASSESSMENT_ITEM_ID=" + assessmentItemId;
	    var resultObj = {};
	    var assessmentItemData = loadDataPerc(questionUrl, resultObj, "PATCH");
	    // alert(assessmentItemData);
	    var parsedAssessmentItemData = assessmentItemData.responseValueObjects.ASSESSMENT_ITEM.qtiXML;
	    //var questionType = assessmentItemData.responseValueObjects.ASSESSMENT_ITEM.itemType;
	    var questionType = assessmentItemData.responseValueObjects.ASSESSMENT_ITEM.questionSubtype;

	    //render assessmentItem
	    var output = ''
	    try {
	        var assessmentPlugin = pluginLoader.loadPlugin(questionType);
	        output = assessmentPlugin.renderData(parsedAssessmentItemData);
	    } catch (error) {
	        output = "Something went wrong, Please try again later..."

	    }

	    $('#' + divId).html(output);

	};

	// function launchIDE(assessmentId, assessmentItemId, attemptNum, questionUrl){
	// 	var url = "http://" + document.location.host + "/private/v1/player/getUserInfo/";
	// 	$.ajax({
	// 			url : url,
	// 			type : "GET",
	// 			async : false,
	// 			success : function(data)
	// 		 	{
	// 		 		var url_ide = assessmentsConfig.programmingEnvironmentBaseUrl + "?repourl=" + questionUrl;
	// 		 		url_ide += "&uname=" + data.identifier + "&assessmentId=" +  assessmentId;
	// 		 		url_ide += "&assessmentItemId=" + assessmentItemId;
	// 		 		url_ide += "&attemptNum="+attemptNo+ "&stack=C&action=launchAssessmentItemIDE";
	// 				window.open(url_ide);
	// 			},
	// 			error : function(xhr, ajaxOptions, thrownError) {}
	// 		});
	// }

renderSubmission = function(data, isPreview) {
    // var parsedData = JSON.parse(data);
    var parsedData = data;

    var assessmentStatus = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.status;
    var startTime = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.timeStarted;
    var startTimeDate = new Date(startTime);
    var endTime = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.timeCompleted;
    var endTimeDate = new Date(endTime);
    var assessmentId = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.assessmentId;
    var attemptNum = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.attemptNum;

    var score = '';
    if (parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.score != null && parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.maxScore != null) {
        score = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.score + '/' + parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.maxScore;
    } else {
        score = 'no score.'
    }

    jQuery("#assessment-feedback-container #status").append(score);
    jQuery("#assessment-feedback-container #startTime").append(startTimeDate.toLocaleString());
    jQuery("#assessment-feedback-container #endTime").append(endTimeDate.toLocaleString());

    var reqObj = {};
    reqObj.ASSESSMENT_ITEM_IDS = {};
    reqObj.ASSESSMENT_ITEM_IDS.idsList = [];
    // Process responses
    var responses = parsedData.responseValueObjects.ASSESSMENT_TEST_STATE.itemStates;
    jQuery.each(responses, function(i, response) {
        reqObj.ASSESSMENT_ITEM_IDS.idsList.push(response.questionURL);
    });
    var baseUrl = assessmentsConfig.assessmentBasePercUrl;
    var nextAssessmentItemCommand = "deliverAssessmentItems";
    if (isPreview) nextAssessmentItemCommand = "previewAssessmentItems";
    var questionUrl = baseUrl + nextAssessmentItemCommand + "?ASSESSMENT_ID=" + assessmentId + "&ATTEMPT_NUM=" + attemptNum;
    var assessmentItems = assessmentItemManager.getAssessmentItems(questionUrl, reqObj);

    // var tmpResponse = responses[0];
    // var assessmentItem = assessmentItems.responseValueObjects.ASSESSMENT_ITEMS.baseValueMap[tmpResponse.questionURL];
    if (!assessmentItems || !assessmentItems.responseValueObjects || !assessmentItems.responseValueObjects.ASSESSMENT_ITEMS) {
        return;
    }
    var assessmentItemMap = assessmentItems.responseValueObjects.ASSESSMENT_ITEMS.baseValueMap;

    var count = 0;
    jQuery.each(responses, function(i, response) {
        // response = tmpResponse;

        var itemState = response;
        var answer = response.ans;
        var responseType = response.responseType;

        var itemFeedback = response.itemFeedbackMessage;
        var inlinefeedback = "";
        if (responseType != 2) {
            inlinefeedback = response.inlinefeedback;
        }



        // if (!assessmentItems || !assessmentItems.responseValueObjects || !assessmentItems.responseValueObjects.ASSESSMENT_ITEMS) {
        // 	return;
        // }
        var assessmentItem = assessmentItemMap[response.questionURL];
        // if (!assessmentItem) {
        // 	return;
        // }
        var assessmentItemData = assessmentItem.data;
        var questionType = assessmentItem.questionSubtype;
        var pluginObject = pluginLoader.loadPlugin(questionType);

        var questionHtml = pluginObject.renderResponseView(assessmentItemData, answer, inlinefeedback, itemFeedback, responseType, itemState);

        jQuery("#assessment-feedback-container #responses").append(questionHtml);
        count++;
        // console.log("Rendered Question " + count + ". Question uri:" + response.questionURL);

    });
};

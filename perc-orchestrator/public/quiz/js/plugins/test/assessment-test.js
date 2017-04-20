var assessmentTest = function() {

	this.parsedata = function(data) {
		var quizQuestionCounter = 0;
		// var parsedResult = JSON.parse(data);
		var parsedResult = data;
		var quizXmlData = parsedResult.responseValueObjects.ASSESSMENT_TEST_XML.id;
		var assessmentId = parsedResult.responseValueObjects.ASSESSMENT_TEST_STATE.assessmentId;
		var quizDuration = parsedResult.responseValueObjects.ASSESSMENT_TEST_STATE.maxTime;
		var quizTitle = $(quizXmlData).filter(":first").attr('title');

		var currentAttempt = parsedResult.responseValueObjects.ASSESSMENT_TEST_STATE.attemptNum;
		var maxAttempts = parsedResult.responseValueObjects.ASSESSMENT_TEST_STATE.numAttempts;

		var assessmentSectionObj = {
			"duration" : quizDuration,
			"quizTitle" : quizTitle,
			"currentAttempt" : currentAttempt,
			"maxAttempts" : maxAttempts,
			"assessmentId" : assessmentId
		};

		assessmentSectionObj.assessmentSection = new Array();

		$(quizXmlData).find('assessmentItemRef').each(function(q) {
			var quizItemIdentifier = $(this).attr('identifier');
			var quizItemUrl = $(this).attr('href');
			assessmentSectionObj.assessmentSection[q] = {
				"identifier" : quizItemIdentifier,
				"url" : quizItemIdentifier
			};
			quizQuestionCounter++;
		});

		assessmentSectionObj.totalQuestions = quizQuestionCounter;
		return assessmentSectionObj;
	};
};

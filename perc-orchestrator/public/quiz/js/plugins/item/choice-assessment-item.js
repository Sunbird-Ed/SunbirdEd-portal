function ChoiceAssessmentItem () {
	
	
	/**
	 * Validates the Response. 
	 * Returns true if answer selected is valid.
	 */
	this.validateResponse = function(answerSelected){
		
		var validationObj = {status:true, message:""};
		if(answerSelected == '' || answerSelected == undefined) { 
			validationObj.status = false;
			validationObj.message = SELECT_ANSWER_MESSAGE;
		}
		return validationObj;
	};
	
	/**
	 * 
	 */
	this.prepareResponse = function(){
		var currentQuestionUserAnswerId = "";			
		var singleCardinality = $('#choiceWGInteraction').children().hasClass('singleChoicePanel');
		if(singleCardinality == true){
			$('.singleChoicePanel').each(function(){
				var choicePanelId = this.id;
				if($('#'+choicePanelId).hasClass('selectedchoicePanel') == true){
					currentQuestionUserAnswerId = choicePanelId;
				}				
			});
		}else{							
			currentQuestionUserAnswerId = $('.multipleChoicePanel').map(function () {
				var choicePanelId = this.id;
				if($('#'+choicePanelId).hasClass('selectedchoicePanel') == true){
					return currentQuestionUserAnswerId = choicePanelId;
				}	
			}).get();
		}
		return currentQuestionUserAnswerId;
	};
	
	/**
	 * Renders the choice type interaction.
	 */
	this.renderData = function(inputData) {
		var basePath = this.basePath;
		var $itemBody = $($.parseXML(inputData)).find('itemBody');
		var $itemBodyPrompt = $itemBody.children().not('choiceInteraction');
		var $choiceInteractionBody = $itemBody.find('choiceInteraction');
		var $choiceInteractionPrompt = $choiceInteractionBody.find('prompt');
		var $simpleChoiceBody = $choiceInteractionBody.find('simpleChoice');
		var cardinality = $(inputData).find('responseDeclaration').attr(
				'cardinality');

		var quizImgSrc = $itemBody.find('img').attr('src');
		quizImgSrc = basePath + quizImgSrc;

		$itemBodyPrompt.find('img').attr('src', quizImgSrc);
		$choiceInteractionPrompt.find('img').attr('src', quizImgSrc);

		var choiceWidget = '<div id="choiceWG" class="choiceWG commonWGClass row-fluid span10 offset1">';

		$itemBodyPrompt.each(function(q) {
			var childSelectorTagName = $(this).prop("tagName");
			var questionContent = '<'+childSelectorTagName+'>'+$(this).text()+'</'+childSelectorTagName+'>';
			choiceWidget += '<div id="choiceWGQuestionContainer_' + q
					+ '" class="choiceWGQuestionContainer">';
			choiceWidget += questionContent;
			choiceWidget += '</div>';
		});		

		var promptContent = $choiceInteractionPrompt.html();
		if (promptContent != null && promptContent != '') {
			choiceWidget += '<div id="choiceWGPromtContainer" class="choiceWGPromtContainer commonPrompt row-fluid col-md-12">';
			choiceWidget += promptContent;
			choiceWidget += '</div>';
		}

		$simpleChoiceImg = $simpleChoiceBody.find('img');

		$simpleChoiceImg.each(function(chImg) {
			var interactionImgSrc = $(this).attr('src');
			interactionImgSrc = basePath + interactionImgSrc;
			$(this).attr('src', interactionImgSrc);
		});

		choiceWidget += '<div id="choiceWGInteraction" class="choiceWGInteraction commonWGInteraction row-fluid col-md-12">';
		$simpleChoiceBody
				.each(function(c) {
					var choiceContentHtml = $.trim($(this).text());
					var choiceContentText = $.trim($(this).text());
					var choiceAnsId = $(this).attr('identifier');

					if (choiceAnsId == "")
						choiceAnsId = choiceContentText;
					if (cardinality == 'single') {
						choiceWidget += '<div id="'
								+ choiceAnsId
								+ '" class="singleChoicePanel choicePanel span12 col-md-12 noPad">';
						choiceWidget += '<div class="formElementHolder radioOff pull-left col-md-1 noPad"></div>';
						choiceWidget += '<div class="pull-left marginTop8 col-md-11 noPad">' + choiceContentHtml + '</div>';
						choiceWidget += '</div>';
					} else if (cardinality == 'multiple') {
						choiceWidget += '<div id="'
								+ choiceAnsId
								+ '" class="multipleChoicePanel choicePanel span12 col-md-12 noPad">';
						choiceWidget += '<div class="formElementHolder checkBoxOff pull-left col-md-1 noPad"></div>';
						choiceWidget += '<div class="pull-left marginTop8 col-md-11 noPad">' + choiceContentHtml + '</div>';
						choiceWidget += '</div>';
					}
				});
		choiceWidget += '</div>'; 
		choiceWidget += '</div>'; 

		// For MCQ & true or false.
		choiceWidget += '<script>$(".singleChoicePanel").click(function(){var choicePanelId=this.id;$(".singleChoicePanel").removeClass("selectedchoicePanel");$("#"+choicePanelId).addClass("selectedchoicePanel");$(".formElementHolder").removeClass("radioOn").addClass("radioOff");$("#"+choicePanelId+" .formElementHolder").removeClass("radioOff").addClass("radioOn")});</script>';

		// For MMCQ
		choiceWidget += '<script>$(".multipleChoicePanel").click(function(){var choicePanelId=this.id;$("#"+choicePanelId).toggleClass("selectedchoicePanel");$("#"+choicePanelId+" .formElementHolder").toggleClass("checkBoxOn")});</script>';

		// To remove un wanted spans
		choiceWidget += '<script>$(".Apple-tab-span").remove();</script>';

		// To highlight code snippet
		choiceWidget += '<script>$("pre code").each(function(i,block){hljs.highlightBlock(block)});</script>';

		return choiceWidget;
	};
	
	this.renderResponseView = function(inputData, answer, inlinefeedback, itemFeedback, responseType, itemState) {
		var basePath = this.basePath;
		// var $itemBody = $(inputData).find('itemBody');
		var $itemBody = $($.parseXML(inputData)).find('itemBody');
		var $itemBodyPrompt = $itemBody.children().not('choiceInteraction');
		var $choiceInteractionBody = $itemBody.find('choiceInteraction');
		var $choiceInteractionPrompt = $choiceInteractionBody.find('prompt');
		var $simpleChoiceBody = $choiceInteractionBody.find('simpleChoice');
		var cardinality = $(inputData).find('responseDeclaration').attr(
				'cardinality');

		var quizImgSrc = $itemBody.find('img').attr('src');
		quizImgSrc = basePath + quizImgSrc;

		$itemBodyPrompt.find('img').attr('src', quizImgSrc);
		$choiceInteractionPrompt.find('img').attr('src', quizImgSrc);

		var choiceWidget = '<div id="choiceWG" class="choiceWG commonWGClass row span10 offset1">';

		var userSelectedAnswer = answer;
		
		// Item answered
		if(responseType != 2){
			if((itemState.score && itemState.score > 0)){
				choiceWidget += '<div id="correct-answer-text-container" class="col-md-1"><i class="fa fa-check fa-3x"></i></div>';
			}else{
				choiceWidget += '<div id="wrong-answer-text-container" class="col-md-1"><i class="fa fa-times fa-3x"></i></div>';
			}
		}else{
			choiceWidget += '<div id="not-answered-text-container">Skipped</div>';
		}
		
		
		
		$itemBodyPrompt.each(function(q) {
			var childSelectorTagName = $(this).prop("tagName");
			var questionContent = '<'+childSelectorTagName+'>'+$(this).text()+'</'+childSelectorTagName+'>';
			choiceWidget += '<div id="choiceWGQuestionContainer_' + q
					+ '" class="choiceWGQuestionContainer col-md-11">';
			choiceWidget += questionContent;
			choiceWidget += '</div>';
		});

		var promptContent = $choiceInteractionPrompt.html();
		if (promptContent != null && promptContent != '') {
			choiceWidget += '<div id="choiceWGPromtContainer" class="choiceWGPromtContainer commonPrompt row-fluid span12">';
			choiceWidget += promptContent;
			choiceWidget += '</div>';
		}

		$simpleChoiceImg = $simpleChoiceBody.find('img');

		$simpleChoiceImg.each(function(chImg) {
			var interactionImgSrc = $(this).attr('src');
			interactionImgSrc = basePath + interactionImgSrc;
			$(this).attr('src', interactionImgSrc);
		});

		/*var messToUser = cardinality == 'single' ? MCQ_MESS : MMCQ_MESS;

		choiceWidget += '<div id="choiceWGInteractionMess" class="choiceWGInteractionMess row-fluid span12">( '
				+ messToUser + ' )</div>';
		*/
		choiceWidget += '<div id="choiceWGInteraction" class="choiceWGInteraction commonWGInteraction row span12 col-md-12">';
		
		$simpleChoiceBody
				.each(function(c) {
					var choiceContentHtml = $.trim($(this).text());
					var choiceContentText = $.trim($(this).text());
					var choiceAnsId = $(this).attr('identifier');

					var choiceInlinefeedback;
					if (inlinefeedback) {
						for(var i = 0; i < inlinefeedback.length; i++){						
							if (inlinefeedback[i].answer == choiceAnsId) {
								choiceInlinefeedback = inlinefeedback[i];
							};
						};
					};

					if (choiceAnsId == "")
						choiceAnsId = choiceContentText;
					if (cardinality == 'single') {
						var answerChoice = "radioOff";
						var choiceFeedbackText = "";
						var choiceIncorrectClass = "";

						var choiceCorrectClass = "";
						if(userSelectedAnswer && userSelectedAnswer.indexOf(choiceAnsId) > -1){
							answerChoice = "radioOn";
						}
						choiceFeedbackText = "";
						if (choiceInlinefeedback) {
							if (choiceInlinefeedback.correct == true) {
								choiceFeedbackText = "";
								choiceCorrectClass = "correct-choice"	
							} else if (choiceInlinefeedback.correct == false) {
								choiceFeedbackText = "";
								choiceIncorrectClass = "incorrect-choice"	
							}
							if (choiceInlinefeedback.feedback && choiceInlinefeedback.feedback != "null") {
								choiceFeedbackText += choiceInlinefeedback.feedback;
							}
						}
						
						choiceWidget += '<div id="'
								+ choiceAnsId
								+ '" class="singleChoicePanel choicePanel span12 col-md-12 noPad"><div class="commonCorrectIcon marginTop8 col-md-1 noPad '+choiceCorrectClass+'"></div>';
						choiceWidget += '<div class="formElementHolder pull-left col-md-1 noPad '+answerChoice+'"></div>';
						choiceWidget += '<div class="pull-left marginTop8 col-md-10 noPad">' + choiceContentHtml + '</div>' + '</div>';
						if (!choiceFeedbackText || choiceFeedbackText == "null") {
							choiceFeedbackText = "";
						}
						choiceWidget += '<div id="choiceFeedbackContainer" class="'+choiceIncorrectClass+'">'+choiceFeedbackText+'</div>';
					} else if (cardinality == 'multiple') {
						var answerChoice = "checkBoxOff";
						var choiceFeedbackText = "";
						var choiceIncorrectClass = "";
						var choiceCorrectClass = "";
						if(userSelectedAnswer && userSelectedAnswer.indexOf(choiceAnsId) > -1){
							answerChoice = "checkBoxOn";
						}
						choiceFeedbackText = "";
						if (choiceInlinefeedback) {
							if (choiceInlinefeedback.correct == true) {
								choiceFeedbackText = "";	
								choiceCorrectClass = "correct-choice"	
							} else if (choiceInlinefeedback.correct == false) {
								choiceFeedbackText = "";
								choiceIncorrectClass = "incorrect-choice"	
							}
							if (choiceInlinefeedback.feedback && choiceInlinefeedback.feedback != "null") {
								choiceFeedbackText += choiceInlinefeedback.feedback;
							}
						}

						// choiceWidget += '<div id="'
						// 		+ choiceAnsId
						// 		+ '" class="multipleChoicePanel choicePanel span12">';
						// choiceWidget += '<div class="formElementHolder '+ answerChoice +'"></div>';
						choiceWidget += '<div id="'
								+ choiceAnsId
								+ '" class="multipleChoicePanel choicePanel span12 col-md-12 noPad"><div class="commonCorrectIcon marginTop8 col-md-1 noPad '+choiceCorrectClass+'"></div>';
						choiceWidget += '<div class="formElementHolder pull-left col-md-1 noPad '+answerChoice+'"></div>';
						choiceWidget += '<div class="pull-left marginTop8 col-md-10 noPad">' + choiceContentHtml + '</div>';
						choiceWidget += '</div>';
						if (!choiceFeedbackText || choiceFeedbackText == "null") {
							choiceFeedbackText = "";
						}
						choiceWidget += '<div id="choiceFeedbackContainer" class="'+choiceIncorrectClass+'">'+choiceFeedbackText+'</div>';
					}
				});

		choiceWidget += '</div>'; /* choiceWGInteraction Ends */
		// Show Question Level Feedback if Available
		if (itemFeedback && itemFeedback.length > 0) {
			choiceWidget +=  '<br/><div id="choiceWGInteraction" class="choiceWGInteraction commonWGInteraction row-fluid col-md-12" > <h4> feedback </h4>';
			choiceWidget += '<div id="choiceFeedbackContainer" class="incorrect-choice">'+itemFeedback+'</div></div>';
		}
		choiceWidget += '</div>'; /* choiceWG Ends */

		// For MCQ & true or false.
		// choiceWidget += '<script>$(".singleChoicePanel").click(function(){var choicePanelId=this.id;$(".singleChoicePanel").removeClass("selectedchoicePanel");$("#"+choicePanelId).addClass("selectedchoicePanel");$(".formElementHolder").removeClass("radioOn").addClass("radioOff");$("#"+choicePanelId+" .formElementHolder").removeClass("radioOff").addClass("radioOn")});</script>';

		// For MMCQ
		// choiceWidget += '<script>$(".multipleChoicePanel").click(function(){var choicePanelId=this.id;$("#"+choicePanelId).toggleClass("selectedchoicePanel");$("#"+choicePanelId+" .formElementHolder").toggleClass("checkBoxOn")});</script>';

		// To remove un wanted spans
		// choiceWidget += '<script>$(".Apple-tab-span").remove();</script>';

		// To highlight code snippet
		// TODO - optimize this - taking too long to render - uncomment after implementing pagination
		// choiceWidget += '<script>$("pre code").each(function(i,block){hljs.highlightBlock(block)});</script>';

		return choiceWidget;
	};
	
	/**
	 * 
	 */
	this.renderWithAnswers = function(questionIndex){
		var lsUserSelectedAnswer = localStorage.getItem('userSelectedAnswerId_'+questionIndex);		
		if(lsUserSelectedAnswer != null) {
		
			var singleCardinality = $('#choiceWGInteraction').children().hasClass('singleChoicePanel');
			
			if(singleCardinality == true){
				$('#'+lsUserSelectedAnswer).addClass('selectedchoicePanel');
				$("#" + lsUserSelectedAnswer + " .formElementHolder").removeClass("radioOff").addClass("radioOn");
			}else{							
				var UserSelectedAnswerArr = lsUserSelectedAnswer.split(',');
				for(var x = 0; x < UserSelectedAnswerArr.length; x++){						
					$('#'+UserSelectedAnswerArr[x]).addClass('selectedchoicePanel');
					$("#" +UserSelectedAnswerArr[x]+ " .formElementHolder").addClass('checkBoxOn');
				};
			};
		};
	};

	
};

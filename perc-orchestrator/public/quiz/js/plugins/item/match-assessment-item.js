function MatchAssessmentItem () {

	
	/**
	 * Validates the Response. 
	 * Returns true if answer selected is valid.
	 */
	this.validateResponse = function(answerSelected){
		var validationObj = {status:true, message:""};
		var noAnswerSelected = false;
		var duplicateAnswersSelected = false;
		
		for (var i = 0; i < answerSelected.length; i++) {
		    if(answerSelected[i] == SELECT_MATCH_DEFAULT_VALUE){
		    	noAnswerSelected = true;
		    }
		}
		
		if(noAnswerSelected){
			validationObj.status = false;
			validationObj.message = SELECT_ANSWER_MESSAGE;
		}
		var matchingOptionsCount =  (jQuery("#matchWGdropDown_0").children().length)-1;
		
		var index = 0;
		for (var i = 0; i < answerSelected.length; i++) {
		    if(answerSelected[i] != "" && answerSelected[i] != undefined){
		    	index++;
		    }
		}
		
		if(matchingOptionsCount > index){
			duplicateAnswersSelected = true;
		}
		
		if(duplicateAnswersSelected){
			validationObj.status = false;
			validationObj.message = SELECT_MATCH_DUPLICATE_MESSAGE;
		}
		
		return validationObj;
		
	};
	
	this.prepareResponse = function(){
		
		currentQuestionUserAnswerId = [];
		matchInteractionItem = [];
		var matchEmptyIdentifier = 0;
		var matchDuplicateIdentifier = 0;
		var DuplicateVal;

		var hiddenMatchWGLength = $('.hiddenMatchWG').length;
		$('.hiddenMatchWG').each(function(select){				
			var selectId = this.id;
			var selectedItem = $('#'+selectId).html();
			selectedValArr  = selectedItem.split(SELECT_MATCH_SEPARATOR);
			selectedVal = selectedValArr[0];
			if(selectedVal != SELECT_MATCH_DEFAULT_VALUE){	
				matchEmptyIdentifier = 1;					
				if($.inArray(selectedVal, currentQuestionUserAnswerId) == -1){
					currentQuestionUserAnswerId[select] = selectedVal;
					if(select < (hiddenMatchWGLength-1)) matchInteractionItem[select] = selectedItem+CUSTOM_MATCH_SEPARATOR;
					else matchInteractionItem[select] = selectedItem;
				}
				else{
					matchDuplicateIdentifier = 1;
					DuplicateVal = selectedItem;						
				}

			}
			else{
				currentQuestionUserAnswerId[select] = selectedVal;				
				if(select < (hiddenMatchWGLength-1)) matchInteractionItem[select] = selectedItem+CUSTOM_MATCH_SEPARATOR;
				else matchInteractionItem[select] = selectedItem;
			}						
		});
		if(matchDuplicateIdentifier == 1){							
			$('.hiddenMatchWG').each(function(matchIndex){					
				if($(this).html() == DuplicateVal) $('#matchWGdefBtn_'+matchIndex).addClass('matchDuplicate');					
				else $('#matchWGdefBtn_'+matchIndex).removeClass('matchDuplicate');					
			});				
		}
		return matchInteractionItem;
	};
	
	/**
	 * Renders the choice type interaction.
	 */
	this.renderData = function(inputData) {
		
		var $itemBody = $(inputData).find('itemBody');
		var $matchInteraction = $itemBody.find('matchInteraction');
		
		var $simpleMatchSetPrompt = $matchInteraction.find('prompt');
		
		var $simpleMatchSetQuestion = $matchInteraction.find('simpleMatchSet:eq(0)').find('simpleAssociableChoice');
		var $simpleMatchSetAnswer   = $matchInteraction.find('simpleMatchSet:eq(1)').find('simpleAssociableChoice');
		
		var matchWidget  = '<div id="matchWG" class="matchWG commonWGClass row-fluid span10 offset1">';
		matchWidget  	+= '<div id="matchContainer" class="matchContainer row-fluid span12">';
		
		var promptContent = $simpleMatchSetPrompt.html();
		if(promptContent != null && promptContent != ''){
			matchWidget += '<div id="matchWGPromtContainer" class="matchWGPromtContainer commonPrompt span12">';
			matchWidget += promptContent;
			matchWidget += '</div>';
		}
		
		matchWidget  	+= '<div id="lhsQuestionContainer" class="lhsQuestionContainer span12">';
		
		$simpleMatchSetQuestion.each(function(sMq){
			var questionContent = $(this).html();
			matchWidget  	+= '<ul id="questionItemContainer_'+sMq+'" class="matchItemContainer span12">';
			matchWidget  	+= '<li id="questionItem_'+sMq+'" class="questionItem matchInteraction commonFloatLeft span6">'+questionContent+'</li>';
			matchWidget  	+= '<li id="answerItem_'+sMq+'" class="matchInteraction commonFloatLeft span6">';
				
				matchWidget  	+= '<div class="btn-group matchBtn">';
				matchWidget  	+= '<button id="matchWGdefBtn_'+sMq+'" class="btn matchWGdefBtn">'+SELECT_MATCH_DEFAULT+'</button>';		
				matchWidget  	+= '<button class="btn dropdown-toggle" data-toggle="dropdown">';
				matchWidget  	+= '<span class="caret"></span>';
				matchWidget  	+= '</button>';
				matchWidget  	+= '<label id="hiddenMatchWG_'+sMq+'" class="hiddenMatchWG commonDisplayNone">'+SELECT_MATCH_DEFAULT_VALUE+SELECT_MATCH_SEPARATOR+SELECT_MATCH_DEFAULT+'</label>';
				matchWidget  	+= '<ul id="matchWGdropDown_'+sMq+'" class="matchWGdropDown dropdown-menu">';
				matchWidget  	+= '<li>';
				matchWidget  	+= '<a href="#" id="'+SELECT_MATCH_DEFAULT_VALUE+"_"+sMq+'" class="answerItem">'+SELECT_MATCH_DEFAULT+'</a>';
				matchWidget  	+= '</li>';	
					$simpleMatchSetAnswer.each(function(sMa){
						var answerContent = $(this).html();	
						var matchAnsId 	  = $(this).attr('identifier');
						if(matchAnsId == "") matchAnsId = answerContent;
						matchWidget  	+= '<li id="'+sMq+'">';
						matchWidget  	+= '<a href="#" id="'+matchAnsId+"_"+sMq+'" class="answerItem">'+answerContent+'</a>';
						matchWidget  	+= '</li>';			
					});
				matchWidget  	+= '</ul>';
				matchWidget  	+= '</div>';
			
			matchWidget  	+= '</li>';	
			matchWidget  	+= '</ul>';
		});

		matchWidget  	+= '</div>';		
		matchWidget  	+= '</div>';
		matchWidget += '</div>';
		
		matchWidget += '<script>$(".answerItem").click(function(){var answerItemId=this.id;answerItemArr=answerItemId.split("_");var answerId=answerItemArr[0];var matchParentId=answerItemArr[1];var answerContent=$("#"+answerItemId).html();$("#matchWGdefBtn_"+matchParentId).html(answerContent);$("#hiddenMatchWG_"+matchParentId).html(answerId+SELECT_MATCH_SEPARATOR+answerContent)});</script>';
		return matchWidget;
	};	
	
	
	this.renderWithAnswers = function(questionIndex){
		var lsUserSelectedAnswer = localStorage.getItem('userSelectedAnswerId_'+questionIndex);
		if(lsUserSelectedAnswer != null) {
			var UserSelectedAnswerArr = lsUserSelectedAnswer.split(CUSTOM_MATCH_SEPARATOR+',');
			for(var x = 0; x < UserSelectedAnswerArr.length; x++){						
				var UserSelectedAnswer = UserSelectedAnswerArr[x].split(SELECT_MATCH_SEPARATOR);
				var UserSelectedAnswerContent = UserSelectedAnswer[1];
				$('#matchWGdefBtn_'+x).html(UserSelectedAnswerContent);
				$('#hiddenMatchWG_'+x).html(UserSelectedAnswerArr[x]);
			}
		}
	}
};

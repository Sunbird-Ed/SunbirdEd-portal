function ProgramAssessmentItem () {
	
	
	/**
	 * Validates the Response. 
	 * Returns true if answer selected is valid.
	 */
	this.validateResponse = function(answerSelected){
		
		var validationObj = {status:true, message:""};
		return validationObj;
	};
	
	/**
	 * 
	 */
	this.prepareResponse = function(){
		var currentQuestionUserAnswerId = "";			
		return currentQuestionUserAnswerId;
	};
	
	/**
	 * Renders the choice type interaction.
	 */
	this.renderData = function(inputData, assessmentId, assessmentItemId, attemptNo) {
		var parsedData = eval('(' + inputData + ')');
		var basePath = this.basePath;
		var itemBody = parsedData.Question;
		var choiceWidget = '<div id="progQuestionDef' + '" class="choiceWGQuestionContainer"><h3>';
		// choiceWidget += parsedData.projectName;
		choiceWidget += '</h3>';
		choiceWidget += itemBody;
		choiceWidget += '</div>';
		// choiceWidget += '<script>$("#ideBtn").click(function(event){'+
		// 				' var url = "http://" + document.location.host + "/private/v1/player/getUserInfo/";$.ajax({'+
		// 				'url : url, type : "GET",async : false,'+
		// 				'success : function(data) { '+
		// 				'var url_ide = PROGRAMMING_ENVIRONMENT_BASE_URL + "?repourl=" + "';
		// choiceWidget += parsedData.repoURL;
		// choiceWidget +=	'" + "&uname=" + data.identifier + "&REMOTE_USER=" + data.identifier + "&assessmentId=" + "' + assessmentId;
		// choiceWidget += '" + "&assessmentItemId=" + "'+ assessmentItemId;
		// choiceWidget += '" + "&attemptNum=" + "'+attemptNo+'" + "&stack=C&action=launchAssessmentItemIDE";'+
		// 				'window.open(url_ide);},'+
		// 				'error : function(xhr, ajaxOptions, thrownError) {}});});</script>';	
		return choiceWidget;
	}; 

	this.renderResponseView = function(inputData, answer, inlinefeedback, itemFeedback, responseType, itemState) {
		var criteriaMap =
        {
            "blackboxtests" : "Practice Test Cases",
            "evalblackboxtests" : "Eval Test Cases",
            "system" : "System",
            "summary": "Summary"
        };
		var parsedData = eval('(' + inputData + ')');
		var basePath = this.basePath;
		var itemBody = parsedData.Question;
		var choiceWidget = '<div id="choiceWG" class="choiceWG commonWGClass row-fluid span10 offset1">';
		choiceWidget += '<div class ="choiceWGQuestionContainer">';
		choiceWidget += itemBody +'</div>';
		choiceWidget +=  '<div id="choiceWGInteraction" class="row-fluid span12" style="margin:none;" > <h4> feedback </h4>';
		var rubricResult = '';
		feedbackDecode = document.createElement('div');
		feedbackDecode.innerHTML = itemFeedback;	
		try { 		
   			rubricResult = JSON.parse(feedbackDecode.innerHTML);
		}
		catch(err) {
    		console.log("Item Feedback cannot be parsed"+err.message);	
		}	
		// var rubricResult = {
		// 	"resultSummary": {
		//         "blackboxtests": {
		//             "totalchecks": 5,
		//             "pass": 5,
		//             "fail": 5,
		//             "error": 5,
		//             "skipped": 5,
		//             "groupScore": 20
		//         },
		//         "blackboxtests_eval": {
		//             "totalchecks": 5,
		//             "pass": 5,
		//             "fail": 5,
		//             "error": 5,
		//             "skipped": 5,
		//             "groupScore": 20
		//         },
		//         "system": {
		//             "totalchecks": 1,
		//             "pass": 1,
		//             "fail": 0,
		//             "error": 0,
		//             "skipped": 0,
		//             "groupScore": 0
		//         	},
  		//       	"overallScore": 0
  		//  	}
		// };
		var criteriaList = (rubricResult['resultSummary'])?rubricResult['resultSummary']:'';
		// alert(itemBody);
		if(criteriaList)
		{
			choiceWidget += '<div id="SummaryDiv" class ="summaryPanel" style="display:block;">'+
						'<div  class="feedbackPanel" style="width:100%;background-color:#ddd; padding:10px;">'+
						'<table id="smryFeedback" class="smryFeedback" style="background-color:#ddd">'+
						'<thead><tr><th>Criteria</th><th>Total Checks</th><th>Passed</th><th>Failed</th><th>Errors</th><th>Skipped</th><th>Group Score</th>'+
						'</tr></thead>';
			
			choiceWidget += '<tbody>';

			for(var k in criteriaList)
	        {
	            if(k != 'overallScore' && typeof criteriaMap[k] !== 'undefined')
	            {
	               var criteria = criteriaList[k];
	               choiceWidget += '<tr>'+
	                    '<td><input class=\"tCriteria\" type=\"text\" name=\"criteriaName\" value="' + this.getValue(criteriaMap[k]) + '"></input></td>' +
			    '<td><input class=\"tSummary\" type=\"text\" name=\"totalChecks\" value="'+this.getValue(criteria.totalchecks)+'"></input></td>'+
	                    '<td><input class=\"tSummary\" type=\"text\" name=\"pass\" value="'+this.getValue(criteria.pass)+'"></input></td>'+
	                    '<td><input class=\"tSummary\" type=\"text\" name=\"fail\" value="'+this.getValue(criteria.fail)+'"></input></td>'+
	                    '<td><input class=\"tSummary\" type=\"text\" name=\"error\" value="'+this.getValue(criteria.error)+'"></input></td>'+
	                    '<td><input class=\"tSummary\" type=\"text\" name=\"skipped\" value="'+this.getValue(criteria.skipped)+'"></input></td>'+
	                    '<td><input class=\"tSummary\" type=\"text\" name=\"groupScore\" value="'+this.getValue(criteria.groupScore)+'"></input></td>'+
	                	'</tr>'; 
	            }
	        }
	        choiceWidget += '</tbody></table>';
	        choiceWidget += '<div class=\"scoreDiv\"> <span> Overall Score:  '+criteriaList.overallScore+'</span></div></div></div>';

		}
		else
			choiceWidget += '<div><p> Feedback is not available for this Question </p></div>';
       
        choiceWidget += '</div></div></div>';

		return choiceWidget;
    };
	
	/**
	 * 
	 */
	this.renderWithAnswers = function(questionIndex){
		// $('#ideBtn').hide();
	};

	this.getValue = function(val) {
        if(val || val == 0) {
            return val;
        } else {
            return '-';
        }
    }
};

/**
 * Manages Plugins in the system. Responsible for creating appropriate plugin object.
 * TODO; Add plugin validation logic in this.
 */
function PluginLoader(){

	/**
	 * Loads the plugin based on the type of the assessment ot item.
	 */
	this.loadPlugin = function(type){
		var pluginObject = "";
		type = type.toUpperCase();
		switch (type) {
		case 'ASSESSMENT-TEST':
			pluginObject = new assessmentTest();
			break;
		case 'MCQ':
			var className = "ChoiceAssessmentItem";
			//var className = "ProgramAssessmentItem";
			pluginObject = new window[className]();
			break;
		case 'MMCQ':
			var className = "ChoiceAssessmentItem";
			//var className = "ProgramAssessmentItem";
			pluginObject = new window[className]();
			break;
		case 'MATCH':
			var className = "MatchAssessmentItem";
			pluginObject = new window[className]();
			break;
		case 'LOGICAL PROGRAMMING':
			var className = "ProgramAssessmentItem";
			pluginObject = new window[className]();
			break;
		case 'PROGRAM_IN_IDE':
			var className = "ProgramAssessmentItem";
			pluginObject = new window[className]();
			break;
		case 'PROGRAM IN IDE':
			var className = "ProgramAssessmentItem";
			pluginObject = new window[className]();
			break;
		default:
			pluginObject = 'InvalidPlugin';
			break;
		}
		return pluginObject;
	};
	
	this.getPluginName = function (input) { 
	    return input.toLowerCase().replace(/-(.)/g, function(match, name) {
	        return name.toUpperCase();
	    });
	};
};

/*
var loadPlugin = function(type) {
	switch (type) {
	case 'assessment-test':
		var assessmentTestObj = new assessmentTest();
		return assessmentTestObj;
		break;
	case 'CHOICE':
		var choiceAssessmentObj = new choiceAssessmentItem();
		return choiceAssessmentObj;
		break;
	default:
		var invalidPlugin = 'InvalidPlugin';
		return invalidPlugin;
		break;
	}
};
*/
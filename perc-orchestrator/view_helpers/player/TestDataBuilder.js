var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');

exports.createTestData = function(req, res) {

	LearnerStateModel = mongoose.model('LearnerStateModel');
	LearnerStateModel.collection.remove(function(err, obj) {
		console.log('Collection removed');
	});
	var state = new LearnerStateModel();
	state.student_id = "1";
	state.courseId = "Course1";
	state.profile = {};
	state.profile.name = "Profile A";
	state.profile.outcome = "learning";
	state.profile.learnerLevel = "Advanced";
	state.enrolled_date = "24 April 2014";
	state.proficiency = "85";
	state.tutor = "tutor1";
	state.total_elements = 14;
	state.complete_count = 6;
	state.learning_objects = [];
	var module1 = ['lesson1', 'lesson2', 'lesson3'];
	state.learning_objects.push(getModuleLearningObject('module1', module1, 14));
	var module2 = ['lesson4', 'lesson5', 'lesson6'];
	state.learning_objects.push(getModuleLearningObject('module2', module2, 1));
	var module3 = ['lesson7', 'lesson8'];
	state.learning_objects.push(getModuleLearningObject('module3', module3, 1));
	state.learning_objects.push(getLesson1());
	var lesson2 = ['lecture5', 'lecture6'];
	state.learning_objects.push(getLessonLearningObject('lesson2', lesson2, 2, 'module1'));
	var lesson3 = ['lecture7', 'lecture8', 'lecture9', 'lecture10'];
	state.learning_objects.push(getLessonLearningObject('lesson3', lesson3, 4, 'module1'));
	var lesson4 = [];
	state.learning_objects.push(getLessonLearningObject('lesson4', lesson4, 1, 'module2'));
	var lesson5 = [];
	state.learning_objects.push(getLessonLearningObject('lesson5', lesson5, 1, 'module2'));
	var lesson6 = [];
	state.learning_objects.push(getLessonLearningObject('lesson6', lesson6, 1, 'module2'));
	var lesson7 = [];
	state.learning_objects.push(getLessonLearningObject('lesson7', lesson7, 1, 'module3'));
	var lesson8 = [];
	state.learning_objects.push(getLessonLearningObject('lesson8', lesson8, 1, 'module3'));

	state.save(function(err, object) {
		if(err) {
			console.log("Test data creation failed: " + err);
		} else {
			console.log("Test data created");
		}
	});
	res.send("ok");
};

function getLesson1() {
	var lesson = {};
	lesson.identifier = "lesson1";
	lesson.elementType = "lesson";
	lesson.parent_lob = "module1";
	lesson.proficiency = "";
	lesson.status = "";
	lesson.is_complete = false;
	lesson.total_elements = 8;
	lesson.complete_count = 4;
	lesson.proficiency = 50;
	lesson.elements = [];
	lesson.elements.push(getElement("lecture1", "learningresource"));
	lesson.elements.push(getElement("lecture2", "learningresource"));
	lesson.elements.push(getElement("lecture3", "learningresource"));
	lesson.elements.push(getElement("tl1.1", "learningresource"));
	lesson.elements.push(getElement("tl1.2", "learningresource"));
	lesson.elements.push(getElement("activity1", "learningactivity"));
	lesson.elements.push(getElement("lecture4", "learningresource"));
	lesson.elements.push(getElement("activity2", "learningactivity"));
	lesson.sequence = ['lecture1', 'lecture2', 'lecture3', 'tl1.1', 'tl1.2', 'activity1', 'lecture4', 'activity2'];
	return lesson;
}

function getElement(identifier, type) {
	var element = {};
	element.identifier = identifier;
	element.elementType = type;
	element.status = '';
	element.is_complete = false;
	element.attempt_count = 0;
	element.result = '';
	return element;
}

function getLessonLearningObject(name, lessons, count, parent) {
	var module = {};
	module.identifier = name;
	module.elementType = "lesson";
	module.parent_lob = parent;
	module.proficiency = "";
	module.status = "";
	module.is_complete = false;
	module.total_elements = count;
	module.complete_count = count;
	module.proficiency = 75;
	if (lessons.length > 0) {
		module.elements = [];
		for (var i=0; i<lessons.length; i++) {
			var element = {};
			element.identifier = lessons[i];
			element.elementType = 'learningresource';
			element.status = '';
			element.is_complete = false;
			element.attempt_count = 0;
			element.result = '';
			module.elements.push(element);
		}
		module.sequence = lessons;
	}
	return module;
}

function getModuleLearningObject(name, lessons, count) {
	var module = {};
	module.identifier = name;
	module.elementType = "module";
	module.parent_lob = "";
	module.proficiency = "";
	module.status = "";
	module.is_complete = false;
	module.total_elements = count;
	module.complete_count = 1;
	module.proficiency = 75;
	module.elements = [];
	for (var i=0; i<lessons.length; i++) {
		var element = {};
		element.identifier = lessons[i];
		element.elementType = 'lesson';
		element.status = '';
		element.is_complete = false;
		module.elements.push(element);
	}
	module.sequence = lessons;
	return module;
}




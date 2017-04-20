/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

 /**
 * View Helper for Quiz
 * 
 * @author Mahesh
 */

 var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');

var Client = require('node-rest-client').Client;
var client = new Client();
client.on('error', function(err) {
    console.error('Something went wrong on the client', err);
});

 exports.getQuiz = function(req, res) {
 	LoggerUtil.setOperationName('getQuiz');
 	var url = decodeURIComponent(req.params.quizUrl);
 	var args = {};
	client.get(url, args, function(data, response) {
		data = data.replace(/\n/g,'').replace(/\t/g,'').replace(/\r/g,'');
		res.send(data);    
    }).on('error', function(err) {
    	res.send('error');
    });
 };

 exports.getQuizResult = function(req, res) {
 	LoggerUtil.setOperationName('getQuizResult');
 	var quiz = req.body.quiz;
 	var correctAnsCount = 0;
 	var wrongAnsCount = 0;
 	var worngAnsQuestions = [];
 	for(var i=0; i<quiz.questions.length; i++) {
 	 	var question = quiz.questions[i];
 	 	if(question.userAnswer != null) {
 	 		if(question.userAnswer == question.answer) {
 	 			correctAnsCount++;
 	 		} else {
 	 			wrongAnsCount++;
 	 			worngAnsQuestions.push(question);
 	 		}
 	 	} else {
 	 		worngAnsQuestions.push(question);
 	 	}
 	}

 	var totalMarks = correctAnsCount*quiz.marksPerQust;
 	if(quiz.hasNegMarking) {
 		totalMarks -= wrongAnsCount*quiz.negMarksPerQust;
 	}
 	if (quiz.lobId && quiz.elementId) {
 		setElementResult(req, quiz.lobId, quiz.elementId, totalMarks);
 	}

 	var result = new Object();
 	result.noOfCorrectAnswers = correctAnsCount;
 	result.noOfWrongAnswers = wrongAnsCount;
 	result.worngAnsQuestions = worngAnsQuestions;
 	result.noOfQuestionsAttempted = correctAnsCount+wrongAnsCount;
 	result.noOfQuestions = quiz.questions.length;
 	result.totalMarks = totalMarks;
 	res.send(JSON.stringify(result));
 };

 function setElementResult(req, lobId, elementId, marks) {
 	var courseId = req.body.courseId;
	var studentId = req.user.identifier;
	LearnerStateModel = mongoose.model('LearnerStateModel');
	LearnerStateModel.findOne({student_id: studentId, courseId: courseId}).exec(function(err, course) {
		if (err) {
			console.log('Error: ' + err);
		} else {
			if (course) {
				var currentElement;
				course.learning_objects.forEach(function(lob) {
					if(lob.identifier == lobId) {
						lob.elements.forEach(function(element) {
							if(element.identifier == elementId) {
								currentElement = element;
							}
						});
					}
				});
				currentElement.result = marks;
				course.markModified('learning_objects');
				course.save(function(err, obj) {
					console.log('State Updated');
				});
			}
		}
	});
 }




var csv = require('csv');
var fs = require('fs');
var Decompress = require('decompress');
var mongoose = require('mongoose');
var promise_lib = require('when');
var ViewHelperConstants = require('../view_helpers/ViewHelperConstants');
var iViewHelper = require('../interactions/view_helpers/InteractionViewHelper');
var stackexchange = require('stackexchange');
var options = { version: 2.2 };
var context = new stackexchange(options);

var testUserIds = ['kirankumar', 'ashoknair', 'channappa', 'eswarsharma', 'nishant', 'suhasini', 'admin'];
var userCache = [];
var elementCache = {};

var interactionHeaderFields = {
    "parent node id": "parentNodeId",
    "node id": "nodeId",
    "element id": "elementId",
    "element type": "elementType",
    "post title":"title",
    "post": "post",
    "post type": "postType"
}

function getObjectKey(csvKey, headerFields) {
	if(headerFields[csvKey]) {
		return headerFields[csvKey];
	} else {
		return csvKey.replace(/\s+/g, '_');
	}
}

exports.qaTestData = function(req, res) {
	console.log('Importing interactions test data...');
	var file = req.files.importFile;
	var header = {};
	var json = {};

	csv()
	.from.stream(fs.createReadStream(file.path))
	.on('record', function(row, index){
		if(index == 0) {
			header = row;
		} else {
			var object = new Object();
			for(k in row) {
				var objKey = getObjectKey(header[k].toLowerCase(), interactionHeaderFields)
				object[objKey]=row[k];
			}

			if(object.nodeId != "") {
				json[object.nodeId] = object;
			}
			/*LoggerUtil.log(LogLevel.INFO, {parentNodeId: object.parentNodeId, nodeId: object.nodeId, postType: object.postType, title: object.title});
			if(!object.nodeId || object.nodeId == '') {
				console.log('NodeId or postType not found at index:', index);
			}*/
		}
	})
	.on('end', function(count){
	  	processQATestData(json, res);
	  	//res.send('Data is imported');
	})
	.on('error', function(error){
		console.log('error', error);
	  	res.send(error);
	});
}

function processQATestData(json, res) {
	console.log('############ Process qa test data ############');
	var questions = {};
	var answers = [];
	promise_lib.resolve()
	.then(function() {
		console.log('############ Get all users ############');
		var deferred = promise_lib.defer();
		MongoHelper.find('UserModel', {identifier : {$nin: testUserIds}}).toArray(function(err, users) {
			userCache = users;
			deferred.resolve();
		})
		return deferred.promise;
	})
	.then(function() {
		console.log('############ Creating question data ############');
		var deferred = promise_lib.defer();
		var promises = [];
		for(k in json) {
			var question = json[k];
			if(question.postType && question.postType.toLowerCase() == 'question') {
				questions[question.nodeId] = question;
				promises.push(createQuestionData(question));
			}
		}
		return promise_lib.all(promises);
	})
	.then(function() {
		console.log('############ Saving questions ############');
		var deferred = promise_lib.defer();
		var promises = [];
		for(k in questions) {
			promises.push(createQuestion(questions[k]));
		}
		promise_lib.all(promises).then(function(value) {
			console.log('############ Questions saved ############');
		    deferred.resolve(value);
		});
		return deferred.promise;
	})
	.then(function() {
		console.log('############ Creating answer data ############');
		for(k in json) {
			var answer = json[k];
			if(answer.postType && answer.postType.toLowerCase() != 'question' && questions[answer.parentNodeId]) {
				answer.interaction = questions[answer.parentNodeId].result;
				answers.push(answer);
			}
		}
		console.log('############ Answer data created ############');
	})
	.then(function() {
		console.log('############ Saving answers ############');
		// Save answers
		var deferred = promise_lib.defer();
		var promises = [];
		for(k in answers) {
			if(answers[k].interaction && null != answers[k].interaction && typeof answers[k].interaction != 'undefined') {
				promises.push(createAnswer(answers[k]));
			}
		}
		promise_lib.all(promises).then(function(value) {
			console.log('############ Answers saved ############');
		    deferred.resolve(value);
		});
		return deferred.promise;
	})
	.then(function() {
		//res.send(JSON.stringify(answers));
		res.send('Test data ingested');
	})
	.catch(function(err) {
		console.log('Error ingesting QA test data - ', err);
	})
	.done();
}

function createQuestionData(question) {

	question.metadata = {
		interactionType: 'QA',
		accessType: 'OPEN',
		rateCount: Math.floor((Math.random() * 100) + 1),
		viewCount: Math.floor((Math.random() * 100) + 1)
	};
	var defer = promise_lib.defer();
	switch (question.elementType) {
	    case ViewHelperConstants.LEARNING_OBJECT:
	    	promise_lib.resolve()
			.then(function() {
				return setLearningElementId(question);
			})
			.then(function() {
	        	if(question.metadata.leType == 'lesson') {
	        		question.metadata.lessonId = question.metadata.learningElementId;
	        		return setModuleId(question);
	        	} else if(question.metadata.leType == 'module') {
	        		var deferred = promise_lib.defer();
	        		question.metadata.moduleId = question.metadata.learningElementId;
	        		deferred.resolve();
	        		return deferred.promise;
	        	}
			})
			.then(function() {
	        	defer.resolve();
	        })
	        .catch(function(err) {
	        	defer.reject(err);
	        }).done();
	        break;
	    case ViewHelperConstants.LEARNING_RESOURCE:
	        promise_lib.resolve()
			.then(function() {
				var deferred = promise_lib.defer();
				if(elementCache[question.elementId]) {
					question.metadata.leType = ViewHelperConstants.LEARNING_RESOURCE;
			        question.metadata.learningElementId = elementCache[question.elementId].identifier;
			        question.metadata.lessonId = elementCache[question.elementId].lobId;
			        question.courseId = elementCache[question.elementId].courseId;
					deferred.resolve();
				} else {
					MongoHelper.findOne('LearningResourceModel', {'identifier': question.elementId}, function(err, obj) {
						question.metadata.leType = ViewHelperConstants.LEARNING_RESOURCE;
			        	question.metadata.learningElementId = obj.identifier;
			        	question.metadata.lessonId = obj.lobId;
			        	question.courseId = obj.courseId;
			        	elementCache[question.elementId] = obj;
			        	deferred.resolve();
					});
				}
				return deferred.promise;
			})
	        .then(function() {
	        	if(question.metadata.lessonId) {
	        		return setModuleId(question);
	        	}
	        })
	        .then(function() {
	        	defer.resolve();
	        })
	        .catch(function(err) {
	        	defer.reject(err);
	        }).done();
	        break;
		case ViewHelperConstants.LEARNING_ACTIVITY:
			promise_lib.resolve()
			.then(function() {
				var deferred = promise_lib.defer();
				if(elementCache[question.elementId]) {
					question.metadata.leType = ViewHelperConstants.LEARNING_ACTIVITY;
			        question.metadata.learningElementId = elementCache[question.elementId].identifier;
			        question.metadata.lessonId = elementCache[question.elementId].lobId;
			        question.courseId = elementCache[question.elementId].courseId;
					deferred.resolve();
				} else {
					MongoHelper.findOne('LearningActivityModel', {'identifier': question.elementId}, function(err, obj) {
						question.metadata.leType = ViewHelperConstants.LEARNING_ACTIVITY;
			        	question.metadata.learningElementId = obj.identifier;
			        	question.metadata.lessonId = obj.lobId;
			        	question.courseId = obj.courseId;
			        	elementCache[question.elementId] = obj;
			        	deferred.resolve();
					});
				}
				return deferred.promise;
			})
	        .then(function() {
	        	if(question.metadata.lessonId) {
	        		return setModuleId(question);
	        	}
	        })
	        .then(function() {
	        	defer.resolve();
	        })
	        .catch(function(err) {
	        	defer.reject(err);
	        }).done();
	        break;
	    default:
	    	defer.resolve();
	}
	return defer.promise;
}

function setLearningElementId(question) {
	var defer = promise_lib.defer();
	if(elementCache[question.elementId]) {
		question.metadata.leType = elementCache[question.elementId].lobType;
    	question.metadata.learningElementId = elementCache[question.elementId].identifier;
    	question.courseId = elementCache[question.elementId].courseId;
		defer.resolve();
	} else {
		MongoHelper.findOne('LearningObjectModel', {'identifier': question.elementId}, function(err, obj) {
        	question.metadata.leType = obj.lobType;
        	question.metadata.learningElementId = obj.identifier;
        	question.courseId = obj.courseId;
        	elementCache[question.elementId] = obj;
        	defer.resolve();
        });
	}
	return defer.promise;
}


function setModuleId(question) {
	var defer = promise_lib.defer();
	if(elementCache[question.metadata.lessonId]) {
		question.metadata.moduleId = elementCache[question.metadata.lessonId].identifier;
		defer.resolve();
	} else {
		MongoHelper.findOne('LearningObjectModel', {'children.identifier': question.metadata.lessonId}, {identifier: 1}, function(err, module) {
        	question.metadata.moduleId = module.identifier;
        	elementCache[question.metadata.lessonId] = module;
        	defer.resolve();
        });
	}
	return defer.promise;
}

function createQuestion(question) {
	var deferred = promise_lib.defer();
	var req = {
		body: question,
		user: userCache[Math.floor(Math.random() * userCache.length)]
	};
	var res = {
		send: function(resp) {
			question.result = resp.INTERACTION;
			deferred.resolve();
		}
	};
	iViewHelper.postInteraction(req, res);
	return deferred.promise;
}

function createAnswer(answer) {
	var deferred = promise_lib.defer();
	answer.title = 'RE:' + answer.interaction.title;
	answer.metadata = {rateCount: Math.floor((Math.random() * 100) + 1)};
	var req = {
		body:answer,
		user: userCache[Math.floor(Math.random() * userCache.length)]
	};
	var res = {
		send: function(resp) {
			answer.result = resp.responseValueObjects.COMMENT;
			deferred.resolve();
		}
	};
	iViewHelper.answer(req, res);
	return deferred.promise;
}

exports.getTestDataFromStackExchange = function(req, res) {
	var elements = [];
	var courseNodeId = req.params.courseId;
	var courseId;
	var lobJson=[], lrJson=[], laJson=[];

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningObjectModel', {'metadata.nodeId': courseNodeId}, {identifier: 1}, function(err, course) {
			if(err || null == course) {
				deferred.reject('Course not found');
			} else {
				deferred.resolve(course.identifier);
			}
		});
		return deferred.promise;
	})
	.then(function(courseIdentifier) {
		courseId = courseIdentifier;
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningObjectModel', {'courseId': courseId}, {identifier: 1}).toArray(function(err, lobs) {
			if(null != lobs) {
				lobs.forEach(function(lob) {
					elements.push({id: lob.identifier, type: ViewHelperConstants.LEARNING_OBJECT});
				})
			}
			deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function(courseIdentifier) {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningResourceModel', {'courseId': courseId}, {identifier: 1}).toArray(function(err, lobs) {
			if(null != lobs) {
				lobs.forEach(function(lob) {
					elements.push({id: lob.identifier, type: ViewHelperConstants.LEARNING_RESOURCE});
				})
			}
			deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function(courseIdentifier) {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningActivityModel', {'courseId': courseId}, {identifier: 1}).toArray(function(err, lobs) {
			if(null != lobs) {
				lobs.forEach(function(lob) {
					elements.push({id: lob.identifier, type: ViewHelperConstants.LEARNING_ACTIVITY});
				})
			}
			deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function() {
		console.log('elements size - ', elements.length);
		var promises = [];
		var index = 0;
		elements.forEach(function(element) {
			if(element.type == ViewHelperConstants.LEARNING_RESOURCE) {
				promises.push(getElementInteractions(element.id, element.type, lrJson, index++));
			} else if(element.type == ViewHelperConstants.LEARNING_ACTIVITY) {
				promises.push(getElementInteractions(element.id, element.type, laJson, index++));
			} else {
				promises.push(getElementInteractions(element.id, element.type, lobJson, index++));
			}
		});
		return promise_lib.all(promises);
	})
	.then(function() {
		outputToFile(lobJson, 'lob');
		outputToFile(lrJson, 'lr');
		outputToFile(laJson, 'la');
		res.send('Test data generated');
	})
	.catch(function(err) {
		console.log('err', err);
		res.send('Error occured while generating test data');
	}).done();
}

function outputToFile(json, prefix) {
	var idx = 1;
	json.forEach(function(obj) {
		if(!obj.nodeId) {
			obj.nodeId = 'ans_' + (idx++);
		}
	});

	var jsonCSV = require('json-csv');
	var jsonFields = [];
	for(k in interactionHeaderFields) {
		jsonFields.push({name: interactionHeaderFields[k], label: k});
	}
	var args = {
		data: json,
		fields: jsonFields
	}
	jsonCSV.toCSV(args, function(err, csv) {
		fs.appendFile('interactions_test_data' + prefix + '.csv', csv, function (err) {
		  	if (err) throw err;
		  	console.log('The interactions test data was appended to file!');
		});
	});
}

function getElementInteractions(elementId, elementType, json, idx) {
	console.log('#### Generating Stack Exchange data for element - ', idx, '####');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		if(typeof elementType == 'undefined') {
			return;
		}
		var deferred = promise_lib.defer();
		switch (elementType.toLowerCase()) {
		    case ViewHelperConstants.LEARNING_OBJECT:
		        MongoHelper.findOne('LearningObjectModel', {'identifier': elementId}, {'concepts': 1}, function(err, obj) {
		        	var concepts = [];
		        	if(obj.concepts && obj.concepts.length > 0) {
		        		obj.concepts.forEach(function(concept) {
		        			concepts.push(concept.conceptTitle);
		        		});
		        	}
		        	deferred.resolve(concepts);
		        });
		        break;
		    case ViewHelperConstants.LEARNING_RESOURCE:
		        MongoHelper.findOne('LearningResourceModel', {'identifier': elementId}, {'concepts': 1}, function(err, obj) {
		        	var concepts = [];
		        	if(obj.concepts && obj.concepts.length > 0) {
		        		obj.concepts.forEach(function(concept) {
		        			concepts.push(concept.conceptTitle);
		        		});
		        	}
		        	deferred.resolve(concepts);
		        });
		        break;
			case ViewHelperConstants.LEARNING_ACTIVITY:
		        MongoHelper.findOne('LearningActivityModel', {'identifier': elementId}, {'concepts': 1}, function(err, obj) {
		        	var concepts = [];
		        	if(obj.concepts && obj.concepts.length > 0) {
		        		obj.concepts.forEach(function(concept) {
		        			concepts.push(concept.conceptTitle);
		        		});
		        	}
		        	deferred.resolve(concepts);
		        });
		        break;
		    default:
		    	deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function(concepts) {
		var deferred = promise_lib.defer();
		var promises = [];
		concepts.forEach(function(conceptTitle) {
			promises.push(getQuestionsFromSE(conceptTitle, elementId, elementType, json));
		});
		promise_lib.all(promises).then(function(value) {
		    deferred.resolve(value);
		});
		return deferred.promise;
	})
	.then(function() {
		defer.resolve();
	})
	.catch(function(err) {
		console.log('Error:', err);
		defer.reject(err);
	})
	.done();
	return defer.promise;
}

function getQuestionsFromSE(conceptTitle, elementId, elementType, json) {
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return queryQuestions(conceptTitle);
	})
	.then(function(data) {
		if(data.items && data.items.length > 0) {
			var questionIds = [];
			data.items.forEach(function(item) {
				json.push({
					postType:'question',
					title: item.title,
					post: item.body,
					elementId: elementId,
					elementType: elementType,
					nodeId: item.question_id
				});
				questionIds.push(item.question_id);
			});
			return questionIds;
		}
	})
	.then(function(questionIds) {
		if(questionIds && questionIds.length > 0) {
			return queryAnswers(questionIds);
		}
	})
	.then(function(data) {
		if(data && data.items && data.items.length > 0) {
			data.items.forEach(function(item) {
				json.push({
					postType:'answer',
					title: 'Reply to ' + item.question_id,
					post: item.body,
					elementId: '',
					elementType: '',
					parentNodeId: item.question_id
				});
			});
		}
	})
	.then(function() {
		defer.resolve();
	})
	.catch(function(err) {
		console.log('Error:', err);
		defer.reject(err);
	})
	.done();
	return defer.promise;
}

function queryQuestions(conceptTitle) {

	var defer = promise_lib.defer();
	var filter = {
	  	key: 'Hh0Tkd9A9FrhpSC0OLg9ww((',
	  	sort: 'activity',
	  	order: 'asc',
	  	filter: 'withbody',
	  	site: 'stackoverflow',
	  	q: conceptTitle,
	  	pagesize: 4
	};

	// Get all the questions (http://api.stackexchange.com/docs/questions)
	context.search.advanced(filter, function(err, results){
	  	if (err) {
	  		defer.reject(err);
	  	} else {
	  		defer.resolve(results);
	  	}
	});
	return defer.promise;
}

function queryAnswers(ids) {

	var defer = promise_lib.defer();
	var filter = {
	  	key: 'Hh0Tkd9A9FrhpSC0OLg9ww((',
	  	sort: 'activity',
	  	order: 'asc',
	  	filter: 'withbody',
	  	site: 'stackoverflow',
	  	pagesize: 16
	};

	// Get all the questions (http://api.stackexchange.com/docs/questions)
	context.questions.answers(filter, function(err, results){
	  	if (err) {
	  		defer.reject(err);
	  	} else {
	  		defer.resolve(results);
	  		console.log('quota_remaining', results.quota_remaining, 'backoff', results.backoff);
	  	}
	}, ids);
	return defer.promise;
}


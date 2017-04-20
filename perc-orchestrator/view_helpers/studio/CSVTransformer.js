/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for course import/export.
 *
 * @author Santhosh
 */
appConfig = require('../../appConfig.json');
LoggerUtil = require('../../commons/LoggerUtil');
process.domain = {logObject:{}};
var csv = require('csv');
var fs = require('fs');
//var mongoose = require('mongoose');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
//var db = require('../../models');

var contentHeaderFields = {
    "node id": "nodeId",
    "node type": "nodeType",
    "node class": "nodeClass",
    "name": "name",
    "keyword": "keyword",
    "format": "format",
    "location": "location",
    "description": "description",
    "summary": "summary",
    "snippet": "snippet",
    "size": "size",
    "duration": "duration",
    "order": "order",
    "content group": "contentGroup"
}

function transformContent() {
	var directory = '/Users/santhosh/Perceptron/perceptron-courses/WebDevelopmentPoc/content_files/';
	var fileNames = ['java-course-concepts_consolidated.csv'];
	var header = {};
	var csvArray = [];
	var tmpArray = [];
	fileNames.forEach(function(filePath) {
		csv()
		.from.stream(fs.createReadStream(directory + filePath))
		.on('record', function(row, index){
			if(index == 0) {
				header = row;
			} else {
				var object = new Object();
				for(k in row) {
					if(contentHeaderFields[header[k].toLowerCase()]) {
						object[contentHeaderFields[header[k].toLowerCase()]]=row[k];
					}
				}
				tmpArray.push(object);
			}
		})
		.on('end', function(count) {
			console.log('Remove duplicates and merging concept ids...');
			var urlObjects = {};
			tmpArray.forEach(function(obj) {
				var key = obj.location + obj.description;
				if(!urlObjects[key]) {
					urlObjects[key] = obj;
				} else {
					var keywords = obj.keyword.split(',');
					keywords.forEach(function(keyword) {
						keyword = keyword.trim();
						if(keyword != '') {
							if(urlObjects[key].keyword.indexOf(keyword) == -1) {
								urlObjects[key].keyword += ',' + keyword;
							}
						}
					});
				}
			});
			for(k in urlObjects) {
				csvArray.push(urlObjects[k]);
			}
			var promises = [];
			console.log('Transforming CSV....');

			console.log('Outputting CSV');
			var jsonCSV = require('json-csv');
		  	var jsonFields = [];
			for(k in contentHeaderFields) {
				jsonFields.push({name: contentHeaderFields[k], label: k});
			}
			var args = {
				data: csvArray,
				fields: jsonFields
			}
			jsonCSV.toCSV(args, function(err, csv) {
				fs.writeFile(directory + 'transform_' + filePath, csv, function (err) {
				  	if (err) {
				  		console.log('unable to save');
				  	} else {
				  		console.log('It\'s saved!');
				  	}
				});
			});
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

transformContent();

var courseHeaderFields = {
    "parent node id": "parentNodeId",
    "parent relation": "parentRelation",
    "node id": "nodeId",
    "node type": "nodeType",
    "node class": "nodeClass",
    "name": "name",
    "content group": "contentGroup",
    "interception media id": "interceptionMediaId",
    "interception point": "interceptionPoint",
    "code/short name": "codeName",
    "identifier": "identifier",
    "description": "description",
    "language": "language",
    "keyword": "keyword",
    "offered by": "offeredBy",
    "popularity": "popularity",
    "rating": "rating",
    "completion results in": "completionResult",
    "classification - stream": "classificationStream",
    "classification - subject area": "classificationSubject",
    "mandatory": "isMandatory",
    "structure": "structure",
    "aggregation level": "aggregationLevel",
    "current status": "currentStatus",
    "current version": "currentVersion",
    "version - date": "versionDate",
    "version - number": "versionNumber",
    "version - role": "versionRole",
    "version - person": "versionPerson",
    "version - status": "versionStatus",
    "owner": "owner",
    "copy right": "copyRight",
    "cost": "cost",
    "contributors": "contributors",
    "annotation record": "annotationRecord",
    "format": "format",
    "size": "size",
    "location": "location",
    "duration": "duration",
    "purpose": "purpose",
    "study level": "studyLevel",
    "learner level": "learnerLevel",
    "intended end-user role": "intendedEndUserRole",
    "difficulty level": "difficultyLevel",
    "interactivity type": "interactivityType",
    "context": "context",
    "learning time": "learningTime",
    "semantic density": "semanticDensity",
    "learning element type": "elementType",
    "knowledge dimension": "knowledgeDimension",
    "bloom's taxonomy level": "bloomsTaxonomyLevel",
    "instruction usage": "instructionUsage",
    "interactivity level": "interactivityLevel",
    "interactivity location": "interactivityLocation",
    "intervention": "intervention",
    "intervention role": "interventionRole",
    "collaboration": "collaboration",
    "evaluation type": "evaluationType",
    "learning style": "learningStyle",
    "place in container": "placeInContainer",
    "lesson type": "lessonType",
    "tutoring mode": "tutoringMode",
    "tutor type": "tutorType",
    "tutor/learner ratio": "tutorLearnerRatio",
    "categorize by learner profile": "categorizeByLP",
    "tutoring hours by profile": "tutorHoursByProfile",
    "tutoring language supported": "tutorLanguage",
    "tutoring learning resource types": "tutorLRTypes",
    "program template": "programTemplate",
    "program answer": "programAnswer",
    "image": "image",
    "min proficiency": "minProficiency",
    "proficiency weightage": "proficiencyWeightage",
	"author": "author",
	"author image": "authorImage",
	"author profile url": "authorProfileURL",
	"owner type": "ownerType",
	"owner image": "ownerImage",
	"owner profile url": "ownerProfileURL",
	"offeredby type": "offeredByType",
	"offeredby image": "offeredByImage",
	"offeredby profile url": "offeredByProfileURL",
	"extended material": "extendedMaterial",
	"outcome": "outcome",
	"content source": "contentSource"

}

var categoryArrays = ['explore', 'references', 'drilldown', 'pre-requisites', 'challenge'];
function getContentIds() {
	var directory = '/Users/santhosh/Perceptron/Course/Web Development Course/java-course/';
	var fileNames = ['transform_Java-course-concepts_1_500_mongodb.csv'];
	var header = {};
	var csvArray = [];
	fileNames.forEach(function(filePath) {
		csv()
		.from.stream(fs.createReadStream(directory + filePath))
		.on('record', function(row, index){
			if(index == 0) {
				header = row;
			} else {
				var object = new Object();
				for(k in row) {
					if(courseHeaderFields[header[k].toLowerCase()]) {
						object[courseHeaderFields[header[k].toLowerCase()]]=row[k];
					}
				}
				object['contentGroup'] = categoryArrays[Math.floor(Math.random() * categoryArrays.length)];
				if(index % 10 == 0) {
					object['contentGroup'] = '101';
				}
				csvArray.push(object);
			}
		})
		.on('end', function(count){
		  	var promises = [];
		  	csvArray.forEach(function(object) {
		  		//promises.push(getContentId(object));
		  	});

		  	promise_lib.all(promises).then(function(value) {
			    var jsonCSV = require('json-csv');
			  	var jsonFields = [];
				for(k in courseHeaderFields) {
					jsonFields.push({name: courseHeaderFields[k], label: k});
				}
				var args = {
					data: csvArray,
					fields: jsonFields
				}
				jsonCSV.toCSV(args, function(err, csv) {
					fs.writeFile(directory + filePath, csv, function (err) {
					  	if (err) {
					  		console.log('unable to save');
					  	} else {
					  		console.log('It\'s saved!');
					  	}
					});
				});
			}).catch(function(err) {
				console.log('Error:', err);
			});
		})
		.on('error', function(error){
		  	console.log(error);
		});
	});
}

function getContentId(object) {
	var deferred = promise_lib.defer();
	ContentModel = mongoose.model('MediaContentModel');
	ContentModel.findOne({name:object.name.trim()}, 'identifier').exec(function(err, content) {
		object.identifier = content.identifier;
		deferred.resolve();
	});
	return deferred.promise;
}

//getContentIds();
function transformMongoDBContent() {
	ContentModel = mongoose.model('MediaContentModel');
	ContentModel.find().exec(function(err, contents) {
		var index = 0;
		contents.forEach(function(content) {
			index++;
			if(!content.categories || content.categories.length == 0) {
				if(index % 10 == 0) {
					content.categories.push('101');
				} else {
					content.categories.push(categoryArrays[Math.floor(Math.random() * categoryArrays.length)]);
				}
			}
			content.save(function(err) {
				if(err) {
					console.log('Err', err);
				}
			});
		});
		console.log('Contents transformed');
	});
}
//transformMongoDBContent();

function conceptCategoryLookup() {
	var conceptViewHelper = require('./conceptViewHelper');
	conceptViewHelper.categoryReverseLookup('info:fedora/learning:3297');
}

//conceptCategoryLookup();
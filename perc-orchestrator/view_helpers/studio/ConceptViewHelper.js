/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Concept Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var PlayerUtil = require('../player/PlayerUtil');
var Digraph = require("graphlib").Digraph;
ConceptModel = mongoose.model('ConceptModel');

exports.getConcept = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(ConceptModel.findOne, ConceptModel, [{identifier: req.params.id}]))
	.catch (buildCatchFunction(error))
	.done(buildDoneFunction(error, "ERROR_FETCHING_CONCEPT", req, res));
}

exports.importRelation = function(edge, node, childNode) {
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var relation = ViewHelperUtil.getNodeProperty(edge, 'relation_label');
		var relationType = ViewHelperUtil.getNodeProperty(edge, 'relationType');
		var associatedConcept = {
			tag: relationType,
			conceptTitle: ViewHelperUtil.getNodeProperty(childNode, 'name'),
			conceptId: ViewHelperUtil.getNodeProperty(childNode, 'identifier')
		}
		exports.addAssociation(ViewHelperUtil.getNodeProperty(node, 'identifier'), associatedConcept);
	})
	.catch(function(err) {
		console.log('Error importing concept relation - ', err);
		defer.reject(err);
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

exports.importConcept = function(conceptNode) {
	var id = ViewHelperUtil.getNodeProperty(conceptNode, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(conceptNode);
	var updateObject = {"description": ViewHelperUtil.getNodeProperty(conceptNode, 'description')}
	for(k in metadata) {
		updateObject["metadata." + k] = metadata[k];
	}

	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		ConceptModel.update({identifier: id},{$set: updateObject}).exec(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error importing concept - ', err);
		defer.reject(err);
	})
	.done(function(concept) {
		defer.resolve(concept);
	});
	return defer.promise;
}

exports.saveConceptToMW = function(graph, res) {
	var rdf = {};
	//console.log("graph when saving to MW", graph);
	graph.nodes().forEach(function(nodeId) {
		var node = graph.node(nodeId);
		rdf[nodeId] = node;
	});
	graph.edges().forEach(function(edgeId) {
		var edge = graph.edge(edgeId);
		rdf[edgeId] = graph.edge(edgeId);
	});
	var req = new Object();
    req.CONCEPT_NETWORK = JSON.stringify(rdf);
	promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MWServiceProvider.callServiceStandard("DummyService", "SaveConceptNetwork", req, function(err, data, response) {
            if (err) {
            	console.log('Error saving concept network', err);
            	EventHelper.emitEvent('conceptMapMWSave', false);
                deferred.reject(err);
            } else {
            	console.log('Concept network saved', data.responseValueObjects.CONCEPT_NETWORK.id);
            	EventHelper.emitEvent('conceptMapMWSave', true);
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }).catch(function(err){
    	console.log('error - ', err);
    }).done(function() {
    	console.log('Concept network Saved in middleware');
    });
}

exports.getConceptByTitle = function(conceptTitle, context) {
	var error = false;
	var params = {title: conceptTitle};
	if(context) {
		params.context = context;
	}
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(ConceptModel.findOne, ConceptModel, [params]))
	.then(function(concept) {
	//	console.log("concept in monfo-----------", concept);
		if(typeof concept == 'undefined' || concept == null) {
			var req = new Object();
    		req.CONCEPT_NAME = conceptTitle;
    		if(context) {
    			req.CONTEXT = context;
    		}
    		MWServiceProvider.callServiceStandard("DummyService", "FetchConceptIdentifier", req, function(err, data, response) {
	            if (err) {
	                deferred.resolve();
	            } else {
	            	
	               // var mwData = eval('(' + data + ')');
	               var mwData = data;
	               
	                if (mwData.responseValueObjects.STATUS.statusCode == '0') {
	                	deferred.resolve(mwData.responseValueObjects.CONCEPT_ID);
	                } else {
	                	deferred.resolve();
	                }
	            }
	        });
		} else {
			deferred.resolve(concept.identifier);
		}		
	})
	.catch(function(err) {
		console.log('Error creating concept - ', err);
		error = true;
	})
	return deferred.promise;
}

exports.addConcept = function(conceptTitle, context) {
	var error = false;
	var params = {title: conceptTitle};
	if(context) {
		params.context = context;
	}
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(ConceptModel.findOne, ConceptModel, [params]))
	.then(function(concept) {
		var deferred = promise_lib.defer();
		if(typeof concept == 'undefined' || concept == null) {
			var req = new Object();
    		req.CONCEPT_NAME = conceptTitle;
    		if(context) {
    			req.CONTEXT = context;
    		}
    		MWServiceProvider.callServiceStandard("DummyService", "FetchConceptIdentifier", req, function(err, data, response) {
	            if (err) {
	                deferred.resolve();
	            } else {

	                var mwData = data; //eval('(' + data + ')');

	                if (mwData.responseValueObjects.STATUS.statusCode == '0') {
	                	deferred.resolve(mwData.responseValueObjects.CONCEPT_ID.id);
	                } else {
	                	deferred.resolve();
	                }
	                deferred.resolve();
	            }
	        });
		} else {
			deferred.resolve(concept.identifier);
		}
		return deferred.promise;
	})
	.then(function(conceptId) {
	//	console.log("concept ID",conceptId);
		var deferred = promise_lib.defer();
		if(typeof conceptId == 'undefined' || conceptId == null || !conceptId) {
			IDCacheUtil.getIdentifier()
			.then(function(identifier) {
				var concept = new ConceptModel();
				concept.identifier = identifier;
				if(context) {
					concept.context = context;
				} else {
					concept.context = '';
				}
				concept.title = conceptTitle;
				concept.save(function(err) {
					if(err) {
						deferred.reject(err);
					} else {
						deferred.resolve(identifier);
					}
				});
			})
		} else {
			deferred.resolve(conceptId);
		}
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error creating concept - ', err);
		error = true;
	})
	.done(function(identifier) {
		if(error) {
			ConceptModel.findOne({title: conceptTitle}).exec(function(err, concept) {
				if(err) {
					defer.reject(err);
				} else {
					if(null != concept) {
						defer.resolve(concept.identifier);
					} else {
						console.log('Concept Identifier is null - ', conceptTitle);
						defer.resolve('');
					}
				}
			});
		} else {
			defer.resolve(identifier);
		}
	});
	return defer.promise;
}

exports.addAssociation = function(conceptId, associatedConcept) {
	ConceptModel.findOne({identifier: conceptId,
	associations: {$elemMatch: {conceptId: associatedConcept.conceptId}}}).exec(function(err, concept) {
		if (err) {
			console.log('Error Searching Assoications - ', err);
		} else {
			if (concept && concept != null) {
				ConceptModel.update(
					{
						identifier: conceptId,
						"associations": {$elemMatch: {conceptId: associatedConcept.conceptId}}
					},
					{
						$set: {
							"associations.$.conceptTitle":associatedConcept.conceptTitle,
							"associations.$.conceptId":associatedConcept.conceptId,
							"associations.$.tag":associatedConcept.tag
						}
					}
				).exec(function(err) {
					if(err) {
						console.log('Error Updating Association - ', err);
					}
				});
			} else {
				ConceptModel.update(
					{
						identifier: conceptId
					},
					{
						$push: {
							associations : {
								conceptTitle : associatedConcept.conceptTitle,
								conceptId : associatedConcept.conceptId,
								tag : associatedConcept.tag
							}
						}
					}
				).exec(function(err) {
					if(err) {
						console.log('Error Pushing Association - ', err);
					}
				});
			}
		}
	});
}

exports.linkConcept = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(ConceptModel.findOne, ConceptModel, [{identifier: req.body.conceptId}]))
	.then(function(concept){
		var deferred = promise_lib.defer();
		if(typeof concept === 'undefined')  {
			deferred.reject('No concept found');
		} else {
			if(req.body.linkType == 'subConcept') {
				concept.subConcepts.push({
					conceptTitle: relatedConcept.conceptTitle,
					conceptId: relatedConcept.conceptId
				});
				concept.markModified('subConcepts');
			} else {
				concept.relatedConcepts.push({
					conceptTitle: relatedConcept.conceptTitle,
					conceptId: relatedConcept.conceptId
				});
				concept.markModified('relatedConcepts');
			}
			concept.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_LINKING_CONCEPTS", req, res));
}

function getContentForConcept(conceptId, category, req, res) {

	var studentId = req.user.identifier;
	var courseId = req.body.courseId;
	var offset = req.body.offset || 0;
	var nPerPage = req.body.limit || appConfig.DEFAULT_RESULT_SIZE || 2000;
	var contentOrder = 1;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return getOrderCutOffValue(courseId);
	})
	.then(function(order) {
		contentOrder = order;
		var defer = promise_lib.defer();
		var req = new Object();
    	req.CONCEPT_ID = conceptId;
        // change to Content model.
        ContentModel = mongoose.model('MediaContentModel');
		ContentModel.find({concepts:{ $elemMatch: {conceptIdentifier: conceptId}}, order : {$gte: contentOrder}}).sort({order: -1}).skip(offset > 0 ? (offset*nPerPage) : 0).limit(nPerPage).lean().exec(function (err, contents) {
               if(err) {
                    defer.reject(err);
               } else {
               		if(contents && contents.length > 0) {
               			contents = leanifyContent(contents, category);
						defer.resolve(contents);
               		} else {
               			defer.resolve([]);
               		}
               }
          });
		return defer.promise;
	})
	.then(function(contents) {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				var elementMap = PlayerUtil.getMap(lobState.elements);
				contents.forEach(function(content) {
					if(elementMap[content.identifier]) {
						content.addedToPath = true;
					} else {
						content.addedToPath = false;
					}
					content.shortId = PlayerUtil.removeFedoraPrefix(content.identifier);
				});
				deferred.resolve(contents);
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('err', err);
		deferred.reject(err);
	})
	.done(function(contents) {
		deferred.resolve(contents);
	});
	return deferred.promise;
}

exports.fetchContent = function(req, res) {
	LoggerUtil.setOperationName('fetchContent');
	var conceptId = req.body.conceptId;
	var category = req.body.category;
	if(!category || category == "" || category.trim() == "") category = null;
	var error = false;
	promise_lib.resolve()
	.then(function() {
		return getContentForConcept(conceptId, category, req, res);
	})
	.catch(function(err) {
		console.log('err', err);
		error = true;
	})
	.done(function(contents) {
		if(error) {
			contents = [];
		}
		res.send(JSON.stringify(contents));
	});
}

var facultyRecommendedCategory = ['drilldown', 'pre-requisites', 'challenge'];

function leanifyContent(contents, category) {
	var returnContents = [];
	contents.forEach(function(content) {
		content.facultyRecommended = false;
		content.media.forEach(function(media) {
			if(media.isMain) {
				content['mediaType'] = media.mediaType;
			}
		});
		var contentExistsInCourse = false;
		/*if(content.linkedCourses && content.linkedCourses.length > 0) {
			var index = content.linkedCourses.indexOf('');
			if(index > -1) {
				content.linkedCourses.splice(index, 1);
			}
			if(content.linkedCourses.length > 0) {
				contentExistsInCourse = true;
			}
		}*/
		if(!contentExistsInCourse) {
			if(category && null != category) {
				if(content.categories && categoryIndex(content.categories, category)) {
					returnContents.push(content);
				}
			} else {
				content['mainCategory'] = 'explore';
				returnContents.push(content);
			}
			if(content.categories) {
				content['mainCategory'] = content.categories[0];
			} else {
				content['mainCategory'] = 'explore';
			}
		}
	});
	return returnContents;
}

function categoryIndex(array, word) {
    return -1 < array.map(function(item) { return item.toLowerCase(); }).indexOf(word.toLowerCase());
}

function sortContents(contents) {
	var sortOrder = {'video':0, 'audio': 1, 'slides':2, 'mcq':3, 'document': 4, 'richtext': 5, 'text': 6, 'image': 7, 'url': 8, 'test':9};
	function compare(a,b) {
		var mediaType1 = 10, mediaType2 = 10;
		mediaType1 = sortOrder[a.mediaType];
		mediaType2 = sortOrder[b.mediaType];
		if(mediaType1 < mediaType2)
		 	return -1;
		if(mediaType1 > mediaType2)
			return 1;
		return 0;
	}
	if (contents) {
		contents.sort(compare);
	}
	return contents;
}

function conceptComparator(a, b) {
	if (a.conceptTitle < b.conceptTitle)
    	return -1;
  	if (a.conceptTitle > b.conceptTitle)
    	return 1;
  	return 0;
}

exports.fetchRelatedConcepts = function(req, res) {
	LoggerUtil.setOperationName('fetchRelatedConcepts');
	var conceptIds = req.body.conceptIds;
	var category = req.body.category;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ConceptModel.find().where('identifier').in(conceptIds).lean().exec(function (err, concepts) {
			var conceptArray = [];
			concepts.forEach(function(concept) {
				concept.associations.forEach(function(conceptAssc) {
					conceptArray.push(conceptAssc.conceptId);
				});
			})
			defer.resolve(conceptArray);
		});
		return defer.promise;
	})
	.then(function(relatedConceptIds) {
		var defer = promise_lib.defer();
		ConceptModel.find().where('identifier').in(relatedConceptIds).lean().exec(function (err, concepts) {
			var conceptArray = [];
			concepts.forEach(function(concept) {
				if(category) {
					if(concept.contentCategories && concept.contentCategories.indexOf(category) != -1) {
						conceptArray.push({conceptId: concept.identifier, title: concept.title, description: concept.description});
					}
				} else {
					conceptArray.push({conceptId: concept.identifier, title: concept.title, description: concept.description});
				}
			});
			defer.resolve(conceptArray);
		});
		return defer.promise;
	})
	.catch(function(err) {
		console.log('Err', err);
	})
	.done(function(relatedConcepts) {
		res.send(JSON.stringify(relatedConcepts));
	});
}

/**
 * Function to fetch the concept Map
 * @param  {Request} req - The request object
 * @param  {Response} res - The response object
 * @return {json} - The concept map json
 */
exports.fetchConceptMap = function(req, res) {
	LoggerUtil.setOperationName('fetchConceptMap');
	var courseId = req.params.courseId;
	var paginationSize = calculatePaginationSize(req);
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('ConceptMapCache', {courseId: courseId}, {'conceptMap':1}, function(err, conceptCache) {
			if(err) {
				console.log('Error fetching concepts list in concept cache');
				defer.reject(err);
			} else {
				defer.resolve(conceptCache.conceptMap);
			}
		});
		return defer.promise;
	})
	.then(function(concepts) {
		paginateConcept(concepts[0], paginationSize);
		return concepts;
	})
	.catch(function(err) {
		console.log('fetchConceptMap() - Error - ', err);
		res.send(err);
		deferred.reject(err);
	})
	.done(function(concepts) {
		console.log('fetchConceptMap() - Done fetching concept map');
		res.send(JSON.stringify(concepts));
		deferred.resolve(concepts);
	});
	return deferred.promise;
}

/**
 * Function to fetch the concept title map
 * @param  {Request} req - The request object
 * @param  {Response} res - The response object
 * @return {json} - The concept map json
 */
exports.fetchConceptTitleMap = function(req, res) {
	LoggerUtil.setOperationName('fetchConceptTitleMap');
	var courseId = req.params.courseId;

	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('ConceptMapCache', {courseId: courseId}, {'conceptsTitleList':1}, function(err, conceptCache) {
			if(null == conceptCache) {
				console.log('Error fetching concepts title map in concept cache');
				defer.resolve([]);
			} else {
				defer.resolve(conceptCache.conceptsTitleList);
			}
		});
		return defer.promise;
	})
	.then(function(conceptTitles) {
		console.log('fetchConceptTitleMap() - Done fetching concept title map');
		var conceptsStr = JSON.stringify(conceptTitles);
		res.send(conceptsStr);
	})
	.catch(function(err) {
		console.log('fetchConceptTitleMap() - Error - ', err);
		res.send(err);
	})
	.done();
}


function addToDistinctConcepts(distinctConcepts, id, title) {
	if(!distinctConcepts[id]) {
		distinctConcepts[id] = title;
	}
}

/**
 * [calculatePaginationSize description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function calculatePaginationSize(req) {
	//TODO: Dynamically calculate paginate size based on visualization type, page width/height
	return 10;
}

function paginateConceptList(concepts, paginationSize) {
	concepts.forEach(function(concept) {
		paginateConcept(concept, paginationSize);
	});
}

/**
 * [paginateConcepts description]
 * @param  {[type]} concept        [description]
 * @param  {[type]} paginationSize [description]
 * @return {[type]}                [description]
 */
function paginateConcept(concept, paginationSize) {
	if(concept.children && concept.children.length > 0) {
		paginateConceptList(concept.children, paginationSize);
	}
	if(concept.children && concept.children.length > paginationSize) {
		var children = concept.children;
		var page1 = children.slice(0, paginationSize);
		var length = page1.length;
		var pageIndex = 1;
		concept.children = page1;
		concept.children[length] = {name: 'more', pages: [], pageIndex: pageIndex};
		while(children.length > paginationSize) {
			concept.children[length].pages.push({page: pageIndex++, nodes: children.splice(0, paginationSize)});
		}

		if(children.length > 0) {
			concept.children[length].pages.push({page: pageIndex++, nodes: children.splice(0, paginationSize)});
		}
	}
}

/**
 * Function to recursively fetch the child concepts
 * @param  {[ConceptModel]} concepts - Array of concept objects
 * @param  {Integer} paginationSize - the pagination size of the child results
 * @return {[type]}                [description]
 */
function fetchRecursive(concepts, paginationSize, parents, distinctConcepts, level) {
	var deferred = promise_lib.defer();
	var promises = [];
	concepts.forEach(function(concept) {
		promises.push(fetchSubConcepts(concept, paginationSize, JSON.parse(JSON.stringify(parents)), distinctConcepts, level));
	});
	promise_lib.all(promises).then(function(value) {
	    deferred.resolve(value);
	}).catch(function(err) {
		console.log('Error:', err);
	});
	return deferred.promise;
}

exports.fetchConceptMapByCategory = function(req, res) {
	LoggerUtil.setOperationName('fetchConceptMapByCategory');
	var conceptId = req.body.conceptId;
	var category = req.body.category;
	var deferred = promise_lib.defer();
	var levels = {};
	var currLevel = 0;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ConceptModel.findOne({identifier:conceptId}).lean().exec(function (err, concept) {
			if(err || concept == null) {
				defer.reject('Concept not found');
			} else {
				concept.associations.sort(conceptComparator);
				defer.resolve(concept.associations);
			}
		});
		return defer.promise;
	})
	.then(function(concepts) {
		return recursiveFetchLevel(concepts, [], levels, currLevel, category);
	})
	.catch(function(err) {
		console.log('fetchConceptMap() - Error - ', err);
		res.send(err);
		deferred.reject(err);
	})
	.done(function(concepts) {
		var newLevels = {};
		var index = 0;
		for(k in levels) {
			if(levels[k] && levels[k].length > 0) {
				levels[k].sort(conceptComparator);
				newLevels[index++] = levels[k];
			}
		}
		res.send(JSON.stringify(newLevels));
	});
	return deferred.promise;
}

function recursiveFetchSubLevel(concept, parents, levels, currLevel, category) {
	var deferred = promise_lib.defer();
	ConceptModel.findOne({identifier: concept.conceptId}, {'associations':1,'description':1, 'contentCategories': 1}).lean().exec(function(er, concpt) {
		var level = (++currLevel) + '';
		if(!levels[level]) {
			levels[level] = [];
		}
		concpt.associations.sort(conceptComparator);
		if(parents.indexOf(concept.conceptId) != -1) {
			deferred.resolve(concept);
		} else {
			if(concpt.contentCategories && concpt.contentCategories.indexOf(category) != -1) {
				levels[level].push(concept);
			}
			parents.push(concept.conceptId);
			recursiveFetchLevel(concpt.associations, parents, levels, currLevel, category)
			.then(function(associations) {
				deferred.resolve(concept);
			});
		}
	});
	return deferred.promise;
}

function recursiveFetchLevel(concepts, parents, levels, currLevel, category) {
	var deferred = promise_lib.defer();
	var promises = [];
	concepts.forEach(function(concept) {
		promises.push(recursiveFetchSubLevel(concept, parents, levels, currLevel, category));
	});
	promise_lib.all(promises).then(function(value) {
	    deferred.resolve(value);
	}).catch(function(err) {
		console.log('Error:', err);
	});
	return deferred.promise;
}

function updateCategory(concept) {
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		var req = new Object();
    	req.CONCEPT_ID = concept.identifier;
		MWServiceProvider.callServiceStandard("DummyService", "GetConceptMaterial", req, function(err, data, response) {
            if (err) {
                deferred.reject(err);
            } else {
            	//console.log('MW data', data);
                deferred.resolve(data);
            }
        });
		return deferred.promise;
	})
	.then(function(data) {
		var mwData = eval('(' + data + ')');
        if (mwData.responseValueObjects.STATUS.statusCode == '0') {
        	return mwData.responseValueObjects.CONCEPT_MATERIAL.valueObjectList;
        } else {
        	return [];
        }
	})
	.then(function(contentIds) {
		ContentModel = mongoose.model('MediaContentModel');
		var deferred = promise_lib.defer();
		if(contentIds && contentIds.length > 0) {
			var contentIdentifiers = [];
			contentIds.forEach(function(contentId) {
				contentIdentifiers.push(contentId.id);
			});
			ContentModel.find().where('identifier').in(contentIdentifiers).lean().exec(function (err, contents) {
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve(contents);
				}
			});
		} else {
			deferred.resolve([]);
		}
		return deferred.promise;
	})
	.then(function(contents) {
		var deferred = promise_lib.defer();
		var categories = [];
		var categoryCountMap = {};
		contents.forEach(function(content) {
			if(content.categories) {
				content.categories.forEach(function(cat) {
					if(categories.indexOf(cat) == -1) {
						categories.push(cat);
					}
					if(cat != '') {
						if(!categoryCountMap[cat]) categoryCountMap[cat] = 0;
						categoryCountMap[cat]++;
					}
				});
			}
		});
		concept.contentCategories = [];
		categories.forEach(function(cat) {
			if(cat != "") {
				if(concept.contentCategories.indexOf(cat) == -1) {
					concept.contentCategories.push(cat);
				}
			}
		});
		concept.categoryCounts = [];
		for(k in categoryCountMap) {
			concept.categoryCounts.push({name: k, count: categoryCountMap[k]});
		}
		//console.log(concept.identifier, 'contentCategories', concept.contentCategories);
		concept.contentCount = contents.length;
		concept.markModified('categoryCounts');
		concept.markModified('contentCategories');
		concept.save(function(err) {
			if(err) {
				console.log('Save Concept Err', err);
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('updateCategory() - err', err);
		defer.reject(err);
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

function setCategoriesOnConcepts(conceptIds) {
	var d = new Date();
	var t1 = d.getTime();
	console.log('Setting categories on content');
	ConceptModel.find().where('identifier').in(conceptIds).exec(function (err, concepts) {
		var promises = [];
		concepts.forEach(function(concept) {
			promises.push(updateCategory(concept));
		});
		promise_lib.all(promises).then(function(value) {
			d = new Date();
			var t2 = d.getTime();
			console.log('Reverse lookup completed in - ' + (t2 - t1) + ' ms');
		}).catch(function(err) {
			console.log('Error in setCategoriesOnConcepts() :', err);
		});
	});
}

exports.categoryReverseLookup = function(courseId, conceptIds) {
	LoggerUtil.setOperationName('categoryReverseLookup');
	if(courseId) {
		console.log('Using courseId to do category reverse lookup');
		ConceptMapCache = mongoose.model('ConceptMapCache');
		ConceptMapCache.findOne({courseId: courseId}, 'conceptsList').lean().exec(function(err, conceptCache) {
			if(err) {
				console.log('Error fetching concepts list in concept cache');
			} else {
				setCategoriesOnConcepts(conceptCache.conceptsList);
			}
		});
	} else if(conceptIds) {
		console.log('Using conceptIds array to do category reverse lookup');
		setCategoriesOnConcepts(conceptIds);
	} else {
		console.log('course id or list of concept ids are required');
	}
}

exports.getContentsForConcepts = function(req, res) {
	LoggerUtil.setOperationName('getContentsForConcepts');
	var conceptIds = req.body.conceptIds;
	var category = req.body.category;
	if(!category || category == "" || category.trim() == "") category = null;
	var conceptObjects = [];
	conceptIds.forEach(function(conceptId) {
		if(conceptId && conceptId != null && conceptId != '') {
			conceptObjects[conceptObjects.length] = {conceptId: conceptId, contentList: []};
		}
	})
	var promises = [];
	for(k in conceptObjects) {
		promises.push(getConceptContents(conceptObjects[k], category, req, res));
	}
	promise_lib.all(promises).then(function(value) {
	    var returnMap = [];
	    for(k in conceptObjects) {
	    	if(conceptObjects[k].contentList.length > 0) {
	    		returnMap[returnMap.length] = conceptObjects[k];
	    	}
	    }
	    res.send(JSON.stringify(returnMap));
	}).catch(function(err) {
		console.log('Error:', err);
	});
}

function getConceptContents(conceptObj, category, req, res) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ConceptModel.findOne({identifier: conceptObj.conceptId}, {'title':1, 'description': 1}).lean().exec(function(err, concept) {
			if(err) {
				defer.reject(err);
			} else {
				conceptObj.title = concept.title;
				conceptObj.description = concept.description;
			}
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		return getContentForConcept(conceptObj.conceptId, category, req, res);
	})
	.catch(function(err) {
		console.log('getConceptContents() - Error fetching concept contents.', err);
	})
	.done(function(contents) {
		conceptObj.contentList = contents;
		deferred.resolve();
	});
	return deferred.promise;
}

/**
 * Function to fetch the concept Map from the ConceptMapCache model. This function assumes that the cache is pre-built
 * @param  {Request} req - The request object
 * @param  {Response} res - The response object
 * @return {json} - The concept map json
 */
exports.fetchSunburstConceptMap = function(req, res) {
	LoggerUtil.setOperationName('fetchSunburstConceptMap');
	var courseId = req.body.courseId;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('ConceptMapCache',{courseId: courseId}, {'conceptMap':1}, function(err, conceptCache) {
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve(conceptCache.conceptMap);
			}
		});
		return defer.promise;
	})
	.then(function(concepts) {
		console.log('fetchSunburstConceptMap() - Done fetching concept map.');
		var conceptsStr = JSON.stringify(concepts);
		res.send(conceptsStr);
	})
	.catch(function(err) {
		console.log('fetchSunburstConceptMap() - Error - ', err);
		res.send(err);
	})
	.done();
}

/**
 * Function which is invoked at node startup to build the concept map. This is called only once for a course.
 * @return void
 */
exports.cacheConceptMaps = function() {
	promise_lib.resolve()
	.then(getCourseIdsWithNoConceptMapCache())
	.then(cacheConceptMapForCourses())
	.catch(function(err) {
		console.log('cacheConceptMaps():Error:', err);
	})
	.done(function() {
		console.log('Finished caching concept maps');
	})
}

/**
 * Get the course ids with no concept map
 * @return function - A promisified function
 */
function getCourseIdsWithNoConceptMapCache() {
	return function() {
		var deferred = promise_lib.defer();
		promise_lib.resolve()
		.then(function() {
			var defer = promise_lib.defer();
			CourseModel = mongoose.model('CourseModel');
			CourseModel.find({}, 'identifier').lean().exec(function(err, courses) {
				if(err) {
					defer.reject(err);
				} else {
					var courseIds = [];
					courses.forEach(function(course) {
						courseIds.push(course.identifier);
					});
					defer.resolve(courseIds);
				}
			});
			return defer.promise;
		})
		.then(function(courseIds) {
			var defer = promise_lib.defer();
			var promises = [];
			courseIds.forEach(function(courseId) {
				promises.push(checkIfConceptMapIsCached(courseId));
			});
			promise_lib.all(promises).then(function(value) {
			    defer.resolve(value);
			});
			return defer.promise;
		})
		.catch(function(err) {
			console.log('getCourseIdsWithNoConceptMapCache(). Error - ', err);
			deferred.reject(err);
		})
		.done(function(ids) {
			var returnIds = [];
			ids.forEach(function(id) {
				if(id != '') {
					returnIds.push(id);
				}
			});
			deferred.resolve(returnIds);
		});
		return deferred.promise;
	};
}

/**
 * Cache concept map for a list of courses.
 * @return function - A promisified function
 */
function cacheConceptMapForCourses() {
	return function(courseIds) {
		var defer = promise_lib.defer();
		var promises = [];
		courseIds.forEach(function(courseId) {
			promises.push(buildConceptMap(courseId));
		});
		promise_lib.all(promises).then(function(value) {
		    defer.resolve();
		});
		return defer.promise;
	};
}

/**
 * Check if the concept map is built for the courseId
 * @param  {[type]} courseId [description]
 * @return {[type]}          [description]
 */
function checkIfConceptMapIsCached(courseId) {
	var defer = promise_lib.defer();
	ConceptMapCache = mongoose.model('ConceptMapCache');
	ConceptMapCache.count({courseId: courseId}).exec(function(err, count) {
		if(count == 0) {
			defer.resolve(courseId);
		} else {
			defer.resolve('');
		}
	});
	return defer.promise;
}

exports.updateConceptsCache = function(req, res) {
	if(req.params.courseId) {
		exports.updateConceptMapCache(req.params.courseId);
		res.send("OK");
	} else {
		res.send("Please give course Id.");
	}
}

exports.updateConceptMapCache = function(courseId, rootConceptId, conceptIds) {
	if(courseId || rootConceptId) {
		rebuildConceptMap(courseId, rootConceptId).catch(function(err) {
			console.log('Error building conceptMap', err);
		});
	} else if(conceptIds) {
		ConceptMapCache = mongoose.model('ConceptMapCache');
		ConceptMapCache.find({conceptsList: {$in : conceptIds}}, {courseId: 1, rootConceptId: 1, _id: 0})
			.lean().exec(function(err, concepts) {
			if (concepts && null != concepts && concepts.length > 0) {
				concepts.forEach(function(cachedConcept) {
					rebuildConceptMap(cachedConcept.courseId, cachedConcept.rootConceptId);
				});
			}
		});
	} else {
		console.log('updateConceptMapCache() - No required variables found in arguments');
	}
}

/**
 * Build the concept map recursively and save it in ConceptMapCache
 * @param  {[type]} courseId [description]
 * @return {[type]}          [description]
 */
function buildConceptMap(courseId) {
	var distinctConcepts = {};
	var contentOrder = 1;
	var deferred = promise_lib.defer();
	var rootConceptId;
	promise_lib.resolve()
	.then(function() {
		return getOrderCutOffValue(courseId);
	})
	.then(function(order) {
		contentOrder = order;
		var defer = promise_lib.defer();
		LearningObjectModel = mongoose.model('LearningObjectModel');
		LearningObjectModel.findOne({identifier: courseId}, 'concepts').lean().exec(function(err, course) {
			if(err) {
				defer.reject(err);
			} else {
				if(course && course.concepts && course.concepts[0])
					defer.resolve(course.concepts[0].conceptIdentifier);
				else
					defer.reject("Root concept not found");
			}
		});
		return defer.promise;
	})
	.then(function(conceptId) {
		rootConceptId = conceptId;
		var defer = promise_lib.defer();
		ConceptModel.findOne({identifier: conceptId}, {'title':1, 'description': 1}).lean().exec(function (err, concept) {
			var conceptArray = [];
			conceptArray.push({name: concept.title, conceptTitle: concept.title, conceptId: conceptId, description: concept.description});
			defer.resolve(conceptArray);
		});
		return defer.promise;
	})
	.then(function(concepts) {
		return fetchSunburstRecursive(concepts, [], distinctConcepts, 0);
	})
	.then(function(concepts) {
		var defer = promise_lib.defer();
		ContentModel = mongoose.model('MediaContentModel');
		var group = {
			key: {'categories.0': 1},
			cond: {'concepts.conceptIdentifier':{$in:Object.keys(distinctConcepts)}, order : {$gte: contentOrder}},
			reduce: function( curr, result ) { result.total += 1; },
			initial: { total : 0 }
		};
		var categoryCounts = { totalCount: 0 };
		ContentModel.collection.group(group.key, group.cond, group.initial, group.reduce, null, true, function(err, results) {
		    if(err) {
		    	console.log('err', err);
		    } else {
		    	results.forEach(function(result) {
			    	if(result['categories.0'] != '') {
			    		categoryCounts[result['categories.0']] = result.total;
			    		categoryCounts.totalCount += result.total;
			    	}
			    });
		    	concepts[concepts.length] = categoryCounts;
		    }
		    defer.resolve(concepts);
		});
		return defer.promise;
	})
	.then(function(concepts) {
		var defer = promise_lib.defer();
		ConceptMapCache = mongoose.model('ConceptMapCache');
		var conceptCache = new ConceptMapCache();
		conceptCache.courseId = courseId;
		conceptCache.rootConceptId = rootConceptId;
		conceptCache.conceptMap = concepts;
		conceptCache.conceptsList = Object.keys(distinctConcepts);
		conceptCache.conceptsTitleList = distinctConcepts;
		conceptCache.save(function(err) {
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve();
			}
		});
		return defer.promise;
	})
	.catch(function(err) {
		console.log('buildConceptMap():Error - ', err);
		deferred.reject(err);
	})
	.done(function() {
		console.log('ConceptMap build complete for courseId - ' + courseId);
		deferred.resolve('done');
	});
	return deferred.promise;
}

/**
 * Build the concept map recursively and save it in ConceptMapCache
 * @param  {[type]} courseId [description]
 * @return {[type]}          [description]
 */
function rebuildConceptMap(courseId, rootConceptId) {
	console.log('courseId', courseId);
	var distinctConcepts = {};
	var contentOrder = 1;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return getOrderCutOffValue(courseId);
	})
	.then(function(order) {
		contentOrder = order;
		var defer = promise_lib.defer();
		if(courseId) {
			LearningObjectModel = mongoose.model('LearningObjectModel');
			LearningObjectModel.findOne({identifier: courseId}, 'concepts').lean().exec(function(err, course) {
				if(err || !course || !course.concepts || course.concepts.length == 0) {
					defer.reject('Course does not contain a root concept');
				} else {
					rootConceptId = course.concepts[0].conceptIdentifier;
					defer.resolve(course.concepts[0].conceptIdentifier);
				}
			});
		} else {
			defer.resolve(rootConceptId);
		}
		return defer.promise;
	})
	.then(function(conceptId) {
		var defer = promise_lib.defer();
		ConceptModel.findOne({identifier: conceptId}, {'title':1, 'description': 1}).lean().exec(function (err, concept) {
			var conceptArray = [];
			conceptArray.push({name: concept.title, conceptTitle: concept.title, conceptId: conceptId, description: concept.description});
			defer.resolve(conceptArray);
		});
		return defer.promise;
	})
	.then(function(concepts) {
		return fetchSunburstRecursive(concepts, [], distinctConcepts, 0);
	})
	.then(function(concepts) {
		var defer = promise_lib.defer();
		ContentModel = mongoose.model('MediaContentModel');
		var group = {
			key: {'categories.0': 1},
			cond: {'concepts.conceptIdentifier':{$in:Object.keys(distinctConcepts)}, order : {$gte: contentOrder}},
			reduce: function( curr, result ) { result.total += 1; },
			initial: { total : 0 }
		};
		var categoryCounts = { totalCount: 0 };
		ContentModel.collection.group(group.key, group.cond, group.initial, group.reduce, null, true, function(err, results) {
		    if(err) {
		    	console.log('err', err);
		    } else {
		    	results.forEach(function(result) {
			    	if(result['categories.0'] != '') {
			    		categoryCounts[result['categories.0']] = result.total;
			    		categoryCounts.totalCount += result.total;
			    	}
			    });
		    	concepts[concepts.length] = categoryCounts;
		    }
		    defer.resolve(concepts);
		});
		return defer.promise;
	})
	.then(function(concepts) {
		ConceptMapCache = mongoose.model('ConceptMapCache');
		var defer = promise_lib.defer();
		MongoHelper.findOne('ConceptMapCache', {courseId: courseId}, {rootConceptId: 1, courseId: 1}, function(err, conceptCache) {
			if(err || conceptCache == null) {
				var conceptCache = new ConceptMapCache();
				conceptCache.courseId = courseId;
				conceptCache.rootConceptId = rootConceptId;
				conceptCache.conceptMap = concepts;
				conceptCache.conceptsList = Object.keys(distinctConcepts);
				conceptCache.conceptsTitleList = distinctConcepts;
				conceptCache.save(function(err) {
					if(err) {
						defer.reject(err);
					} else {
						defer.resolve();
					}
				});
			} else {
				ConceptMapCache.update({courseId: courseId}, {
					$set: {
						rootConceptId: rootConceptId,
						conceptMap: concepts,
						conceptsList: Object.keys(distinctConcepts),
						conceptsTitleList: distinctConcepts
					}
				}).exec(function(err) {
					if(err) {
						defer.reject(err);
					} else {
						defer.resolve();
					}
				});
			}
		});

		return defer.promise;
	})
	.catch(function(err) {
		console.log('rebuildConceptMap():Error - ', err);
		deferred.reject(err);
	})
	.done(function() {
		console.log('ConceptMap rebuild complete for courseId - ' + courseId);
		deferred.resolve('done');
	});
	return deferred.promise;
}

function updateConceptsInConceptMapCache(conceptIds) {
	var matchingConcepts = [];
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		ConceptModel.find().where('identifier').in(conceptIds).exec(function (err, concepts) {
			var promises = [];
			matchingConcepts = concepts;
			concepts.forEach(function(concept) {
				promises.push(updateCategory(concept));
			});
			promise_lib.all(promises).then(function(value) {
				concepts.forEach(function(concept) {
					matchingConcepts[concept.identifier] = concept;
				});
				defer.resolve();
			}).catch(function(err) {
				defer.reject(err);
			});
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		ConceptMapCache = mongoose.model('ConceptMapCache');
		ConceptMapCache.find({conceptsList:{$in:conceptIds}}, 'conceptMap').exec(function(err, maps) {
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve(maps);
			}
		});
		return defer.promise;
	})
	.then(function(maps) {
		if(maps && maps.length > 0) {
			var defer = promise_lib.defer();
			var promises = [];
			maps.forEach(function(map) {
				promises.push(updateConceptMapCache(map, matchingConcepts));
			});
			promise_lib.all(promises).then(function(value) {
				defer.resolve();
			}).catch(function(err) {
				defer.reject(err);
			});
			return defer.promise;
		}
	})
	.catch(function(err) {
		console.log('updateConceptsInConceptMapCache():Error updating concept maps');
	})
	.done(function() {
		console.log('updateConceptsInConceptMapCache():Concept Maps updated');
	});
}

function updateConceptMapCache(map, matchingConcepts) {
	var deferred = promise_lib.defer();
	deferred.resolve();
	//TODO: recurse through conceptmap and update concepts
	return deferred.promise;
}

/* Start of functions to build concept map recursively calling mongo db */

function fetchSunburstSubConcepts(concept, parents, distinctConcepts, level) {
	var deferred = promise_lib.defer();
	ConceptModel.findOne({identifier: concept.conceptId}, {'associations':1,'description':1, 'contentCount':1, 'categoryCounts':1}).lean().exec(function(er, concpt) {
		concept['level'] = level;
		concpt.associations.sort(conceptComparator);
		if(parents.indexOf(concept.conceptId) != -1) {
			concept['sum'] = 0;
			deferred.resolve(concept);
		} else {
			addToDistinctConcepts(distinctConcepts, concept.conceptId, concept.conceptTitle);
			parents.push(concept.conceptId);
			fetchSunburstRecursive(concpt.associations, parents, distinctConcepts, ++level)
			.then(function(associations) {
				concept.children = associations;
				concept.description = concpt.description;
				concept.contentCount = concpt.contentCount;
				concept.categoryCounts = concpt.categoryCounts;
				try {
					concept.size = 1;
					var sum = concept.children.length;
					var contentCount = concpt.contentCount;
					concept.children.forEach(function(child) {
						child['name'] = child.conceptTitle;
						child['size'] = 1;
						sum += child.sum ? child.sum : (child.children ? child.children.length : 0);
						contentCount += child.totalContentCount ? child.totalContentCount: 0;
						delete child.conceptTitle;
					});
					concept['sum'] = sum;
					concept['totalContentCount'] = contentCount;
				} catch(err) {
					console.log(err);
				}
				deferred.resolve(concept);
			});
		}
	});
	return deferred.promise;
}

function fetchSunburstRecursive(concepts, parents, distinctConcepts, level) {
	var deferred = promise_lib.defer();
	var promises = [];
	concepts.forEach(function(concept) {
		promises.push(fetchSunburstSubConcepts(concept, parents, distinctConcepts, level));
	});
	promise_lib.all(promises).then(function(value) {
	    deferred.resolve(value);
	}).catch(function(err) {
		console.log('Error:', err);
	});
	return deferred.promise;
}

function getOrderCutOffValue(courseId) {
	var deferred = promise_lib.defer();
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: courseId}, 'order').lean().exec(function(err, course) {
		if (err || typeof course === 'undefined' || course == null) {
			deferred.resolve(appConfig.ORDER_CUTOFF_VALUE);
		} else {
			if (course.order == null || !course.order || course.order == '' || isNaN(course.order)) {
				deferred.resolve(appConfig.ORDER_CUTOFF_VALUE);
			} else {
				deferred.resolve(course.order);
			}
		}
	});
	return deferred.promise;
}

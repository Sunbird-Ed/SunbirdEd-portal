
var interactionService = require('../services/InteractionService.js');
var dummy = require('../services/data.js');
var mongoose = require('mongoose');
var nodefn = require('when/node');
var promise_lib = require('when');
var userActions = mongoose.model('UserActionModel');
var crypto = require('crypto');
var fs = require('fs');
require('date-format-lite');

var DEFAULT_RESULT_START_POSITION = 0;

var getUserEmail = function(req){
	if(req.user.inboxEmailId)
		return req.user.inboxEmailId;
	else
		return req.user.identifier + "@perceptronnetwork.com";
}

var setUserMetadata = function(obj, user){
	obj.from = user.identifier;
	obj.userEmail = (user.inboxEmailId)? user.inboxEmailId : user.identifier + "@perceptronnetwork.com";
	obj.userName = user.displayName;
	obj.userType = user.userType || 'student';
	return obj;
}

function handleError(err, res) {
	res.send({error: true, errorMsg: err.toString()});
}

exports.getInteractionActions = function(req, res) {

	var forumType = req.body.forumType;
	var actionsMetadata = {
		interactionRole: 'user',
		privileges: {},
		actions: {}
	}

	if(req.roles.indexOf('faculty_observer') > -1) {
		actionsMetadata.interactionRole = 'observer';
	}

	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var intActions = mongoose.model('InteractionActionModel');
		intActions.find({interactionType: forumType}).lean().exec(function(err, actions) {
			defer.resolve(actions);
		});
		return defer.promise;
	})
	.then(function(actions) {
		actions.forEach(function(action) {
			var key = action.postType + '_' + action.action;
			actionsMetadata.actions[key] = {
				occurrence: action.occurrence,
				occurrenceType: action.occurrenceType,
				interationRolesPriority: action.interationRolesPriority,
				inverseOfAction: action.inverseOfAction,
				defaultUserPrivilege: action.defaultUserPrivilege,
				roles: {}
			}
			action.interactionRoles.forEach(function(interactionRole) {
				actionsMetadata.actions[key].roles[interactionRole.roleType] = {
					access: interactionRole.access,
					accessDisplayState: interactionRole.accessDisplayState,
					actionDisplayState: interactionRole.actionDisplayState
				}
			});
 		});
	})
	.then(function() {
		var defer = promise_lib.defer();
		var userPrivileges = mongoose.model('UserPrivilegesModel');
		userPrivileges.findOne({userId: req.user.identifier, interactionType: forumType}).lean().exec(function(err, privileges) {

			if(null != privileges) {
				if(privileges.interactionRole != null && privileges.interactionRole != '') {
					actionsMetadata.interactionRole = privileges.interactionRole;
				}
				privileges.interactionActions.forEach(function(action) {
					actionsMetadata.privileges[action.action] = action.privilege;
				});
			}
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		res.send(JSON.stringify(actionsMetadata));
	})
	.catch(function(err) {
		console.log('Error getting actions metadata - ', err);
	})
	.done();
}

exports.getCommentActions = function(req, res) {

}

exports.getUserActions = function(req, res){
	var data = {
		USER_EMAIL_ID: getUserEmail(req),
	}
	interactionService.getActions(data).then(function(response){
		res.send(response);
	}).catch(function(e){
		handleError(e, res);
	})
}

exports.postInteraction = function(req, res) {
	var metadata = req.body.metadata;
	req.sanitize("title").escape();
	console.log("req.body.title: ", req.body.title);
	var data = {
		USER_EMAIL_ID: getUserEmail(req),
		INTERACTION: {
			contextMetadata: {
				type: 'interaction',
				interactionType : metadata.interactionType,
				accessType: metadata.accessType,
				learningElementId : metadata.learningElementId,
				leType : metadata.leType,
				interceptionPoint : (metadata.interceptionPoint) ? metadata.interceptionPoint : '',
				courseId : req.body.courseId,
				status: 'open',
				members: [],
				moderationUsers: [],
				lessonId: (metadata.lessonId) ? metadata.lessonId : '',
				moduleId: (metadata.moduleId) ? metadata.moduleId : '',
				to: metadata.to
			},
			systemMetadata: {},
			post:req.body.post,
			title:req.body.title,
			tags: [],
			attachments: []
		}
	};
	if(metadata && metadata.rateCount) {
		data.INTERACTION.contextMetadata.rateCount = metadata.rateCount;
	}
	if(metadata.viewCount) {
		data.INTERACTION.contextMetadata.viewCount = metadata.viewCount;
	}
	data.INTERACTION.systemMetadata = setUserMetadata(data.INTERACTION.systemMetadata, req.user);
	if(metadata.concepts && metadata.concepts.length > 0) {
		data.INTERACTION.concepts = metadata.concepts.map(function(concept){ return concept.identifier });
	}
	if(req.body.attachments) {
		req.body.attachments.forEach(function(attachment) {
			var fileData = fs.readFileSync(attachment.path);
			attachment.inputStream = fileData;
		});
		data.INTERACTION.attachments = req.body.attachments;
	}
	getElementConcepts(metadata.leType, metadata.learningElementId)
	.then(function(concepts) {
		data.INTERACTION.concepts = concepts;
		interactionService.startInteraction(data)
		.then(function(response){
			response.responseValueObjects.INTERACTION.isOwner = true;
			updatePostInteractionSummary(data);
			res.send(response.responseValueObjects);
		}).catch(function(err){
			handleError(err, res);
		});
	});
}

function getElementConcepts(elementType, elementId) {
	var modelName = '';
	if(elementType == 'learningresource') {
		modelName = 'LearningResourceModel';
	} else if(elementType == 'learningactivity') {
		modelName = 'LearningActivityModel';
	} else if(elementType == 'content') {
		modelName = 'MediaContentModel';
	} else {
		modelName = 'LearningObjectModel';
	}
	var deferred = promise_lib.defer();
	MongoHelper.findOne(modelName, {identifier: elementId}, {concepts: 1}, function(err, object) {
		var concepts = [];
		if(object && object.concepts) {
			object.concepts.forEach(function(concept) {
				concepts.push(concept.conceptIdentifier);
			});
		}
		deferred.resolve(concepts);
	});
	return deferred.promise;
}

function updatePostInteractionSummary(interaction) {
	var metadata = interaction.INTERACTION.contextMetadata;
	var modelName = '';
	if(metadata.leType == 'learningresource') {
		modelName = 'LearningResourceModel';
	} else if(metadata.leType == 'learningactivity') {
		modelName = 'LearningActivityModel';
	} else if(metadata.leType == 'content') {
		modelName = 'MediaContentModel';
	} else {
		modelName = 'LearningObjectModel';
	}
	increment(modelName, metadata.learningElementId);
	if(metadata.lessonId && metadata.lessonId != metadata.learningElementId) {
		increment('LearningObjectModel', metadata.lessonId);
	}
	if(metadata.moduleId && metadata.moduleId != metadata.learningElementId) {
		increment('LearningObjectModel', metadata.moduleId);
	}
	if(metadata.courseId && metadata.courseId != metadata.learningElementId) {
		increment('LearningObjectModel', metadata.courseId);
	}
}

function increment(modelName, idValue) {
	MongoHelper.update(modelName,{'identifier': idValue},{$inc:{ 'summaries.qaCount': 1}}, function(err, obj) {
		if(err) console.log('Error increment summary:', err);
	});
}

exports.listInteractions = function(req, res) {
	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		SEARCH: {
			metadata: req.body.metadata,
			model: req.body.courseId,
			limit: (req.body.limit) ? req.body.limit : appConfig.DEFAULT_RESULT_SIZE,
			offset: (req.body.offset) ? req.body.offset : DEFAULT_RESULT_START_POSITION,
			orderFields: {'createdDate': 'desc'}
		}
	}
	args.SEARCH.metadata = {
		interactionType: req.body.metadata.interactionType,
		learningElementId: req.body.metadata.learningElementId
	};
	interactionService.getInteractions(args).then(function(data) {
		res.send(data.responseValueObjects.INTERACTIONS.valueObjectList);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.searchInteractions = function(req, res) {
	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		SEARCH: {
			metadata: req.body.metadata,
			searchText: req.body.query,
			model: req.body.courseId,
			filters:[],
			orFilters:[],
			orderFields:{},
			limit: (req.body.limit) ? req.body.limit : appConfig.DEFAULT_RESULT_SIZE,
			offset: (req.body.offset) ? req.body.offset : DEFAULT_RESULT_START_POSITION
		 }
	};
	args.SEARCH.metadata.type = 'interaction';
	if(req.body.concepts) {
		var conceptFilter = {name:'concept', operator:'in', valueList:[], uriDataType: true};
		req.body.concepts.forEach(function(conceptId) {
			conceptFilter.valueList.push(conceptId);
		});
		args.SEARCH.filters.push(conceptFilter);
	}
	switch(req.body.order) {
		case 'mostActive':
			args.SEARCH.orderFields['activeCount'] = 'desc';
			break;
		case 'mostAnswers':
			args.SEARCH.orderFields['commentsCount'] = 'desc';
			break;
		case 'topRated':
			args.SEARCH.orderFields['rateCount'] = 'desc';
			break;
		case 'lastUpdated':
			args.SEARCH.orderFields['lastUpdated'] = 'desc';
			break;
		default:
			args.SEARCH.orderFields['createdDate'] = 'desc';
			break;
	}
	var filters = req.body.filter || [];
	filters.forEach(function(filterElement) {
		switch(filterElement.name) {
			case 'answered':
				args.SEARCH.filters.push({name:'markAsAnswered', operator:'eq', value: true});
				break;
			case 'answeredByMe':
				args.SEARCH.filters.push({name:'comment.commentType', operator:'eq', value:'answer'});
				args.SEARCH.filters.push({name:'comment.from', operator:'eq', value:req.user.identifier});
				break;
			case 'answeredByTutor':
				args.SEARCH.filters.push({name:'comment.commentType', operator:'eq', value:'answer'});
				args.SEARCH.filters.push({name:'comment.userType', operator:'eq', value:'coach'});
				break;
			case 'answeredByFaculty':
				args.SEARCH.filters.push({name:'comment.commentType', operator:'eq', value:'answer'});
				args.SEARCH.filters.push({name:'comment.userType', operator:'eq', value:'faculty'});
				break;
			case 'askedByMe':
				args.SEARCH.filters.push({name:'from', operator:'eq', value: req.user.identifier});
				break;
			case 'closed':
				args.SEARCH.filters.push({name:'closed', operator:'eq', value:true});
				break;
			case 'notAnswered':
				args.SEARCH.filters.push({name:'markAsAnswered', operator:'eq', value: false, optional: true});
				break;
			case 'fromDate':
				args.SEARCH.filters.push({name:'createdDate', operator:'ge', dateValue: filterElement.value.date().getTime()});
				break;
			case 'toDate':
				args.SEARCH.filters.push({name:'createdDate', operator:'le', dateValue: filterElement.value.date().getTime()});
				break;
			case 'excludeNotAns':
				if(filterElement.value) {
					args.SEARCH.filters.push({name:'markAsAnswered', operator:'eq', value: true});
				}
				break;
			case 'excludeNotRel':
				if(filterElement.value) {
					args.SEARCH.filters.push({name:'markAsNotRelevant', operator:'eq', value: false, optional: true});
					args.SEARCH.filters.push({name:'markAsFrivolous', operator:'eq', value: false, optional: true});
				}
				break;
			case 'excludeSpam':
				if(filterElement.value) {
					args.SEARCH.filters.push({name:'markAsSpam', operator:'eq', value: false, optional: true});
				}
				break;
			case 'to':
				if(filterElement.value) {
					args.SEARCH.filters.push({name:'to', operator:'eq', value: filterElement.value});
				}
				break;
			case 'from':
				if(filterElement.value) {
					args.SEARCH.filters.push({name:'from', operator:'eq', value: filterElement.value});
				}
				break;
		}
	});
	var orFilters = req.body.orFilter || [];
	orFilters.forEach(function(filter) {
		args.SEARCH.orFilters.push({name:filter.name, operator:filter.operator, value: filter.value});
	});
	interactionService.searchInteractions(args).then(function(data) {
		var list = data.responseValueObjects.INTERACTIONS.valueObjectList ? data.responseValueObjects.INTERACTIONS.valueObjectList : [];
		res.send(list);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.getInteraction = function(req, res) {
	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE_ID: req.params.courseId,
		INTERACTION_ID: req.params.interactionId
	};
	var interaction = {};
	interactionService.getInteraction(args)
	.then(function(data) {
		var deferred = promise_lib.defer();
		interaction = data.responseValueObjects.INTERACTION;
		userActions.findOne({ 'userId': req.user.identifier, 'interactionId' : interaction.interactionId}).lean().exec(function(err, actionsObj){
			if(null == actionsObj) {
				actionsObj = {userId: req.user.identifier};
			}
			deferred.resolve(actionsObj);
		});
		return deferred.promise;
	})
	.then(function(actionsObj) {
		if(interaction.systemMetadata.from == req.user.identifier) {
			interaction.isOwner = true;
		} else {
			interaction.isOwner = false;
		}
		if(interaction.comments) {
			interaction.comments.forEach(function(comment) {
				if(comment.systemMetadata.from == req.user.identifier) {
					comment.isOwner = true;
				} else {
					comment.isOwner = false;
				}
				if(comment.postComments) {
					comment.postComments.forEach(function(pc) {
						if(pc.systemMetadata.from == req.user.identifier) {
							pc.isOwner = true;
						} else {
							pc.isOwner = false;
						}
					});
				}
			});
		}
		if(interaction.postComments) {
			interaction.postComments.forEach(function(comment) {
				if(comment.systemMetadata.from == req.user.identifier) {
					comment.isOwner = true;
				} else {
					comment.isOwner = false;
				}
			});
		}
		interaction.actionsHash = [];
		interaction.uid = new Buffer(req.user.identifier).toString('base64');
		if(actionsObj.actions && actionsObj.actions.length > 0) {
			actionsObj.actions.forEach(function(action) {
				var hashKey = actionsObj.userId + '~' + actionsObj.interactionId + '~' + action.action;
				interaction.actionsHash.push(crypto.createHash('md5').update(hashKey).digest('base64'));
			});
		}
		if(actionsObj.comments && actionsObj.comments.length > 0) {
			actionsObj.comments.forEach(function(comment) {
				comment.actions.forEach(function(action) {
					var hashKey = actionsObj.userId + '~' + comment.commentId + '~' + action.action;
					interaction.actionsHash.push(crypto.createHash('md5').update(hashKey).digest('base64'));
				});
			});
		}
		interaction.actionsObj = actionsObj;
		delete interaction.actionsObj.userId;
	})
	.then(function() {
		res.send(interaction);
	})
	.catch(function(e){
		handleError(e, res);
	});
}

function updateUserAction(interactionId, commentId, userId, action, value) {
	if(value) {
		updateUserActions(interactionId, userId, commentId, action);
	} else {
		undoUserAction(interactionId, userId, commentId, action);
	}
}

exports.comment = function(req, res) {
	var metadata = req.body.metadata;
	var interaction = req.body.interaction;
	var data = {
		USER_EMAIL_ID: getUserEmail(req),
		COMMENT:{
			post:req.body.post,
			title:req.body.title,
			rootInteractionId: req.body.rootInteractionId,
			parentAwsMessageId: interaction.systemMetadata.awsMessageId,
			parentType : (interaction.commentId ? 'comment' : 'interaction'),
			parentId : interaction.commentId || interaction.interactionId,
			contextMetadata: {
				type: 'comment',
				commentType : 'postComment',
				learningElementId : interaction.contextMetadata.learningElementId,
				leType : interaction.contextMetadata.leType,
				courseId : interaction.contextMetadata.courseId
			},
			systemMetadata: {},
			attachments: []
		}
	};
	data.COMMENT.systemMetadata = setUserMetadata(data.COMMENT.systemMetadata, req.user);
	interactionService.commentOnPost(data).then(function(response){
		updateUserActions(req.body.interaction.interactionId, req.user.identifier, req.body.interaction.commentId, 'comment');
		response.responseValueObjects.COMMENT.isOwner = true;
		res.send(response);
	}).catch(function(e){
		handleError(e,res);
	});
}

exports.answer = function(req, res){
	var metadata = req.body.metadata;
	var interaction = req.body.interaction;
	var data = {
		USER_EMAIL_ID: getUserEmail(req),
		COMMENT:{
			post:req.body.post,
			title:req.body.title,
			parentAwsMessageId: interaction.systemMetadata.awsMessageId,
			parentType : 'interaction',
			parentId : req.body.interaction.interactionId,
			contextMetadata: {
				type: 'comment',
				commentType : 'answer',
				learningElementId : interaction.contextMetadata.learningElementId,
				leType : interaction.contextMetadata.leType,
				courseId : interaction.contextMetadata.courseId
			},
			systemMetadata: {},
			attachments: []
		}
	};
	data.COMMENT.systemMetadata = setUserMetadata(data.COMMENT.systemMetadata, req.user);
	if(metadata && metadata.rateCount) {
		data.COMMENT.contextMetadata.rateCount = metadata.rateCount;
	}
	//TODO: update with attachments implementation.
	if(req.body.attachments) {
		req.body.attachments.forEach(function(attachment) {
			var fileData = fs.readFileSync(attachment.path);
			attachment.inputStream = fileData;
		});
		data.COMMENT.attachments = req.body.attachments;
	}

	interactionService.postComment(data).then(function(response){
		updateUserActions(req.body.interaction.interactionId, req.user.identifier, null, 'answer');
		response.responseValueObjects.COMMENT.isOwner = true;
		res.send(response);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.rate = function(req, res){

	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE_ID : req.body.courseId,
		ACTION: {
			interactionId: req.body.interactionId,
			commentId: (req.body.commentId) ? req.body.commentId : '',
			action : 'rate',
			actionBy: req.user.identifier,
			actionUserType: req.user.userType || 'student',
			actionMessage: '',
			actionValue: req.body.upVote
		}
	};
	interactionService.ratePost(args).then(function(data){
		updateUserAction(req.body.interactionId, req.body.commentId, req.user.identifier, 'rate', req.body.upVote);
		res.send(data.responseValueObjects);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.follow = function(req, res) {

	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE_ID : req.body.courseId,
		ACTION: {
			interactionId: req.body.interactionId,
			commentId: (req.body.commentId) ? req.body.commentId : '',
			action : 'follow',
			actionBy: req.user.identifier,
			actionUserType: req.user.userType || 'student',
			actionMessage: '',
			actionValue: req.body.follow
		}
	};

	interactionService.follow(args).then(function(data){
		updateUserAction(req.body.interactionId, null, req.user.identifier, 'follow', req.body.follow);
		res.send(data.responseValueObjects);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.applyAction = function(req, res) {
	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE_ID : req.body.courseId,
		ACTION: {
			interactionId: (req.body.interactionId) ? req.body.interactionId : '',
			commentId: (req.body.commentId) ? req.body.commentId : '',
			action : req.body.action,
			actionBy: req.user.identifier,
			actionUserType: req.user.userType || 'student',
			actionMessage: req.body.actionMsg
		}
	};
	if(req.body.actionValue == "false") {
		args.ACTION.actionValue = false;
	} else {
		args.ACTION.actionValue = true;
	}
	interactionService.applyAction(args).then(function(response){
		updateUserAction(req.body.interactionId, req.body.commentId, req.user.identifier, req.body.action, args.ACTION.actionValue);
		res.send(response);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.applyTag = function(req, res){
	var args = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE_ID: req.body.interaction.contextMetadata.courseId,
		TAG: {
			interactionId: (req.body.interaction.interactionId) ? req.body.interaction.interactionId : '',
			commentId: (req.body.interaction.commentId) ? req.body.interaction.commentId : '',
			tag: req.tag,
			lastModifiedBy:getUserEmail(req),
			createdUserType: req.user.userType
		}
	}
	interactionService.applyTag(args).then().catch(function(e){
		handleError(e, res);
	});
}

function undoUserAction(interactionId, userId, commentId, action) {
	if(commentId) {
		userActions.update(
			{
				'userId': userId,
				'interactionId' : interactionId,
				'comments':{$elemMatch: {'commentId': commentId}}
			},
			{$pull : { "comments.$.actions" : {"action": action}}
		}).exec(function(err, actionsObj){});
	} else {
		userActions.update(
			{
				'userId': userId,
				'interactionId' : interactionId
			},
			{$pull : { "actions" : {"action": action}}
		}).exec(function(err, actionsObj){});
	}
}

function updateUserActions(interactionId, userId, commentId, action){
	var getActionObject = function(action){
			return {
				action: action,
				value: undefined,
				actedOn: new Date()
			}
		};
		userActions.findOne({ 'userId': userId, 'interactionId' : interactionId}, function(err, actionsObj){
			if(!actionsObj){
				var newActionDocument = new userActions({
					userId: userId,
					interactionId : interactionId,
					actions: [],
					comments: []
				});

				if(commentId)
				{
					newActionDocument.comments = [{
						commentId: commentId,
						actions: [getActionObject(action)]
					}];
				}else
					newActionDocument.actions = [getActionObject(action)]
				newActionDocument.save();
			}else{
				if(commentId){
					if(!actionsObj.comments) actionsObj.comments = [];
					for(var i =0; i< actionsObj.comments.length; i++){
						if(actionsObj.comments.commentId == commentId)
							actionsObj.comments[i].actions.push(getActionObject(action));
					}
				}else{
					actionsObj.actions.push(getActionObject(action));
				}
				actionsObj.save();
			}
		});
}

exports.uploadFile = function(req, res){
	var file = req.files.fileObj;
	var courseLobId = req.body.courseLobId;
	var userId = req.user.identifier;
	var sourcePath = 'public/uploads';
	var targetDir = createDirectory(sourcePath, courseLobId, userId, 'temp');
	var serverResponse = uploadFile(file, targetDir, req, res);

}

function createDirectory(parentDir, courseDir, userDir, tempDir){
	var courseDirPath = parentDir+'/'+courseDir;
	var userDirPath = parentDir+'/'+courseDir+'/'+userDir;
	var tempDirPath = parentDir+'/'+courseDir+'/'+userDir+'/'+tempDir;

	if (!fs.existsSync(courseDirPath)) fs.mkdirSync(courseDirPath, 0755);
	if (!fs.existsSync(userDirPath)) fs.mkdirSync(userDirPath, 0755);
	if (!fs.existsSync(tempDirPath)) fs.mkdirSync(tempDirPath, 0755);
	return tempDirPath;
}

function uploadFile(file, path, req, res) {
	if (fs.existsSync(path)){
			fs.readFile(file.path, function (err, data) {
			var fileUniqueName = new Date().getTime() + '_' + file.name;
		  	var newPath = path + '/' + fileUniqueName;
		  	var downloadPath = newPath.replace('public/','');
		  	fs.writeFile(newPath, data, function (err) {
		    	//res.send({url: req.protocol + '://' + req.get('host') + '/uploads/interaction/' + file.name});
		    	res.send({'errStatus': 0,url: req.protocol + '://' + req.get('host') + '/' + downloadPath, 'displayName': file.name, 'path':newPath, 'mimeType':file.type, 'description':''});
		  	});
	  	});
	}
	else{
		res.send({'errStatus': 1});
	}
}

exports.deleteuploadedFile = function(req, res){

	console.log(req.body.deleteFileName);
	var targetFile = req.body.deleteFileName;
	fs.unlink(targetFile, function (err) {
	  if (err){
	  	res.send('0');
	  	throw err;
	  }
	  else{
	  	res.send('1');
	  }
	});
}

exports.getSets = function(req, res) {
	var args = {
		SEARCH: {
			model: req.body.courseId,
			metadata: req.body.metadata
		}
	}
	interactionService.searchSets(args).then(function(response) {
		res.send(response);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.getSet = function(req, res) {
	var args = {
		SET_ID: req.body.setId,
		COURSE_ID: req.body.courseId
	}
	interactionService.getSetInteractions(args).then(function(data) {
		var list = data.responseValueObjects.INTERACTIONS.valueObjectList ? data.responseValueObjects.INTERACTIONS.valueObjectList : [];
		res.send(list);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.checkRole = function(req, res) {
	var responseArgs = {
		role: req.user.roles[0],
		userId: req.user.identifier
	}
	res.send(responseArgs);
}

exports.createSet = function(req, res) {
	var args = {
		USER_EMAIL_ID:req.user.email,
  		COURSE_ID:req.body.courseId,
  		SET:{
			label: req.body.setName,
			manual: true,
			metadata: {
			  context:"interactions",
			  forum:"QA",
			  createdBy:req.user.identifier,
			  createdUserName:req.user.displayName
			}
		}
	}

	interactionService.createSet(args).then(function(data) {
		res.send(data);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.updateSet = function(req, res) {
	var args = {
		USER_EMAIL_ID:req.user.email,
  		COURSE_ID:req.body.courseId,
  		SET:{
  			id: req.body.setId,
			label: req.body.setName,
			manual: true,
			metadata: {
			  context:"interactions",
			  forum:"QA",
			  createdBy:req.user.identifier,
			  createdUserName:req.user.displayName
			}
		}
	}

	interactionService.updateSet(args).then(function(data) {
		res.send(data);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.addInteractionToSet = function(req, res) {
	var args = {
		  "USER_EMAIL_ID": req.user.email,
		  "COURSE_ID": req.body.courseId,
		  "SET_ID": req.body.setId,
		  "INTERACTION_ID":  req.body.intId
	}

	interactionService.addInteractionToSet(args).then(function(data) {
		res.send(data);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.removeInteractionFromSet = function(req, res) {
	var args = {
		"USER_EMAIL_ID": req.user.email,
		"COURSE_ID": req.body.courseId,
		"SET_ID": req.body.setId,
		"INTERACTION_ID":  req.body.intId
	}

	interactionService.removeInteractionFromSet(args).then(function(data) {
		res.send(data);
	}).catch(function(e){
		handleError(e, res);
	});
}

exports.deleteSet = function(req, res) {
	var args = {
		"COURSE_ID": req.body.courseId,
		"SET_ID": req.body.setId
	}

	interactionService.deleteSet(args).then(function(data) {
		res.send(data);
	}).catch(function(e){
		handleError(e, res);
	});
}

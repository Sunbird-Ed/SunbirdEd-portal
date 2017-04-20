/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Interceptor for LogStream capturing
 *
 * @author rayulu
 */

 var meld = require('meld');
 var util = require('util');
 var PlayerUtil = require('../../view_helpers/player/PlayerUtil');
 var logStreamHelper = require('./LogStreamHelper');
 var logEvents = [];

console.log('initialising interceptors');

var actions = [
  {object: 'view_helpers/player/DashboardViewHelper', method: 'getStudentDashboard', 
    actions: [
      {name: 'View', external: 'false', environment: 'General'}
    ]
  },
  {object: 'view_helpers/player/DashboardViewHelper', method: 'getCourseInstance', 
    actions: [
      {name: 'View', external: 'false', environment: 'Course', 
        objectId: {container: 'request', field: 'params', param: ['courseId']}}
    ]
  },
  {object: 'view_helpers/player/DashboardViewHelper', method: 'getLearningObject', 
    actions: [
      {name: 'View', external: 'false', environment: 'Course', 
        objectId: {container: 'request', field: 'params', param: ['lobId']}}
    ]
  },
  {object: 'view_helpers/player/PlayerViewHelper', method: 'playElement', 
    actions: [
      {name: 'View', external: 'false', environment: 'Course', 
        objectId: {container: 'request', field: 'params', param: ['elementId']}}
    ]
  },
  {object: 'view_helpers/player/PlayerViewHelper', method: 'playLob', 
    actions: [
      {name: 'View', external: 'false', environment: 'Course', 
        objectId: {container: 'response', param: ['identifier']}}
    ]
  },
  {object: 'view_helpers/player/PlayerViewHelper', method: 'getClassRooms', 
    actions: [
      {name: 'List:CoachingSessions', external: 'false', environment: 'Coaching'}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'getNotesBrowser', 
    actions: [
      {name: 'Open', external: 'false', environment: 'Notes'}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'getDefaultNotesList', 
    actions: [
      {name: 'List', external: 'false', environment: 'Notes'}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'getCourseNotesList', 
    actions: [
      {name: 'List', external: 'false', environment: 'Notes'}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'getNotesList', 
    actions: [
      {name: 'List', external: 'false', environment: 'Notes'}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'saveNote', 
    actions: [
      {name: 'Save', external: 'false', environment: 'Notes', 
        objectId: {container: 'response', param: ['identifier']}}
    ]
  },
  {object: 'view_helpers/NoteViewHelper', method: 'delete', 
    actions: [
      {name: 'Delete', external: 'false', environment: 'Notes', 
        objectId: {container: 'request', field: 'params', param: ['id']}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'searchInteractions', 
    actions: [
      {name: 'Search', external: 'false', environment: 'Forums'}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'getInteraction', 
    actions: [
      {name: 'View', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'params', param: ['interactionId']}, 
        courseId: {container: 'request', field: 'params', param: ['courseId']},
        objectType: 'Interaction'}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'rate', 
    actions: [
      {name: 'Vote:Up', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['commentId','interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']},
        criteria: {container: 'request', field: 'body', param: ['upVote'], paramValue: true}},
      {name: 'Vote:Down', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['commentId','interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']},
        criteria: {container: 'request', field: 'body', param: ['upVote'], paramValue: false}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'follow', 
    actions: [
      {name: 'Follow', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']},
        criteria: {container: 'request', field: 'body', param: ['follow'], paramValue: true}},
      {name: 'UnFollow', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']},
        criteria: {container: 'request', field: 'body', param: ['follow'], paramValue: false}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'applyAction', 
    actions: [
      {name: 'Flag', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['commentId', 'interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'comment', 
    actions: [
      {name: 'Comment', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['interaction.commentId', 'interaction.interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'answer', 
    actions: [
      {name: 'Answer', external: 'false', environment: 'Forums', 
        objectId: {container: 'request', field: 'body', param: ['interaction.interactionId']},
        courseId: {container: 'request', field: 'body', param: ['interaction.contextMetadata.courseId']}}
    ]
  },
  {object: 'interactions/view_helpers/InteractionViewHelper', method: 'postInteraction', 
    actions: [
      {name: 'Save', external: 'false', environment: 'Forums', 
        objectId: {container: 'response', param: ['INTERACTION.interactionId']},
        courseId: {container: 'request', field: 'body', param: ['courseId']}}
    ]
  },
  {object: 'view_helpers/studio/ConceptViewHelper', method: 'fetchContent', 
    actions: [
      {name: 'Explore', external: 'false', environment: 'Explore', 
        objectId: {container: 'request', field: 'body', param: ['conceptId']}}
    ]
  }
];

for (var i=0; i<actions.length; i++) {
  var interceptor = actions[i];
  if (interceptor.actions && interceptor.actions.length > 0) {
    registerInterceptor(interceptor);    
  }
}

function registerInterceptor(interceptor) {
  var viewHelper = require('../../' + interceptor.object);
  var before = meld.around(viewHelper, interceptor.method, function(joinpoint) {
    var req = joinpoint.args[0];
    var res = joinpoint.args[1];
    logResponseBody(res, function(resBody) {
      interceptor.actions.forEach(function(action) {
        registerAction(action, req, resBody);        
      });
    });
    joinpoint.proceed();
  }); 
}

function registerAction(action, req, resBody) {
  if (typeof resBody == 'undefined') {
    resBody = {};
  }
  var match = false;
  if (action.criteria) {
    var value;
    if (action.criteria.container.toLowerCase() == 'response' && resBody) {
        value = getParameterValue(resBody, action.criteria.param);
    } else if (action.criteria.container.toLowerCase() == 'request' && req) {
        var reqBody;
        if (action.criteria.field == 'query') {
          reqBody = req.query;
        } else if (action.criteria.field == 'params') {
          reqBody = req.params;
        } else {
          reqBody = req.body;
        }
        value = getParameterValue(reqBody, action.criteria.param);
    }
    if (value && value != null) {
      if (action.criteria.partials) {
        if (value.indexOf(action.criteria.paramValue) > -1) {
          match = true;  
        }
      } else if (value == action.criteria.paramValue) {
        match = true;
      }
    }
  } else {
    match = true;
  }
  if (match) {
    var logEvent = {};
    var objectId;
    if (action.objectId) {
      if (action.objectId.container.toLowerCase() == 'response' && resBody) {
        objectId = getParameterValue(resBody, action.objectId.param);
      } else if (action.objectId.container.toLowerCase() == 'request' && req) {
        var reqBody;
        if (action.objectId.field == 'query') {
          reqBody = req.query;
        } else if (action.objectId.field == 'params') {
          reqBody = req.params;
        } else {
          reqBody = req.body;
        }
        objectId = getParameterValue(reqBody, action.objectId.param);
      }
    }
    if (objectId && objectId != null) {
      objectId = decodeURIComponent(objectId);
      if (objectId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
          if (action.environment == 'Course' || action.environment == 'Explore') {
              objectId = PlayerUtil.addFedoraPrefix(objectId);
          }
      }
      logEvent.objectId = objectId;
    }
    var user = req.user;
    if (user) {
      logEvent.sessionId = req.sessionID;
      logEvent.timestamp = (new Date()).getTime();
      logEvent.userId = user.identifier;
      logEvent.role = user.roles[0];
      logEvent.environment = action.environment;
      logEvent.action = action.name;
      logEvent.ipAddress = req.ip;
      logEvent.external = action.external;
      if (req.session && req.session.courseId) {
        logEvent.courseId = req.session.courseId;
      }
      console.log('Log Event: ' + JSON.stringify(logEvent));
      logEvents.push(logEvent);
      if (logEvents.length > 10) {
        exports.flushEvents();
      }
    }
  }
}

function logResponseBody(res, callback) {
  var oldWrite = res.write;
  var oldJSON = res.json;
  var oldEnd = res.end;
  var chunks = [];
  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };
  res.json = function (chunk) {
    chunks.push(chunk);
    oldJSON.apply(res, arguments);
  };
  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);
    var resJSON;
    try {
      var body = Buffer.concat(chunks).toString('utf8');
      resJSON = JSON.parse(body);
    } catch(e) {
      console.log('interceptor error: ' + e);
    }
    if (callback) {
      callback(resJSON);
    }
    oldEnd.apply(res, arguments);
  };
}

function getParameterValue(obj, params) {
    var paramVal = null;
    for (var i=0; i<params.length; i++) {
        paramVal = getParamValue(obj, params[i].split('.'));
        if (paramVal != null) {
            break;
        }
    }
    return paramVal;
}

function getParamValue(obj, params) {
    var paramVal = null;
    for (var i=0; i<params.length; i++) {
        if (paramVal != null)
            paramVal = paramVal[params[i]];
        else
            paramVal = obj[params[i]];
    }
    return paramVal;
}

exports.flushEvents = function() {
    //console.log('flushing all events: ' + logEvents.length);
    logStreamHelper.flushLogStream(logEvents);
    logEvents = [];
}


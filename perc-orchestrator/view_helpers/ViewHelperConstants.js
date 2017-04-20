exports.LEARNING_RESOURCE = 'learningresource';
exports.LEARNING_ACTIVITY = 'learningactivity';
exports.LEARNING_OBJECT = 'learningobject';
exports.LEARNING_OBJECTIVE = 'learningobjective';
exports.PACKAGE = 'package';
exports.COLLECTION = 'collection';
exports.COURSE = 'course';
exports.MODULE = 'module';
exports.LESSON = 'lesson';
exports.BINDER = 'binder';
exports.CONTENT = 'content';
exports.CONCEPT = 'concept';
exports.MEDIA = 'media';
exports.SEQUENCE = 'sequence';
exports.ADDL_MATERIAL = 'additionalmaterial';
exports.QUIZ = 'quiz';
exports.PROGRAM = 'program';
exports.EXERCISE = 'exercise';
exports.FACULTY = 'faculty';
exports.TUTOR = 'tutor';
exports.LECTURE = 'lecture';
exports.PRACTICE = 'practice';
exports.ASSESSMENT = 'assessment';
exports.STATUS_INVITED = 'invited';
exports.STATUS_ACCEPTED = 'accepted';
exports.STATUS_DECLINED = 'declined';
exports.EXAM = 'Exam';
exports.CLASSROOM = 'coachingSession';
exports.PRACTICE_TEST = 'practiceTest';
exports.COACHING = 'coaching';

exports.INSTRUCTION_USAGE = {
    "learningresource": [
        "lecture",
        "tutoring",
        "coaching"
    ],
    "learningactivity": [
        "exercise",
        "assignment",
        "coaching"
    ]
};

exports.contentGroups = {
    "challenge": "challenge",
    "explore": "explore",
    "drilldown": "drilldown",
    "pairs": "pairs",
    "pre-requisites": "prerequisites",
    "101": "101",
    "same author": "same_author",
    "same institute/organisation": "same_org",
    "popular": "popular",
    "currently viewed": "currently_viewed",
    "recommended content": "recommended_content",
    "references": "references"
}

exports.getContentGroup = function(contentGroup) {
    if(exports.contentGroups[contentGroup] && typeof exports.contentGroups[contentGroup] != 'undefined') {
        return exports.contentGroups[contentGroup];
    }
    return contentGroup;
}

exports.getAllMediaTypes = function() {
    var mediaTypes = [];
    for(k in exports.mediaTypeMapping) {
        var mediaType = exports.mediaTypeMapping[k];
        if(mediaTypes.indexOf(mediaType) == -1) {
            mediaTypes.push(mediaType);
        }
    }
    return mediaTypes;
}

exports.getAllMimeTypes = function() {
    var mimeTypes = [];
    for(mimeType in exports.mediaTypeMapping) {
        if(mimeTypes.indexOf(mimeType) == -1) {
            mimeTypes.push(mimeType);
        }
    }
    return mimeTypes;
}

exports.mediaTypeMapping = {
    'video/youtube':'video',
    'application/dash+xml': 'video',
    'video/vimeo':'video',
    'video/mp4':'video',
    'audio/mpeg3':'audio',
    'scribd/url':'slides',
    'scribd/id':'slides',
    'scribd/pdf':'document',
    'scribd/doc': 'document',
    'application/pdf':'document',
    'text/plain':'text',
    'text/html':'richtext',
    'application/powerpoint':'slides',
    'image/jpeg':'image',
    'image/png':'image',
    'url':'url',
    'application/url':'url',
    'application/json':'mcq',
    'ilimi/test':'test',
    'slideshare/url':'slideshare',
    'slideshare/pdf':'slideshare',
    'ilimi/ide':'ide',
    'ilimi/event':'event',
    'ilimi/external':'external',
    'ilimi/package':'package'
}

exports.conceptHeaderFields = {
    "node id": "nodeId",
    "name": "name",
    "parent node id": "parentNodeId",
    "node type": "nodeType",
    "node class": "nodeClass",
    "parent relation": "parentRelation",
    "context": "context",
    "identifier": "identifier",
    "description": "description"
}

exports.deleteCSVHeaderFields = {
    "node id": "extId",
    "node type": "nodeType",
    "parent node id": "parentExtId",
    "parent node type": "parentNodeType",
    "recursive": "recursive",
    "delete status" : "deleteStatus"
}

exports.INSERT = 'insert';
exports.UPDATE = 'update';
exports.DELETE = 'delete';
exports.NOTSTARTED = 'notstarted';
exports.INPROGRESS = 'inprogress';
exports.COMPLETE = 'complete';
exports.READY = 'ready';
exports.NOTSTARTEDLABEL = 'Not Started';
exports.INPROGRESSLABEL = 'IN PROGRESS';
exports.COMPLETELABEL = 'Completed';
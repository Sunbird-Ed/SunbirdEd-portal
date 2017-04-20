var MongoClient = require('mongodb').MongoClient;

var dbConn;

var modelMap = {
	"ConceptMapCache": "concept_map_cache", "LearnerStateModel": "learner_state",
	"ConceptModel": "concepts", "LearningActivityModel": "learning_activities",
	"CourseModel": "course", "LearningCollectionModel": "learning_collections",
	"EnrolledCoursesModel": "enrolled_courses", "LearningObjectElementsModel": "learning_object_elements",
	"InstructorModel": "instructors", "LearningObjectModel": "learning_object",
	"LearningResourceModel": "learning_resources", "MediaContentModel": "media_content",
	"MediaModel": "media", "NoteModel": "note", "CategoryTypesModel":"category_types",
	"ProgramModel": "programs", "QuizModel": "quizzes", "ObjectTypesModel": "object_types",
	"StudentModel": "students", "UserModel": "user", "AdditionalMaterialModel":"additional_material",
	"CSVImportQueueModel": "csv_import_queue", "EventModel": "events", "TaxonomyModel": "taxonomy_models",
	"PedagogyNodeSetModel": "pedagogy_nodeset", "InstructorCoursesModel": "instructor_courses",
	"LearnerSearchFieldsModel": "learner_search_fields", "GoogleAccessToken": "google_access_tokens",
	"Organization": "organizations", "FacebookAccessToken": "fb_access_tokens"
}

function wrapLogger(callback, data) {
	var startTime = (new Date()).getTime();
  	return (function() {
  		if(process && process.domain && LoggerUtil) {
  			 var endTime = (new Date()).getTime();
			   LoggerUtil.logMongo(process.domain, startTime, endTime, data);
		  }
		  callback.apply(this, arguments); // use .apply() to call it
	 });
}

MongoClient.connect(appConfig.MONGO_DB_URI + "?", {
    	server: {
      		poolSize: 20
    	}
  	}, function(err, db) {
  		console.log('Mongodb default connection open to ' + appConfig.MONGO_DB_URI, err);
  		dbConn = db;
	}
);

exports.findOne = function(modelName, query, projection, callback) {
	if(typeof projection == 'function') {
		callback = projection;
		projection = {};
	}

	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:findOne():', modelName);
	}

	dbConn.collection(modelMap[modelName]).findOne(query, projection, wrapLogger(callback, modelName + ':findOne()'));
}

exports.find = function(modelName, query, projection, options) {
	if(!query) {
		query = {};
	}
	if(!projection) {
		projection = {};
	}
	if(!options) {
		options = {};
	}
	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:find():', modelName);
	}

	return dbConn.collection(modelMap[modelName]).find(query, projection, options);
}

exports.update = function(modelName, criteria, objNew, options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:update():', modelName);
	}
	dbConn.collection(modelMap[modelName]).update(criteria, objNew, options, wrapLogger(callback, modelName + ':update()'));
}

exports.insert = function(modelName, records, callback) {
	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:update():', modelName);
	}
	dbConn.collection(modelMap[modelName]).insert(records, wrapLogger(callback, modelName + ':insert()'));
}

exports.count = function(modelName, query, callback) {
 	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
 	 	console.log('Incorrect model:count():', modelName);
 	}
 	dbConn.collection(modelMap[modelName]).count(query, {}, wrapLogger(callback, modelName + ':count()'));
}

exports.distinct = function(modelName, fieldName, query, callback) {
	if(typeof query == 'function') {
		callback = query;
		query = {};
	}
 	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
 	 	console.log('Incorrect model:distinct():', modelName);
 	}
 	dbConn.collection(modelMap[modelName]).distinct(fieldName, query, wrapLogger(callback, modelName + ':distinct()'));
}
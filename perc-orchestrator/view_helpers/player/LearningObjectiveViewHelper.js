var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var promise_lib = require('when');
var courseMWViewHelper = require('../studio/CourseMWViewHelper');


exports.createLearningObjective = function(req, res) {

    promise_lib.resolve()
    .then(function(){
        return IDCacheUtil.getIdentifier();
    })
    .then(function(identifier) {
        var deferred = promise_lib.defer();
        LearningObjectiveModel = mongoose.model('LearningObjectiveModel');
        var learningObjective = new LearningObjectiveModel();
        learningObjective.identifier = identifier;
        learningObjective.name = req.body.name;
        learningObjective.objective = req.body.objective;
        learningObjective.bloomTaxonomy = req.body.bloomTaxonomy;
        learningObjective.concepts = [];
        if(req.body.concepts) {
            req.body.concepts.forEach(function(concept)
                {
                    learningObjective.concepts.push(concept);
                })
        }
        learningObjective.save(function(err) {
            if (err) {
                errorModule.handleError(err, "ERROR_SAVING_LEARNING_OBJECTIVE", req, res);
                deferred.reject(err);
            }
            else{
                deferred.resolve(identifier);
            }
        })
        return deferred.promise;
    })
    .then(function(identifier){
        courseMWViewHelper.exportLearningObjectiveToMW(identifier);
        res.send(identifier);
    })
    .catch(function(err){
        console.log(err);
    });
       
};

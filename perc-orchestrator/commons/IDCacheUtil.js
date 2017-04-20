//appConfig = require('../appConfig.json');
//LoggerUtil = require('../commons/LoggerUtil');
var mongoose = require('mongoose')
var promise_lib = require('when');
require('../models')
IDCache = mongoose.model('IDCache');
var shortId = require('shortid');
var ViewHelperUtil = require('./ViewHelperUtil');
var MWServiceProvider = require('./MWServiceProvider');

var fedoraPrefix = "info:fedora/";

exports.fedoraPrefix = fedoraPrefix;
//process.domain = {logObject:{}};
/**
 * Function which returns a promise of an id.
 * @return promise
 */
exports.getIdentifier = function() {
    var deferred = promise_lib.defer();
    getId(function(identifier) {
        deferred.resolve(identifier);
    });
    return deferred.promise;
}

exports.getIdentifierPromise = function(deferred) {
    getId(function(identifier) {
        deferred.resolve(identifier);
    });
}

function getId(callback) {

    var error;
    promise_lib.resolve()
    .then(ViewHelperUtil.promisify(IDCache.findOneAndRemove, IDCache))
    .then(function(id) {
        var deferred = promise_lib.defer();
        if(!id || (null == id)) {
            var promise = fetchIdentifiers();
            promise.then(function(data) {
                return saveIdentifiers(data);
            })
            .then(ViewHelperUtil.promisify(IDCache.findOneAndRemove, IDCache))
            .catch (function(err) {
                error = err;
            })
            .done(function(newId) { deferred.resolve(newId); })
        } else {
            deferred.resolve(id);
        }
        return deferred.promise;
    })
    .catch (function(err) {
        console.log(err);
        error = err;
    })
    .done(function(returnId) {
        if(error) {
            callback(shortId.generate());
        } else {
            callback(returnId.identifier);
        }
    });
};

function fetchIdentifiers() {
    var deferred = promise_lib.defer();
    MWServiceProvider.callServiceStandard("IDService", "fetchIdentifiers", {"COUNT":1000}, function(err, data, response) {
        //console.log('error', err, 'data', data);
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function saveIdentifiers(data) {

    var deferred = promise_lib.defer();
    if(!data || (null == data)) {
        deferred.reject('No data returned from middleware');
    } else {
        var ids = new Array();
        var mwData = JSON.parse(data);
        var mwIds = mwData.responseValueObjects.IDENTIFIERS.valueObjectList;
        mwIds.forEach(function(mwId) {
            ids.push({identifier: mwId.id});
        });
        IDCache.create(ids, function(err, cache) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve();
            }
        });
    }
    return deferred.promise;
}

function returnId(id) {
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(IDCache.findOne, IDCache, [{identifier: 'id_cache'}]))
    .then(function(idCache) {
        idCache.ids.push(id);
        idCache.markModified('ids');
        idCache.save();
    });
};

function getIdsFromMW() {
    var promise = fetchIdentifiers();
    promise.then(function(data) {
        console.log("data:", data);
        return saveIdentifiers(data);
    })
    .catch(function(err) {
        console.log('Promise error - ', err);
    })
    .done(function() {
        console.log('Ids imported from MW');
    });
}

exports.getId = getId;
exports.returnId = returnId;


function fetchFedoraIds(idCount) {
    var d = promise_lib.defer();
    promise_lib.resolve()
    .then(function(){
        var deferred = promise_lib.defer();
        MWServiceProvider.callServiceStandard("IDService", "fetchIdentifiers", {"COUNT":idCount}, function(err, data, response) {
            if (err) {
                console.log("from MW",err);
                deferred.reject(err);
            } else {
         //       console.log("ids fetched",data);
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    })
    .then(function(data){
        var deferred = promise_lib.defer();
        if(!data || (null == data)) {
            deferred.reject('No data returned from middleware');
        } else {
            var ids = new Array();
            var mwData = data;
            var mwIds = mwData.responseValueObjects.IDENTIFIERS.valueObjectList;
        //    console.log("ids",mwIds);
            mwIds.forEach(function(mwId) {
                ids.push({identifier: mwId.id});
            });
            IDCache.create(ids, function(err, cache) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        }
        return deferred.promise;
    })
    .catch(function(err){
        console.log("error fecthing and saving fedoraIds");
        d.reject();

    })
    .done(function(){
        d.resolve();
    })
    return d.promise;
}

exports.loadFedoraIds = function(req, res) {
    exports.populateIDCache(10000);    
    res.send("OK");
}

exports.populateIDCache = function(idCount){
    var mwLimit = 100; /* can be moved to some common config file*/
    console.log("inside fecth identifiers");
    var noIterations = Math.ceil(idCount/mwLimit)
    var promises = [];
    var deferred = promise_lib.defer();
    for(var i=0;i < noIterations ;i++){
        promises.push(fetchFedoraIds(mwLimit));
    }
    promise_lib.all(promises).then(function(value) {
               // console.log(value+" promises fulfilled");
                EventHelper.emitEvent('importedFedoraIds',idCount); 
    })
    .catch(function(err)
    {
        console.log("Error fetching the required FedoraIds",err);
        
    })    
}

/*exports.populateIDCache(10000);*/

/*getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();
getIdsFromMW();*/




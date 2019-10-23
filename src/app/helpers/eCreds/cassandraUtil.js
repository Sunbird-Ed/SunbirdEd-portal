var _ = require('lodash');
var models = require('express-cassandra');
const envHelper = require('../environmentVariablesHelper');
const contactPoints = envHelper.PORTAL_CASSANDRA_URLS;
const keyspaceName = 'sunbird';
let isConnected = false;
const consistency = getConsistencyLevel(envHelper.PORTAL_CASSANDRA_CONSISTENCY_LEVEL);

models.setDirectory(__dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: contactPoints,
            keyspace: keyspaceName,
            queryOptions: { consistency: consistency }
        },
        ormOptions: {
            defaultReplicationStrategy: {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function (err) {
        if (err) {
            console.log('error', err);
            isConnected = false;
        } else {
            isConnected = true;
            console.log('Successfully synced to bulk_upload_process')
        }
    }
);

function getConsistencyLevel(consistency) {
    let consistencyValue = consistency && _.get(models, `consistencies.${consistency}`) ? _.get(models, `consistencies.${consistency}`) : models.consistencies.one
    return consistencyValue;
}

const insertData = (data, cb) => {
    const processId = models.uuid();
    data['id'] = _.toString(processId);
    const batch = new models.instance.bulk_upload_process(data);
    batch.save(err => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, processId);
        }
    });
}

const updateData = (query_object, update_object, cb) => {
    models.instance.bulk_upload_process.update(query_object, update_object, function (err) {
        if (err) {
            cb(err, null);
        }
        else {
            cb(null, query_object);
        }
    });
}

const findRecord = (queryObj, selectCriteria = [], cb) => {
    models.instance.bulk_upload_process.find(queryObj, { allow_filtering: true, select: selectCriteria }, (err, result) => {
        if (err) {
            console.log('error', _.get(err, 'message'));
            cb(err, null);
        } else {
            cb(null, result);
        }
    })
}

module.exports = { insertData, updateData, isConnected, findRecord }


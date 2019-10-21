var _ = require('lodash');
var models = require('express-cassandra');
const envHelper = require('../environmentVariablesHelper');
const contactPoints = envHelper.PORTAL_CASSANDRA_URLS
const keyspaceName = 'sunbird'
let isConnected = false;

models.setDirectory(__dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: contactPoints,
            keyspace: keyspaceName,
            queryOptions: { consistency: models.consistencies.one }
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
            console.log('done')
        }
    }
);

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

module.exports = { insertData, updateData, isConnected }


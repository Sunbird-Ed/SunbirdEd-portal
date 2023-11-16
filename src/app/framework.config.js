const fs = require('fs');
const path = require('path')
const envHelper = require('./helpers/environmentVariablesHelper.js')
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const uuidv1 = require('uuid/v1');
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'helpers/telemetryEventConfig.json')))
const cassandraUtils = require('./helpers/cassandraUtil.js')
const replicationStrategy = cassandraUtils.getReplicationStrategy(envHelper.PORTAL_CASSANDRA_REPLICATION_STRATEGY)
const consistency = cassandraUtils.getConsistencyLevel(envHelper.PORTAL_CASSANDRA_CONSISTENCY_LEVEL)

module.exports = {
    db: {
        cassandra: {
        contactPoints: envHelper.PORTAL_CASSANDRA_URLS,
        defaultKeyspaceSettings: {
            replication: replicationStrategy,
        },
        queryOptions: { 
            consistency: consistency 
        }
    },
    elasticsearch: {
        host: '127.0.0.1:9200', // need to change
        disabledApis: ['cat', 'cluster', 'ingest', 'nodes', 'remote', 'snapshot', 'tasks']
    }
    },
    telemetry: {
        dispatcher: 'http', // default
        pdata: {
            'id': envHelper.APPID,
            'ver': packageObj.version,
            'pid': envHelper.APPID
        },
        env: process.env.sunbird_environment,
        // apislug: '', // not needed in portal
        channel: '', // should fetch default channel by making api call
        uid: uuidv1(),
        endpoint: telemtryEventConfig.endpoint,
        batchsize: 1,
        host: envHelper?.TELEMETRY_SERVICE_LOCAL_URL,
        authtoken: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN,
        runningEnv: 'server'
    },
    plugins: [
        { id: '@project-sunbird/form-service',ver: '1.0'},
        { id: '@project-sunbird/review-comment', ver: '1.0' },
        { id: '@project-sunbird/discussion-service', ver: '1.0' }
        // { id: '@project-sunbird/program', ver: '1.0' }      
    ],
    pluginBasePath: __dirname + '/node_modules/',
    logLevel: 'error'
}
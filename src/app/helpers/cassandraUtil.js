const _ = require('lodash')
const CassandraStore = require('cassandra-session-store')
const envHelper = require('./environmentVariablesHelper.js')
const expressCassandra = require('express-cassandra')
const contactPoints = envHelper.PORTAL_CASSANDRA_URLS
const consistency = getConsistencyLevel(envHelper.PORTAL_CASSANDRA_CONSISTENCY_LEVEL)
const replicationStrategy = getReplicationStrategy(envHelper.PORTAL_CASSANDRA_REPLICATION_STRATEGY)

function getCassandraStoreInstance  () {
  return new CassandraStore({
    'table': 'sessions',
    'client': null,
    'clientOptions': {
      'contactPoints': contactPoints,
      'keyspace': 'portal',
      'queryOptions': {
        'consistency': consistency,
        'prepare': true
      }
    },
    'ormOptions': {
      'defaultReplicationStrategy': replicationStrategy,
      'migration': 'safe'
    }
  }, () => { })
}

function getConsistencyLevel (consistency) {
  let consistencyValue = consistency && _.get(expressCassandra, `consistencies.${consistency}`) ? _.get(expressCassandra, `consistencies.${consistency}`):  expressCassandra.consistencies.one
  return consistencyValue;
}

function getReplicationStrategy (replicationStrategy) { 
  try{
    return JSON.parse(replicationStrategy)
  }catch(e){
    console.log("err in getReplicationStrategy",e)
    return {"class":"SimpleStrategy","replication_factor":1}
  }
}

module.exports = { getCassandraStoreInstance, getConsistencyLevel, getReplicationStrategy }



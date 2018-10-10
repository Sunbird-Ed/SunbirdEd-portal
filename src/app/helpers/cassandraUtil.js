const CassandraStore = require('cassandra-session-store')
const envHelper = require('./environmentVariablesHelper.js')
const expressCassandra = require('express-cassandra')

const contactPoints = envHelper.PORTAL_CASSANDRA_URLS
const consistency = getConsistencyLevel(envHelper.PORTAL_CASSANDRA_CONSISTENCY_LEVEL)
const replicationStrategy = getReplicationStrategy(envHelper.PORTAL_CASSANDRA_REPLICATION_STRATEGY)
const cassandraPort = envHelper.PORTAL_CASSANDRA_PORT

console.log("contactPoints",contactPoints,cassandraPort)
console.log("consistency",consistency)
console.log("replicationStrategy",replicationStrategy)

function getCassandraConfig  () {
  return new CassandraStore({
    'table': 'sessions',
    'client': null,
    'clientOptions': {
      'contactPoints': contactPoints,
      'protocolOptions': { port: cassandraPort },
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
  let consistencyValue = expressCassandra.consistencies.one
  if (consistency && contactPoints) {
    if (expressCassandra.consistencies[consistency]) {
      consistencyValue = expressCassandra.consistencies[consistency]
    }
  }
  return consistencyValue
}

function getReplicationStrategy (replicationStrategy) {
  let replicationStrategyValue = {}
  if (replicationStrategy && contactPoints) {
    replicationStrategyValue = JSON.parse(replicationStrategy)
    if (!Object.keys(replicationStrategyValue).length) {
      replicationStrategyValue = {}
    }
  }
  return replicationStrategyValue
}


module.exports = {
  getCassandraConfig: getCassandraConfig
}



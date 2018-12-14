const envHelper = require('./environmentVariablesHelper.js')
const cassandraUtils = require('./cassandraUtil.js')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
let memoryStore = null

if (envHelper.PORTAL_SESSION_STORE_TYPE === 'in-memory') {
  memoryStore = new session.MemoryStore()
} else {
  memoryStore = cassandraUtils.getCassandraStoreInstance()
}
const getKeyCloakClient = (config, store) => {
  return new Keycloak({ store: store || memoryStore }, config)
}
let keycloak = 
module.exports = {
  getKeyCloakClient,
  memoryStore
}

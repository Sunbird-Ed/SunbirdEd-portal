const envHelper = require('./environmentVariablesHelper.js')
const cassandraUtils = require('./cassandraUtil.js')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const permissionsHelper = require('./permissionsHelper.js')
const async = require('async')
const telemetryHelper = require('./telemetryHelper.js')
const userHelper = require('./userHelper.js')
let memoryStore = null

if (envHelper.PORTAL_SESSION_STORE_TYPE === 'in-memory') {
  memoryStore = new session.MemoryStore()
} else {
  memoryStore = cassandraUtils.getCassandraStoreInstance()
}
const getKeyCloakClient = (config, store) => {
  const keycloak = new Keycloak({ store: store || memoryStore }, config);
  keycloak.authenticated = authenticated;
  keycloak.deauthenticated = deauthenticated;
  return keycloak
}
const deauthenticated = function (request) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    telemetryHelper.logSessionEnd(request)
    delete request.session.sessionEvents
  }
}
const authenticated = function (request) {
  permissionsHelper.getPermissions(request)
  async.series({
    getUserData: function (callback) {
      permissionsHelper.getCurrentUserRoles(request, callback)
    },
    updateLoginTime: function (callback) {
      userHelper.updateLoginTime(request, callback)
    },
    logSession: function (callback) {
      telemetryHelper.logSessionStart(request, callback)
    }
  }, function (err, results) {
    if (err) {
      console.log('err', err)
    }
  })
}
module.exports = {
  getKeyCloakClient,
  memoryStore
}

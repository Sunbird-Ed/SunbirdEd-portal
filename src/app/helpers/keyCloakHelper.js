const envHelper = require('./environmentVariablesHelper.js')
const cassandraUtils = require('./cassandraUtil.js')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const permissionsHelper = require('./permissionsHelper.js')
const async = require('async')
const telemetryHelper = require('./telemetryHelper.js')
const userHelper = require('./userHelper.js')
let memoryStore = null
const logger = require('sb_logger_util_v2');

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
  delete request.session.userId
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    telemetryHelper.logSessionEnd(request)
    delete request.session.sessionEvents
  }
}
const authenticated = function (request) {
  permissionsHelper.getPermissions(request)
  try {
    var userId = request.kauth.grant.access_token.content.sub.split(':')
    request.session.userId = userId[userId.length - 1];
    request.session.save();
  } catch(err) {
    logger.error({
      msg: 'userId conversation error',
      err,
      additionalInfo: { errorInfo: request.kauth.grant.access_token.content.sub}
    })
  }
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
      logger.error({msg:'error while executing async.series()', err})
    }
  })
}
module.exports = {
  getKeyCloakClient,
  memoryStore
}

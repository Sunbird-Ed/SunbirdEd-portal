const envHelper = require('./environmentVariablesHelper.js')
const cassandraUtils = require('./cassandraUtil.js')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const permissionsHelper = require('./permissionsHelper.js')
const async = require('async')
const telemetryHelper = require('./telemetryHelper.js')
const userHelper = require('./userHelper.js')
let memoryStore = null;
const logger = require('sb_logger_util_v2');
const { logErr, logDebug, logInfo} = require('./utilityService.js');

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
const authenticated = function (request, next) {
  try {
    var userId = request.kauth.grant.access_token.content.sub.split(':')
    request.session.userId = userId[userId.length - 1];
  } catch (err) {
    logErr(req, err, 'userId conversation error');
  }
  const postLoginRequest = [];
  postLoginRequest.push(function (callback) {
    permissionsHelper.getCurrentUserRoles(request, callback)
  });
  console.log('value of updateLoginTimeEnabled-->', envHelper.sunbird_portal_updateLoginTimeEnabled);
  console.log('if condition value-->' + JSON.parse(envHelper.sunbird_portal_updateLoginTimeEnabled || 'false'));
  if (JSON.parse(envHelper.sunbird_portal_updateLoginTimeEnabled || 'false')) {
    postLoginRequest.push(function (callback) {
      userHelper.updateLoginTime(request, callback)
    });
  }
  telemetryHelper.logSessionStart(request);
  async.series(postLoginRequest, function (err, results) {
    if (err) {
      logErr(request, err, 'error loggin in user');
      next(err, null);
    } else {
      logErr(request, err, 'keycloack authenticated successfully');
      next(null, 'loggedin');
    }
  })
}

const memoryType = envHelper.PORTAL_SESSION_STORE_TYPE;
switch (memoryType) {
  case 'in-memory':
    memoryStore = new session.MemoryStore()
    break;
  case 'cassandra':
    memoryStore = cassandraUtils.getCassandraStoreInstance();
    break;
  case 'redis':
    const redisUtils = require('./redisUtil');
    memoryStore = redisUtils.getRedisStoreInstance(session)
    break;
  default:
    memoryStore = cassandraUtils.getCassandraStoreInstance()
    break;
}

module.exports = {
  getKeyCloakClient,
  memoryStore
}

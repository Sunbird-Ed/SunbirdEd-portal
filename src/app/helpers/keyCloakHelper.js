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
    console.log('userId conversation error', request.kauth.grant.access_token.content.sub, err);
  }
  const postLoginRequest = [];
  postLoginRequest.push(function (callback) {
    permissionsHelper.getCurrentUserRoles(request, callback)
  });
  if (JSON.parse(envHelper.sunbird_portal_updateLoginTimeEnabled || 'false')) {
    postLoginRequest.push(function (callback) {
      userHelper.updateLoginTime(request, callback)
    });
  }
  async.series(postLoginRequest, function (err, results) {
    telemetryHelper.logSessionStart(request);
    if (err) {
      logger.error({msg: 'error loggin in user', error: err});
      next(err, null);
    } else {
      logger.error({msg: 'keycloack authenticated successfully'});
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

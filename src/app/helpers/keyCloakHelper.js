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
    console.log('userId conversation error', request.kauth.grant.access_token.content.sub, err);
  }
  const postLoginRequest = [];
    postLoginRequest.push(function (callback) {
      permissionsHelper.getCurrentUserRoles(request, callback)
    });
    console.log('value of updateLoginTimeEnabled-->',envHelper.sunbird_portal_updateLoginTimeEnabled, 'if condition value-->' +JSON.parse(envHelper.sunbird_portal_updateLoginTimeEnabled || 'false'))
  if(JSON.parse(envHelper.sunbird_portal_updateLoginTimeEnabled || 'false')){
    postLoginRequest.push(function (callback) {
      userHelper.updateLoginTime(request, callback)
    });
  }
  postLoginRequest.push(function (callback) {
    telemetryHelper.logSessionStart(request, callback)
  });
  async.series(postLoginRequest, function (err, results) {
    if (err) {
      console.log('err', err)
    }
  })
}
module.exports = {
  getKeyCloakClient,
  memoryStore
}

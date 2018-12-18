const { google } = require('googleapis');
const _ = require('lodash');
const { GOOGLE_OAUTH_CONFIG } = require('./environmentVariablesHelper.js')
const redirectPath = '/google/auth/callback';
const defaultScope = ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email'];
const jwt = require('jsonwebtoken')
const async = require('async')
const { getKeyCloakClient } = require('./keyCloakHelper')
const permissionsHelper = require('./permissionsHelper.js')
const telemetryHelper = require('./telemetryHelper.js')
const userHelper = require('./userHelper.js')
const envHelper = require('./environmentVariablesHelper.js')
const request = require('request-promise'); //  'request' npm package with Promise support
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')

let keycloak = getKeyCloakClient({
  resource: envHelper.PORTAL_TRAMPOLINE_CLIENT_ID,
  bearerOnly: true,
  serverUrl: envHelper.PORTAL_AUTH_SERVER_URL,
  realm: envHelper.PORTAL_REALM,
  credentials: {
    secret: envHelper.PORTAL_TRAMPOLINE_SECRET
  }
})

keycloak.authenticated = function (request) {
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
class GoogleOauth {
  createConnection(req) {
    const  { clientId, clientSecret } = GOOGLE_OAUTH_CONFIG;
    const redirect = `${req.protocol}://${req.get('host')}${redirectPath}`;
    return new google.auth.OAuth2(clientId, clientSecret, redirect);
  }
  generateAuthUrl(req) {
    const connection = this.createConnection(req);
    return connection.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
  }
  async getProfile(req) {
    const client = this.createConnection(req);
    const { tokens } = await client.getToken(req.query.code).catch(this.handleError)
    client.setCredentials(tokens)
    const plus = google.plus({ version: 'v1', auth: client})
    const { data } = await plus.people.get({ userId: 'me' }).catch(this.handleError)
    return {
      name: data.displayName,
      emailId: _.get(_.find(data.emails, {type: 'account'}), 'value')
    }
  }
  handleError(error){
    if(_.get(error, 'response.data')){
      throw error.response.data
    } else if(error instanceof Error) {
      throw error.message
    } else {
      throw 'unhandled exception while getting tokens'
    } 
  }
}
const googleOauth = new GoogleOauth()
const createSession = async (emailId, req, res) => {
  const grant = await keycloak.grantManager.obtainDirectly(emailId);
  keycloak.storeGrant(grant, req, res)
  req.kauth.grant = grant
  keycloak.authenticated(req)
  return {
    access_token: grant.access_token.token,
    refresh_token: grant.refresh_token.token
  };
}
const fetchUserById = async (emailId) => {
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'user/v1/getByKey',
    headers: {
      'x-device-id': 'portal',
      'x-msgid': uuid(),
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'x-consumer-id': envHelper.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
    },
    body: { request: { key: 'email', value: emailId } },
    json: true
  }
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const createUserWithMailId = async (accountDetails) => {
  if (!accountDetails.name || accountDetails.name === '') {
    throw 'User name not present in request';
  }
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'user/v3/create',
    headers: {
      'x-device-id': 'trampoline',
      'x-msgid': uuid(),
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'x-consumer-id': envHelper.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
    },
    body: {
      request: {
        firstName: accountDetails.name,
        email: accountDetails.emailId,
        emailVerified: true
      }
    },
    json: true
  }
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
module.exports = { googleOauth,  keycloak, createSession, fetchUserById, createUserWithMailId };
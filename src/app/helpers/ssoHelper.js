const _ = require('lodash');
const { getKeyCloakClient } = require('./keyCloakHelper')
const envHelper = require('./environmentVariablesHelper.js')
const request = require('request-promise'); //  'request' npm package with Promise support
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')
const learnerURL = envHelper.LEARNER_URL
const trampolineClientId = envHelper.PORTAL_TRAMPOLINE_CLIENT_ID
const trampolineServerUrl = envHelper.PORTAL_AUTH_SERVER_URL
const trampolineRealm = envHelper.PORTAL_REALM
const trampolineSecret = envHelper.PORTAL_TRAMPOLINE_SECRET
const echoAPI = envHelper.PORTAL_ECHO_API_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN

let keycloak = getKeyCloakClient({
  clientId: trampolineClientId,
  bearerOnly: true,
  serverUrl: trampolineServerUrl,
  realm: trampolineRealm,
  credentials: {
    secret: trampolineSecret
  }
})
const verifySignature = async (token) => {
  let options = {
    method: 'GET',
    url: echoAPI + '/test',
    'rejectUnauthorized': false,
    headers: {
      'cache-control': 'no-cache',
      authorization: 'Bearer ' + token
    }
  }
  const echoRes = await request(options);
  if(echoRes !== '/test'){
    throw new Error('INVALID_SIGNATURE');
  }
  return true
}
const verifyToken = (token) => {
  let timeInSeconds = parseInt(Date.now() / 1000)
  if (!(token.iat < timeInSeconds)) {
    throw new Error('TOKEN_IAT_FUTURE');
  } else if (!(token.exp > timeInSeconds)) {
    throw new Error('TOKEN_EXPIRED');
  } else if (!token.sub) {
    throw new Error('USER_ID_NOT_PRESENT');
  } 
  return true;
}
const getChannel = (req, channelData) => {
  let channelInfo = {};
  return Promise.resolve(channelInfo);
}
const fetchUserWithLoginId = async (loginId, req) => {
  const options = {
    method: 'GET',
    url: envHelper.LEARNER_URL + 'user/v1/get/loginId/'+ loginId,
    headers: getHeaders(req),
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
const createUserWithPhone = async (accountDetails, req) => {
  if (!accountDetails.name || accountDetails.name === '') {
    throw new Error('USER_NAME_NOT_PRESENT');
  }
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'user/v2/create',
    headers: getHeaders(req),
    body: {
      request: {
        firstName: accountDetails.name,
        phone: accountDetails.phone,
        phoneVerified: true,
        userName: accountDetails.userName.split('@')[0], // need to be verified
        provider: accountDetails.userName.split('@')[1]
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
const createSession = async (loginId, req, res) => {
  const grant = await keycloak.grantManager.obtainDirectly(loginId);
  keycloak.storeGrant(grant, req, res)
  req.kauth.grant = grant
  keycloak.authenticated(req)
  return {
    access_token: grant.access_token.token,
    refresh_token: grant.refresh_token.token
  }
}
const updatePhone = (accountDetails) => {
  return Promise.resolve({});
}
const updateRoles = (accountDetails) => {
  return Promise.resolve({});
}
const getHeaders = (req) => {
  return {
    'x-device-id': req.get('x-device-id'),
    'x-msgid': uuid(),
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
    'content-type': 'application/json',
    'accept': 'application/json',
    'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
  }
}
module.exports = { keycloak, verifySignature, verifyToken, getChannel, fetchUserWithLoginId, createUserWithPhone, createSession, updatePhone, updateRoles };
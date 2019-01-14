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
  const validToken = await Promise.resolve({validToken: true});
  if(!validToken){
    throw new Error('INVALID_SIGNATURE');
  }
  return true
}
const verifyToken = (token) => {
  const validToken = true;
  if (!validToken) {
    throw new Error('INVALID_TOKEN');
  }
  return true;
}
const getChannel = (req, channelData) => {
  let channelInfo = {};
  return Promise.resolve(channelInfo);
}
const fetchUserWithLoginId = async (loginId, req) => {
  let userInfo = {};
  return Promise.resolve(userInfo);
}
const createUserWithPhone = async (accountDetails, req) => {
  let userInfo = {};
  return Promise.resolve(userInfo);
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
module.exports = { keycloak, verifySignature, verifyToken, getChannel, fetchUserWithLoginId, createUserWithPhone, createSession, updatePhone, updateRoles };
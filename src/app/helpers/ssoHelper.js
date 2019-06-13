const _ = require('lodash');
const { getKeyCloakClient } = require('./keyCloakHelper')
const envHelper = require('./environmentVariablesHelper.js')
const request = require('request-promise'); //  'request' npm package with Promise support
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')
const kafkaService = require('../helpers/kafkaHelperService');
let ssoWhiteListChannels;
const privateBaseUrl = '/private/user/'
let keycloak = getKeyCloakClient({
  clientId: envHelper.PORTAL_TRAMPOLINE_CLIENT_ID,
  bearerOnly: true,
  serverUrl: envHelper.PORTAL_AUTH_SERVER_URL,
  realm: envHelper.PORTAL_REALM,
  credentials: {
    secret: envHelper.PORTAL_TRAMPOLINE_SECRET
  }
})
const verifySignature = async (token) => {
  let options = {
    method: 'GET',
    url: envHelper.PORTAL_ECHO_API_URL + 'test',
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
const fetchUserWithExternalId = async (payload, req) => { // will be called from player docker to learner docker
  const options = {
    method: 'GET',
    url: `${envHelper.learner_Service_Local_BaseUrl}${privateBaseUrl}v1/read/${payload.sub}?provider=${payload.state_id}&idType=${payload.state_id}`,
    headers: getHeaders(req),
    json: true
  }
  console.log('sso fetch user with external id', options);
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      console.log('sso fetching user', data.result);
      return _.get(data, 'result.response');
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  }).catch(handleGetUserByIdError);
}
const createUser = async (req, jwtPayload) => {
  const requestBody = {
    firstName: jwtPayload.name,
    channel: jwtPayload.state_id,
    orgExternalId: jwtPayload.school_id,
    externalIds: [{
      id: jwtPayload.sub,
      provider: jwtPayload.state_id,
      idType: jwtPayload.state_id
    }]
  }
  if(req.query.type === 'phone'){
    requestBody.phone = req.query.value;
    requestBody.phoneVerified = true
  } else {
    requestBody.email = req.query.value;
    requestBody.emailVerified = true
  }
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'user/v2/create',
    headers: getHeaders(req),
    body: {
      params: {
        signupType: "sso"
      },
      request: requestBody
    },
    json: true
  }
  console.log('sso user create user request', requestBody);
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      console.log('sso new user create response', data);
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const createSession = async (loginId, client_id, req, res) => {
  let grant;
  if (client_id === 'android') {
    grant = await keycloak.grantManager.obtainDirectly(loginId, undefined, undefined, 'offline_access')
  } else {
    grant = await keycloak.grantManager.obtainDirectly(loginId, undefined, undefined, 'openid')
  }
  keycloak.storeGrant(grant, req, res)
  req.kauth.grant = grant
  keycloak.authenticated(req)
  return {
    access_token: grant.access_token.token,
    refresh_token: grant.refresh_token.token
  }
}
const updateContact = (req, userDetails) => { // will be called from player docker to learner docker
  let requestBody = {
    userId: userDetails.id,
    phone: req.query.value,
    phoneVerified: true
  }
  if(req.query.type === 'email'){
    requestBody = {
      userId: userDetails.id,
      email: req.query.value,
      emailVerified: true
    } 
  }
  const options = {
    method: 'PATCH',
    url: envHelper.learner_Service_Local_BaseUrl + privateBaseUrl +'v1/update',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  console.log('sso update contact api request', requestBody);
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const updateRoles = (req, userId, jwtPayload) => { // will be called from player docker to learner docker
  const requestBody = {
    userId: userId,
    externalId: jwtPayload.school_id,
    provider: jwtPayload.state_id,
    roles: jwtPayload.roles
  }
  const options = {
    method: 'POST',
    url: envHelper.learner_Service_Local_BaseUrl + privateBaseUrl +'v1/assign/role',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  console.log('sso update role api request', requestBody);
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const migrateUser = (req, jwtPayload) => { // will be called from player docker to learner docker
  const requestBody = {
    userId: req.query.userId,          
    channel:jwtPayload.state_id,
    orgExternalId: jwtPayload.school_id,
    externalIds: [{
        id: jwtPayload.sub,
        provider: jwtPayload.state_id,
        idType: jwtPayload.state_id,
        operation: 'ADD'
      }]
  }

  const options = {
    method: 'PATCH',
    url: envHelper.learner_Service_Local_BaseUrl + privateBaseUrl +'v1/migrate',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  console.log('sso migrate user request', options);
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
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
const handleGetUserByIdError = (error) => {
  if (['USER_NOT_FOUND', 'EXTERNALID_NOT_FOUND'].includes(_.get(error, 'error.params.err')) || ['USER_NOT_FOUND', 'EXTERNALID_NOT_FOUND'].includes(_.get(error, 'error.params.status'))) {
    return {};
  }
  throw error.error || error.message || error;
}

  // creating payload for kafka service
const getKafkaPayloadData = (sessionDetails) => {
  var jwtPayload = sessionDetails.jwtPayload;
  var userDetails = sessionDetails.userDetails;
  return {
    'identifier': uuid(),
    'ets': (new Date).getTime(),
    'operationType': 'UPDATE',
    'eventType': 'transactional',
    'objectType': 'user',
    'event': {
      'userExternalId': jwtPayload.sub || '',
      'nameFromPayload': jwtPayload.name || '',
      'channel': jwtPayload.state_id || '',
      'orgExternalId': jwtPayload.school_id || '',
      'roles': jwtPayload.roles || [],
      'userId': userDetails.id || '',
      'organisations': userDetails.organisations || [],
      'firstName': userDetails.firstName
    }
  }
};

const getSsoUpdateWhiteListChannels = async (req) => {
  // return cached value
  if (ssoWhiteListChannels) {
    return _.includes(_.get(ssoWhiteListChannels, 'result.response.value'), req.session.jwtPayload.state_id);
  }

  let options = {
    method: 'GET',
    url: envHelper.LEARNER_URL + 'data/v1/system/settings/get/ssoUpdateWhitelistChannels',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
    }
  };
  try {
    const response = await request(options);
    if (_.isString(response)) {
      const res = JSON.parse(response);
      ssoWhiteListChannels = res;
      return _.includes(_.get(res, 'result.response.value'), req.session.jwtPayload.state_id);
    } else {
      return false
    }
  } catch (error) {
    console.log('sso error fetching whileList channels: getSsoUpdateWhileListChannels');
    return false;
  }
};

const sendSsoKafkaMessage = async (req) => {
  const ssoUpdataChannelLists = await getSsoUpdateWhiteListChannels(req);
  if (ssoUpdataChannelLists) {
    var kafkaPayloadData = getKafkaPayloadData(req.session);
    kafkaService.sendMessage(kafkaPayloadData, envHelper.sunbird_sso_kafka_topic, function (err, res) {
      if (err) {
        console.log('sso sending message to kafka errored', err)
      } else {
        console.log('sso kafka message send successfully')
      }
    });
  } else {
    console.log('sso white list channels not matched or errored ')
  }
};

module.exports = {
  keycloak,
  verifySignature,
  verifyToken,
  fetchUserWithExternalId,
  createUser,
  createSession,
  updateContact,
  updateRoles,
  sendSsoKafkaMessage,
  migrateUser
};

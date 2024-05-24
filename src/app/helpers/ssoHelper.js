const _ = require('lodash');
const { getKeyCloakClient } = require('./keyCloakHelper')
const envHelper = require('./environmentVariablesHelper.js')
const request = require('request-promise'); //  'request' npm package with Promise support
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')
const kafkaService = require('../helpers/kafkaHelperService');
const { logger } = require('@project-sunbird/logger');
const {getUserIdFromToken} = require('../helpers/jwtHelper');
const {getUserDetails} = require('../helpers/userHelper');
const {isDate} = require('../helpers/utilityService');
let ssoWhiteListChannels;
const privateBaseUrl = '/private/user/';
const {isValidAndNotEmptyString} = require('../helpers/utilityService');
const { getBearerToken } = require('../helpers/kongTokenHelper')

const keycloakTrampoline = getKeyCloakClient({
  clientId: envHelper.PORTAL_TRAMPOLINE_CLIENT_ID,
  bearerOnly: true,
  serverUrl: envHelper.PORTAL_AUTH_SERVER_URL,
  realm: envHelper.PORTAL_REALM,
  credentials: {
    secret: envHelper.PORTAL_TRAMPOLINE_SECRET
  }
})
const keycloakTrampolineAndroid = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT?.secret
  }
})
const keycloakTrampolineDesktop = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_TRAMPOLINE_DESKTOP_CLIENT?.secret
  }
})
const verifySignature = async (token) => {
  let options = {
    method: 'GET',
    forever: true,
    url: envHelper.PORTAL_ECHO_API_URL + 'test',
    'rejectUnauthorized': false,
    headers: {
      'cache-control': 'no-cache',
      authorization: 'Bearer ' + token
    }
  }
  const echoRes = await request(options);
  if (echoRes !== 'test') {
    // TODO: To be removed in future relase
    console.log('SsoHelper: verifySignature -echoRes', echoRes);
    throw new Error('INVALID_SIGNATURE');
  }
  return true
}
const verifyToken = (token) => {
  let timeInSeconds = Date.now();
  let date1 = new Date(0);
  let date2 = new Date(0);
  date1.setUTCSeconds(token.iat);
  let iat = date1.getTime();
  date2.setUTCSeconds(token.exp);
  let exp = date2.getTime();
  if (isDate(iat) && !(iat < timeInSeconds)) {
    logger.info({
      msg: 'ssoHelper:verifyToken: TOKEN_IAT_FUTURE',
      additionalInfo: {iat: iat, timeInSeconds: timeInSeconds}
    });
    throw new Error('TOKEN_IAT_FUTURE');
  } else if (isDate(exp) && !(exp > timeInSeconds)) {
    logger.info({
      msg: 'ssoHelper:verifyToken: TOKEN_EXPIRED',
      additionalInfo: {iat: iat, timeInSeconds: timeInSeconds, exp: exp}
    });
    throw new Error('TOKEN_EXPIRED');
  } else if (!token.sub) {
    logger.info({
      msg: 'ssoHelper:verifyToken: USER_ID_NOT_PRESENT',
      additionalInfo: {iat: iat, timeInSeconds: timeInSeconds, sub: token.sub}
    });
    throw new Error('USER_ID_NOT_PRESENT');
  }
  return true;
}
const fetchUserWithExternalId = async (payload, req) => { // will be called from player docker to learner docker
  const options = {
    method: 'GET',
    url: `${envHelper?.learner_Service_Local_BaseUrl}${privateBaseUrl}v1/read/${payload.sub}?provider=${payload.state_id}&idType=${payload.state_id}`,
    headers: getHeaders(req),
    json: true
  }
  logger.info({msg:'sso fetch user with external id', additionalInfo:{options: options}})
  return request(options).then(data => {
    
    if (data.responseCode === 'OK') {
      logger.info({msg: 'sso fetching user',
      additionalInfo: {
        result: data.result
        }
      })
      return _.get(data, 'result.response')
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  }).catch(handleGetUserByIdError);
}

const freeUpUser = async (req) => {
  const freeUprequest = {
    id: req.query.userId,
    identifier: [req.query.identifier]
  };
  const options = {
    method: 'POST',
    url: envHelper?.learner_Service_Local_BaseUrl + privateBaseUrl + 'v1/identifier/freeup',
    headers: getHeaders(req),
    body: {
      request: freeUprequest
    },
    json: true
  };
  logger.info({msg:'sso free up user request', additionalInfo:{requestBody: freeUprequest }});
  return request(options).then(data => {
    if (data.responseCode === 'OK' && _.get(data, 'result.response') === 'SUCCESS') {
      logger.info({msg:'sso free up user response', additionalInfo:{data}});
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
};
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
    url: envHelper.LEARNER_URL + 'user/v1/sso/create',
    headers: getHeaders(req),
    body: {
      params: {
        signupType: "sso"
      },
      request: requestBody
    },
    json: true
  }
  console.log('sso user create user request', JSON.stringify(options));
  logger.info({msg:'sso user create user request', additionalInfo:{requestBody: requestBody }})
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      logger.info({msg:'sso new user create response', additionalInfo:{data}})
      return data;
    } else {
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const createSession = async (loginId, client_id, req, res) => {
  let grant;
  let keycloakClient = keycloakTrampoline;
  let scope = 'openid';
  if (client_id === 'android') {
    keycloakClient = keycloakTrampolineAndroid;
    scope = 'offline_access';
  } else if (client_id === 'desktop') {
    keycloakClient = keycloakTrampolineDesktop;
    scope = 'offline_access';
  }
  grant = await keycloakClient.grantManager.obtainDirectly(loginId, undefined, undefined, scope);
  keycloakClient.storeGrant(grant, req, res);
  req.kauth.grant = grant;
  return new Promise((resolve, reject) => {
    keycloakClient.authenticated(req, function (error) {
      if (error) {
        logger.info({msg: 'SsoHelper:createSession error creating session', additionalInfo: error});
        reject('ERROR_CREATING_SSO_SESSION')
      } else {
        resolve({
          access_token: grant.access_token.token,
          refresh_token: grant.refresh_token.token
        })
      }
    });
  });
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
    url: envHelper?.learner_Service_Local_BaseUrl + privateBaseUrl +'v1/update',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  logger.info({msg:'sso update contact api request', additionalInfo:{requestBody: requestBody}})
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
    url: envHelper?.learner_Service_Local_BaseUrl + privateBaseUrl +'v2/assign/role',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  logger.info({msg:'sso update role api request', additionalInfo:{requestBody: requestBody}})
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
    url: envHelper?.learner_Service_Local_BaseUrl + privateBaseUrl +'v1/migrate',
    headers: getHeaders(req),
    body: {
      request: requestBody
    },
    json: true
  }
  logger.info({msg: 'sso migrate user request', additionalInfo:{options: options}})
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
    'Authorization': 'Bearer ' + getBearerToken(req)
  }
}
const handleGetUserByIdError = (error) => {
  logger.info({msg: 'Error Happened and the error is --->',
      additionalInfo: {
        result: error
        }
      })
  if (['USER_NOT_FOUND', 'EXTERNALID_NOT_FOUND', 'UOS_USRRED0013'].includes(_.get(error, 'error.params.err')) || 
  ['USER_NOT_FOUND', 'EXTERNALID_NOT_FOUND', 'UOS_USRRED0013'].includes(_.get(error, 'error.params.status'))) {
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
      'Authorization': 'Bearer ' + getBearerToken(req)
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
    logger.error({msg: 'sso error fetching whileList channels: getSsoUpdateWhileListChannels'});
    return false;
  }
};

const sendSsoKafkaMessage = async (req) => {
  const ssoUpdataChannelLists = await getSsoUpdateWhiteListChannels(req);
  if (ssoUpdataChannelLists) {
    var kafkaPayloadData = getKafkaPayloadData(req.session);
    kafkaService.sendMessage(kafkaPayloadData, envHelper.sunbird_sso_kafka_topic, function (err, res) {
      if (err) {
        logger.error({msg: 'sso sending message to kafka errored', err})
      } else {
        logger.info({msg: 'sso kafka message send successfully'})
      }
    });
  } else {
    logger.error({msg: 'sso white list channels not matched or errored'})
  }
};

/**
 *
 * @param stateVerifiedIdentifier valid email or phone
 * @param nonStateMaskedIdentifier masked email or phone
 * @param identifierType can be email or phone
 * @returns {*|boolean}
 */
const verifyIdentifier = (stateVerifiedIdentifier, nonStateMaskedIdentifier, identifierType) => {
  if (isValidAndNotEmptyString(stateVerifiedIdentifier)) {
    stateVerifiedIdentifier = stateVerifiedIdentifier.toLowerCase();
  } else {
    throw "ERROR_PARSING_STATE_IDENTIFIER";
  }
  if (isValidAndNotEmptyString(nonStateMaskedIdentifier)) {
    nonStateMaskedIdentifier = nonStateMaskedIdentifier.toLowerCase();
  } else {
    throw "ERROR_PARSING_NON_STATE_IDENTIFIER";
  }
  console.log("stateVerifiedIdentifier", stateVerifiedIdentifier);
  console.log("nonStateMaskedIdentifier", nonStateMaskedIdentifier);
  console.log("identifierType", identifierType);
  if (identifierType === 'email') {
    var splittedData = nonStateMaskedIdentifier.split("@");
    if (_.isArray(splittedData) && splittedData.length > 1) {
      return stateVerifiedIdentifier.includes(splittedData[1]) && stateVerifiedIdentifier.includes(splittedData[0].slice(0, 2)) && nonStateMaskedIdentifier.length === stateVerifiedIdentifier.length;
    } else {
      throw "ERROR_PARSING_EMAIL"
    }
  } else if (identifierType === 'phone') {
    var extractedNumber = nonStateMaskedIdentifier.slice(6, nonStateMaskedIdentifier.length);
    return stateVerifiedIdentifier.includes(extractedNumber) && nonStateMaskedIdentifier.length === stateVerifiedIdentifier.length;
  } else {
    throw "UNKNOWN_IDENTIFIER"
  }
};

/**
 *
 */
const fetchUserDetails = async (token) => {
  const userId = getUserIdFromToken(token);
  return await getUserDetails(userId, token);
};

/**
 *
 * @param identifier
 * @returns {string}
 */
const getIdentifier = (identifier) => {
  if (identifier === 'email') {
    return 'email'
  } else if (identifier === 'phone') {
    return 'maskedPhone'
  } else {
    throw "UNKNOWN_IDENTIFIER_CANNOT_PROCESS"
  }
};

const orgSearch = (id, req) => {
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'org/v2/search',
    headers: getHeaders(req),
    body: {
      request: {
        filters: {externalId: id}
      }
    },
    json: true
  };
  logger.info({msg: 'SsoHelpers.orgSearchorg search org', additionalInfo: {id: id}});
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return data;
    } else {
      logger.error({
        msg: 'fetching org details errored',
        error: JSON.stringify(data)
      });
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
};

module.exports = {
  verifySignature,
  verifyToken,
  fetchUserWithExternalId,
  createUser,
  createSession,
  updateContact,
  updateRoles,
  sendSsoKafkaMessage,
  migrateUser,
  freeUpUser,
  verifyIdentifier,
  fetchUserDetails,
  getIdentifier,
  orgSearch
};

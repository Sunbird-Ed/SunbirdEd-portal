const { google } = require('googleapis');
const _ = require('lodash');
const { GOOGLE_OAUTH_CONFIG } = require('./environmentVariablesHelper.js')
const redirectPath = '/google/auth/callback';
const defaultScope = ['https://www.googleapis.com/auth/userinfo.email', 'openid', 'email', 'profile', 'https://www.googleapis.com/auth/userinfo.profile'];
const { getKeyCloakClient } = require('./keyCloakHelper')
const envHelper = require('./environmentVariablesHelper.js')
const request = require('request-promise'); //  'request' npm package with Promise support
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')
const { decodeToken } = require('./jwtHelper');
const { logger } = require('@project-sunbird/logger');
const { ProxyLogger } = require("@project-sunbird/logger/decorator");
const { getBearerToken } = require('../helpers/kongTokenHelper')

const keycloakGoogle = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.secret
  }
})

// keycloack client for account merge poiting to subdomain
const keycloakMergeGoogle = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_MERGE_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.secret
  }
})


const keycloakGoogleAndroid = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_ANDROID_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_ANDROID_CLIENT?.secret
  }
})
const keycloakMergeGoogleAndroid = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_ANDROID_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_MERGE_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_ANDROID_CLIENT?.secret
  }
})
const keycloakGoogleIos = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_IOS_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_MERGE_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_IOS_CLIENT?.secret
  }
})

const keycloakGoogleDesktop = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_DESKTOP_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_AUTH_SERVER_URL,
  realm: envHelper.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_DESKTOP_CLIENT?.secret
  }
})
const keycloakMergeGoogleDesktop = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_DESKTOP_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_MERGE_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_DESKTOP_CLIENT?.secret
  }
})

const keycloakMergeGoogleIos = getKeyCloakClient({
  resource: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.clientId,
  bearerOnly: true,
  serverUrl: envHelper?.PORTAL_MERGE_AUTH_SERVER_URL,
  realm: envHelper?.PORTAL_REALM,
  credentials: {
    secret: envHelper?.KEYCLOAK_GOOGLE_CLIENT?.secret
  }
})

class GoogleOauth {
  createConnection(req) {
    const { clientId, clientSecret } = GOOGLE_OAUTH_CONFIG;
    const protocol = envHelper.SUNBIRD_PROTO;
    /* need to delete post debugging*/
    logger.info({ msg: 'google auth protocol-->', protocol });
    /* need to delete post debugging*/
    const redirect = `${protocol}://${req.get('host')}${redirectPath}`;
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
    if (req.query.error === 'access_denied') {
      throw new Error('GOOGLE_ACCESS_DENIED');
    }
    const { tokens } = await client.getToken(req.query.code).catch(this.handleError)
    client.setCredentials(tokens)
    const tokenInfo = decodeToken(tokens.id_token);
    let userInfo = {
      email: tokenInfo.email,
      name: tokenInfo.name
    };
    // TODO: Remove console logs
    if (!_.get(userInfo, 'name') || !_.get(userInfo, 'email')) {
      logger.info('userInformation being fetched from oauth2 api');
      var oauth2 = google.oauth2({
        auth: client,
        version: 'v2'
      });
      const googleProfileFetched = await oauth2.userinfo.get().catch(this.handleError) || {};
      userInfo = googleProfileFetched.data || {};
      logger.info('userInformation fetched from oauth2 api', userInfo);
    }
    console.log('user information', userInfo);
    logger.info({
      msg: 'token fetched'
    });
    logger.info({
      msg: 'fetched user profile'
    });
    return {
      name: userInfo.name,
      emailId: userInfo.email
    }
  }

  handleError(error) {
    logger.info({
      msg: 'googleOauthHelper: getProfile failed',
      error: error
    });
    if (_.get(error, 'response.data')) {
      throw error.response.data
    } else if (error instanceof Error) {
      throw error.message
    } else {
      throw 'unhandled exception while getting tokens'
    }
  }
}
const googleOauth = new GoogleOauth()
const createSession = async (emailId, reqQuery, req, res) => {
  let grant;
  let keycloakClient = keycloakGoogle;
  let keycloakMergeClient = keycloakMergeGoogle;
  let scope = 'openid';
  if (reqQuery.client_id === 'android') {
    console.log('reqQuery.client_id', reqQuery.client_id);
    keycloakClient = keycloakGoogleAndroid;
    keycloakMergeClient = keycloakMergeGoogleAndroid;
    scope = 'offline_access';
  } else if (reqQuery.client_id === 'desktop') {
    console.log('reqQuery.client_id', reqQuery.client_id);
    keycloakClient = keycloakGoogleDesktop;
    keycloakMergeClient = keycloakMergeGoogleDesktop;
    scope = 'offline_access';
  } else if (reqQuery.client_id === 'ios') {
    keycloakClient = keycloakGoogleIos;
    keycloakMergeClient = keycloakMergeGoogleIos;
    scope = 'offline_access';
  }

  // merge account in progress
  if (_.get(req, 'session.mergeAccountInfo.initiatorAccountDetails') || reqQuery.merge_account_process === '1') {
    console.log('merge in progress', emailId, reqQuery.client_id);
    grant = await keycloakMergeClient.grantManager.obtainDirectly(emailId, undefined, undefined, scope);
    console.log('grant received', JSON.stringify(grant.access_token.token));
    if (!['android', 'desktop'].includes(reqQuery.client_id)) {
      req.session.mergeAccountInfo.mergeFromAccountDetails = {
        sessionToken: grant.access_token.token
      };
    }
    return {
      access_token: grant.access_token.token,
      refresh_token: grant.refresh_token.token
    };
  } else {
    console.log('login in progress');
    grant = await keycloakClient.grantManager.obtainDirectly(emailId, undefined, undefined, scope).catch(function (error) {
      logger.info({
        msg: 'googleOauthHelper: createSession failed',
        error: error
      });
      throw 'unable to create session';
    });
    keycloakClient.storeGrant(grant, req, res);
    req.kauth.grant = grant;
    return new Promise((resolve, reject) => {
      keycloakClient.authenticated(req, function (error) {
        if (error) {
          logger.info({ msg: 'googleauthhelper:createSession error creating session', additionalInfo: error });
          reject('GOOGLE_CREATE_SESSION_FAILED')
        } else {
          resolve({ access_token: grant.access_token.token, refresh_token: grant.refresh_token.token })
        }
      });
    })
  }
}
const fetchUserByEmailId = async (emailId, req) => {
  const options = {
    method: "GET",
    url:
      envHelper.LEARNER_URL +
      "user/v1/exists/email/" +
      +encodeURIComponent(emailId),
    headers: getHeaders(req),
    json: true,
  };
  console.log('check user exists', JSON.stringify(options));
  return request(options).then(data => {
    if (data.responseCode === 'OK') {
      return _.get(data, 'result.exists');
    } else {
      logger.error({ msg: 'googleOauthHelper: fetchUserByEmailId failed', additionalInfo: { data } });
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
    }
  })
}
const createUserWithMailId = async (accountDetails, client_id, req) => {
  if (!accountDetails.name || accountDetails.name === '') {
    throw new Error('USER_NAME_NOT_PRESENT');
  }
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + 'user/v2/signup',
    headers: getHeaders(req),
    body: {
      params: {
        source: client_id,
        signupType: client_id === "apple" ? "apple" : "google"
      },
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
      logger.error({ msg: client_id + 'OauthHelper: createUserWithMailId failed', additionalInfo: { data } });
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
module.exports = { googleOauth, createSession, fetchUserByEmailId, createUserWithMailId };
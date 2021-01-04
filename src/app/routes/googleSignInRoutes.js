const _ = require('lodash');
const { googleOauth, createSession, fetchUserByEmailId, createUserWithMailId } = require('./../helpers/googleOauthHelper');
const telemetryHelper = require('../helpers/telemetryHelper')
const googleDid = '2c010e13a76145d864e459f75a176171';
const { logger } = require('@project-sunbird/logger');
const utils = require('../helpers/utilityService');
const GOOGLE_SIGN_IN_DELAY = 3000;
const uuid = require('uuid/v1')
const REQUIRED_STATE_FIELD = ['client_id', 'redirect_uri', 'error_callback', 'scope', 'state', 'response_type', 'version', 'merge_account_process'];
/**
 * keycloack adds this string to track auth redirection and 
 * with this it triggers auth code verification to get token and create session
 * google flow this is not required
 */
const KEYCLOACK_AUTH_CALLBACK_STRING = 'auth_callback=1'; 

module.exports = (app) => {

  app.get('/google/auth', (req, res) => {
    logger.info({msg: 'google auth called'});
    if (!req.query.client_id || !req.query.redirect_uri || !req.query.error_callback) {
      res.redirect('/library')
      return
    }
    const googleSignInData = _.pick(req.query, REQUIRED_STATE_FIELD)
    googleSignInData.redirect_uri = Buffer.from(googleSignInData.redirect_uri).toString('base64');
    const state = JSON.stringify(googleSignInData);
    logger.info({ reqId: req.get('X-Request-ID'), msg: 'query params state', googleSignInData});
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state=' + state
    logger.info({ reqId: req.get('X-Request-ID'), msg: 'redirect google to' + JSON.stringify(googleAuthUrl)});
    res.redirect(googleAuthUrl)
    logImpressionEvent(req);
  });
  /**
   * steps to be followed in callback url
   * 1. Parse 'state' query param and check mandatory field. If error redirect to '/library'.
   * 2. Fetch profile from access code.
   * 3. Fetch userProfile from sunbird middleware.
   * 4. If userProfile found do step 5.
   * 5. Redirect based on client_id obtained from req query.
   *    a. If portal, create session and redirect to redirect url, if not '/library'.
   *    b. If mobile, crete session redirect to redirect url obtained from query with jwt token and refresh token.
   * 6. userProfile not found, make create user api, then do step 5
   * 7. If any error in the flow, redirect to error_callback with all query param.
   */
  app.get('/google/auth/callback', async (req, res) => {
    logger.info({msg: 'google auth callback called' });
    let googleProfile, isUserExist, newUserDetails, keyCloakToken, redirectUrl, errType, reqQuery = {};
    try {
      errType = 'BASE64_STATE_DECODE';
      reqQuery = _.pick(JSON.parse(req.query.state), REQUIRED_STATE_FIELD);
      reqQuery.redirect_uri = Buffer.from(reqQuery.redirect_uri, 'base64').toString('ascii');
      if (!reqQuery.client_id || !reqQuery.redirect_uri || !reqQuery.error_callback) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'GOOGLE_PROFILE_API';
      googleProfile = await googleOauth.getProfile(req).catch(handleGoogleProfileError);
      logger.info({msg: 'googleProfile fetched' + JSON.stringify(googleProfile)});
      errType = 'USER_FETCH_API';
      isUserExist = await fetchUserByEmailId(googleProfile.emailId, req).catch(handleGetUserByIdError);
      logger.info({msg: 'sunbird profile fetched' + JSON.stringify(isUserExist)});
      if (!isUserExist) {
        logger.info({msg: 'creating new google user'});
        errType = 'USER_CREATE_API';
        newUserDetails = await createUserWithMailId(googleProfile, reqQuery.client_id, req).catch(handleCreateUserError);
        await utils.delay(GOOGLE_SIGN_IN_DELAY);
      }
      errType = 'KEYCLOAK_SESSION_CREATE';
      keyCloakToken = await createSession(googleProfile.emailId, reqQuery, req, res).catch(handleCreateSessionError);
      logger.info({msg: 'keyCloakToken fetched' + JSON.stringify(keyCloakToken)});
      errType = 'UNHANDLED_ERROR';
      redirectUrl = reqQuery.redirect_uri.replace(KEYCLOACK_AUTH_CALLBACK_STRING, ''); // to avoid 401 auth errors from keycloak
      if (reqQuery.client_id === 'android' || reqQuery.client_id === 'desktop' || reqQuery.client_id === 'nodebb' || reqQuery.client_id === 'nodebb-local') {
        redirectUrl = reqQuery.redirect_uri.split('?')[0] + getQueryParams(keyCloakToken);
      }
      logger.info({msg: 'redirect url ' + redirectUrl});
      logger.info({msg:'google sign in success',additionalInfo: {googleProfile, isUserExist, newUserDetails, redirectUrl}});
    } catch (error) {
      if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
        queryObj.error_message = getErrorMessage(error);
        redirectUrl = reqQuery.error_callback + getQueryParams(queryObj);
      }
      console.log({msg:'google sign in failed', error: error, additionalInfo: {errType, googleProfile, isUserExist, newUserDetails, redirectUrl}});
      logger.error({msg:'google sign in failed', error: error, additionalInfo: {errType, googleProfile, isUserExist, newUserDetails, redirectUrl}})
      logErrorEvent(req, errType, error);
    } finally {
      logger.info({msg: 'redirecting to ' + redirectUrl});
      res.redirect(redirectUrl || '/resources');
    }
  });
}
const logImpressionEvent = (req) => {
  const edata = {
    type: 'view',
    pageid: 'google-sign-in',
    uri: '/google/auth',
  }
  const context = {
    env: 'GOOGLE_SIGN_IN',
    did: googleDid
  }
  telemetryHelper.logImpressionEvent(req, {edata, context});
}
const logErrorEvent = (req, type, error) => {
  let stacktrace;
  if(error instanceof Error){
    stacktrace = error.message;
  } else {
    stacktrace = JSON.stringify(error)
    if(stacktrace === '{}'){
      stacktrace = 'STRINGIFY_FAILED'
    }
  }
  const edata = {
    err: 'GOOGLE_SIGN_IN_ERROR',
    type,
    stacktrace
  }
  const context = {
    env: 'GOOGLE_SIGN_IN'
  }
  telemetryHelper.logApiErrorEventV2(req, {edata, context});
}
const getQueryParams = (queryObj) => {
  return '?' + Object.keys(queryObj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
    .join('&');
}
const getErrorMessage = (error) => {
  if (error === 'USER_NAME_NOT_PRESENT' || _.get(error, 'message') === 'USER_NAME_NOT_PRESENT') {
    return 'Your account could not be created on DIKSHA due to your Google Security settings';
  } else if(error === 'GOOGLE_ACCESS_DENIED' || _.get(error, 'message') === 'GOOGLE_ACCESS_DENIED') {
    return 'Your account could not be created on DIKSHA due to your Google Security settings';
  } else if(_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
    return 'User account is blocked. Please contact admin';
  } else {
    return 'Your account could not be signed in to DIKSHA due to technical issue. Please try again after some time';
  }
}
const handleCreateUserError = (error) => {
  logger.info({
    msg: 'ERROR_CREATING_USER',
    error: error,
  });
  if (_.get(error, 'error.params')) {
    throw error.error.params;
  } else if (error instanceof Error) {
    throw error.message;
  } else {
    throw 'unhandled exception while getting userDetails';
  }
}
const handleGetUserByIdError = (error) => {
  if (_.get(error, 'error.params.err') === 'USER_NOT_FOUND' || _.get(error, 'error.params.status') === 'USER_NOT_FOUND') {
    return {};
  }
  throw error.error || error.message || error;
}

const handleCreateSessionError = (error) => {
  logger.info({
    msg: 'ERROR_CREATING_SESSION',
    error: error,
  });
  throw error.error || error.message || error;
};

const handleGoogleProfileError = (error) => {
  logger.info({
    msg: 'ERROR_FETCHING_GOOGLE_PROFILE',
    error: error,
  });
  throw error.error || error.message || error;
};

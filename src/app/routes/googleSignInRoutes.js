const _ = require('lodash');
const { googleOauth, createSession, fetchUserByEmailId, createUserWithMailId } = require('./../helpers/googleOauthHelper');
const telemetryHelper = require('../helpers/telemetryHelper')
const googleDid = '2c010e13a76145d864e459f75a176171';
const logger = require('sb_logger_util_v2')
const utils = require('../helpers/utilityService');
const GOOGLE_SIGN_IN_DELAY = 2000;

module.exports = (app) => {

  app.get('/google/auth', (req, res) => {
    console.log('google auth called');
    if (!req.query.client_id || !req.query.redirect_uri || !req.query.error_callback) {
      res.redirect('/library')
      return
    }
    const state = JSON.stringify(req.query);
    console.log('query params state', state);
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state=' + state
    console.log('redirect google to', JSON.stringify(googleAuthUrl));
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
    console.log('google auth callback called');
    const reqQuery = _.pick(JSON.parse(req.query.state), ['client_id', 'redirect_uri', 'error_callback', 'scope', 'state', 'response_type', 'version', 'merge_account_process']);
    let googleProfile, isUserExist, newUserDetails, keyCloakToken, redirectUrl, errType;
    try {
      if (!reqQuery.client_id || !reqQuery.redirect_uri || !reqQuery.error_callback) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'GOOGLE_PROFILE_API';
      googleProfile = await googleOauth.getProfile(req).catch(handleGoogleProfileError);
      console.log('googleProfile fetched', JSON.stringify(googleProfile));
      errType = 'USER_FETCH_API';
      isUserExist = await fetchUserByEmailId(googleProfile.emailId, req).catch(handleGetUserByIdError);
      console.log('sunbird profile fetched', isUserExist);
      if (!isUserExist) {
        console.log('creating new google user');
        errType = 'USER_CREATE_API';
        newUserDetails = await createUserWithMailId(googleProfile, reqQuery.client_id, req).catch(handleCreateUserError);
        await utils.delay(GOOGLE_SIGN_IN_DELAY);
      }
      errType = 'KEYCLOAK_SESSION_CREATE';
      keyCloakToken = await createSession(googleProfile.emailId, reqQuery, req, res).catch(handleCreateSessionError);
      console.log('keyCloakToken fetched', JSON.stringify(keyCloakToken));
      errType = 'UNHANDLED_ERROR';
      redirectUrl = reqQuery.redirect_uri.split('?')[0];
      if (reqQuery.client_id === 'android') {
        redirectUrl = redirectUrl + getQueryParams(keyCloakToken);
      }
      console.log('redirect url ', redirectUrl);
      logger.info({msg:'google sign in success',additionalInfo: {googleProfile, isUserExist, newUserDetails, redirectUrl}});
    } catch (error) {
      if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
        queryObj.error_message = getErrorMessage(error);
        redirectUrl = reqQuery.error_callback + getQueryParams(queryObj);
      }
      logger.error({msg:'google sign in failed', error: error, additionalInfo: {errType, googleProfile, isUserExist, newUserDetails, redirectUrl}})
      logErrorEvent(req, errType, error);
    } finally {
      console.log('redirecting to ', redirectUrl);
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

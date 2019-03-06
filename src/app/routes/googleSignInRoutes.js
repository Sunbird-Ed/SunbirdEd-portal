const _ = require('lodash');
const { googleOauth, createSession, fetchUserByEmailId, createUserWithMailId } = require('./../helpers/googleOauthHelper');
const telemetryHelper = require('../helpers/telemetryHelper')

module.exports = (app) => {

  app.get('/google/auth', (req, res) => {
    if (!req.query.client_id || !req.query.redirect_uri || !req.query.error_callback) {
      res.redirect('/library')
      return
    }
    const state = JSON.stringify(req.query);
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state=' + state
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
    const reqQuery = _.pick(JSON.parse(req.query.state), ['client_id', 'redirect_uri', 'error_callback', 'scope', 'state', 'response_type', 'version']);
    let googleProfile, sunbirdProfile, newUserDetails, keyCloakToken, redirectUrl, errType;
    try {
      if (!reqQuery.client_id || !reqQuery.redirect_uri || !reqQuery.error_callback) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'GOOGLE_PROFILE_API';
      googleProfile = await googleOauth.getProfile(req);
      errType = 'USER_FETCH_API';
      sunbirdProfile = await fetchUserByEmailId(googleProfile.emailId, req).catch(handleGetUserByIdError);
      if (!_.get(sunbirdProfile, 'result.response.userName') || !_.get(sunbirdProfile, 'result.response.firstName')) {
        errType = 'USER_CREATE_API';
        newUserDetails = await createUserWithMailId(googleProfile, req).catch(handleCreateUserError);
      }
      errType = 'KEYCLOAK_SESSION_CREATE';
      keyCloakToken = await createSession(googleProfile.emailId, req, res);
      errType = 'UNHANDLED_ERROR';
      redirectUrl = reqQuery.redirect_uri.split('?')[0];
      if (reqQuery.client_id === 'android') {
        redirectUrl = redirectUrl + getQueryParams(keyCloakToken);
      }
      console.log('google sign in success', googleProfile, sunbirdProfile, newUserDetails, redirectUrl);
      logAuditEvent(req, googleProfile)
    } catch (error) {
      if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
        queryObj.error_message = getErrorMessage(error);
        redirectUrl = reqQuery.error_callback + getQueryParams(queryObj);
      }
      console.log('google sign in failed', errType, error, googleProfile, sunbirdProfile, newUserDetails, redirectUrl);
      logErrorEvent(req, errType, error);
    } finally {
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
    env: 'GOOGLE_SIGN_IN'
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
const logAuditEvent = (req, profile) => {
  const edata = {
    props: ['email'],
    state: 'LOGGED_IN_USER', 
    prevstate: 'ANONYMOUS_USER'
  }
  const context = {
    env: 'GOOGLE_SIGN_IN'
  }
  telemetryHelper.logAuditEvent(req, {edata, context});
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

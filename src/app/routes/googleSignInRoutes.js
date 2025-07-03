const _ = require('lodash');
const path = require('path');
const { googleOauth, createSession, fetchUserByEmailId, createUserWithMailId } = require('./../helpers/googleOauthHelper');
const telemetryHelper = require('../helpers/telemetryHelper')
const googleDid = '2c010e13a76145d864e459f75a176171';
const { logger } = require('@project-sunbird/logger');
const utils = require('../helpers/utilityService');
const GOOGLE_SIGN_IN_DELAY = 3000;
const uuid = require('uuid/v1')
const bodyParser = require('body-parser');
const REQUIRED_STATE_FIELD = ['client_id', 'redirect_uri', 'error_callback', 'scope', 'state', 'response_type', 'version', 'merge_account_process'];
const envHelper = require('../helpers/environmentVariablesHelper.js');
const { GOOGLE_OAUTH_CONFIG, GOOGLE_OAUTH_CONFIG_IOS } = require('../helpers/environmentVariablesHelper.js')
const {OAuth2Client} = require('google-auth-library');

const allowedGoogleEmails = process.env.google_allowed_emails?.split(',');
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
    const googleSignInData = _.pick(req.query, REQUIRED_STATE_FIELD);
    googleSignInData.redirect_uri = Buffer.from(googleSignInData.redirect_uri).toString('base64');
    const state = JSON.stringify(googleSignInData);
    logger.info({ reqId: req.get('X-Request-ID'), msg: 'query params state', googleSignInData});
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state=' + state
    logger.info({ reqId: req.get('X-Request-ID'), msg: 'redirect google to' + JSON.stringify(googleAuthUrl)});
    res.redirect(googleAuthUrl)
    logImpressionEvent(req);
  });

  app.post('/google/auth/android', bodyParser.json(), async (req, res) => {
    let errType, newUserDetails, payload = {}
    let CLIENT_ID = req && req.body.platform && req.body.platform === 'ios' ? GOOGLE_OAUTH_CONFIG_IOS.clientId : GOOGLE_OAUTH_CONFIG.clientId;
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.get('X-GOOGLE-ID-TOKEN'),
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      payload = ticket.getPayload();
      if (req.body['emailId'] !== payload['email']) {
        res.status(400).send({
          msg: 'emailId donot match'
        });
        throw 'emailId donot match'
      }
      return payload['email'];
    }
     verify().then(async (emailId) => {
       let isUserExist = await fetchUserByEmailId(emailId, req).catch(handleGetUserByIdError);
       if (!isUserExist) {
         let newGoogleUserDetails = {};
         newGoogleUserDetails['name']= payload.name;
         newGoogleUserDetails['emailId'] = payload.email;
         logger.info({msg: 'creating new google user'});
         errType = 'USER_CREATE_API';
         newUserDetails = await createUserWithMailId(newGoogleUserDetails, 'android', req).catch(handleCreateUserError);
         await utils.delay(GOOGLE_SIGN_IN_DELAY);
       }
       const clientId = req && req.body.platform && req.body.platform === 'ios' ? 'ios': 'android';
       const keyCloakToken = await createSession(emailId, {client_id: 'android'}, req, res).catch(handleCreateSessionError);
       res.send(keyCloakToken);
     }).catch((err) => {
       res.status(400).send({
         msg: 'unable to create session'
       });
       throw err;
     });
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
      // if(!allowedGoogleEmails.includes(googleProfile.emailId)) {
      //   throw 'google email not allowed';
      // }
      logger.info({msg: 'googleProfile fetched' + JSON.stringify(googleProfile)});
      errType = 'USER_FETCH_API';
      isUserExist = await fetchUserByEmailId(googleProfile.emailId, req).catch(handleGetUserByIdError);
      logger.info({msg: 'sunbird profile fetched' + JSON.stringify(isUserExist)});
      if (!isUserExist) {
        // logger.info({msg: 'creating new google user'});
        // errType = 'USER_CREATE_API';
        // newUserDetails = await createUserWithMailId(googleProfile, reqQuery.client_id, req).catch(handleCreateUserError);
        // await utils.delay(GOOGLE_SIGN_IN_DELAY);
        logger.error({ msg: 'User not registered with the FMPS portal' });
        throw new Error('User not registered with the FMPS portal. Please contact the administrator.');
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
        let emailId = null;
        if (googleProfile && googleProfile?.emailId) {
          emailId = googleProfile.emailId;
        }
        queryObj.error_message = getErrorMessage(error, emailId);
        redirectUrl = reqQuery.error_callback + getQueryParams(queryObj);
      }
      console.log({msg:'google sign in failed', error: error, additionalInfo: {errType, googleProfile, isUserExist, newUserDetails, redirectUrl}});
      logger.error({msg:'google sign in failed', error: error, additionalInfo: {errType, googleProfile, isUserExist, newUserDetails, redirectUrl}})
      logErrorEvent(req, errType, error);
    } finally {
      logger.info({msg: 'redirecting to ' + redirectUrl});
      if(reqQuery.client_id === 'desktop') {
        const protocol = envHelper.DESKTOP_APP_ID.replace(/\./g, "");
        const reponseData = `${protocol}://google/signin?access_token=${keyCloakToken.access_token}`;
        logger.info({msg: 'DESKTOP REDIRECT URL ' + reponseData});
        res.render(
            path.join(__dirname, "googleResponse.ejs"),
            {data: reponseData}
        );
      } else {
        res.redirect(redirectUrl || '/resources');
      }
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
const getErrorMessage = (error, emailId) => {
  const emailPart = emailId ? ` with email "${emailId}"` : '';
  if (error === 'USER_NAME_NOT_PRESENT' || _.get(error, 'message') === 'USER_NAME_NOT_PRESENT') {
    return `We couldn't create your FMPS account${emailPart} due to Google security settings. Try checking your account settings or use a different email.`;
  } else if (error === 'GOOGLE_ACCESS_DENIED' || _.get(error, 'message') === 'GOOGLE_ACCESS_DENIED') {
    return `Access was denied while creating your FMPS account${emailPart}. Try adjusting your Google permissions or use another email.`;
  } else if (_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
    return `The account${emailPart} is blocked. Please contact your admin to unblock it.`;
  } else {
    return `We couldn't complete the FMPS login${emailPart}. This email may not be authorized. Try again with a whitelisted email.`;
  }
};
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

const _ = require('lodash');
const { verifySignature, verifyToken, getChannel, fetchUserWithLoginId, createUserWithPhone, createSession, updatePhone, updateRoles } = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper');

const successUrl = '/sso/sign-in/success';
const updatePhoneUrl = '/sign-in/sso/update-phone';
const errorUrl = '/sso/sign-in/error';

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    let requestBody, loginId, userDetails, userChannel, redirectUrl, errType;
    try {
      errType = 'VERIFY_SIGNATURE';
      await verifySignature(req.query.token);
      requestBody = jwt.decode(req.query.token);
      errType = 'VERIFY_TOKEN';
      verifyToken(requestBody);
      loginId = requestBody.sub + (requestBody.iss ? '@' + requestBody.iss : '')
      errType = 'USER_FETCH_API';
      userDetails = fetchUserWithLoginId(loginId, req);
      if(userDetails.phoneVerified) {
        errType = 'USER_CHANNEL_API';
        userChannel = await getChannel(loginId);
        redirectUrl = successUrl + getQueryParams({ id: loginId, redirect_url: requestBody.redirect_url});
      } else {
        redirectUrl = updatePhoneUrl + getQueryParams({id: loginId, redirect_url: requestBody.redirect_url, roles: requestBody.roles, name : requestBody.name});
      }
      console.log('sso session creation successfully redirected', requestBody, req.query, userDetails, redirectUrl);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=SSO failed`;
      console.log('sso session creation failed', error, requestBody, req.query, userDetails, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  });

  app.get('/v1/sso/phone/verified', async (req, res) => {
    let loginId, phone, userDetails, userChannel, redirectUrl, errType, newUseDetails;
    try {
      if (!req.query.phone || !req.query.id || !req.query.name) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'USER_FETCH_API';
      loginId = req.query.id;
      phone = req.query.phone;
      userDetails = fetchUserWithLoginId(loginId, req);
      if(userDetails.userName) {
        errType = 'USER_CHANNEL_API';
        userChannel = await getChannel(loginId);
        errType = 'UPDATE_PHONE';
        await updatePhone({phone, loginId}); // api need to be verified
      } else {
        newUseDetails = {
          name: req.query.name,
          userName: loginId,
          phone,
          phoneVerified: true
        }
        errType = 'CREATE_USER';
        userDetails = await createUserWithPhone(userDetails);
        if (req.query.roles) {
          errType = 'UPDATE_USER_ROLES';
          userDetails.roles = req.query.roles;
          await updateRoles(userDetails);
        }
        logAuditEvent(req, newUseDetails)
      }
      redirectUrl = successUrl + getQueryParams({ id: loginId, redirect_url: req.query.redirect_url});
      console.log('sso phone updated successfully', req.query, userDetails, redirectUrl, newUseDetails);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=SSO failed`;
      console.log('sso phone updating failed', error, req.query, userDetails, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get(successUrl, async (req, res) => {
    let loginId, phone, userDetails, userChannel, redirectUrl, errType;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      loginId = req.query.id;
      errType = 'CREATE_SESSION';
      await createSession(loginId, req, res);
      redirectUrl = req.query.redirect_url ? req.query.redirect_url : '/resources';
      console.log('sso sign-in success callback redirected', req.query, redirectUrl, errType);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=SSO failed`;
      console.log('sso sign-in success callback error', error, req.query, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get('/v1/get/access/token', async (req, res) => { // needs to onboard to kong
    let loginId, accessTokens, userDetails, userChannel, response, errType;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      loginId = req.query.id;
      errType = 'CREATE_SESSION';
      accessTokens = await createSession(loginId);
      response = accessTokens;
      console.log('sso sign in get access success', req.query, response, accessTokens);
    } catch (error) {
      response = { error: 'session creation failed' };
      console.log('sso sign in get access token failed', error, req.query, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.json(response);
    }
  })

  app.get(errorUrl, (req, res) => {
    res.redirect('/resources'); // should go to error page
  })

  // mock api 
  app.get('/mock/v2/user/session/create', (req,res) => {
    let redirectUrl;
    if(req.query.phone) {
      redirectUrl = `${successUrl}?id=sunil1as990&redirect_url=/home`;
    } else {
      redirectUrl = `${updatePhoneUrl}?id=sunil1as990&redirect_url=/home`;
    }
    res.redirect(redirectUrl);
  })
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
    err: 'SSO_SIGN_IN_ERROR',
    type,
    stacktrace
  }
  const context = {
    env: 'SSO_SIGN_IN'
  }
  telemetryHelper.logApiErrorEventV2(req, {edata, context});
}
const logAuditEvent = (req, profile) => {
  const edata = {
    props: ['phone'],
    state: 'LOGGED_IN_USER', 
    prevstate: 'ANONYMOUS_USER'
  }
  const context = {
    env: 'SSO_SIGN_IN'
  }
  telemetryHelper.logAuditEvent(req, {edata, context});
}
const getQueryParams = (queryObj) => {
  return '?' + Object.keys(queryObj).filter(key => queryObj[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
    .join('&');
}


const _ = require('lodash');
const { verifySignature, verifyToken, getChannel, fetchUserWithLoginId, createUserWithPhone, createSession, updatePhone, updateRoles } = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper')

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    let jwtDecodedToken, loginId, userDetails, userChannel, redirectUrl, errType;
    try {
      errType = 'VERIFY_SIGNATURE';
      await verifySignature(req.query.token);
      jwtDecodedToken = jwt.decode(req.query.token);
      errType = 'VERIFY_TOKEN';
      verifyToken(jwtDecodedToken);
      loginId = jwtDecodedToken.sub + (jwtDecodedToken.iss ? '@' + jwtDecodedToken.iss : '')
      errType = 'USER_FETCH_API';
      userDetails = fetchUserWithLoginId(loginId);
      if(userDetails.phoneVerified) {
        errType = 'USER_CHANNEL_API';
        userChannel = await getChannel(loginId);
        redirectUrl = '/sso/signin/success?loginId=' + loginId + '&redirect_url=' + jwtDecodedToken.redirect_url;
      } else {
        redirectUrl = '/sso/update/phone?loginId=' + loginId + '&redirect_url=' + jwtDecodedToken.redirect_url + '&roles=' + jwtDecodedToken.roles;
      }
      console.log('sso session creation successfully redirected', jwtDecodedToken, req.query, userDetails, redirectUrl);
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
      console.log('sso session creation failed', error, jwtDecodedToken, req.query, userDetails, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || '/sso/signin/error');
    }
  });

  app.get('/v1/sso/phone/verified', (req, res) => {
    let loginId, phone, userDetails, userChannel, redirectUrl, errType;
    try {
      if (!req.query.phone || !req.query.loginId) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'USER_FETCH_API';
      loginId = req.query.loginId;
      phone = req.query.phone;
      userDetails = fetchUserWithLoginId(loginId);
      if(userDetails.userName) {
        errType = 'USER_CHANNEL_API';
        userChannel = await getChannel(loginId);
        errType = 'UPDATE_PHONE';
        await updatePhone({phone, loginId}); // api need to be verified
      } else {
        const userDetails = {
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
        logAuditEvent(req, googleProfile)
      }
      redirectUrl = '/sso/signin/success?loginId=' + loginId + '&redirect_url=' + req.query.redirect_url;
      console.log('sso phone updated successfully', req.query, userDetails, redirectUrl);
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
      console.log('sso phone updating failed', error, req.query, userDetails, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || '/sso/signin/error');
    }
  })

  app.get('/sso/signin/success', async (req, res) => {
    let loginId, phone, userDetails, userChannel, redirectUrl, errType;
    try {
      if (!req.query.loginId) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      loginId = req.query.loginId;
      errType = 'CREATE_SESSION';
      await createSession(loginId);
      redirectUrl = req.query.redirect_url ? req.query.redirect_url : '/resources';
      console.log('sso signin success callback redirected', req.query, redirectUrl, errType);
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
      console.log('sso signin success callback error', error, req.query, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || '/sso/signin/error');
    }
  })

  app.get('/v1/get/access/token', async (req, res) => { // needs to onboard to kong
    let loginId, accessTokens, userDetails, userChannel, response, errType;
    try {
      if (!req.query.loginId) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      loginId = req.query.loginId;
      errType = 'CREATE_SESSION';
      accessTokens = await createSession(loginId);
      response = accessTokens;
      console.log('sso sign in get access success', loginId, req.query, response, accessTokens);
    } catch (error) {
      response = { error: 'session creation failed' };
      console.log('sso sign in get access token failed', error, req.query, redirectUrl, errType);
      logErrorEvent(req, errType, error);
    } finally {
      res.json(response);
    }
  })

  app.get('/sso/signin/error', (req, res) => {
    res.redirect('/resources'); // should go to error page
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
    props: ['email'],
    state: 'LOGGED_IN_USER', 
    prevstate: 'ANONYMOUS_USER'
  }
  const context = {
    env: 'SSO_SIGN_IN'
  }
  telemetryHelper.logAuditEvent(req, {edata, context});
}


const _ = require('lodash');
const jwt = require('jsonwebtoken')
const { verifySignature, verifyToken, fetchUserWithExternalId, createUser, createSession, updatePhone, updateRoles } = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper');

const successUrl = '/sso/sign-in/success';
const updatePhoneUrl = '/sign-in/sso/update-phone';
const errorUrl = '/sso/sign-in/error';

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    let jwtPayload, userDetails, redirectUrl, errType;
    try {
      errType = 'VERIFY_SIGNATURE';
      await verifySignature(req.query.token);
      jwtPayload = jwt.decode(req.query.token);
      if (!jwtPayload.state_id || !jwtPayload.school_id || !jwtPayload.name || !jwtPayload.sub) {
        errType = 'PAYLOAD_DATA_MISSING';
        throw 'some of the JWT payload is missing';
      }
      req.session.jwtPayload = jwtPayload;
      errType = 'VERIFY_TOKEN';
      verifyToken(jwtPayload);
      errType = 'USER_FETCH_API';
      userDetails = await fetchUserWithExternalId(jwtPayload, req);
      req.session.userDetails = userDetails;
      if(!_.isEmpty(userDetails) && userDetails.phone) {
        redirectUrl = successUrl + getQueryParams({ id: userDetails.userName });
      } else {
        redirectUrl = updatePhoneUrl; // verify phone then create user
      }
      console.log('sso session creation successfully redirected', jwtPayload, req.query, userDetails, redirectUrl);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error);
      console.log('sso session creation failed', errType,  error, jwtPayload, req.query, userDetails, redirectUrl);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  });

  app.get('/v1/sso/phone/verified', async (req, res) => {
    let userDetails, jwtPayload, redirectUrl, errType, createUserReq, updatePhoneReq, updateRolesReq;
    jwtPayload = req.session.jwtPayload; // fetch from session
    userDetails = req.session.userDetails; // fetch from session
    try {
      if (_.isEmpty(jwtPayload) || !req.query.phone) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      if(!_.isEmpty(userDetails) && !userDetails.phone) { // existing user without phone
        errType = 'UPDATE_PHONE';
        updatePhoneReq = {
          userId: userDetails.id,
          phone: req.query.phone,
          phoneVerified: true
        }
        await updatePhone(updatePhoneReq).catch(handleProfileUpdateError); // api need to be verified
      } else { // create user and update roles
        errType = 'CREATE_USER';
        createUserReq = {
          firstName: jwtPayload.name,
          phone: req.query.phone,
          phoneVerified: true,
          channel: jwtPayload.state_id,
          orgExternalId: jwtPayload.school_id,
          externalIds: [{
            id: jwtPayload.sub,
            provider: jwtPayload.state_id,
            idType: jwtPayload.state_id
          }]
        }
        await createUser(createUserReq, req).catch(handleProfileUpdateError);
        errType = 'FETCH_USER_AFTER_CREATE';
        userDetails = await fetchUserWithExternalId(jwtPayload, req); // to get userName
        if (jwtPayload.roles && jwtPayload.roles.length) {
          errType = 'UPDATE_USER_ROLES';
          updateRolesReq = {
            userId: userDetails.id,
            orgExternalId: jwtPayload.school_id, // need to be verified
            provider: jwtPayload.state_id,
            roles: jwtPayload.roles
          }
          await updateRoles(updateRolesReq, req).catch(handleProfileUpdateError);
        }
        logAuditEvent(req, createUserReq)
      }
      redirectUrl = successUrl + getQueryParams({ id: userDetails.userName });
      console.log('sso phone updated successfully', req.query.phone, jwtPayload, userDetails, createUserReq, updatePhoneReq, updateRolesReq, redirectUrl, errType);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error);
      console.log('sso phone updating failed', errType, req.query.phone, error, userDetails, jwtPayload, redirectUrl, createUserReq, updatePhoneReq, updateRolesReq);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get(successUrl, async (req, res) => {
    let userName, jwtPayload, redirectUrl, errType;
    jwtPayload = req.session.jwtPayload;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      userName = req.query.id;
      errType = 'CREATE_SESSION';
      await createSession(userName, req, res);
      redirectUrl = jwtPayload.redirect_url ? jwtPayload.redirect_url : '/resources';
      console.log('sso sign-in success callback success', req.query, redirectUrl, errType);
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error);
      console.log('sso sign-in success callback error', errType, error, req.query, jwtPayload, redirectUrl);
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get('/v1/sso/create/session', async (req, res) => { // needs to onboard to kong
    let userName, response, errType;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      userName = req.query.id;
      errType = 'CREATE_SESSION';
      response = await createSession(userName, req, res);
      console.log('sso sign in create session success', req.query, response);
    } catch (error) {
      response = { error: getErrorMessage(error) };
      console.log('sso sign in get access token failed', errType, error, req.query);
      logErrorEvent(req, errType, error);
    } finally {
      res.json(response);
    }
  })

  app.get(errorUrl, (req, res) => {
    const redirect_uri = encodeURIComponent(`https://${req.get('host')}/resources?auth_callback=1`);
    const redirectUrl = `/auth/realms/sunbird/protocol/openid-connect/auth?client_id=portal&redirect_uri=${redirect_uri}&scope=openid&response_type=code&version=1&error_message=` + req.query.error_message;
    res.redirect(redirectUrl); // should go to error page
  })
}
const handleProfileUpdateError = (error) => {
  if (_.get(error, 'error.params')) {
    throw error.error.params;
  } else if (error instanceof Error) {
    throw error.message;
  } else {
    throw 'unhandled exception while getting userDetails';
  }
}

const getErrorMessage = (error) => {
  if(_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
    return 'User account is blocked. Please contact admin';
  } else {
    return 'Your account could not be signed in to DIKSHA due to technical issue. Please try again after some time';
  }
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

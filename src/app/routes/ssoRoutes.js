const _ = require('lodash');
const jwt = require('jsonwebtoken');
const envHelper = require('../helpers/environmentVariablesHelper');
const {encrypt, decrypt} = require('../helpers/crypto');
const {
  verifySignature, verifyIdentifier, verifyToken, fetchUserWithExternalId, createUser, fetchUserDetails,
  createSession, updateContact, updateRoles, sendSsoKafkaMessage, migrateUser, freeUpUser, getIdentifier,
  orgSearch
} = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper');
const {generateAuthToken, getGrantFromCode} = require('../helpers/keyCloakHelperService');
const {parseJson, isDateExpired} = require('../helpers/utilityService');
const {getUserIdFromToken} = require('../helpers/jwtHelper');
const fs = require('fs');
const externalKey = envHelper?.CRYPTO_ENCRYPTION_KEY_EXTERNAL;
const successUrl = '/sso/sign-in/success';
const updateContactUrl = '/sign-in/sso/update/contact';
const errorUrl = '/sso/sign-in/error';
const { logger } = require('@project-sunbird/logger');
const url = require('url');
const {acceptTncAndGenerateToken} = require('../helpers/userService');
const VDNURL = envHelper.vdnURL || 'https://dockstaging.sunbirded.org';
const { getAuthToken } = require('../helpers/kongTokenHelper');

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    logger.info({msg: '/v2/user/session/create called'});
    let jwtPayload, userDetails, redirectUrl, errType, orgDetails;
    try {
      errType = 'VERIFY_SIGNATURE';
      await verifySignature(req.query.token);
      jwtPayload = jwt.decode(req.query.token);
      if (!jwtPayload.state_id || !jwtPayload.school_id || !jwtPayload.name || !jwtPayload.sub) {
        errType = 'PAYLOAD_DATA_MISSING';
        throw 'some of the JWT payload is missing';
      }
      req.session.jwtPayload = jwtPayload;
      req.session.migrateAccountInfo = {
        stateToken: req.query.token
      };
      errType = 'VERIFY_TOKEN';
      verifyToken(jwtPayload);
      errType = 'USER_FETCH_API';
      userDetails = await fetchUserWithExternalId(jwtPayload, req);
      if (_.get(req,'cookies.redirectPath')){
        res.cookie ('userDetails', JSON.stringify(encrypt(userDetails.userName, externalKey)));
      }
      req.session.userDetails = userDetails;
      logger.info({msg: "userDetails fetched" + userDetails});
      if(!_.isEmpty(userDetails) && (userDetails.phone || userDetails.email)) {
        redirectUrl = successUrl + getEncyptedQueryParams({userName: userDetails.userName});
        logger.info({
          msg: 'sso session create v2 api, successfully redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            jwtPayload: jwtPayload,
            query: req.query,
            userDetails: userDetails,
            redirectUrl: redirectUrl
          }
        })
      } else {
        errType = 'ORG_SEARCH';
        orgDetails = await orgSearch(jwtPayload.school_id, req);
        if (!(_.get(orgDetails, 'result.response.count') > 0)) {
          throw 'SCHOOL_ID_NOT_REGISTERED'
        }
        const dataToEncrypt = {
          identifier: (userDetails && userDetails.id) ? userDetails.id : ''
        };
        errType = 'ERROR_ENCRYPTING_DATA_SESSION_CREATE';
        req.session.userEncryptedInfo = encrypt(JSON.stringify(dataToEncrypt));
        redirectUrl = updateContactUrl; // verify phone then create user
        logger.info({
          msg:'sso session create v2 api, successfully redirected to update phone page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            jwtPayload: jwtPayload,
            query: req.query,
            userDetails: userDetails,
            redirectUrl: redirectUrl
          }
        })
      }
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso session create v2 api failed',
        error,
        additionalInfo: {
          errorType: errType,
          jwtPayload: jwtPayload,
          query: req.query,
          userDetails: userDetails,
          redirectUrl: redirectUrl
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  });

  app.get('/v1/sso/contact/verified', async (req, res) => {
    logger.info({msg: '/v1/sso/contact/verified called'});
    let userDetails, jwtPayload, redirectUrl, errType;
    jwtPayload = req.session.jwtPayload; // fetch from session
    userDetails = req.session.userDetails; // fetch from session
    try {
      let decryptedData;
      let otpDecryptedData;
      if (_.get(req, 'session.userEncryptedInfo')) {
        decryptedData = decrypt(req.session.userEncryptedInfo);
        decryptedData = JSON.parse(decryptedData);
      }
      if (_.get(req, 'session.otpEncryptedInfo')) {
        otpDecryptedData = decrypt(req.session.otpEncryptedInfo);
        otpDecryptedData = JSON.parse(otpDecryptedData);
      }
      // If data encrypted in session create route; `identifier` should match with the incoming request session user `identifier`
      if (_.get(decryptedData, 'identifier') !== '' && _.get(decryptedData, 'identifier') !== userDetails.identifier) {
        errType = 'FORBIDDEN';
        throw 'Access Forbidden - User identifier mismatch with session create payload';
      }
      if (_.isEmpty(jwtPayload) && ((!['phone', 'email', 'tncVersion', 'tncAccepted'].includes(req.query.type) && !req.query.value) || req.query.userId)) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      if (_.get(otpDecryptedData, req.query.type) !== req.query.value) {
        errType = 'FORBIDDEN';
        throw 'Access Forbidden - User identifier mismatch with OTP payload';
      }
      if (!_.isEmpty(userDetails) && !userDetails[req.query.type]) { // existing user without phone
        errType = 'UPDATE_CONTACT_DETAILS';
        await updateContact(req, userDetails).catch(handleProfileUpdateError); // api need to be verified
        if (req.query.tncAccepted === 'true') {
          errType = 'ACCEPT_TNC';
          await acceptTncAndGenerateToken(req.query.value, req.query.tncVersion).catch(handleProfileUpdateError);
        }
        logger.info({
          msg: 'sso phone updated successfully and redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            phone: req.query.phone,
            jwtPayload: jwtPayload,
            userDetails: userDetails,
            errType: errType
          }
        })
      } else if (_.isEmpty(userDetails)) { // create user and update roles
        errType = 'CREATE_USER';
        const newUserDetails = await createUser(req, jwtPayload).catch(handleProfileUpdateError);
        await delay();
        if (jwtPayload.roles && jwtPayload.roles.length) {
          errType = 'UPDATE_USER_ROLES';
          await updateRoles(req, newUserDetails.result.userId, jwtPayload).catch(handleProfileUpdateError);
        }
        errType = 'FETCH_USER_AFTER_CREATE';
        userDetails = await fetchUserWithExternalId(jwtPayload, req); // to get userName
        if(_.isEmpty(userDetails)){
          errType = 'USER_DETAILS_EMPTY';
          throw 'USER_DETAILS_IS_EMPTY';
        }
        req.session.userDetails = userDetails;
        if (req.query.tncAccepted === 'true') {
          errType = 'ACCEPT_TNC';
          await acceptTncAndGenerateToken(userDetails.userName, req.query.tncVersion).catch(handleProfileUpdateError);
        }
        redirectUrl = successUrl + getEncyptedQueryParams({userName: userDetails.userName});
        logger.info({
          msg: 'sso user creation and role updated successfully and redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            phone: req.query.phone,
            jwtPayload: jwtPayload,
            userDetails: userDetails,
            redirectUrl: redirectUrl,
            errType: errType
          }
        })
      }
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso user creation/phone update failed, redirected to error page',
        error,
        additionalInfo: {
          state_Id: jwtPayload.state_id,
          errType: errType,
          queryParams: req.query,
          userDetails: userDetails,
          jwtPayload: jwtPayload,
          redirectUrl: redirectUrl,
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get(successUrl, async (req, res) => { // to support mobile sso flow
    sendSsoKafkaMessage(req);
    if (_.get(req, 'cookies.redirectPath')){ 
      res.redirect(VDNURL+'/v1/sourcing/sso/success/redirect?userName='+(_.get(req, 'cookies.userDetails')) + '&redirectUrl='+ (_.get(req, 'cookies.redirectTo')));
    } else {
      res.status(200).sendFile('./success_loader.html', {root: __dirname})
    }
    // res.status(200).sendFile('./success_loader.html', {root: __dirname})
  });

  app.get('/v1/sso/success/redirect', async (req, res) => {
    logger.info({msg: '/v1/sso/success/redirect called'});
    let userDetails, jwtPayload, redirectUrl, errType, redirectURIFromCookie;
    jwtPayload = req.session.jwtPayload;
    userDetails = req.session.userDetails;
    try {
      if (_.isEmpty(jwtPayload) || _.isEmpty(userDetails)) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'CREATE_SESSION';
      await createSession(userDetails.userName, 'portal', req, res);
      redirectURIFromCookie = _.get(req, 'cookies.SSO_REDIRECT_URI');
      if (redirectURIFromCookie) {
        const parsedRedirectURIFromCookie = url.parse(decodeURI(redirectURIFromCookie), true);
        delete parsedRedirectURIFromCookie.query.auth_callback;
        delete parsedRedirectURIFromCookie.search;
        redirectUrl = url.format(parsedRedirectURIFromCookie);
      } else {
        redirectUrl = jwtPayload.redirect_uri ? jwtPayload.redirect_uri : '/resources';
      }
      logger.info({
        msg: 'sso sign-in success callback, session created',
        additionalInfo: {
          state_Id: jwtPayload.state_id,
          query: req.query,
          redirectUrl: redirectUrl,
          errType: errType
        }
      })
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso sign-in success callback, create session error',
        error,
        additionalInfo: {
          state_id: jwtPayload.state_id,
          query: req.query,
          jwtPayload: jwtPayload,
          redirectUrl: redirectUrl,
          errType: errType
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      redirectURIFromCookie && res.cookie('SSO_REDIRECT_URI', '', {expires: new Date(0)});
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get('/v1/sso/create/session', async (req, res) => { // needs to onboard to kong
    logger.info({msg: '/v1/sso/create/session called'});
    let userName, response, errType;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'VERIFY_REQUEST';
      const userData = isValidRequest(req.query.id);
      errType = 'CREATE_SESSION';
      let clientId = 'android';
      if(req.query.clientId && req.query.clientId === 'desktop') {
        clientId = req.query.clientId;
      }
      response = await createSession(userData.userName, clientId, req, res);
      logger.info({
        msg: 'sso sign in create session api success',
        additionalInfo: {
          query: req.query,
          response: response
        }
      })
    } catch (error) {
      response = { error: getErrorMessage(error, errType) };
      logger.error({
        msg: 'sso sign in create session api failed',
        error,
        additionalInfo: {
          errType: errType,
          query: req.query
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.json(response);
    }
  })

  app.get(errorUrl, (req, res) => {
    res.status(200).sendFile('./error_loader.html', {root: __dirname })
  })

  app.get('/v1/sso/error/redirect', async (req, res) => {
    logger.info({msg: '/v1/sso/error/redirect called'});
    const redirect_uri = encodeURIComponent(`https://${req.get('host')}/resources?auth_callback=1`);
    const redirectUrl = `/auth/realms/sunbird/protocol/openid-connect/auth?client_id=portal&redirect_uri=${redirect_uri}&scope=openid&response_type=code&version=2&error_message=` + req.query.error_message;
    res.redirect(redirectUrl); // should go to error page
  })

  // creates state user
  app.get('/v1/sso/create/user', async (req, res) => {
    logger.info({msg: '/v1/sso/create/user called'});
    let response, errType, jwtPayload, redirectUrl, userDetails;
    jwtPayload = req.session.jwtPayload; // fetch from session
    try {
      let decryptedData;
      let otpDecryptedData;
      if (_.get(req, 'session.userEncryptedInfo')) {
        decryptedData = decrypt(req.session.userEncryptedInfo);
        decryptedData = JSON.parse(decryptedData);
      }
      if (_.get(req, 'session.otpEncryptedInfo')) {
        otpDecryptedData = decrypt(req.session.otpEncryptedInfo);
        otpDecryptedData = JSON.parse(otpDecryptedData);
      }
      // If data encrypted in session create route; `identifier` should match with the incoming request session user `identifier`
      if (_.get(decryptedData, 'identifier') !== '' && _.get(decryptedData, 'identifier') !== req.query.userId) {
        errType = 'FORBIDDEN';
        throw 'Access Forbidden - User identifier mismatch with session create payload';
      }
      if (!req.query.userId || !req.query.identifier || !req.query.identifierValue
        || !req.query.tncVersion || !req.query.tncAccepted) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      if (_.get(otpDecryptedData, req.query.identifier) !== req.query.identifierValue) {
        errType = 'FORBIDDEN';
        throw 'Access Forbidden - User identifier mismatch with OTP payload';
      }
      if (req.query.freeUser === 'true') {
        errType = 'FREE_UP_USER';
        await freeUpUser(req).catch(handleProfileUpdateError);
      }
      await delay();
      errType = 'CREATE_USER';
      req.query.type = req.query.identifier;
      req.query.value = req.query.identifierValue;
      const newUserDetails = await createUser(req, jwtPayload).catch(handleProfileUpdateError);
      await delay();
      if (jwtPayload.roles && jwtPayload.roles.length) {
        errType = 'UPDATE_USER_ROLES';
        await updateRoles(req, newUserDetails.result.userId, jwtPayload).catch(handleProfileUpdateError);
      }
      errType = 'FETCH_USER_AFTER_CREATE';
      userDetails = await fetchUserWithExternalId(jwtPayload, req); // to get userName
      if(_.isEmpty(userDetails)){
        errType = 'USER_DETAILS_EMPTY';
        throw 'USER_DETAILS_IS_EMPTY';
      }
      req.session.userDetails = userDetails;
      if (req.query.tncAccepted === 'true') {
        errType = 'ACCEPT_TNC';
        await acceptTncAndGenerateToken(userDetails.userName, req.query.tncVersion).catch(handleProfileUpdateError);
      }
      redirectUrl = successUrl + getEncyptedQueryParams({userName: userDetails.userName});
      logger.info({
        msg: 'sso user creation and role updated successfully and redirected to success page',
        additionalInfo: {
          state_id: jwtPayload.state_id,
          phone: req.query.phone,
          jwtPayload: jwtPayload,
          userDetails: userDetails,
          redirectUrl: redirectUrl,
          errType: errType
        }
      })
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      response = { error: getErrorMessage(error, errType) };
      logger.error({
        msg: 'sso create user failed',
        error,
        additionalInfo: {
          errType: errType,
          query: req.query
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  });


  app.get('/v1/sso/migrate/account/initiate', async (req, res) => {
    logger.info({msg: '/v1/sso/migrate/account/initiate called'});
    let response, errType, redirectUrl, url, query;
    try {
      if (!req.query.userId || !req.query.identifier || !req.query.identifierValue || !req.session.migrateAccountInfo
        || !req.query.tncVersion || !req.query.tncAccepted) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      const dataToEncrypt = {
        stateToken : req.session.migrateAccountInfo.stateToken,
        userId: req.query.userId,
        identifier: req.query.identifier,
        identifierValue: req.query.identifierValue,
        tncVersion: req.query.tncVersion,
        tncAccepted: req.query.tncAccepted
      };
      errType = 'ERROR_ENCRYPTING_DATA';
      req.session.migrateAccountInfo.encryptedData = encrypt(JSON.stringify(dataToEncrypt));
      const payload = JSON.stringify(req.session.migrateAccountInfo.encryptedData);
      url = `${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/auth`;
      query = `?client_id=portal&state=3c9a2d1b-ede9-4e6d-a496-068a490172ee&redirect_uri=https://${req.get('host')}/migrate/account/login/callback&payload=${payload}&scope=openid&response_type=code&automerge=1&version=3&goBackUrl=https://${req.get('host')}/sign-in/sso/select-org`;
      const userInfo = `&userId=${req.query.userId}&identifierType=${req.query.identifier}&identifierValue=${req.query.identifierValue}&tncVersion=${req.query.tncVersion}&tncAccepted=${req.query.tncAccepted}`;
      redirectUrl = url + query + userInfo;
      logger.info({msg: 'url for migration' + redirectUrl});
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      response = {error: getErrorMessage(error, errType)};
      logger.error({
        msg: 'sso migrate account initiate failed',
        error,
        additionalInfo: {
          errType: errType,
          query: req.query
        }
      });
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl)
    }
  });

  app.get('/learner/get/user/sessionId/:userId', (req, res) => {
    if (req.session.userId === req.params.userId) {
      res.send({id: getEncyptedQueryParams({userName: req.session.userName})})
    } else {
      throw 'unhandled exception while getting sessionID';
    }
  });

  app.all('/migrate/account/login/callback', async (req, res) => {
    logger.info({msg: '/migrate/account/login/callback called'});
    let nonStateUserToken;
    if (!req.session.migrateAccountInfo) {
      res.status(401).send({
        responseCode: 'UNAUTHORIZED'
      });
      return false;
    }
    if (req.session.migrateAccountInfo.client_id === 'android') {
      logger.info({msg: 'mobile login success'});
      const query = '?payload=' + req.session.migrateAccountInfo.encryptedData + '&code=' + req.query.code + '&automerge=1';
      res.redirect('/account/migrate/login' + query);
    } else if (req.session.migrateAccountInfo.client_id === 'desktop') {
      logger.info({msg: 'desktop login success'});
      const query = '?payload=' + req.session.migrateAccountInfo.encryptedData + '&code=' + req.query.code + '&automerge=1';
      res.redirect('/account/migrate/login' + query);
    } else {
      // user logged in from google
      if (_.get(req, 'kauth.grant')) {
        nonStateUserToken = _.get(req, 'kauth.grant.access_token.token');
        req.session.nonStateUserToken = nonStateUserToken;
        await ssoValidations(req, res)
      } else {
        nonStateUserToken = await generateAuthToken(req.query.code, `https://${req.get('host')}/migrate/account/login/callback`).catch(err => {
          logger.error({
            msg: 'error in verifyAuthToken',
            error: JSON.stringify(err)
          });
          logger.error({
            msg: 'error details',
            error: JSON.stringify(result),
            additionalInfo: {
              statusCode: err.statusCode,
              message: err.message
            }
          });
          const redirect_url = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
          res.redirect(redirect_url)
        });
        const userToken = parseJson(nonStateUserToken);
        req.session.nonStateUserToken = userToken.access_token;
        await ssoValidations(req, res)
      }
    }
  });

  app.all('/migrate/user/account', async (req, res) => {
    await ssoValidations(req, res)
  })
};

const handleProfileUpdateError = (error) => {
  logger.error({
    msg: 'ssoRoutes: handleProfileUpdateError',
    error: error,
    params: _.get(error, 'error.params'),
    message: _.get(error, 'message')
  });
  if (_.get(error, 'error.params')) {
    throw error.error.params;
  } else if (error instanceof Error) {
    throw error.message;
  } else {
    throw 'unhandled exception while getting userDetails';
  }
}

const getErrorMessage = (error, errorType) => {
  if(_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
    return 'User account is blocked. Please contact admin';
  } else if (['VERIFY_SIGNATURE', 'PAYLOAD_DATA_MISSING', 'VERIFY_TOKEN'].includes(errorType) ) {
    return 'Your account could not be signed in to DIKSHA due to invalid credentials provided. Please try again with valid credentials.';
  } else if (error === 'SCHOOL_ID_NOT_REGISTERED') {
    return 'Login failed. Details received from your State seem to be invalid. Contact your State administration for more details';
  } else {
    return 'Your account could not be signed in to DIKSHA due to technical issue. Please try again after some time';
  }
}

/**
 * Verifies request and check exp time
 * @param encryptedData encrypted data to be decrypted
 * @returns {*}
 */
const isValidRequest = (encryptedData) => {
  const decryptedData = decrypt(parseJson(decodeURIComponent(encryptedData)));
  const parsedData = parseJson(decryptedData);
  if (isDateExpired(parsedData.exp)) {
    throw new Error('DATE_EXPIRED');
  } else {
    return _.omit(parsedData, ['exp']);
  }
};

const delay = (duration = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration)
  });
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

const getQueryParams = (queryObj) => {
  return '?' + Object.keys(queryObj).filter(key => queryObj[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
    .join('&');
}

/**
 * To generate session for state user logins
 * using server's time as iat and exp time as 5 min
 * Session will not be created if exp is expired
 * @param data object to encrypt data
 * @returns {string}
 */
const getEncyptedQueryParams = (data) => {
  data.exp = Date.now() + (5 * 60 * 1000);  // adding 5 minutes
  return '?id=' + JSON.stringify(encrypt(JSON.stringify(data)));
};

const ssoValidations = async (req, res) => {
  let stateUserData, stateJwtPayload, errType, response, statusCode;
  // to support mobile/desktop app flow
  if (req.query.client_id === 'android' || req.query.client_id === 'desktop') {
    console.log('req.query.client_id', req.query.client_id);
    req.session.migrateAccountInfo = {
      encryptedData: parseJson(decodeURIComponent(req.get('x-authenticated-user-data')))
    };
  }
  req.session.nonStateUserToken = req.session.nonStateUserToken ||  getAuthToken(req);
  if (!req.session.nonStateUserToken || !(req.session.migrateAccountInfo && req.session.migrateAccountInfo.encryptedData)) {
    res.status(401).send({
      responseCode: 'UNAUTHORIZED'
    });
    return false;
  }
  console.log('migration initiated', req.session.nonStateUserToken, JSON.stringify(req.session.migrateAccountInfo));
  try {
    console.log('decryption started');
    const decryptedData = decrypt(req.session.migrateAccountInfo.encryptedData);
    stateUserData = parseJson(decryptedData);
    errType = 'VERIFY_SIGNATURE';
    console.log('validating state token', JSON.stringify(stateUserData));
    await verifySignature(stateUserData.stateToken);
    errType = 'JWT_DECODE';
    stateJwtPayload = jwt.decode(stateUserData.stateToken);
    errType = 'VERIFY_TOKEN';
    verifyToken(stateJwtPayload);
    console.log('state token validated success');
    errType = 'ERROR_FETCHING_USER_DETAILS';
    const nonStateUserData = await fetchUserDetails(req.session.nonStateUserToken);
    errType = 'ERROR_VERIFYING_IDENTITY';
    const isMigrationAllowed = verifyIdentifier(stateUserData.identifierValue, nonStateUserData[stateUserData.identifier], stateUserData.identifier);
    console.log('ismigration allowed', isMigrationAllowed);
    if (isMigrationAllowed) {
      errType = 'MIGRATE_USER';
      req.query.userId = getUserIdFromToken(req.session.nonStateUserToken);
      console.log('userId fetched', req.query.userId);
      await migrateUser(req, stateJwtPayload);
      await delay();
      console.log('migration success');
      errType = 'ERROR_FETCHING_USER_DETAILS';
      const userDetails = await fetchUserWithExternalId(stateJwtPayload, req); // to get userName
      console.log('userDetails fetched from external ID', JSON.stringify(userDetails));
      if (_.isEmpty(userDetails)){
        errType = 'USER_DETAILS_EMPTY';
        throw 'USER_DETAILS_IS_EMPTY';
      }
      if (stateJwtPayload.roles && stateJwtPayload.roles.length) {
        errType = 'UPDATE_USER_ROLES';
        // await updateRoles(req, req.query.userId, stateJwtPayload).catch(handleProfileUpdateError);
      }
      req.session.userDetails = userDetails;
      if (stateUserData.tncAccepted === 'true') {
        errType = 'ACCEPT_TNC';
        await acceptTncAndGenerateToken(stateUserData.identifierValue, stateUserData.tncVersion).catch(handleProfileUpdateError);
      }
      redirectUrl = '/accountMerge?status=success&merge_type=auto&redirect_uri=/resources';
      if (req.query.client_id === 'android' || req.query.client_id === 'desktop') {
        response = {
          "id": "api.user.migrate", "params": {
            "resmsgid": null, "err": null, "status": "success",
            "errmsg": null
          }, "responseCode": "OK", "result": {"response": "SUCCESS",}
        };
        statusCode = 200
      }
    } else {
      errType = 'UNAUTHORIZED';
      throw 'USER_DETAILS_DID_NOT_MATCH';
    }
  } catch (error) {
    redirectUrl ='/accountMerge?status=error&merge_type=auto&redirect_uri=/resources';
    if (req.query.client_id === 'android' || req.query.client_id === 'desktop') {
      response = {
        "id": "api.user.migrate", "params": {
          "resmsgid": null, "err": JSON.stringify(error), "status": "error",
          "errType": errType
        }, "responseCode": "INTERNAL_SERVER_ERROR", "result": {"response": "ERROR",}
      };
      statusCode = 500
    }
    logger.error({
      msg: 'ssoValidations failed',
      "error": JSON.stringify(error),
      additionalInfo: {
        errorType: errType,
        stateUserData: stateUserData,
        stateJwtPayload: stateJwtPayload,
        redirectUrl: redirectUrl
      }
    });
    logErrorEvent(req, errType, error);
  } finally {
    req.session.migrateAccountInfo = null;
    req.session.nonStateUserToken = null;
    if (req.query.client_id === 'android' || req.query.client_id === 'desktop') {
      res.status(statusCode).send(response)
    } else {
      res.redirect(redirectUrl || errorUrl);

    }
  }
};

exports.ssoValidations = ssoValidations;

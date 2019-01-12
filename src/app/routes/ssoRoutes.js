const _ = require('lodash');
const { verifySignature, verifyToken, getChannel, fetchUserWithLoginId, createUserWithPhone, createSession, updatePhone } = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper')

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    let jwtDecodedToken, loginId, userDetails, userChannel, redirectUrl, errType;
    try {
      await verifySignature(req.query.token);
      jwtDecodedToken = jwt.decode(req.query.token);
      verifyToken(jwtDecodedToken);
      loginId = jwtDecodedToken.sub + (jwtDecodedToken.iss ? '@' + jwtDecodedToken.iss : '')
      userDetails = fetchUserWithLoginId(loginId);
      if(userDetails.phoneVerified) {
        userChannel = await getChannel(loginId);
        redirectUrl = '/sso/signin/success?loginId=' + loginId + '&redirect_url=' + jwtDecodedToken.redirect_url;
      } else {
        redirectUrl = '/sso/update/phone?loginId=' + loginId + '&redirect_url=' + jwtDecodedToken.redirect_url;
      }
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
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
      loginId = req.query.loginId;
      phone = req.query.phone;
      userDetails = fetchUserWithLoginId(loginId);
      if(userDetails.userName) {
        userChannel = await getChannel(loginId);
        await updatePhone({phone, loginId}); // api need to be verified
      } else {
        const userDetails = {
          userName: loginId,
          phone,
          phoneVerified: true
        }
        userDetails = await createUserWithPhone(userDetails);
      }
      redirectUrl = '/sso/signin/success?loginId=' + loginId + '&redirect_url=' + jwtDecodedToken.redirect_url;
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
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
      await createSession(loginId);
      redirectUrl = req.query.redirect_url ? req.query.redirect_url : '/resources';
    } catch (error) {
      redirectUrl = '/sso/signin/error?error_message=' + 'SSO failed';
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
      accessTokens = await createSession(loginId);
      response = accessTokens;
    } catch (error) {
      response = { error: 'session creation failed' };
    } finally {
      res.json(response);
    }
  })

  app.get('/sso/signin/error', (req, res) => {
    res.redirect('/resources'); // should go to error page
  })
}


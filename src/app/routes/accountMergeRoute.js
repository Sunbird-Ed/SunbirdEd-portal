const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {initiateAccountMerge} = require('../helpers/accountMergeHelper');
const {generateAuthToken} = require('../helpers/keyCloakHelperService');
const {parseJson} = require('../helpers/utilityService');
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const authorizationToken = envHelper.PORTAL_API_AUTH_TOKEN;
const logger = require('sb_logger_util_v2');

module.exports = (app) => {

  /**
   * User initiated merge process is redirected to following url
   */
  app.get('/user/session/save', (req, res) => {
    if (!_.get(req, 'kauth.grant.access_token.token')) {
      res.status(401).send({
        responseCode: 'UNAUTHORIZED'
      });
      return false;
    }
    req.session.mergeAccountInfo = {
      initiatorAccountDetails: {
        userId: _.get(req, 'session.userId'),
        sessionToken: _.get(req, 'kauth.grant.access_token.token'),
        redirectUri: req.query.redirectUri
      }
    };
    req.session.save(function (result) {
      console.log('session id before login', req.session.id);
      console.log('storing merge account initiator account details', JSON.stringify(req.session.mergeAccountInfo));
      if (result) {
        logger.error({
          msg: 'user/session/save failed to save user session',
          error: JSON.stringify(result),
          additionalInfo: {
            userId: _.get(req, 'session.userId'),
            redirectUri: req.query.redirectUri
          }
        });
        res.status(500).send({
          "id": "api.user-session.save",
          "responseCode": "INTERNAL_SERVER_ERROR",
          "result": {
            "message": "ERROR"
          }
        });
      } else {
        logger.debug({
          msg: 'user/session/save user session saved successfully',
          error: JSON.stringify(result),
          additionalInfo: {
            userId: _.get(req, 'session.userId'),
            redirectUri: req.query.redirectUri
          }
        });
        const url = `${envHelper.PORTAL_MERGE_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/auth`;
        const query = `?client_id=portal&state=3c9a2d1b-ede9-4e6d-a496-068a490172ee&redirect_uri=https://${req.get('host')}/merge/account/u2/login/callback&scope=openid&response_type=code&mergeaccountprocess=1&version=2&goBackUrl=https://${req.get('host')}${req.query.redirectUri}`;
        console.log('redirecting to', url + query);
        res.status(200).send({
          "id": "api.user-session.save",
          "responseCode": "OK",
          "result": {
            "message": "USER_SESSION_SAVED_SUCCESSFULLY",
            "status": "SUCCESS",
            "redirectUrl": url + query
          }
        });
      }
    });
  });


  /**
   * Successful login for account merge redirects to below url
   */
  app.all('/merge/account/u2/login/callback', async (req, res) => {
    console.log('session id login callback', req.session.id);
    console.log('redirect url was initiated', JSON.stringify(req.session));
    if (!req.session.mergeAccountInfo) {
      res.status(401).send({
        responseCode: 'UNAUTHORIZED'
      });
      return false;
    }
    const redirectUrl = `https://${req.get('host')}/merge/account/u2/login/callback`;
    let u2Token = _.get(req, 'session.mergeAccountInfo.mergeFromAccountDetails.sessionToken');
    console.log('u2Token from google', JSON.stringify(u2Token));
    // merge from google sign in progress
    if (!u2Token) {
      // since google sign is not in progress generate auth token from keycloak
      u2Token = await generateAuthToken(req.query.code, redirectUrl).catch(err => {
        console.log('error in verifyAuthToken', err.error);
        console.log('error details', err.statusCode, err.message)
      });
      u2Token = parseJson(u2Token);
      u2Token = u2Token.access_token;
    }
    console.log('target account logged in: getting access token', u2Token);
    const url = `${envHelper.PORTAL_MERGE_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/logout?redirect_uri=`;
    const mergeResponse = await initiateAccountMerge(_.get(req, 'session.mergeAccountInfo.initiatorAccountDetails'),
      u2Token).catch(err => {
      console.log('error in initiateAccountMerge', JSON.stringify(err));
      console.log('error detals', err.statusCode, err.message);
      const query = '?status=error&merge_type=manual&redirect_uri=' + req.session.mergeAccountInfo.initiatorAccountDetails.redirectUri;
      delete req.session.mergeAccountInfo;
      const redirectUri = `https://${req.get('host')}/accountMerge` + encodeURIComponent(query);
      res.redirect(url + redirectUri);
    });
    if (_.get(mergeResponse, 'result.result.status') === 'SUCCESS' && mergeResponse.responseCode === 'OK') {
      console.log('mergeResponse coming from backend', JSON.stringify(mergeResponse));
      const query = '?status=success&merge_type=manual&redirect_uri=' + req.session.mergeAccountInfo.initiatorAccountDetails.redirectUri;
      console.log('after final success', query);
      const redirectUri = `https://${req.get('host')}/accountMerge` + encodeURIComponent(query);
      delete req.session.mergeAccountInfo;
      res.redirect(url + redirectUri);
    }
  })
};

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {initiateAccountMerge} = require('../helpers/accountMergeHelper');
const {generateAuthToken} = require('../helpers/keyCloakHelperService');
const {parseJson} = require('../helpers/utilityService');
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const authorizationToken = envHelper.PORTAL_API_AUTH_TOKEN;
const logger = require('sb_logger_util_v2');
const ROUTES = require('../constants/routesConstants')
const CONTROLLER = require('../controllers/accountMergeController')

module.exports = (app) => {

  /**
   * User initiated merge process is redirected to following url
   */
  app.get(ROUTES.ACCOUNT_MERGE.SESSION_SAVE, (req, res) => {
    CONTROLLER.sessionSave(req, res);
  });


  /**
   * Successful login for account merge redirects to below url
   */
  app.all('/merge/account/u2/login/callback', async (req, res) => {
    logger.info({msg: '/merge/account/u2/login/callback called'});
    logger.info({msg: 'session id login callback ' + req.session.id});
    logger.info({msg: 'redirect url was initiated ' + JSON.stringify(req.session)});
    if (!req.session.mergeAccountInfo) {
      res.status(401).send({
        responseCode: 'UNAUTHORIZED'
      });
      return false;
    }
    const redirectUrl = `https://${req.get('host')}/merge/account/u2/login/callback`;
    let u2Token = _.get(req, 'session.mergeAccountInfo.mergeFromAccountDetails.sessionToken');
    logger.info({msg: 'u2Token from google ' + JSON.stringify(u2Token)});
    // merge from google sign in progress
    if (!u2Token) {
      // since google sign is not in progress generate auth token from keycloak
      u2Token = await generateAuthToken(req.query.code, redirectUrl).catch(err => {
        logger.error({
          msg: 'error in verifyAuthToken',
          error: JSON.stringify(err.error)
        });
        logger.error({
          msg: 'error details',
          error: err.statusCode + err.message
        });
      });
      u2Token = parseJson(u2Token);
      u2Token = u2Token.access_token;
    }
    logger.info({msg: 'target account logged in: getting access token ' + u2Token});
    const url = `${envHelper.PORTAL_MERGE_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/logout?redirect_uri=`;
    const mergeResponse = await initiateAccountMerge(_.get(req, 'session.mergeAccountInfo.initiatorAccountDetails'),
      u2Token).catch(err => {
        logger.error({
          msg: 'error in initiateAccountMerge',
          error: JSON.stringify(err)
        });
        logger.error({
          msg: 'error detals',
          error: err.statusCode + err.message
        });
      const query = '?status=error&merge_type=manual&redirect_uri=' + req.session.mergeAccountInfo.initiatorAccountDetails.redirectUri;
      delete req.session.mergeAccountInfo;
      const redirectUri = `https://${req.get('host')}/accountMerge` + encodeURIComponent(query);
      res.redirect(url + redirectUri);
    });
    if (_.get(mergeResponse, 'result.result.status') === 'SUCCESS' && mergeResponse.responseCode === 'OK') {
      logger.info({msg: 'mergeResponse coming from backend' + JSON.stringify(mergeResponse)});
      const query = '?status=success&merge_type=manual&redirect_uri=' + req.session.mergeAccountInfo.initiatorAccountDetails.redirectUri;
      logger.info({msg: 'after final success' + query});
      const redirectUri = `https://${req.get('host')}/accountMerge` + encodeURIComponent(query);
      delete req.session.mergeAccountInfo;
      res.redirect(url + redirectUri);
    }
  })
};

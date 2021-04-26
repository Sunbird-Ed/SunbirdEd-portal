const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { initiateAccountMerge } = require('../helpers/accountMergeHelper');
const { generateAuthToken } = require('../helpers/keyCloakHelperService');
const { parseJson } = require('../helpers/utilityService');
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const authorizationToken = envHelper.PORTAL_API_AUTH_TOKEN;
const { logger } = require('@project-sunbird/logger');


const sessionSave = async function (req, res) {
  logger.info({ msg: '/user/session/save called' });
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
    logger.info({ msg: 'session id before login ' + req.session.id });
    logger.info({
      msg: 'storing merge account initiator account details',
      additionalInfo: {
        details: JSON.stringify(req.session.mergeAccountInfo)
      }
    });
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
      logger.debug(req.context, {
        msg: 'user/session/save user session saved successfully',
        error: JSON.stringify(result),
        additionalInfo: {
          userId: _.get(req, 'session.userId'),
          redirectUri: req.query.redirectUri
        }
      });
      const url = `${envHelper.PORTAL_MERGE_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/auth`;
      const query = `?client_id=portal&state=3c9a2d1b-ede9-4e6d-a496-068a490172ee&redirect_uri=https://${req.get('host')}/merge/account/u2/login/callback&scope=openid&response_type=code&mergeaccountprocess=1&version=2&goBackUrl=https://${req.get('host')}${req.query.redirectUri}`;
      logger.info({ msg: 'redirecting to ' + url + query });
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
}
module.exports = { sessionSave };
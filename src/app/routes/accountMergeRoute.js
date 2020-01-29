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
const accountMergeController = require('../controllers/accountMergeController')

module.exports = (app) => {

  /**
   * User initiated merge process is redirected to following url
   */
  app.get(ROUTES.ACCOUNT_MERGE.SESSION_SAVE, accountMergeController.sessionSave);


  /**
   * Successful login for account merge redirects to below url
   */
  app.all(ROUTES.ACCOUNT_MERGE.LOGIN_CALLBACK, accountMergeController.getLoginCallback);
};

'use strict';
/**
 * @file - Handle whitelisting of Portal API(s)
 * @since release-3.1.0
 * @version 1.0
 */

const _ = require('lodash');
const logger = require('sb_logger_util_v2');
const uuidv1 = require('uuid/v1');
const dateFormat = require('dateformat');
const ROUTE = require('./apiLists');

/**
 * @param  {String} routeType - Route category [LEARNER, CONTENT]
 * @description - Function to check whether incoming API is whitelisted (or) not
 * 1. `routeType` is required to identify the category of API belongs to
 * 2. `routeType` will be set to `DEFAULT` if not passed
 * 3. If incoming API is present in API_LISTS and is enabled then request is passed further
 * 4. If API is not enabled then request is terminated and 401 UNAUTHORIZED response is sent
 * @since release-3.1.0
 */
const isAPIWhiteListed = (routeType) => {
  if (!routeType) routeType = 'DEFAULT';
  return function (req, res, next) {
    if (_.get(ROUTE, urlMatch(routeType, req.originalUrl))) {
      next();
    } else {
      //TODO  Err message needs to be finalized
      logger.error({
        msg: 'API WHITELIST :: Type [ ' + routeType + ' ]' + '. API [ ' + req.originalUrl + ' ]',
        url: req.originalUrl
      });
      res.status(401);
      res.send({
        id: 'api.error',
        ver: '1.0',
        ts: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        params: {
          resmsgid: uuidv1(),
          msgid: null,
          status: 'failed',
          err: 'UNAUTHORIZED_ERROR',
          errmsg: 'Unauthorized: Access is denied'
        },
        responseCode: 'UNAUTHORIZED',
        result: {}
      });
      res.end()
    }
  }
};

/**
 * @param  {String} routeType - Route category [LEARNER, CONTENT]
 * @param  {String} url       - Request original URL
 * @description - Function to construct string using params
 * @returns  {String} - String to pass as argument in _.get
 */
const urlMatch = (routeType, url) => {
  return routeType.toUpperCase() + '[' + url + ']';
};

module.exports = {
  isAPIWhiteListed
};

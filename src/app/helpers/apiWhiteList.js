'use strict';
/**
 * @file - Handle whitelisting of Portal API(s)
 * @since release-3.1.0
 * @version 1.0
 */

const _           = require('lodash');
const uuidv1      = require('uuid/v1');
const dateFormat  = require('dateformat');
const ROUTE       = require('./whitelistApis');
const utils       = require('./utilityService');

/**
 * @description - Function to check whether incoming API is whitelisted (or) not
 * 1. If incoming API is present in API_LISTS (whitelistApis); then request is passed further
 * 2. If API is does not exists then request is terminated and 401 UNAUTHORIZED response is sent
 * @since release-3.1.0
 */
const isAllowed = () => {
  return function (req, res, next) {
    const REQ_URL = req.originalUrl;
    if (_.get(ROUTE, REQ_URL)) {
      next();
    } else {
      const err = ({ msg: 'API WHITELIST :: Unauthorized access for API [ ' + REQ_URL + ' ]', url: REQ_URL });
      utils.logError(req, err, err.msg);
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

module.exports = {
  isAllowed
};

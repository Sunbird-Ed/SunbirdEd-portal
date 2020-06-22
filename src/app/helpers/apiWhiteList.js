'use strict';
/**
 * @file - Handle whitelisting and role checks of Portal API(s)
 * @since release-3.1.0
 * @version 1.0
 */

const _                 = require('lodash');
const uuidv1            = require('uuid/v1');
const dateFormat        = require('dateformat');
const { pathToRegexp }  = require("path-to-regexp");

const API_LIST          = require('./whitelistApis');
const utils             = require('./utilityService');

/**
 * @description - Function to check whether
 * 1. Incoming API is whitelisted (or) not
 * 2. If API does not exists then request is terminated and 403 Forbidden response is sent
 * 3. If incoming API is present in API_LIST (whitelistApis); then check URL pattern matching
 * 4. Refer `API_LIST` and execute the checks defined
 * @since release-3.1.0
 */
const isAllowed = () => {
  return function (req, res, next) {
    // Retain until 3.1.0 release
    // let REQ_URL = req.originalUrl;
    let REQ_URL = req.path;
    // Pattern match for URL
    _.forEach(API_LIST.URL_PATTERN, (url) => {
      let regExp = pathToRegexp(url);
      if (regExp.test(REQ_URL)) {
        REQ_URL = url;
        return false;
      }
    });
    // Is API whitelisted ?
    if (_.get(API_LIST.URL, REQ_URL)) {
      const URL_RULE_OBJ = _.get(API_LIST.URL, REQ_URL);
      let checksToExecute = [];
      // Iterate for checks defined for API and push to array
      URL_RULE_OBJ.checksNeeded.forEach(CHECK => {
        checksToExecute.push(new Promise((res, rej) => {
          if (_.get(URL_RULE_OBJ, CHECK) && typeof urlChecks[CHECK] === 'function') {
            urlChecks[CHECK](res, rej, req, URL_RULE_OBJ[CHECK]);
          }
        }));
      });
      executeChecks(req, res, next, checksToExecute);
    } else {
      // If API is not whitelisted
      respond403(req, res);
    }
  }
};

/**
 * @description
 * Set of methods which checks for certain condition on URL
 * @since release-3.1.0
 */
const urlChecks = {
  ROLE_CHECK: (resolve, reject, req, rolesForURL) => {
    if (_.intersection(rolesForURL, req.session['roles']).length > 0) {
      resolve();
    } else {
      return reject('User doesn\'t have appropriate roles');
    }
  }
};

/**
 * @param  {Object} req             - Request Object
 * @param  {Object} res             - Response Object
 * @param  {Function} next          - Function for next middleware
 * @param  {Array} checksToExecute  - Array of methods (checks; defined in urlChecks object)
 * @description
 * 1. Array of methods executed by promise
 * 2. On success; API is allowed
 * 3. On error; 403 Forbidden response is sent
 * @since release-3.1.0
 */
const executeChecks = async (req, res, next, checksToExecute) => {
  try {
    await Promise.all(checksToExecute)
      .then((pSuccess) => {
        next();
      })
      .catch((pError) => {
        utils.logError(req, pError, {});
        respond403(req, res);
      });
  } catch (error) {
    utils.logError(req, error, {});
    respond403(req, res);
  }
};

/**
 * @param  {Object} req             - Request Object
 * @param  {Object} res             - Response Object
 * @description - Generic function to return 403 Forbidden response
 * @since release-3.1.0
 */
const respond403 = (req, res) => {
  let REQ_URL = req.originalUrl;
  const err = ({ msg: 'API WHITELIST :: Forbidden access for API [ ' + REQ_URL + ' ]', url: REQ_URL });
  utils.logError(req, err, err.msg);
  res.status(403);
  res.send({
    id: 'api.error',
    ver: '1.0',
    ts: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
    params: {
      resmsgid: uuidv1(),
      msgid: null,
      status: 'failed',
      err: 'FORBIDDEN_ERROR',
      errmsg: 'Forbidden: Access is denied'
    },
    responseCode: 'FORBIDDEN',
    result: {}
  });
  res.end();
};

module.exports = {
  isAllowed
};

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
const { logger }        = require('@project-sunbird/logger');

const API_LIST          = require('./whitelistApis');
const utils             = require('./utilityService');
const ROLE = {
  ORGADMIN : 'ORG_ADMIN',
  SYSADMIN : 'SYSTEM_ADMINISTRATION'
}

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
    if (shouldAllow(req)) {
      next();
    } else {
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
              urlChecks[CHECK](res, rej, req, URL_RULE_OBJ[CHECK], REQ_URL);
            }
          }));
        });
        executeChecks(req, res, next, checksToExecute);
      } else {
        // If API is not whitelisted
        logger.info({
          msg: 'Portal_API_WHITELIST: URL not whitelisted',
          reqPath: req.path,
          reqOriginalUrl: req.originalUrl,
          method: req.method
        });
        respond403(req, res);
      }
    }
  }
};

/**
 * @description - Entry function to check static routes and env flags
 * @todo - Implement global flag check
 * @todo - Implement is logger enabled check
 */
const shouldAllow = (req) => {
  // Ignore static routes
  return req.path === '/' || checkIsStaticRoute(req.path);
};

/**
 * @param  { String } REQ_URL - Request URL
 * @returns { Boolean } - Return boolean value based on exclude path criteria
 */
const checkIsStaticRoute = (REQ_URL) => {
  const excludePath = [
    '.md',
    '.js',
    '.js.map',
    '.ico',
    '.ttf',
    '.woff2',
    '.woff',
    '.eot',
    '.svg',
    '.gif',
    '.png',
    '.html',
    '/dist/',
    '/streaming/',
    '/resourcebundles/',
    '/assets/',
    '/explore',
    '/resources',
    '/search',
    '/orgType',
    '/dashBoard',
    '/workspace',
    '/profile',
    '/learn',
    '/resources',
    '/myActivity',
    '/manage',
    '/contribute',
    '/groups',
    '/my-groups',
    '/telemetry',
    '/content-plugins/',
    '/editors/',
    '/api'
  ];
  return _.some(excludePath, (path) => _.includes(REQ_URL, path));
};

/**
 * @description
 * Set of methods which checks for certain condition on URL
 * @since release-3.1.0
 */
const urlChecks = {
   /**
   * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
   * @param  {Callback} reject      - Callback to `isAllowed` function promise object
   * @param  {Object} req           - API request object
   * @param  {Array} rolesForURL    - Array of roles defined for incoming API
   * @access Private
   * @description - Function to check session roles and defined roles are having one in common
   * @since - release-3.1.0
   */
  ROLE_CHECK: (resolve, reject, req, rolesForURL, REQ_URL) => {
    logger.info({
      msg: 'whitelist middleware for URL [ ' + REQ_URL + ' ]',
      reqPath: req.path,
      matchPattern: REQ_URL,
      method: req.method,
      sessionRoles: _.get(req, 'session.roles') || 'no roles in session',
      rulesForURL: rolesForURL
    });
    if (_.includes(rolesForURL, 'ALL') && req.session['roles'].length > 0) {
      resolve();
    } else if (_.intersection(rolesForURL, req.session['roles']).length > 0) {
      resolve();
    } else {
      return reject('User doesn\'t have appropriate roles');
    }
  },
  /**
   * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
   * @param  {Callback} reject      - Callback to `isAllowed` function promise object
   * @param  {Object} req           - API request object
   * @param  {Array} checksParams   - Rules object for `OWNER_CHECK`
   * @access Private
   * @description - Function to execute different rules defined in checksParams object for key `checks`
   * @since - release-3.1.0
   */
  OWNER_CHECK: async (resolve, reject, req, checksParams, REQ_URL) => {
    if (_.get(checksParams, 'checks')) {
      let ownerChecks = [];
      checksParams.checks.forEach((ownerCheckObj) => {
        ownerChecks.push(new Promise((res, rej) => {
          let _checkFor = _.get(ownerCheckObj, 'entity');
          if (_checkFor && typeof urlChecks[_checkFor] === 'function') {
            urlChecks[_checkFor](res, rej, req, ownerCheckObj);
          }
        }));
      });
      try {
        await Promise.all(ownerChecks)
          .then((pSuccess) => {
            resolve();
          })
          .catch((pError) => {
            return reject(pError);
          });
      } catch (error) {
        utils.logError(req, error, {});
        return reject();
      }
    } else {
      return reject('Owner check validation failed.');
    }
  },  
  /**
   * @param  {Callback} resolve      - Callback to `OWNER_CHECK` promise object
   * @param  {Callback} reject       - Callback to `OWNER_CHECK` promise object
   * @param  {Object} req            - API request object
   * @param  {Object} ownerCheckObj  - `OWNER_CHECK` object
   * @access Private
   * @description - Function to check session userId for incoming API along with request userId
   * @since - release-3.1.0
   */
  __session__userId: (resolve, reject, req, ownerCheckObj) => {
    try {
      const _sessionUserId = _.get(req, 'session.userId');
      const _reqUserId = _.get(req, 'body.request.userId');
      if (_sessionUserId === _reqUserId) {
        resolve();
      } else {
        return reject('Mismatch in user id verification. Session UserId [ ' + _sessionUserId +
          ' ] does not match with request body UserId [ ' + _reqUserId + ' ]');
      }
    } catch (error) {
      return reject('User id validation failed.');
    }
  },
  /**
   * @param  {Callback} resolve      - Callback to `OWNER_CHECK` promise object
   * @param  {Callback} reject       - Callback to `OWNER_CHECK` promise object
   * @param  {Object} req            - API request object
   * @param  {Object} ownerCheckObj  - `OWNER_CHECK` object
   * @access Private
   * @description - Function to check session userId is an admin if yes resolve or if 
   *  the session userId is same as that of the request userId then also resolve
   * @since - release-3.3.0
   */
  __adminCheck__userId: (resolve, reject, req, ownerCheckObj) => {
    try {
      const _sessionUserId = _.get(req, 'session.userId');
      const _reqUserId = _.get(req, 'body.request.userId');
      const _sessionRole = _.get(req, 'session.roles');
      if(_sessionRole === ROLE.ORGADMIN || _sessionRole === ROLE.SYSADMIN){
        resolve();
      } else{
        if (_sessionUserId === _reqUserId) {
          resolve();
        } else {
          return reject('Mismatch in user id verification. Session UserId [ ' + _sessionUserId +
            ' ] is not an admin or does not match with request body UserId [ ' + _reqUserId + ' ]');
        }
      }
    } catch (error) {
      return reject('User id validation failed.');
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
    await Promise.allSettled(checksToExecute)
      .then((pSuccess) => {
        if (pSuccess) {
          const _isRejected = _.find(pSuccess, {'status': 'rejected'});
          if (_isRejected) {
            throw new Error(_isRejected.reason);
          } else {
            next();
          }
        } else {
          throw new Error('API whitelisting validation failed');
        }
      })
      .catch((pError) => {
        utils.logError(req, pError, _.get(pError, 'message'));
        respond403(req, res);
      });
  } catch (error) {
    utils.logError(req, error, _.get(error, 'message'));
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
  let REQ_URL = req.path;
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
      errmsg: 'Forbidden: API WHITELIST Access is denied'
    },
    responseCode: 'FORBIDDEN',
    result: {}
  });
  res.end();
};

const apiWhiteListLogger = () => {
  return (req, res, next) => {
    if (req.path === '/' || checkIsStaticRoute(req.path)) {
      next();
    } else {
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
        next();
      } else {
        // If API is not whitelisted
        logger.info({
          msg: 'Portal_API_WHITELIST_LOGGER: URL not whitelisted',
          reqPath: req.path,
          reqOriginalUrl: req.originalUrl,
          method: req.method,
          sessionRoles: _.get(req, 'session.roles') || 'no roles in session'
        });
        next();
      }
    }
  }
};

module.exports = {
  isAllowed,
  apiWhiteListLogger
};

/**
 * @file - Responsible for generating and accessing user kong token
 * @since release-4.3.0
 * @version 1.0
 */
'use strict';

const _                                     = require('lodash');
const { v1: uuidv1 } = require('uuid');
const { logger }                            = require('@project-sunbird/logger');
const { sendRequest }                       = require('./httpRequestHandler');

const SUNBIRD_DEFAULT_TTL                   = require('./environmentVariablesHelper.js').sunbird_session_ttl;
const SUNBIRD_ANONYMOUS_TTL                 = require('./environmentVariablesHelper.js').sunbird_anonymous_session_ttl;
const KONG_DEVICE_REGISTER_TOKEN            = require('./environmentVariablesHelper.js').KONG_DEVICE_REGISTER_TOKEN;
const KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN  = require('./environmentVariablesHelper.js').KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN;

const KONG_LOGGEDIN_FALLBACK_TOKEN          = require('./environmentVariablesHelper.js').sunbird_logged_default_token;
const KONG_ANONYMOUS_FALLBACK_TOKEN         = require('./environmentVariablesHelper.js').sunbird_anonymous_default_token;
const KONG_LOGGEDIN_DEVICE_REGISTER_TOKEN   = require('./environmentVariablesHelper.js').sunbird_loggedin_register_token;
const KONG_ANONYMOUS_DEVICE_REGISTER_TOKEN  = require('./environmentVariablesHelper.js').sunbird_anonymous_register_token;

const KONG_REFRESH_TOKEN_API                = require('./environmentVariablesHelper.js').sunbird_kong_refresh_token_api;
const KONG_LOGGEDIN_DEVICE_REGISTER_API     = require('./environmentVariablesHelper.js').sunbird_loggedin_device_register_api;
const KONG_ANONYMOUS_DEVICE_REGISTER_API    = require('./environmentVariablesHelper.js').sunbird_anonymous_device_register_api;

const BLACKLISTED_URL                       = ['/service/health', '/health', '/assets/images', '/discussion'];
const KONG_ACCESS_TOKEN                     = 'userAccessToken';
const KONG_DEVICE_BEARER_TOKEN              = 'apiBearerToken';

/**
 * @param  { Object } req - API Request object
 * @description Get Kong token from core service using session id as primary key
 */
const generateKongToken = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        resolveWithFullResponse: true,
        method: 'POST',
        url: KONG_ANONYMOUS_DEVICE_REGISTER_API,
        headers: {
          'Authorization': 'Bearer ' + KONG_ANONYMOUS_DEVICE_REGISTER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: {
            key: _.get(req, 'sessionID') || 'no_key'
          }
        })
      };
      sendRequest(options).then((response) => {
        const responseData = JSON.parse(response.body);
        if (_.get(response, 'statusCode') === 200 && _.get(responseData, 'params') && _.get(responseData, 'params.status') === 'successful') {
          _log(req, 'KONG_TOKEN bearer_token_anonymous :: anonymous bearer token generated success for session id ' + _.get(req, 'sessionID') || 'no_key');
          resolve(responseData);
        } else {
          resolve(false);
        }
      }).catch((error) => {
        reject(error);
      });
    } catch (error) {
      throw new Error(error);
    }
  });
};

/**
 * @description Entry method for requesting Kong token
 * 1. Request API should not be blacklisted
 * 2. `Kong` service flag should be enabled
 * 3. Req session id should not have existing kong token
 * 4. If session consists kong token; same will be returned
 */
const registerDeviceWithKong = () => {
  return async function (req, res, next) {
    // Check if URL is blacklisted; forward request in case blacklisted
    if (!unless(req)) {
      if (KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'true' && !getKongTokenFromSession(req)) {
        _log(req, 'KONG_TOKEN :: requesting device register with kong');
        generateKongToken(req).then((kongToken) => {
          let _token;
          // If success; use response token
          // else use default token
          if (_.get(kongToken, 'result.token')) {
           _token = _.get(kongToken, 'result.token');
          } else {
            logger.error({
              'id': 'api.kong.tokenManager', 'ts': new Date(),
              'params': {
                'resmsgid': uuidv1(),
                'msgid': uuidv1(),
                'err': 'Internal Server Error',
                'status': 'Internal Server Error',
                'errmsg': 'Internal Server Error'
              },
              'responseCode': 'Internal Server Error',
              'result': {}
            });
            _token = KONG_ANONYMOUS_FALLBACK_TOKEN;
            _log(req, 'KONG_TOKEN bearer_token_anonymous :: anonymous bearer token failed API for session id ' + _.get(req, 'sessionID') || 'no_key');
          }
          req.session[KONG_DEVICE_BEARER_TOKEN] = _token;
          req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
          req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
          req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
          req.session['roles'] = [];
          req.session.roles.push('ANONYMOUS');
          req.session.save(function (error) {
            if (error) {
              next(error, null)
            } else {
              next();
            }
          });
        }).catch((err) => {
          logger.error({
            'id': 'api.kong.tokenManager', 'ts': new Date(),
            'params': {
              'resmsgid': uuidv1(),
              'msgid': uuidv1(),
              'err': 'Internal Server Error',
              'status': 'Internal Server Error',
              'errmsg': 'Internal Server Error'
            },
            'responseCode': 'Internal Server Error',
            'result': {}
          });
          _log(req, 'KONG_TOKEN bearer_token_anonymous :: anonymous bearer token failed block for session id ' + _.get(req, 'sessionID') || 'no_key');
          _log(req, 'KONG_TOKEN bearer_token_anonymous :: error stack ' + err);
          req.session[KONG_DEVICE_BEARER_TOKEN] = KONG_ANONYMOUS_FALLBACK_TOKEN;
          req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
          req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
          req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
          req.session['roles'] = [];
          req.session.roles.push('ANONYMOUS');
          req.session.save(function (error) {
            if (error) {
              next(error, null)
            } else {
              next();
            }
          });
        });
      } else {
        if (KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'true') {
          let _msg = getKongTokenFromSession(req) ? 'existing token' : ' no token from session';
          _log(req, 'KONG_TOKEN :: request using ' + _msg);
          _refreshLoginTTL(req, res, next);
        } else {
          _log(req, 'KONG_TOKEN :: kong bearer token not called due to flag set to  ' + KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN);
          next();
        }
      }
    } else {
      _log(req, 'KONG_TOKEN :: URL blacklisted');
      next();
    }
  }
};

/**
 * @param  { Object } req - API Request object
 * @param  { Object } res - API Response object
 * @param  { Callback } next - Request callback
 * @description Function to refresh TTL
 */
const _refreshLoginTTL = (req, res, next) => {
  if (req.session.userId) {
    // req.session.cookie.maxAge = SUNBIRD_DEFAULT_TTL;
    // req.session.cookie.expires = new Date(Date.now() + SUNBIRD_DEFAULT_TTL);
  } else {
    req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
    req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
  }
  req.session.save(function (error) {
    if (error) {
      next(error, null)
    } else {
      next();
    }
  });
};

/**
 * @param  { Object } req - API Request object
 * @description Function to return kong token for req session id
 * @returns { String } Kong token from session object
 */
const getKongTokenFromSession = (req) => {
  return KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'true' ?
  _.get(req, 'session.' + KONG_DEVICE_BEARER_TOKEN) : KONG_ANONYMOUS_FALLBACK_TOKEN;
};

/**
 * @param  { Object } req - API Request object
 * @description Function to check request URL / API is not blacklisted
 * @returns { Boolean } Flag indicating API status
 */
const unless = (req) => {
  const existsIndex = _.indexOf(BLACKLISTED_URL, _.get(req, 'originalUrl'));
  return (existsIndex > -1 ||
    _.includes(_.get(req, 'originalUrl'), '/assets/images') || 
    _.endsWith(_.get(req, 'originalUrl'), '.css') ||
    _.endsWith(_.get(req, 'originalUrl'), '.js') ||
    _.endsWith(_.get(req, 'originalUrl'), '.map') ||
    _.endsWith(_.get(req, 'originalUrl'), '.jpg') ||
    _.endsWith(_.get(req, 'originalUrl'), '.ico') ||
    _.endsWith(_.get(req, 'originalUrl'), '.woff2') ||
    _.endsWith(_.get(req, 'originalUrl'), '.svg') ||
    _.endsWith(_.get(req, 'originalUrl'), '.png')
  ) ? true : false;
};

/**
 * @param  { Object } req - API Request object
 * @description Function to return portal auth token based on service flag
 * 1. If `Kong` service flag should be enabled; kong token from session is returned
 * 2. Else default portal auth token is returned
 * @returns { String } Portal auth token
 */
const getPortalAuthToken = (req) => {
  _log(req, (KONG_DEVICE_REGISTER_TOKEN === 'true') ? 'USE_KONG_TOKEN' : 'USE_PORTAL_TOKEN');
  // return (KONG_DEVICE_REGISTER_TOKEN === 'true') ? _.get(req, 'session.' + KONG_ACCESS_TOKEN) : PORTAL_API_AUTH_TOKEN;
};

/**
 * @description Function to update session TTL
 */
const updateSessionTTL = () => {
  return async (req, res, next) => {
    req.session.cookie.maxAge = SUNBIRD_DEFAULT_TTL;
    req.session.cookie.expires = new Date(Date.now() + SUNBIRD_DEFAULT_TTL);
    req.session.save(function (error) {
      if (error) {
        next(error, null)
      } else {
        next();
      }
    });
  }
};

/**
 * @param  { Object } req     - API Request object
 * @param  { String } message - Log message
 */
const _log = (req, message) => {
  logger.info({
    msg: message,
    route: _.get(req, 'path') || 'no_route',
    originalUrl: _.get(req, 'originalUrl') || 'no_originalUrl',
    sessionId: _.get(req, 'sessionID')
  });
};

/**
 * @param  { Object } req - API Request object
 * @param  { Callback } next - Request callback
 * @description getKongAccessToken
 * 1. Generate x-auth-token for user
 */
const getKongAccessToken = (req, cb) => {
  if(KONG_DEVICE_REGISTER_TOKEN === 'true') {
    try {
      _log(req, 'KONG_TOKEN refresh_token:: requesting kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
      const keycloakObj = JSON.parse(_.get(req, 'session.keycloak-token'));
      // Use default token in case of VDN; as there is no anonymous session workflow for VDN
      const _bearerKey = KONG_DEVICE_REGISTER_TOKEN === 'true' ?
        _.get(req, 'session.' + KONG_DEVICE_BEARER_TOKEN) : KONG_LOGGEDIN_DEVICE_REGISTER_TOKEN;
      var options = {
        method: 'POST',
        url: KONG_REFRESH_TOKEN_API,
        headers: {
          'Authorization': 'Bearer ' + _bearerKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          refresh_token: keycloakObj['refresh_token']
        }
      };
      sendRequest(options).then((response) => {
        const responseData = JSON.parse(response);
        if (_.get(responseData, 'params.status') === 'successful') {
          _log(req, 'KONG_TOKEN refresh_token :: Successfully generated kong refresh auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
          req.session.cookie.maxAge = _.get(responseData.result, 'expires_in') * 1000;
          req.session.cookie.expires = new Date(Date.now() +  (_.get(responseData.result, 'expires_in') * 1000));
          req.session[KONG_ACCESS_TOKEN] = _.get(responseData, 'result.access_token');
          req.session.save(function (error) {
            if (error) {
              cb(error, null)
            } else {
              cb();
            }
          });
        } else {
          _log(req, 'KONG_TOKEN refresh_token :: Failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]');
          cb(true);
        }
      }).catch((error) => {
        _log(req, 'KONG_TOKEN refresh_token :: API Failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]. Error => ' + error);
        cb(error);
      });
    } catch (error) {
      _log(req, 'KONG_TOKEN refresh_token :: Method failed to generate kong auth token for session id [ ' + _.get(req, 'sessionID') || 'no_key' + ' ]. Error => ' + error);
      cb(error);
    }
  } else {
    _log(req, 'KONG_TOKEN refresh_token :: token not requested due to flag set to ' + KONG_DEVICE_REGISTER_TOKEN);
    cb();
  }
};

/**
 * @param  { Object } req - API Request object
 * @description Get Kong token from core service using session id as primary key
 * after user logged in
 */
const generateLoggedInKongToken = (req, cb) => {
  // return new Promise((resolve, reject) => {
  if (!unless(req)) {
    if (KONG_DEVICE_REGISTER_TOKEN === 'true') {
      try {
        var options = {
          method: 'POST',
          url: KONG_LOGGEDIN_DEVICE_REGISTER_API,
          headers: {
            'Authorization': 'Bearer ' + KONG_LOGGEDIN_DEVICE_REGISTER_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            request: {
              key: _.get(req, 'sessionID') || 'no_key'
            }
          })
        };
        sendRequest(options).then((response) => {
          const result = JSON.parse(response);
          if (_.get(result, 'params.status') === 'successful') {
            _log(req, 'KONG_TOKEN bearer_token_logged_in :: logged in bearer token generated success for session id ' + _.get(req, 'sessionID') || 'no_key');
            let _token;
            // If success; use response token
            // else use default token
            if (_.get(result, 'result.token')) {
              _token = _.get(result, 'result.token');
            } else {
              logger.error({
                'id': 'api.kong.tokenManager', 'ts': new Date(),
                'params': {
                  'resmsgid': uuidv1(),
                  'msgid': uuidv1(),
                  'err': 'Internal Server Error',
                  'status': 'Internal Server Error',
                  'errmsg': 'Internal Server Error'
                },
                'responseCode': 'Internal Server Error',
                'result': {}
              });
              _token = KONG_LOGGEDIN_FALLBACK_TOKEN;
              // next(new Error('api.kong.tokenManager:: Internal Server Error'));
            }
            req.session[KONG_DEVICE_BEARER_TOKEN] = _token;
            req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
            req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
            req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
            req.session.save(function (error) {
              if (error) {
                cb(error, null)
              } else {
                cb();
              }
            });
          } else {
            _log(req, 'KONG_TOKEN bearer_token_logged_in :: non successful logged in bearer token generated failed for session id ' + _.get(req, 'sessionID') || 'no_key');
            req.session[KONG_DEVICE_BEARER_TOKEN] = KONG_LOGGEDIN_FALLBACK_TOKEN;
            req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
            req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
            req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
            req.session.save(function (error) {
              if (error) {
                cb(error, null)
              } else {
                cb();
              }
            });
          }
        }).catch((error) => {
          _log(req, 'KONG_TOKEN bearer_token_logged_in :: send request logged in bearer token generated failed for session id ' + _.get(req, 'sessionID') || 'no_key');
          req.session[KONG_DEVICE_BEARER_TOKEN] = KONG_LOGGEDIN_FALLBACK_TOKEN;
          req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
          req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
          req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
          req.session.save(function (error) {
            if (error) {
              cb(error, null)
            } else {
              cb();
            }
          });
        });
      } catch (error) {
        throw new Error(error);
      }
    } else {
      _log(req, 'KONG_TOKEN bearer_token_logged_in :: token not requested due to flag set to ' + KONG_DEVICE_REGISTER_TOKEN + ' using default fallback token');
      req.session[KONG_DEVICE_BEARER_TOKEN] = KONG_LOGGEDIN_FALLBACK_TOKEN;
      req.session['auth_redirect_uri'] = req.protocol + `://${req.get('host')}/resources?auth_callback=1`;
      req.session.cookie.maxAge = SUNBIRD_ANONYMOUS_TTL;
      req.session.cookie.expires = new Date(Date.now() + SUNBIRD_ANONYMOUS_TTL);
      req.session.save(function (error) {
        if (error) {
          cb(error, null)
        } else {
          cb();
        }
      });
    }
  } else {
    _log(req, 'KONG_TOKEN bearer_token_logged_in :: URL blacklisted');
    cb();
  }
  // });
};

/**
 * @param  { Object } req - API Request object
 * @description Function to return bearer token
 * @returns { String } Portal bearer token
 */
const getBearerToken = (req) => {
  if (KONG_DEVICE_REGISTER_TOKEN === 'false' && KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'false') {
    return req.session.userId ? KONG_LOGGEDIN_FALLBACK_TOKEN : KONG_ANONYMOUS_FALLBACK_TOKEN;
  }
  else if (KONG_DEVICE_REGISTER_TOKEN === 'true' && KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'false') {
    return req.session.userId ? _.get(req, 'session.' + KONG_DEVICE_BEARER_TOKEN) : KONG_ANONYMOUS_FALLBACK_TOKEN;
  }
  else if (KONG_DEVICE_REGISTER_TOKEN === 'false' && KONG_DEVICE_REGISTER_ANONYMOUS_TOKEN === 'true') {
    return req.session.userId ? KONG_LOGGEDIN_FALLBACK_TOKEN : _.get(req, 'session.' + KONG_DEVICE_BEARER_TOKEN);
  }
  else {
    return _.get(req, 'session.' + KONG_DEVICE_BEARER_TOKEN);
  }
};

/**
 * @param  { Object } req - API Request object
 * @description Function to return x-auth token
 * @returns { String } Portal x-auth token
 */
 const getAuthToken = (req) => {
  return KONG_DEVICE_REGISTER_TOKEN === 'true' ?
    _.get(req, 'session.' + KONG_ACCESS_TOKEN) : req.kauth.grant.access_token.token;
};

module.exports = {
  registerDeviceWithKong,
  getPortalAuthToken,
  updateSessionTTL,
  getKongAccessToken,
  generateLoggedInKongToken,
  getBearerToken,
  getAuthToken
};

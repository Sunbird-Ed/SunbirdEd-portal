/**
 * @file
 * @description - Permission helper handler
 * @version 1.0
 */

const _                     = require('lodash');
const request               = require('request');
const { v1: uuidv1 } = require('uuid');
const dateFormat            = require('dateformat');
const envHelper             = require('./environmentVariablesHelper.js');
const telemetryHelper       = require('./telemetryHelper');
const learnerURL            = envHelper.LEARNER_URL;
const apiAuthToken          = envHelper.PORTAL_API_AUTH_TOKEN;
const { logger }            = require('@project-sunbird/logger');
const { getBearerToken, getAuthToken } = require('../helpers/kongTokenHelper')

let PERMISSIONS_HELPER = {

  /**
   * @param  {Object} reqObj          - Request object
   * @param  {Object} body            - User read API response object
   * @description setUserSessionData  - Set user session details
   */
  setUserSessionData (reqObj, body) {
    try {
      if (body.responseCode === 'OK') {
        reqObj.session.userId = body.result.response.id ? body.result.response.id : body.result.response.userId;
        reqObj.session.userName = body.result.response.userName;
        if (body.result.response.managedBy) {
          reqObj.session.userSid = uuidv1();
        } else {
          reqObj.session.userSid = reqObj.sessionID;
        }
        if (body.result.response.managedToken) {
          reqObj.session.managedToken = body.result.response.managedToken
        }
        reqObj.session.roles = _.map(body.result.response.roles, 'role');
        if (body.result.response.organisations) {
          _.forEach(body.result.response.organisations, function (org) {
            if (org.roles && _.isArray(org.roles)) {
              reqObj.session.roles = _.union(reqObj.session.roles, org.roles)
            }
            if (org.organisationId) {
              reqObj.session.orgs.push(org.organisationId)
            }
          })
        }
        reqObj.session.orgs = _.uniq(reqObj.session.orgs);
        reqObj.session.orgs = _.compact(reqObj.session.orgs);
        reqObj.session.roles = _.uniq(reqObj.session.roles)
        if (body.result.response.rootOrg && body.result.response.rootOrg.id) {
          reqObj.session.rootOrgId = body.result.response.rootOrg.id
          reqObj.session.rootOrghashTagId = body.result.response.rootOrg.hashTagId
          // reqObj.session.rootOrg = body.result.response.rootOrg
          reqObj.session.rootOrg = {};
          reqObj.session['rootOrg']['id']           = _.get(body, 'result.response.rootOrg.id');
          reqObj.session['rootOrg']['slug']         = _.get(body, 'result.response.rootOrg.slug');
          reqObj.session['rootOrg']['orgName']      = _.get(body, 'result.response.rootOrg.orgName');
          reqObj.session['rootOrg']['channel']      = _.get(body, 'result.response.rootOrg.channel');
          reqObj.session['rootOrg']['hashTagId']    = _.get(body, 'result.response.rootOrg.hashTagId');
          reqObj.session['rootOrg']['rootOrgId']    = _.get(body, 'result.response.rootOrg.rootOrgId');
        }
        // For bulk upload user(s); `PUBLIC` role added.
        if (!_.includes(reqObj.session.roles, 'PUBLIC')) {
          reqObj.session.roles.push('PUBLIC');
        }
        if (!_.includes(reqObj.session.roles, 'ANONYMOUS')) {
          reqObj.session.roles.push('ANONYMOUS');
        }
      }
    } catch (e) {
      logger.error({msg: 'setUserSessionData :: Error while saving user session data', err: e});
      console.log(e)
    }
  },

  /**
   * @param  {Object} reqObj          - Request object
   * @param  {Callback} callback      - Callback
   * @param  {String} userIdentifier  - User identifier
   * @param  {Boolean} isManagedUser  - Flag to indicate isManagedUser
   * @description getCurrentUserRoles - Function to get user roles
   */
  getCurrentUserRoles: function (reqObj, callback, userIdentifier, isManagedUser) {
    var userId = userIdentifier || reqObj.session.userId;
    var url = learnerURL + 'user/v5/read/' + userId;
    if (isManagedUser) {
      url = url + '?withTokens=true'
    }
    var options = {
      method: 'GET',
      url: url,
      headers: {
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + getBearerToken(reqObj),
        'x-authenticated-user-token':  getAuthToken(reqObj)
      },
      json: true
    }
    const telemetryData = {
      reqObj: reqObj,
      options: options,
      uri: 'user/v5/read',
      type: 'user',
      id: userId,
      userId: userId
    };
    request(options, function (error, response, body) {
      telemetryData.statusCode = _.get(response, 'statusCode');
      reqObj.session.roles = [];
      reqObj.session.orgs = [];
      if (error) {
        logger.error({ msg: 'error while user/v5/read', error });
        callback(error, null)
      } else if (!error && body && body.responseCode === 'OK') {
        module.exports.setUserSessionData(reqObj, body);
        let _sessionLog = {
          userId: reqObj.session.userId || null,
          rootOrgId: reqObj.session.rootOrgId || null,
          roles: reqObj.session.roles || null,
          userSid: reqObj.session.userSid || null,
          orgs: reqObj.session.orgs || null
        };
        logger.info({ msg: 'getCurrentUserRoles :: Session data set success', session: _sessionLog });
        reqObj.session.save(function (error) {
          if (error) {
            callback(error, null)
          } else {
            callback(null, body)
          }
        });
      } else if (body.responseCode !== 'OK') {
        logger.error({ msg: 'getCurrentUserRoles :: Error while reading user/v5/read', body });
        callback(body, null);
      } else {
        logger.error({ msg: 'getCurrentUserRoles error while user/v5/read', error });
        callback(error, null)
      }
    })
  }
}
module.exports = PERMISSIONS_HELPER

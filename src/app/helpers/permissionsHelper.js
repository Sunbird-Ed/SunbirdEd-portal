/**
 * @file
 * @description - Permission helper handler
 * @version 1.0
 */

const _                     = require('lodash');
const request               = require('request');
const uuidv1                = require('uuid/v1');
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
        'x-authenticated-user-token': "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsclI0MWpJNndlZmZoQldnaUpHSjJhNlowWDFHaE53a21IU3pzdzE0R0MwIn0.eyJqdGkiOiJhZWEyMjI2Zi1lZDg1LTQ4NjctYjRkZC0yNWEyOTZmZTZjOTIiLCJleHAiOjE2ODQ0NzQ4MjIsIm5iZiI6MCwiaWF0IjoxNjg0Mzg4NDIyLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiM2ZlNjBiOTctYjE3YS00YTE4LTk1YWYtYWYyZTRmZWY3MDljIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG1zIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMTQ4MTAzMGYtMTdmOC00YjE1LWFjYTktZDQxOGRmMDZmOGMzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbIm1hbmFnZS11c2VycyJdfSwibG1zIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6IiIsImNsaWVudElkIjoibG1zIiwiY2xpZW50SG9zdCI6IjEwNi41MS4xOTAuMjciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbG1zIiwiY2xpZW50QWRkcmVzcyI6IjEwNi41MS4xOTAuMjciLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1sbXNAcGxhY2Vob2xkZXIub3JnIn0.YQcSEUL7A0NLg9pWYd205fPXHowrv2cgY7qHPlzvchPUOSWtpsgkfH5KPRJCGwaXkYILCwjDkisoO24mVHDwGU124HSEi5w82jV5b2rD9kqBfgcxC2BTbnv2FVBAY93SXe-nr6vSWYekyMGnUNW4bdDGCOKgHSlsRtd0K6xCups46KjyV290wOUjCjC-rQj8N0lkpDkwFrfBBwqR50hX_93WcggqPEYRndNzwyF95kID5CUWwqfMK83klLaWF-ByqD6_H1pGLEy2bC-f-u7kwejGFZVtE01b-UpB-jI2cOpH8PLSV2revKn0CRGo1-JKQrngEvWTir2aDTk0qEs13A"
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

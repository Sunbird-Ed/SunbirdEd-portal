const request = require('request')
const envHelper = require('./environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
const telemetryHelper = require('./telemetryHelper')
const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const requestPromise = require('request-promise'); //  'request' npm package with Promise support
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN;
const { logger } = require('@project-sunbird/logger');
const { getBearerToken, getAuthToken } = require('../helpers/kongTokenHelper')

module.exports = {
  getUserDetails: async function (userId, userToken) {
    const options = {
      method: 'GET',
      url: learnerURL + 'user/v5/read/' + userId,
      headers: {
        'x-msgid': uuidv1(),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + apiAuthToken,
        'x-authenticated-user-token': userToken
      },
      json: true
    };
    logger.info({msg: 'fetching user request', additionalInfo: {options: options}});
    return requestPromise(options).then(data => {
      if (data.responseCode === 'OK') {
        return _.get(data, 'result.response');
      } else {
        throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
      }
    })
  },
  acceptTermsAndCondition: async function (data, userToken) {
    const options = {
      method: 'POST',
      url: learnerURL + 'user/v1/tnc/accept',
      headers: {
        'x-msgid': uuidv1(),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + apiAuthToken,
        'x-authenticated-user-token': userToken
      },
      body: data,
      json: true
    };
    logger.info({
      msg: 'userHelper:acceptTermsAndCondition initiated',
      body: options.body,
      url: options.url
    });
    return requestPromise(options).then(data => {
      if (data.responseCode === 'OK') {
        logger.info({msg: 'userHelper:acceptTermsAndCondition success', data: data});
        return _.get(data, 'result.response');
      } else {
        logger.info({msg: 'userHelper:acceptTermsAndCondition failed', data: data});
        throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err' || 'FAILED'));
      }
    }, function (error) {
      logger.error({
        msg: 'userHelper:acceptTermsAndCondition errored', error: error,
        params: _.get(error, 'error.params'), message: _.get(error, 'message')
      });
      throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err') || 'FAILED');
    })
  },
  getUserDetailsV2: async function (userId, userToken, req = undefined) {
    const options = {
      method: 'GET',
      url: learnerURL + 'user/v5/read/' + userId,
      qs: {
        fields: "locations"
      },
      headers: {
        'x-msgid': uuidv1(),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + getBearerToken(req),
        'x-authenticated-user-token':  getAuthToken(req)
      },
      json: true
    };
    return requestPromise(options).then(data => {
      if (data.responseCode === 'OK') {
        return _.get(data, 'result.response');
      } else {
        throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
      }
    })
  }
};

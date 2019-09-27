const request = require('request')
const envHelper = require('./environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
const telemetryHelper = require('./telemetryHelper')
const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const requestPromise = require('request-promise'); //  'request' npm package with Promise support
const apiAuthToken = envHelper.PORTAL_API_AUTH_TOKEN;
const logger = require('sb_logger_util_v2');

module.exports = {
  updateLoginTime: function (req, callback) {
    var data = this.prepareRequestBody(req)
    var token = req.kauth.grant.access_token.token
    this.sendUpdateTimeReq(req, token, data, function (err, status) {
      callback(err, status)
    })
  },
  prepareRequestBody: function (req) {
    var userId = req.session.userId
    var data = {
      'params': {},
      'request': {'userId': userId}
    }
    return data
  },
  sendUpdateTimeReq: function (req, token, data, callback) {
    var options = {
      method: 'PATCH',
      url: learnerURL + 'user/v1/update/logintime',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + learnerAuthorization,
        'x-authenticated-user-token': token
      },
      body: data,
      json: true
    }
    const telemetryData = {reqObj: req,
      options: options,
      uri: 'user/v1/update/logintime',
      type: 'user',
      id: data.request.userId,
      userId: data.request.userId}
    // telemetryHelper.logAPICallEvent(telemetryData)

    request(options, function (error, response, body) {
      telemetryData.statusCode = _.get(response, 'statusCode');
      if (callback) {
        if (error) {
          telemetryData.resp = body
          telemetryHelper.logAPIErrorEvent(telemetryData)
          console.log('Update login time failed due to', error)
          callback(null, true)
          console.log('Update login time failed due to', body.params.err)
        } else if (body && body.params && body.params.err) {
          telemetryData.resp = body
          telemetryHelper.logAPIErrorEvent(telemetryData)
          callback(null, true)
        } else {
          callback(null, body)
        }
      }
    })
  },
  getUserDetails: async function (userId, userToken) {
    const options = {
      method: 'GET',
      url: learnerURL + 'user/v1/read/' + userId,
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
  }
};

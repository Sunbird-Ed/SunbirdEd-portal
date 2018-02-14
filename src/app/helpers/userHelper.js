const request = require('request')
const envHelper = require('./environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
const telemetryHelper = require('./telemetryHelper')

module.exports = {
  updateLoginTime: function (req, callback) {
    var data = this.prepareRequestBody(req)
    var token = req.kauth.grant.access_token.token
    this.sendUpdateTimeReq(req, token, data, function (err, status) {
      callback(err, status)
    })
  },
  prepareRequestBody: function (req) {
    var userId = req.kauth.grant.access_token.content.sub
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

    request(options, function (error, response, body) {
      const telemetryData = {reqObj: req,
        options: options,
        statusCode: response.statusCode,
        resp: body,
        uri: 'user/v1/update/logintime',
        type: 'user',
        id: data.request.userId,
        userId: data.request.userId}
      telemetryHelper.logAPICallEvent(telemetryData)
      if (callback) {
        if (error) {
          telemetryHelper.logAPIErrorEvent(telemetryData)
          console.log('Update login time failed due to', error)
          callback(null, true)
          console.log('Update login time failed due to', body.params.err)
        } else if (body && body.params && body.params.err) {
          telemetryHelper.logAPIErrorEvent(telemetryData)
          callback(null, true)
        } else {
          callback(null, body)
        }
      }
    })
  }
}

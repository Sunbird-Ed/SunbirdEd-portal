const request = require('request')
const envHelper = require('./environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN

module.exports = {
  updateLoginTime: function (req, callback) {
    var data = this.prepareRequestBody(req)
    var token = req.kauth.grant.access_token.token
    this.sendUpdateTimeReq(token, data, function (err, status) {
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
  sendUpdateTimeReq: function (token, data, callback) {
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
      if (callback) {
        if (error) {
          callback(null, false)
          console.log(error)
        } else if (body && body.params && body.params.err) {
          console.log(body)
          callback(null, false)
        } else {
          callback(null, true)
        }
      }
    })
  }
}

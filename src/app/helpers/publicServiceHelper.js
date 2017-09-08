const request = require('request'),
  _ = require('lodash'),
  dateFormat = require('dateformat'),
  envHelper = require('./environmentVariablesHelper.js'),
  learnerURL = envHelper.LEARNER_URL,
  appId = envHelper.APPID,
  sunbird_api_auth_token = envHelper.PORTAL_API_AUTH_TOKEN;
module.exports = {
  getOrgs: function(req, res) {
    var options = {
      method: 'POST',
      url: learnerURL + 'org/v1/search',
      headers: module.exports.getHeaders(),
      body: {
        request: {
          filters: { 
            objectType: ['org'],
            isRootOrg: true
          },
          sort_by: { updatedDate: 'asc' }
        }
      },
      json: true
    };
    request(options, function(error, response, body) {
      if (body  && body.responseCode === 'OK') {
        body.result.response.content = _.map(body.result.response.content, _.partial(_.pick, _, ['orgName', 'contactDetail', 'slug']));
      } else{
        if (response && response.statusCode) {
          res.status(response.statusCode)
        }
      }
      res.send(body);
      res.end();
    })
  },
  getHeaders: function() {
    return {
      'x-device-id': 'X-Device-ID',
      'content-type': 'application/json',
      'x-consumer-id': 'X-Consumer-ID',
      'x-source': 'web',
      'X-App-Id': appId,
      'Authorization': 'Bearer ' + sunbird_api_auth_token,
      ts: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
    }
  }
}

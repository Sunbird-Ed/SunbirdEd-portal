/**
 * author: Anuj Gupta
 * Date: 12-01-2018
 * desc: This class is responsible for storing the telemetry data locally till some limit
         once limit is crossed or END event is triggered, called the api to store the data
 */

var request = require('request')

function telemetrySyncManager () {

}

/**
 * config have properties : ['headers', 'batchsize', 'host', 'endpoint', 'authtoken', 'method']
 */

/**
  initialize the telemetry data to store event, and set configuration
  */
telemetrySyncManager.prototype.init = function (config) {
  this.config = config
  this.teleData = []
}

/**
 * desc: Responsible for store data and call sync
 */
telemetrySyncManager.prototype.dispatch = function (telemetryEvent) {
  this.teleData.push(Object.assign({}, telemetryEvent));
  if ((telemetryEvent.eid.toUpperCase() == 'END') || (this.teleData.length >= this.config.batchsize)) {
    this.sync(function (err, res) { })
  }
}

/**
 * Resposible for return http headers for telemetry sync api
 */
telemetrySyncManager.prototype.getHttpHeaders = function () {
  var headersParam = {}

  // If user not sending the headers, we adding authtoken and content-type default,
  // in this user should send authtoken
  if (!this.config.headers) {
    if (typeof this.config.authtoken !== 'undefined') { headersParam['Authorization'] = this.config.authtoken }
    headersParam['Content-Type'] = 'application/json'
  } else {
    headersParam = this.headers
  }
  return headersParam
}

/**
 * Resposible for return http option for telemetry sync
 */
telemetrySyncManager.prototype.getHttpOption = function () {
  const headers = this.getHttpHeaders()
  var telemetryObj = {
    'id': 'ekstep.telemetry',
    'ver': this.config.version || '3.0',
    'ets': Date.now(),
    'events': this.teleData
  }
  const apiPath = this.config.host + this.config.endpoint
  return {
    url: apiPath,
    method: this.config.method,
    headers: headers,
    json: true,
    body: telemetryObj
  }
}

/**
 * desc: Responsible for call http api
 */
telemetrySyncManager.prototype.sync = function (callback) {
  if (this.teleData.length > 0) {
    var self = this
    const options = this.getHttpOption()

    console.log('Sync')

    request(options, function (err, res, body) {
      if (body && body.params && body.params.status === 'successful') {
        self.teleData.splice(0, self.config.batchsize)
        console.log('Telemetry submitted successfully')
        callback(null, body)
      } else {
        console.log('Telemetry sync failed, due to ', JSON.stringify(body))
        callback(err, null)
      }
    })
  } else {
    callback(null, true)
  }
}

module.exports = telemetrySyncManager

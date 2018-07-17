/**
 * author: Anuj Gupta
 * Date: 12-01-2018
 * desc: This class is responsible for storing the telemetry data locally till some limit
         once limit is crossed or END event is triggered, called the api to store the data
 */

var request = require('request')
var _ = require('lodash');
var telemetryBatchUtil = require('./telemetryBatchUtil');

function telemetrySyncManager() {

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
  this.failedList = []
  var self = this;
  setInterval(function () {
    if (telemetryBatchUtil.get()) {
      self.syncBatches();
    }
  }, 10000)
}

/**
 * desc: Responsible for store data and call sync
 */
telemetrySyncManager.prototype.dispatch = function (telemetryEvent) {
  var event = _.cloneDeep(telemetryEvent)
  this.teleData.push(event)
  if ((event.eid.toUpperCase() == 'END') || (this.teleData.length >= this.config.batchsize)) {
    var events = this.teleData.splice(0, this.config.batchsize) 
    this.sync(events, function(error, res, failedEvents){
      if(error) {
        telemetryBatchUtil.add(failedEvents)
      }
    })
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
telemetrySyncManager.prototype.getHttpOption = function (events) {
  const headers = this.getHttpHeaders()

  var telemetryObj = {
    'id': 'ekstep.telemetry',
    'ver': this.config.version || '3.0',
    'ets': Date.now(),
    'events': events
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
telemetrySyncManager.prototype.sync = function (events, callback) {
  if (events && events.length) {
    var self = this
    const options = this.getHttpOption(events)

    request(options, function (err, res, body) {
      
      if (res && res.statusCode === 200) {
        callback(null, body);
        return;
      }
      if(res &&  _.includes([503, 502, 429, 401], res.statusCode)) {
        callback(new Error('Error while syncing telemetry with code: '+res.statusCode), null);
        return;
      } else {
        try {
          console.log('Error while syncing telemetry', JSON.stringify(body));  
        } catch (error) {
          console.log('Error while syncing telemetry', body);
        }
        callback(null, body);
        return;
      }
    })
  } else {
    return callback(null, null);
  }
}

/**
 * desc: Responsible for call http api
 */
telemetrySyncManager.prototype.syncBatches = function (callback) {
  var self = this;
  var batches = telemetryBatchUtil.get();
  _.forEach(batches, function (batch) {
    (function (batch) {
      self.sync(batch.events, function (error, response) {
        if (!error) {
          console.log('Telemetry batch submitted successfully with batch id: ', batch.id)
          telemetryBatchUtil.delete(batch.id);
        }
      })
    })(batch)
  })
}


module.exports = telemetrySyncManager

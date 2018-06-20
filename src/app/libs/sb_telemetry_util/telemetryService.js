var Telemetry = require('./telemetryLibrary.js')
var telemetrySyncManager = require('./telemetrySyncManager.js')

var default_config = {
  'runningEnv': 'server',
  'dispatcher': undefined,
  'batchsize': 200
}

function telemetryService () {
}

/**
 * This function is used to initialize telemetry
 * @param {object} config
 */
telemetryService.prototype.config = {}
telemetryService.prototype.context = []

telemetryService.prototype.init = function (config) {
  default_config.dispatcher = new telemetrySyncManager()
  config['host'] = config['host'] || process.env.sunbird_telemetry_service_local_url;
  default_config.dispatcher.init(config)
  this.config = Object.assign({}, config, default_config)
  Telemetry.initialize(this.config)
}

/**
 * for start event
 * data object have these properties {'edata', 'contentId', 'contentVer', 'context', 'object', 'tags'}
 */

telemetryService.prototype.start = function (data) {
  if (data.context) { this.context.push(data.context) }
  Telemetry.start(this.config, data.contentId, data.contentVer, data.edata, {
    context: data.context,
    object: data.object,
    actor: data.actor,
    tags: data.tags,
    sid: this.config.sid                                                                                                                                                                                                                                         
  })
}

/**
 * for end event
 * data object have these properties {'edata', context', 'object', 'tags'}
 */
telemetryService.prototype.end = function (data) {
  var context = this.context.pop()
  Telemetry.end(data.edata, {
    context: context,
    object: data.object,
    actor: data.actor,
    tags: data.tags
  })
  // Telemetry.reset(context)
}

/**
 * for audit event
 * data object have these properties {'edata', context', 'object', 'tags'}
 */
telemetryService.prototype.audit = function (data) {
  Telemetry.audit(data.edata, {
    context: data.context,
    actor: data.actor,
    object: data.object,
    tags: data.tags,
    runningEnv: 'server'
  })
}

/**
 * for error event
 * data object have these properties {'edata', context', 'object', 'tags'}
 */

telemetryService.prototype.error = function (data) {
  Telemetry.error(data.edata, {
    context: data.context,
    actor: data.actor,
    object: data.object,
    tags: data.tags
  })
}

/**
 * for log event
 * data object have these properties {'edata', context', 'object', 'tags'}
 */
telemetryService.prototype.log = function (data) {
  Telemetry.log(data.edata, {
    context: data.context,
    object: data.object,
    actor: data.actor,
    tags: data.tags
  })
}

/**
 * for log event
 * data object have these properties {'edata', context', 'object', 'tags'}
 */
telemetryService.prototype.search = function (data) {
  Telemetry.search(data.edata, {
    context: data.context,
    actor: data.actor,
    object: data.object,
    tags: data.tags
  })
}

/**
 * this function used to get start event data
 * params: {type} <required>
 * params: {pageid} <required>
 * params: {mode}
 * params: {duration}
 */
telemetryService.prototype.startEventData = function (type, pageid, mode, duration, uaspec) {
  const startEventData = {
    type: type,
    mode: mode,
    duration: duration,
    pageid: pageid,
    uaspec: uaspec    
  }
  return JSON.parse(JSON.stringify(startEventData))
}

/**
 * This function is used to get end event data
 * @param {string} type
 * @param {string} pageid
 * @param {string} mode
 * @param {number} duration
 * @param {array} summery
 */
telemetryService.prototype.endEventData = function (type, pageid, mode, duration, summery) {
  const endEventData = {
    type: type,
    mode: mode,
    duration: duration,
    pageid: pageid,
    summary: summery
  }
  return JSON.parse(JSON.stringify(endEventData))
}

/**
 * This function is use to get log event data
 * @param {string} type
 * @param {string} level
 * @param {string} message
 * @param {string} pageid
 * @param {object} params
 */
telemetryService.prototype.logEventData = function (type, level, message, params) {
  const logEventData = {
    type: type,
    level: level,
    message: message,
    params: params
  }
  return JSON.parse(JSON.stringify(logEventData))
}

/**
 * This function is use to get error event data
 * @param {string} err
 * @param {string} type
 * @param {string} stacktrace
 * @param {string} pageid
 * @param {object} errObject
 */
telemetryService.prototype.errorEventData = function (err, type, stacktrace, errObject) {
  const errorEventData = {
    err: err,
    errtype: type,
    stacktrace: stacktrace,
    object: errObject
  }
  return JSON.parse(JSON.stringify(errorEventData))
}

/**
 * This function is use to get audit event data
 * @param {Array} props
 * @param {string} state
 * @param {string} prestate
 */
telemetryService.prototype.auditEventData = function (props, state, prestate) {
  const auditEventData = {
    props: props,
    state: state,
    prevstate: prestate
  }
  return JSON.parse(JSON.stringify(auditEventData))
}

/**
 * This function helps to get context data for event.
 * @param {channel, pdata, env, cdata, rollup} data
 */
telemetryService.prototype.getContextData = function (data) {
  let cObj = {}
  cObj.channel = data.channel
  cObj.pdata = data.pdata
  cObj.env = data.env
  cObj.cdata = data.cdata
  cObj.rollup = data.rollup
  cObj.did = data['did'] || ''
  return JSON.parse(JSON.stringify(cObj))
}

/**
 * This function return the actor object.
 * @param {string} userId
 * @param {string} type
 */
telemetryService.prototype.getActorData = function (userId, type) {
  if (!userId || !type) {
    console.log("Required params are missing for actor")
    return;
    }
  return {
    id: userId.toString(),
    type: type
  }
}

/**
 * This function return pdata object
 * @param {string} id
 * @param {string} version
 * @param {string} pid
 */
telemetryService.prototype.pData = function (id, version, pid) {
  if (!id || !version) {
    console.log("Required params are missing for p data")
    return
    }
  const pData = {
    id: id,
    pid: pid,
    ver: version
  }
  return JSON.parse(JSON.stringify(pData))
}

/**
 * This function return object data
 * @param {id, type, ver, rollup} data
 */
telemetryService.prototype.getObjectData = function (data) {
  let obj = {}
  if (data && (!data.id || !data.type)) {
    console.log("Required params are missing for object data")
    return
    }
  obj.id = data.id
  obj.type = data.type
  obj.ver = data.ver
  obj.rollup = data.rollup
  return JSON.parse(JSON.stringify(obj))
}

/**
 * This function return rollup object
 * @param {Array} data
 */
telemetryService.prototype.getRollUpData = function (data) {
  data = data || []
  let rollUp = {},
    i = 1

  data.forEach(element => {
    rollUp['l' + i] = element
    i += 1
  })
  return rollUp
}

telemetryService.prototype.syncOnExit = function (cb) {
  default_config.dispatcher.sync(cb)
}

/**
 * This function used to generate api_call log event
 * @param {Object} data
 */
telemetryService.prototype.generateApiCallLogEvent = function (data) {
  const telemetryData = data.telemetryData
  const message = data.message
  const level = 'api_call'
  const edata = this.logEventData('INFO', level, message, telemetryData.params)
  this.log({
    edata: edata,
    context: telemetry.getContextData(telemetryData.context),
    actor: telemetryData && telemetryData.actor,
    tags: telemetryData && telemetryData.tags,
    object: telemetryData && telemetryData.object
  })
}

module.exports = telemetryService

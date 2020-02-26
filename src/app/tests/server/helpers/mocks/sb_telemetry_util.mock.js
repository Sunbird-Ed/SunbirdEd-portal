/**
 * description : Mock file for Telemetry Service (For lib `sb_telemetry_util`)
 */

function mockTelemetry() { }
module.exports = mockTelemetry;
mockTelemetry.prototype.start = (data) => { return data; }
mockTelemetry.prototype.end = (data) => {
  return {
    context: context,
    object: data.object,
    actor: data.actor,
    tags: data.tags
  };
};
mockTelemetry.prototype.startEventData = () => {
  const startEventData = {
    type: 'click',
    mode: 'mode',
    duration: 1000,
    pageid: 'profile',
    uaspec: 'uaspec'
  };
  return JSON.parse(JSON.stringify(startEventData))
};
mockTelemetry.prototype.endEventData = () => {
  const endEventData = {
    type: 'click',
    mode: 'mode',
    duration: 1000,
    pageid: 'profile',
    summary: 'logout'
  };
  return JSON.parse(JSON.stringify(endEventData))
}
mockTelemetry.prototype.getContextData = (data) => {
  let cObj = {}
  cObj.channel = data.channel
  cObj.pdata = data.pdata
  cObj.env = data.env
  cObj.cdata = data.cdata
  cObj.rollup = data.rollup
  cObj.did = data['did'] || ''
  return JSON.parse(JSON.stringify(cObj))
};
mockTelemetry.prototype.getRollUpData = (data) => {
  data = data || []
  let rollUp = {},
    i = 1

  data.forEach(element => {
    rollUp['l' + i] = element
    i += 1
  })
  return rollUp
};
mockTelemetry.prototype.getActorData = (userId, type) => {
  if (!userId || !type) {
    console.log('Required params are missing for actor')
    return;
  }
  return {
    id: userId.toString(),
    type: type
  }
};
mockTelemetry.prototype.logEventData = (type = 'api_call', level = 'INFO', message, params) => {
  const logEventData = {
    type: type,
    level: level,
    message: message,
    params: params
  }
  return JSON.parse(JSON.stringify(logEventData))
};
mockTelemetry.prototype.errorEventData = (err, type, stacktrace, errObject) => {
  const errorEventData = {
    err: err,
    errtype: type,
    stacktrace: stacktrace,
    object: errObject
  };
  return JSON.parse(JSON.stringify(errorEventData))
};
mockTelemetry.prototype.audit = (data) => {
  return {
    context: data.context,
    actor: data.actor,
    object: data.object,
    tags: data.tags
  };
};
mockTelemetry.prototype.impression = (data) => {
  return {
    context: data.context,
    actor: data.actor,
    object: data.object,
    tags: data.tags
  };
};
mockTelemetry.prototype.getObjectData = () => {
  return {
    data: 'data'
  }
};
mockTelemetry.prototype.log = (data) => {
  return {
    context: data.context,
    object: data.object,
    actor: data.actor,
    tags: data.tags
  };
};
mockTelemetry.prototype.error = () => { return true; };

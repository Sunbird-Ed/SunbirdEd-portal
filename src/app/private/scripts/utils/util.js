/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

/**
 * Namespace for the sunbird portal
 */
var content_portal = function () {};// eslint-disable-line
window.org = { sunbird: {} }
org.sunbird.portal = new content_portal();// eslint-disable-line

org.sunbird.portal.init = function () {
  org.sunbird.portal.addUnloadEvent()
  org.sunbird.portal.telemetryInit()
}

/**
 * To add the any window unload events
 */
/* org.sunbird.portal.addUnloadEvent = function () {
  window.onbeforeunload = function (e) {
    e = e || window.event
    var y = e.pageY || e.clientY
        !y && org.sunbird.portal.eventManager.dispatchEvent('sunbird:window:unload', {// eslint-disable-line
      TelemetryData: TelemetryService._data
    })
  }
} */

org.sunbird.portal.telemetryInit = function () {
  var _instance = {
    correlationData: [{ id: '', type: '' }],
    user: {
      uid: org.sunbird.portal.uid
    },
    otherData: {
      channel: org.sunbird.portal.channel,
      pdata: {
        id: org.sunbird.portal.appid,
        ver: '1.0'
      },
      etags: {
        app: [],
        partner: [],
        dims: org.sunbird.portal.dims
      },
      sid: org.sunbird.portal.sid,
      did: '',
      mid: ''
    }
  }
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:init', _instance);// eslint-disable-line
}

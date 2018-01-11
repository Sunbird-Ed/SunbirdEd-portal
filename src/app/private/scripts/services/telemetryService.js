/**
 * @author Anuj Gupta
 */
angular.module('playerApp')
/**
     * @class telemetryService
     * @desc Service to generate telemetry events.
     * @memberOf Services
     */
  .service('telemetryService', ['$rootScope', 'config', function ($rootScope, config) {
    this.config = {
      'pdata': {
        'id': org.sunbird.portal.appid || 'org.sunbird',
        'ver': '1.0',
        'pid': ''
      },
      'env': 'Home',
      'channel': org.sunbird.portal.channel || 'sunbird',
      'did': undefined,
      'authtoken': undefined,
      'uid': $rootScope.userId,
      'sid': $rootScope.sessionId,
      'batchsize': 1,
      'host': '',
      'endpoint': 'data/v1/telemetry',
      'apislug': config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX,
      'dispatcher': undefined
    }
    this.context = []

    this.init = function () {
      console.log('Initialize telemetry')
      EkTelemetry.initialize(this.config) // eslint-disable-line no-undef
    }

    /**
    data = ['edata', 'contentId', 'contentVer', 'context', ']
     */
    this.start = function (data) {
      console.log('Portal Start event', data)
      this.context.push(data.context)
      EkTelemetry.start(this.config, data.contentId, data.contentVer, data.edata, {context: data.context}) // eslint-disable-line no-undef
    }

    this.end = function (edata) {
      console.log('Portal end event')
      var context = this.context.pop()
      EkTelemetry.end(edata, {context: context}) // eslint-disable-line no-undef
      EkTelemetry.reset(context) // eslint-disable-line no-undef
    }

    this.impression = function (data) {
      if (!data) {
        console.error('Impression event data is missing', data)
        return
      }

      EkTelemetry.impression(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.intract = function (data) {
      if (!data) {
        console.error('Intract event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.log = function (data) {
      if (!data) {
        console.error('Log event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.error = function (data) {
      if (!data) {
        console.error('Error event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.response = function (data) {
      if (!data) {
        console.error('Response event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.share = function (data) {
      if (!data) {
        console.error('Search event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.search = function (data) {
      data = data || {}
      if (!data) {
        console.error('Search event data is missing', data)
        return
      }
      EkTelemetry.intract(data, {env: data.env}) // eslint-disable-line no-undef
    }

    this.userAgentSpecification = function () {
      return {
        'agent': 'Chorme', // which user agent (mozilla, chrome, safari, ie)
        'ver': '5.0', // Agent version number
        'system': 'iPad; U; CPU OS 3_2_1 like Mac OS X; en-us', // System identification
        'platform': 'AppleWebKit/531', // client platform,
        'raw': ''
      }
    }

    this.startEventData = function (type, pageid, env, mode, duration, loc) {
      let startEventData = {
        type: type,
        uaspec: this.userAgentSpecification(),
        loc: loc,
        mode: mode,
        duration: duration,
        pageid: pageid
      }
      return JSON.parse(JSON.stringify(startEventData))
    }

    this.getContextData = function (data) {
      data = data || {}
      let contentObj = {}
      contentObj.channel = data.channel || this.config.channel
      contentObj.pdata = this.config.pdata
      contentObj.env = data.env || this.config.env
      contentObj.sid = this.config.sid
      contentObj.cdata = data.cdata
      contentObj.rollup = data.rollup
      return JSON.parse(JSON.stringify(contentObj))
    }

    this.getObjectData = function (data) {
      data = data || {}
      let object = {}
      object.id = data.id
      object.type = data.type
      object.ver = data.ver
      object.rollup = data.rollup
      return JSON.parse(JSON.stringify(object))
    }

    this.getRollUpData = function (data) {
      let rollUp = {}
      let i = 1
      data = data || {}

      data.forEach(element => {
        rollUp['l' + i] = element
        i += 1
      })
      return rollUp
    }

    this.cdata = function () {

    }
  }])

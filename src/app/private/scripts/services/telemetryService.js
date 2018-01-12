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
      'dispatcher': undefined,
      'tags': []
    }
    this.context = []

    /**
     * initialize telemetryLib
     */
    this.init = function () {
      console.log('Initialize telemetry')
      EkTelemetry.initialize(this.config) // eslint-disable-line no-undef
    }

    /**
      * for start event
      * data object have these properties {'edata', 'contentId', 'contentVer', 'context', 'object', 'tags'}
     */
    this.start = function (data) {
      console.log('Portal Start event', data)
      if (data.context) { this.context.push(data.context) }
      EkTelemetry.start(this.config, data.contentId, data.contentVer, data.edata, { // eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
      * for end event
      * data object have these properties {'edata', context', 'object'}
     */
    this.end = function (data) {
      console.log('Portal end event')
      var context = this.context.pop()
      EkTelemetry.end(data.edata, {context: context, object: object}) // eslint-disable-line no-undef
      EkTelemetry.reset(context) // eslint-disable-line no-undef
    }

    /**
      * for impression event
      * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.impression = function (data) {
      EkTelemetry.impression(data.edata, {// eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
      * for intract event
      * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.intract = function (data) {
      EkTelemetry.intract(data.edata, {// eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
      * for log event
      * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.log = function (data) {
      EkTelemetry.log(data.edata, {// eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
      * for error event
      * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.error = function (data) {
      EkTelemetry.error(data.edata, {// eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
      * for share event
      * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.share = function (data) {
      EkTelemetry.share(data.edata, {// eslint-disable-line no-undef
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
     * this function used to get start event data
     * perams: {type} <required>
     * perams: {pageid} <required>
     * perams: {mode}
     * perams: {duration}
     */
    this.startEventData = function (type, pageid, mode, duration) {
      const startEventData = {
        type: type,
        mode: mode,
        duration: duration,
        pageid: pageid
      }
      return JSON.parse(JSON.stringify(startEventData))
    }

    /**
     * This function is used to get content data of event envelope
     * data object have properties: ['channel', 'env', 'cdata', 'rollup']
     */
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

    /**
     * This function is used to get object data of event envelope
     * data object have properties: ['id', 'type', 'ver', 'rollup']
     */
    this.getObjectData = function (data) {
      data = data || {}
      let object = {}
      object.id = data.id
      object.type = data.type
      object.ver = data.ver
      object.rollup = data.rollup
      return JSON.parse(JSON.stringify(object))
    }

    /**
     * This function is used to get rollup data for context or object
     * data is array to strings
     * return rollup object
     */
    this.getRollUpData = function (data) {
      let rollUp = {}
      let i = 1
      data = data || []

      data.forEach(element => {
        rollUp['l' + i] = element
        i += 1
      })
      return rollUp
    }
  }])

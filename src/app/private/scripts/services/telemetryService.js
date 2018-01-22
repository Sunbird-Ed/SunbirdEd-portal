'use strict'
/**
 * @author Anuj Gupta
 */
angular.module('playerApp')
  /**
   * @class telemetryService
   * @desc Service to generate telemetry events.
   * @memberOf Services
   */
  .service('telemetryService', ['$rootScope', 'config', '$window', function ($rootScope, config, $window) {
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
      'batchsize': config.TELEMETRY.MAX_BATCH_SIZE,
      'host': '',
      'endpoint': config.TELEMETRY.SYNC,
      'apislug': config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX,
      'dispatcher': undefined,
      'runningEnv': 'client',
      'tags': []
    }
    this.context = []

    this.setConfig = function () {
      this.config.pdata.id = org.sunbird.portal.appid || 'org.sunbird'
      this.config.channel = org.sunbird.portal.channel || 'sunbird'
      this.config.uid = $rootScope.userId
      this.config.sid = $rootScope.sessionId
    }

    /**
     * initialize telemetryLib
     */
    this.init = function () {
      this.setConfig()
      console.log('Initialize telemetry')
      EkTelemetry.initialize(this.config)
    }

    /**
     * for start event
     * data object have these properties {'edata', 'contentId', 'contentVer', 'context', 'object', 'tags'}
     */
    this.start = function (data) {
      console.log('Portal Start event', data)
      if (data.context) { this.context.push(data.context) }
      EkTelemetry.start(this.config, data.contentId, data.contentVer, data.edata, {
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
      EkTelemetry.end(data.edata, { context: context, object: data.object })
      EkTelemetry.reset(context)
    }

    /**
     * for impression event
     * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.impression = function (data) {
      EkTelemetry.impression(data.edata, {
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
     * for interact event
     * data object have these properties {'edata', 'context', 'object', 'tags'}
     */
    this.interact = function (data) {
      EkTelemetry.interact(data.edata, {
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
      EkTelemetry.log(data.edata, {
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
      EkTelemetry.error(data.edata, {
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
      EkTelemetry.share(data.edata, {
        context: data.context,
        object: data.object,
        tags: data.tags
      })
    }

    /**
     * for get user specification
     */
    this.getUserSpec = function () {
      return {
        agent: $window.navigator.appCodeName,
        ver: $window.navigator.appVersion.split(' (')[0],
        system: '',
        platform: $window.navigator.platform,
        raw: $window.navigator.userAgent
      }
    }

    /** 
     * this function used to get start event data
     * params: {type} <required>
     * params: {pageid} <required>
     * params: {mode}
     * params: {duration}
     */
    this.startEventData = function (type, pageid, mode, duration) {
      var startEventData = {
        type: type,
        mode: mode,
        duration: duration,
        pageid: pageid,
        uspec: this.getUserSpec()
      }
      return JSON.parse(JSON.stringify(startEventData))
    }

    /**
     * This function is used to get end event data of event envelope
     * @param {string} type
     * @param {string} pageid
     * @param {string} mode
     * @param {number} duration
     * @param {array} summery
     */
    this.endEventData = function (type, pageid, mode, duration, summery) {
      var endEventData = {
        type: type,
        mode: mode,
        duration: duration,
        pageid: pageid,
        summary: summery
      }
      return JSON.parse(JSON.stringify(endEventData))
    }

    /**
     *
     * @param {string} type
     * @param {string} subtype
     * @param {string} pageid
     * @param {string} uri
     * @param {object} visits
     */
    this.impressionEventData = function (type, subtype, pageid, uri, visits) {
      var impressionEventData = {
        type: type,
        subtype: subtype,
        pageid: pageid,
        uri: uri,
        visits: visits
      }
      return JSON.parse(JSON.stringify(impressionEventData))
    }

    /**
     *
     * @param {string} type
     * @param {subtype} subtype
     * @param {string} id
     * @param {string} pageid
     * @param {object} target
     */
    this.interactEventData = function (type, subtype, id, pageid, target) {
      var interactEventData = {
        type: type,
        subtype: subtype,
        id: id,
        pageid: pageid,
        target: target
      }
      return JSON.parse(JSON.stringify(interactEventData))
    }

    /**
     *
     * @param {string} type
     * @param {string} level
     * @param {string} message
     * @param {string} pageid
     * @param {object} params
     */
    this.logEventData = function (type, level, message, pageid, params) {
      var logEventData = {
        type: type,
        level: level,
        message: message,
        pageid: pageid,
        params: params
      }
      return JSON.parse(JSON.stringify(logEventData))
    }

    /**
     *
     * @param {string} err
     * @param {string} type
     * @param {string} stacktrace
     * @param {string} pageid
     * @param {object} errObject
     */
    this.errorEventData = function (err, type, stacktrace, pageid, errObject) {
      var errorEventData = {
        err: err,
        type: type,
        stacktrace: stacktrace,
        pageid: pageid,
        object: errObject
      }
      return JSON.parse(JSON.stringify(errorEventData))
    }

    /**
     *
     * @param {string} type
     * @param {object} items
     * @param {string} dir
     * @param {object} origin
     * @param {object} to
     */
    this.shareEventData = function (type, items, dir, origin, to) {
      var shareEventData = {
        type: type,
        items: items,
        dir: dir,
        origin: origin,
        to: to
      }
      return JSON.parse(JSON.stringify(shareEventData))
    }

    /**
     * This function is used to get content data of event envelope
     * data object have properties: ['channel', 'env', 'cdata', 'rollup']
     */
    this.getContextData = function (data) {
      data = data || {}
      var contentObj = {}
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
      var object = {}
      object.id = data.id
      object.type = data.type
      object.ver = data.ver
      object.rollup = data.rollup
      return JSON.parse(JSON.stringify(object))
    }

    /**
     * This function is used to get rollup data for context or object
     * data is array of strings
     * return rollup object
     */
    this.getRollUpData = function (data) {
      var rollUp = {}
      var i = 1
      data = data || []

      data.forEach(function (element) {
        rollUp['l' + i] = element
        i += 1
      })
      return rollUp
    }
  }])

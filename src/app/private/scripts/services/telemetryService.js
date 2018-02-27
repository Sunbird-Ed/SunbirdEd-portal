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
      'batchsize': 10 || config.TELEMETRY.MAX_BATCH_SIZE,
      'host': '',
      'endpoint': config.TELEMETRY.SYNC,
      'apislug': config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX,
      'dispatcher': undefined,
      'runningEnv': 'client',
      'tags': []
    }

    this.ProfileLockConfig = {
      phone: 'phn-number-lock',
      email: 'email-lock',
      gender: 'gender-lock',
      dob: 'birthdate-lock',
      location: 'current-location-lock',
      grade: 'grade-lock',
      language: 'known-language-lock',
      subject: 'subject-experties-lock',
      webPages: 'social-media-link-lock',
      address: 'address-lock',
      profileSummary: 'profile-summary-lock',
      education: 'education-lock',
      jobProfile: 'job-profile-lock',
      skills: 'skills-lock'
    }

    this.ProfileSectionConfig = {
      profileSummary: 'profile-update-summary',
      editSummary: 'profile-edit-summary',
      closeSummary: 'profile-close-summary',
      addExperience: 'profile-update-experience',
      editExperience: 'profile-edit-experience',
      closeExperience: 'profile-close-experience',
      experience: 'add-experience',
      deleteExperience: 'profile-delete-experience',
      address: 'add-address',
      editAddress: 'profile-edit-address',
      addAddress: 'profile-add-address',
      deleteAddress: 'profile-delete-address',
      closeAddress: 'profile-close-address',
      addEducation: 'profile-update-education',
      editEducation: 'profile-edit-education',
      education: 'add-education',
      deleteEducation: 'profile-delete-education',
      closeEducation: 'profile-close-education',
      skills: 'add-skills',
      removeSkills: 'profile-delete-skills',
      cancelSkills: 'profile-cancel-skills',
      addSkills: 'profile-add-skills',
      basicInfo: 'profile-additional-info',
      editBasicInfo: 'edit-additional-info',
      closeBasicInfo: 'close-additional-info',
      phone: 'add-phone-number',
      gender: 'add-gender',
      dob: 'add-dateof-birth',
      grade: 'add-grade',
      language: 'add-known-language',
      subject: 'add-subject-experties',
      webPages: 'add-social-media-link',
      location: 'add-current-location'
    }

    this.context = []
    this.configData = {}
    this.visitData = []

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
      EkTelemetry.end(data.edata, { context: context, tags: data.tags }) // eslint-disable-line no-undef
      EkTelemetry.resetContext(context) // eslint-disable-line no-undef
    }

    /**
         * for impression event
         * data object have these properties {'edata', 'context', 'object', 'tags'}
         */
    this.impression = function (data) {
      EkTelemetry.impression(data.edata, { // eslint-disable-line no-undef
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
      EkTelemetry.interact(data.edata, { // eslint-disable-line no-undef
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
      EkTelemetry.log(data.edata, { // eslint-disable-line no-undef
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
      EkTelemetry.error(data.edata, { // eslint-disable-line no-undef
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
      EkTelemetry.share(data.edata, { // eslint-disable-line no-undef
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
         * perams: {type} <required>
         * perams: {pageid} <required>
         * perams: {mode}
         * perams: {duration}
         */
    this.startEventData = function (type, pageid, mode, duration) {
      var startEventData = {
        type: type,
        mode: mode,
        duration: duration,
        pageid: pageid,
        uaspec: this.getUserSpec()
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
    this.endEventData = function (type, pageid, mode, duration, summary) {
      var endEventData = {
        type: type,
        mode: mode,
        duration: duration,
        pageid: pageid,
        summary: summary
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
        uri: uri
      }
      if (visits) {
        impressionEventData.visits = visits
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
    this.errorEventData = function (err, errtype, stacktrace, pageid) {
      var errorEventData = {
        err: err,
        errtype: errtype,
        stacktrace: stacktrace,
        pageid: pageid
      }
      return JSON.parse(JSON.stringify(errorEventData))
    }

    /* for share item */
    this.getItemData = function (itemId, itemType, itemVer) {
      var itemData = {
        id: itemId,
        type: itemType,
        ver: itemVer
      }
      return JSON.parse(JSON.stringify(itemData))
    }

    /**
         *
         * @param {string} type
         * @param {object} items
         * @param {string} dir
         * @param {object} origin
         * @param {object} to
         */
    this.shareEventData = function (type, items, dir) {
      var shareEventData = {
        type: type,
        items: items,
        dir: dir
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
      if (data.rollup && Object.keys(data.rollup).length > 0) {
        object.rollup = data.rollup
      }
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

      if (data.constructor === Array) {
        data.forEach(function (element) {
          rollUp['l' + i] = element
          i += 1
        })
      }
      return rollUp
    }

    /**
        *This function is used to get config data for
        *LOG event
        */
    this.setConfigData = function (key, value) {
      this.configData[key] = value
    }

    this.getConfigData = function (key) {
      if (this.configData[key]) {
        return this.configData[key]
      } else {
        return this.config[key]
      }
    }

    this.interactTelemetryData = function (env, objId, objType, objVer, edataId, pageId, objRollup) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }
      var objectData = {
        id: objId,
        type: objType,
        ver: objVer,
        rollup: this.getRollUpData(objRollup)
      }

      var data = {
        edata: this.interactEventData('CLICK', '', edataId, pageId),
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }

      this.interact(data)
    }

    this.impressionTelemetryData = function (env, objId, objType, objVer, subtype, pageId,
      uri, objRollup, visit) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }

      var objectData = {
        id: objId,
        type: objType,
        ver: objVer,
        rollup: this.getRollUpData(objRollup)
      }

      var data = {
        edata: this.impressionEventData('view', subtype, pageId, uri, visit),
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }
      this.impression(data)
    }

    this.startTelemetryData = function (env, objId, objType, objVer, startContentType,
      pageId, mode) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }

      var objectData = {
        id: objId,
        type: objType,
        ver: objVer
      }
      var data = {
        edata: this.startEventData(startContentType, pageId, mode),
        contentId: objId,
        contentVer: $rootScope.version,
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }
      this.start(data)
    }

    this.endTelemetryData = function (env, objId, objType, objVer, endContentType,
      pageId, mode) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }

      var objectData = {
        id: objId,
        type: objType,
        ver: objVer
      }
      var data = {
        edata: this.endEventData(endContentType, pageId, mode),
        contentId: objId,
        contentVer: $rootScope.version,
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }
      this.end(data)
    }

    this.shareTelemetryData = function (env, objId, objType, objVer) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }

      var objectData = {
        id: objId,
        type: objType,
        ver: objVer
      }

      var items = [this.getItemData(objId, objType, objVer)]

      var data = {
        edata: this.shareEventData('Link', items, 'Out'),
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }
      this.share(data)
    }

    this.errorTelemetryData = function (env, objType, objVer, errCode, errType,
      stacktrace, pageId) {
      var contextData = {
        env: env,
        rollup: this.getRollUpData($rootScope.organisationIds)
      }
      var objectData = {
        id: $rootScope.userId,
        type: objType,
        ver: objVer
      }

      var data = {
        edata: this.errorEventData(errCode, errType, stacktrace, pageId),
        context: this.getContextData(contextData),
        object: this.getObjectData(objectData),
        tags: $rootScope.organisationIds
      }
      this.error(data)
    }

    this.setVisitData = function (data) {
      this.visitData = data
    }

    this.getVisitData = function () {
      return this.visitData
    }
  }])

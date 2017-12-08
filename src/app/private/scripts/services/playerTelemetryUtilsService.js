'use strict'

angular.module('playerApp')
  .service('playerTelemetryUtilsService', ['$rootScope', '$stateParams', function ($rootScope, $stateParams) {
    /**
     * @class playerTelemetryUtilsService
     * @desc Service to manages player telemetry  events.
     * @memberOf Services
     */
    /**
             * @method startTelemetry
             * @desc Start telemetry
             * @memberOf Services.playerTelemetryUtilsService
             * @instance
             */
    this.startTelemetry = function (data) {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:start', data)
    }
    /**
             * @method updateTelemetry
             * @desc Update telemetry
             * @memberOf Services.playerTelemetryUtilsService
             * @param {object}  data - Telemetry data
             * @instance
             */
    this.updateTelemetry = function (data) {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:intreact', data)
    }
    /**
             * @method endTelemetry
             * @desc End telemetry
             * @memberOf Services.playerTelemetryUtilsService
             * @param {object}  data - Telemetry data
             * @instance
             */
    this.endTelemetry = function (data) {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:end', data)
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:sync', {
        TelemetryData: TelemetryService._data // eslint-disable-line no-undef
      })
    }
    /**
             * @method navigateTelemetry
             * @desc Navigate telemetry
             * @memberOf Services.playerTelemetryUtilsService
             * @param {object}  data - Telemetry data
             * @instance
             */
    this.navigateTelemetry = function (data) {
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:navigate', data)
    }
    /**
             * @method init
             * @desc Initiate telemetry
             * @memberOf Services.playerTelemetryUtilsService
             * @param {object}  data - Telemetry data
             * @instance
             */
    this.init = function (data) {
      var _instance = {
        user: { sid: '', did: '', uid: $rootScope.userId },
        gameData: { id: 'org.sunbird.player', ver: '1.0' }
      }
      if ($stateParams.courseId) {
        _instance.correlationData = [{ id: $stateParams.courseId || data.contentId, type: 'course' }]
      } else {
        _instance.correlationData = [{ id: data.contentId, type: 'content' }]
      }
      var courseId = $stateParams.courseId || data.contentId
      if (_.isUndefined(courseId)) {
        _instance.context.dims = { dims: org.sunbird.portal.dims }
      } else {
        var cloneDims = _.cloneDeep(org.sunbird.portal.dims)
        cloneDims.push(courseId)
        _instance.context = { dims: cloneDims }
      }
      org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:init', _instance)
    }
  }])

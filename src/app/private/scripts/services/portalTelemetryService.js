angular.module('playerApp').service('portalTelemetryService',
  ['$http', '$filter', '$rootScope', 'uuid4', 'config',
    function ($http, $filter, $rootScope, uuid4, config) {
      /**
     * @class portalTelemetryService
     * @desc Service to manages portal telemetry  events.
     * @memberOf Services
     */
      var self = this
      var telemetryEvents = telemetryEvents || [] // eslint-disable-line no-use-before-define
      /**
     * @method init
     * @desc Initiate the telemetry
     * @memberOf Services.portalTelemetryService
     * @instance
     */
      this.init = function () {
        org.sunbird.portal.eventManager.addEventListener('sunbird:window:unload', self.sendTelementrySync)
        org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:flush', self.addTelemetryEvent)
      }
      /**
     * @method fireImpressions
     * @desc Dispatch event
     * @memberOf Services.portalTelemetryService
     * @param {object}  data - Telemetry data
     * @instance
     */
      this.fireImpressions = function (data) {
        org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetery:portal:impression', data)
      }
      /**
     * @method fireAnnouncementImpressions
     * @desc Dispatch event
     * @memberOf Services.portalTelemetryService
     * @param {object}  data - Telemetry data
     * @instance
     */
      this.fireAnnouncementImpressions = function (data, userIdHashTag) {
        // userIdHashTag to build cData
        data.userIdHashTag = userIdHashTag
        org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:announcement:impression', data)
      }
      /**
     * @method addTelemetryEvent
     * @desc Add new event
     * @memberOf Services.portalTelemetryService
     * @param {object}  data - Telemetry data
     * @instance
     */
      this.addTelemetryEvent = function (e, data) {
        telemetryEvents.push(data)
        if (telemetryEvents.length >= config.TELEMETRY.MAX_BATCH_SIZE) {
          self.sendTelementry(true)
        }
      }
      this.sendTelementrySync = function () {
        self.sendTelementry(false)
      }
      /**
     * @method sendTelementry
     * @desc Send telemetry records
     * @memberOf Services.portalTelemetryService
     * @param {string}  asyncFlag - Flag
     * @instance
     */
      this.sendTelementry = function (asyncFlag) {
        var request = {
          id: 'ekstep.telemetry',
          ver: '2.1',
          ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
          params: {
            requesterId: $rootScope.userId,
            did: 'portal',
            key: '13405d54-85b4-341b-da2f-eb6b9e546fff',
            msgid: uuid4.generate()
          },
          events: telemetryEvents
        }
        $.ajax({
          async: asyncFlag,
          crossDomain: true,
          url: config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + config.TELEMETRY.SYNC,
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(request)
        }).done(function (response) {
          if (response && response.params && response.params.status && response.params.status === 'successful') {
            telemetryEvents = []
          }
        })
      }
    }])

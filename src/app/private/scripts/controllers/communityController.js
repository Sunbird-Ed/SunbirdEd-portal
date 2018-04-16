'use strict'

angular.module('playerApp')
  .controller('CommunityController', ['$rootScope', 'telemetryService', function ($rootScope, telemetryService) {
    var commCtrl = this
    commCtrl.showDetail = false

    /**
             * This service call to generate telemetry
             * on click of groups.
             */
    telemetryService.impressionTelemetryData('groups', '', 'community', '1.0',
      'scroll', 'group-read', '/community')
  }])

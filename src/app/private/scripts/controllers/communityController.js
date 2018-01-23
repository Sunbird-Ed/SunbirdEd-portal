'use strict'

angular.module('playerApp')
  .controller('CommunityController', ['$rootScope', 'telemetryService', function ($rootScope, telemetryService) {
    var commCtrl = this
    commCtrl.showDetail = false

    /**
             * This function call to generate telemetry
             * on click of groups.
             */
      commCtrl.generateImpressionEvent = function(){
        var contextData = {
            env : 'groups',
            rollup: telemetryService.getRollUpData($rootScope.organisationIds)
          }
          var data = {
            edata:telemetryService.impressionEventData('view', 'scroll', 'groups-read', '/community', ''),
            context: telemetryService.getContextData(contextData),
            tags: $rootScope.organisationIds
          }
          telemetryService.impression(data)

      }

      commCtrl.generateImpressionEvent()
  }])

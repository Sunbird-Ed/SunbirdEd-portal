'use strict';
angular.module('playerApp')
        .service('playerTelemetryUtilsService', function ($rootScope, $stateParams) {
            this.startTelemetry = function (data) {
                org.sunbird.portal.eventManager.dispatchEvent("sunbird:telemetry:start", data);
            };
            this.updateTelemetry = function (data) {
                org.sunbird.portal.eventManager.dispatchEvent("sunbird:telemetry:intreact", data);
            };
            this.endTelemetry = function (data) {
                org.sunbird.portal.eventManager.dispatchEvent("sunbird:telemetry:end",data);
                org.sunbird.portal.eventManager.dispatchEvent("sunbird:telemetry:sync", {
                    TelemetryData: TelemetryService._data
                });
            };
            this.navigateTelemetry = function (data) {
                org.sunbird.portal.eventManager.dispatchEvent("sunbird:telemetry:navigate", data);
            };
            this.init = function (data) {
                var _instance = {                   
                    user: {"sid": "", "did": "", "uid": $rootScope.userId},
                    gameData: {"id": "org.sunbird.player", "ver": "1.0"}
                }
                if($stateParams.courseId){
                     _instance.correlationData= [{"id": $stateParams.courseId || data.contentId, "type": "course"}];
                }
                else{
                     _instance.correlationData= [{"id": data.contentId, "type": "content"}];
                }
                var courseId = $stateParams.courseId || data.contentId;
                if(_.isUndefined(courseId)){
                    _instance.context.dims = { dims : org.sunbird.portal.dims };
                }else{
                    var cloneDims = _.cloneDeep(org.sunbird.portal.dims);
                    cloneDims.push(courseId);
                    _instance.context = { dims :  cloneDims};
                }
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:init', _instance);
            };

        });

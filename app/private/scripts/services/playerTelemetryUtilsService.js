'use strict';
angular.module('playerApp')
        .service('playerTelemetryUtilsService', function () {
            this.updateTelemetry = function () {

            };
            this.init = function (item) {
                console.log(item);
                var _instance = {
                    correlationData: [{"id": "ba50f82f3a31fe255b6fa24ecbd00578", "type": "ContentSession"}],
                    user: {"avatar": "assets/icons/avatar_anonymous.png", "profileImage": "assets/icons/avatar_anonymous.png", "gender": "male", "handle": "Anonymous", "age": 6, "standard": -1, "uid": "9g8h4ndAnonymouscg56ngd"},
                    gameData: {"id": "org.sunbird.player", "ver": "1.0"}
                }
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:telemetry:init', _instance);
            };
        });
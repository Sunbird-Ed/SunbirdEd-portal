'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('userService', function(config, httpService, httpServiceJava, $q, $rootScope, portalTelemetryService) {
        this.resourceBundle = function(language, type) {
            var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + '/' + type + '/' + language;
            return httpService.get(url);
        };

        this.getUserProfile = function(uId) {
            var url = config.URL.USER.GET_PROFILE + '/' + uId;
            return httpServiceJava.get(url);
        };

        this.updateUserProfile = function(req, name, email) {
            //send telemetry for update profile
            var profile = this.prepareDataForTelemetry(req);
            var data = {
                "name": name, 
                "email": email,
                "access": [{"userId": $rootScope.userId}],
                "partners": [], 
                "profile": profile, 
            }
            portalTelemetryService.fireupdateProfile(data);

            var url = config.URL.USER.UPDATE_USER_PROFILE;
            return httpServiceJava.patch(url, req);
        };

        this.prepareDataForTelemetry = function (req) {
            var data = [];
            var request = req.request;
            _.forEach(request, function (v,k) {
                if (!_.isArray(v) && !_.isObject(v)) {
                    data.push({[k]:v});
                }
            })
            // if (request['address'] && _.isArray(request['address'])) {
            //     _.forEach(request['address'], function(addressObj){
            //         if (_.isObject(addressObj)) {
            //             _.forEach(addressObj, function (v,k) {
            //                 data[k] = v;
            //             })
            //         }
            //     })
            // }
            

            // if (request['jobProfile'] && _.isArray(request['jobProfile'])) {
            //     _.forEach(request['jobProfile'], function(jobProfileObj){
            //         if (_.isObject(jobProfileObj)) {
            //             _.forEach(jobProfileObj, function (v,k) {
            //                 data[k] = v;
            //             })
            //         }
            //     })
            // }
            // if (request['education'] && _.isArray(request['education'])) {
            //     _.forEach(request['education'], function(obj){
            //         if (_.isObject(obj)) {
            //             _.forEach(obj, function (v,k) {
            //                 data[k] = v;
            //             })
            //         }
            //     })
            // }
            //clean array 
            // data = _.pickBy(data, _.identity);
            // _.remove(data, _.isFunction)
            // delete data['$$hashKey'];
            return data;
        },
        this.getTenantLogo = function () {
            return httpService.get(config.URL.USER.TENANT_LOGO);
        }
    });

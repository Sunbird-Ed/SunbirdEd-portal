'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('userService',[
        'config', 
        'httpService', 
        'httpServiceJava', 
        '$rootScope',
        'portalTelemetryService',
        function(config, httpService, httpServiceJava, $rootScope, portalTelemetryService) {
        this.currentUserProfile = {};
        this.resourceBundle = function(language, type) {
            var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + '/' 
                    + type + '/' + language;
            return httpService.get(url);
        };

        this.getUserProfile = function(uId) {
            var url = config.URL.USER.GET_PROFILE + '/' + uId;
            return httpServiceJava.get(url);
        };

        this.updateUserProfile = function(req, name, email) {
            var url = config.URL.USER.UPDATE_USER_PROFILE;
            return httpServiceJava.patch(url, req);
        };

        this.getTenantLogo = function () {
            return httpService.get(config.URL.USER.TENANT_LOGO);
        };

        this.setCurrentUserProfile = function(userProfile) {
            this.currentUserProfile = userProfile;
        };

        this.getCurrentUserProfile = function() {
            return this.currentUserProfile;
        };

    }]);

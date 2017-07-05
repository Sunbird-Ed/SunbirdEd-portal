'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('userService', function(config, httpService, httpServiceJava) {
        this.resourceBundle = function(language, type) {
            var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + '/' + type + '/' + language;
            return httpService.get(url);
        };
        this.signup = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.USER.SIGNUP;
            console.log('url signup', url);
            return httpServiceJava.post(url, req);
        };
        this.updateUserProfile = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.USER.UPDATE_USER_PROFILE;
            return httpServiceJava.patch(url, req);
        };
    });
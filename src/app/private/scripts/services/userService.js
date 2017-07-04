'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('userService', function(config, httpService) {
        this.resourceBundle = function(language, type) {
            var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + "/" + type + "/" + language;
            return httpService.get(url);
        }
    });

'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
        .service('userService', function (config, httpService) {

            function getResourceBundle(language, type) {
                var url = config.URL.CONFIG_BASE + config.URL.USER.RESOURCE_BUNDLE + "/" + type + "/" + language;
                return httpService.get(url);
            }


            return {
                resourceBundle: getResourceBundle
            };

        });
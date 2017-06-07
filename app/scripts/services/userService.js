'use strict';

/**
 * @ngdoc service
 * @name playerApp.userService
 * @description
 * # userService
 * Service in the playerApp.
 */
angular.module('playerApp')
        .service('userService', function (config, $sessionStorage,httpService) {

            function getResourceBundle(language) {
                var url = config.URL.USER_BASE + config.URL.USER.RESOURCE_BUNDLE + "/" + language;
                return httpService.get(url);
            }
            return {
                resourceBundle: getResourceBundle
            };

        });
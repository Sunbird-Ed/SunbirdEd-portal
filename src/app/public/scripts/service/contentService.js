'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * @author Anuj Gupta
 * # contentService
 * Service in the playerApp.
 */
angular.module('loginApp')
    .service('contentService', ['httpService', 'config',
        function (httpService, config) {
            this.getById = function (req) {
                var url = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + config.URL.CONTENT.GET + '/' + req.contentId;
                return httpService.get(url, req, null);
            };

            this.courseHierarchy = function (courseId) {
                var url = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + config.URL.COURSE.HIERARCHY + '/' + courseId;
                return httpService.get(url);
            };
        }]);

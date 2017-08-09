'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * # contentService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('courseService', function (httpServiceJava, config, $sessionStorage, httpService) {
        this.search = function (req) {
            return httpService.post(config.URL.COURSE.SEARCH, req);
        };

        this.courseSchedule = function (req) {
            var url = config.URL.USER_BASE + config.URL.COURSE.USER_COURSE_SCHEDULE + '/' + $sessionStorage.token;
            return httpServiceJava.get(url, req);
        };

        this.courseContentState = function (req) {
            return httpServiceJava.post(config.URL.COURSE.USER_CONTENT_STATE, req);
        };

        this.courseHierarchy = function (courseId) {
            var url = config.URL.COURSE.HIERARCHY + '/' + courseId;
            return httpService.get(url);
        };
        this.enrollUserToCourse = function (req) {
            return httpServiceJava.post(config.URL.COURSE.ENROLL_USER_COURSE, req);
        };
    });

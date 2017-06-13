'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * # contentService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('courseService', function(httpServiceJava, config, $sessionStorage, httpService) {
        function search(req) {
            var url = config.URL.BASE + config.URL.COURSE.SEARCH;
            return httpService.post(url, req);
        }

        function getUserCourseSchedule(req) {
            var url = config.URL.USER_BASE + config.URL.COURSE.USER_COURSE_SCHEDULE + "/" + $sessionStorage.token;
            return httpServiceJava.get(url, req);
        }

        function courseContentState(req) {
            var url = config.URL.USER_BASE + config.URL.COURSE.USER_CONTENT_STATE;
            return httpServiceJava.post(url, req);
        }

        function getCourseHierarchy(courseId) {
            var url = config.URL.BASE + config.URL.COURSE.HIERARCHY + "/" + courseId;
            return httpService.get(url);
        }

        return {
            courseSchedule: getUserCourseSchedule,
            courseContentState: courseContentState,
            courseHierarchy: getCourseHierarchy,
            search: search
        };

    });
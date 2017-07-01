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
        this.search = function(req) {
            var url =  config.URL.CONTENT_PREFIX + config.URL.COURSE.SEARCH;
            return httpService.post(url, req);
        }

        this.courseSchedule = function(req) {
            var url = config.URL.USER_BASE + config.URL.COURSE.USER_COURSE_SCHEDULE + "/" + $sessionStorage.token;
            return httpServiceJava.get(url, req);
        }

        this.courseContentState = function(req) {
            var url =  config.URL.LEARNER_PREFIX + config.URL.COURSE.USER_CONTENT_STATE;
            return httpServiceJava.post(url, req);
        }

        this.courseHierarchy = function(courseId) {
            var url =  config.URL.CONTENT_PREFIX + config.URL.COURSE.HIERARCHY + "/" + courseId;
            return httpService.get(url);
        }
        this.enrollUserToCourse = function(req) {
            var url =  config.URL.LEARNER_PREFIX + config.URL.COURSE.ENROLL_USER_COURSE;
            return httpServiceJava.post(url, req);
        }

    });

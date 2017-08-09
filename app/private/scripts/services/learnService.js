'use strict';

angular.module('playerApp')
    .service('learnService', function (httpServiceJava, config) {
        this.enrolledCourses = function (uid) {
            var url = config.URL.COURSE.GET_ENROLLED_COURSES + '/' + uid;
            return httpServiceJava.get(url);
        };

        this.otherSections = function () {
            return httpServiceJava.get(config.URL.COURSE.GET_LEARN_OTHER_SECTION);
        };
        this.recommendedCourses = function () {
            return httpServiceJava.get(config.URL.COURSE.RECOMMENDED_COURSE);
        };
    });

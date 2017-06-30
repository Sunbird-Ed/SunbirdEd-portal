'use strict';
angular.module('playerApp')
    .service('learnService', function(httpServiceJava, javaService, config, $sessionStorage, $q) {
        this.enrolledCourses = function(uid) {
            var url = config.URL.DEV_API_BASE + config.URL.COURSE.GET_ENROLLED_COURSES + '/' + uid;
            return httpServiceJava.get(url);
        };

        this.otherSections = function(req) {
            var url = config.URL.DEV_API_BASE + config.URL.COURSE.GET_LEARN_OTHER_SECTION;
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Consumer-ID': 'X-Consumer-ID',
                'X-Device-ID': 'X-Device-ID',
                'X-msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ts': '2017-05-25 10:18:56:578+0530',
                'X-Authenticated-Userid': $sessionStorage.token

            };
            return httpServiceJava.get(url, {}, headers);
        };
    });
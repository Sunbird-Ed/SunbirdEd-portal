'use strict';

angular.module('playerApp')
    .service('searchService', function(httpService, httpServiceJava, config, $q) {
        this.contentSearch = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + config.URL.CONTENT.SEARCH;
            return httpService.post(url, req);
        };

        this.courseSearch = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.COURSE.SEARCH;
            return httpServiceJava.post(url, req);
        };
    });
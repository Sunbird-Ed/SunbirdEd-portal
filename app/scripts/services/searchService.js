'use strict';

angular.module('playerApp')
    .service('searchService', function(httpService, httpServiceJava, config, $q) {
        this.contentSearch = function(req) {
            var url = config.URL.BASE + config.URL.CONTENT.SEARCH;
            return httpService.post(url, req);
        };

        this.courseSearch = function(req) {
            var url = config.URL.DEV_API_BASE + config.URL.COURSE.SEARCH;
            return httpServiceJava.post(url, req);
        };
    });
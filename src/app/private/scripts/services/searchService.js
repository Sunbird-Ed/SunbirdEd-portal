'use strict';

angular.module('playerApp')
    .service('searchService', function(httpService, httpServiceJava, config, $q) {
        this.contentSearch = function(req) {
            var url =  config.URL.CONTENT_PREFIX + config.URL.CONTENT.SEARCH;
            return httpService.post(url, req);
        };

        this.courseSearch = function(req) {
            var url =  config.URL.CONTENT_PREFIX + config.URL.COURSE.SEARCH;
            return httpService.post(url, req);
        };

        this.search = function(req) {
            var url =  config.URL.CONTENT_PREFIX + config.URL.COMPOSITE.SEARCH;
            return httpService.post(url, req);
        };
    });
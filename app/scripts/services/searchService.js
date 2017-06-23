'use strict';

angular.module('playerApp')
    .service('searchService', function(httpService, config) {
        this.contentSearch = function(req) {
            var url = config.URL.BASE + config.URL.CONTENT.SEARCH;
            return httpService.post(url, req);
        };

        this.courseSearch = function(req) {
            var url = config.URL.BASE + config.URL.COURSE.SEARCH;
            return httpService.post(url, req);
        };
    });
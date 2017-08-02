'use strict';

angular.module('playerApp')
    .service('searchService', function (httpService, config) {
        this.contentSearch = function (req) {
            return httpService.post(config.URL.CONTENT.SEARCH, req);
        };

        this.courseSearch = function (req) {
            return httpService.post(config.URL.COURSE.SEARCH, req);
        };

        this.search = function (req) {
            return httpService.post(config.URL.COMPOSITE.SEARCH, req);
        };
    });

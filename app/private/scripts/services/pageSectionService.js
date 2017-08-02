'use strict';

angular.module('playerApp')
    .service('pageSectionService', function (httpServiceJava) {
        this.getPageData = function (path, req) {
            return httpServiceJava.post(path, req);
        };
    });

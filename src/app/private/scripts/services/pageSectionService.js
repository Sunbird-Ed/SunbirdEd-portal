'use strict';

angular.module('playerApp')
    .service('pageSectionService', ['httpServiceJava', function (httpServiceJava) {
        this.getPageData = function (path, req) {
            return httpServiceJava.post(path, req);
        };
    }]);

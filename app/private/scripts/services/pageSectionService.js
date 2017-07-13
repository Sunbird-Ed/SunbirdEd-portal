'use strict';
angular.module('playerApp')
    .service('pageSectionService', function(httpServiceJava, config, $rootScope) {
        this.getPageData = function(path,req) {
            var url =  config.URL.LEARNER_PREFIX + path;
            return httpServiceJava.post(url,req);
        };
    });

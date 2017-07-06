'use strict';
angular.module('playerApp')
    .service('pageSectionService', function(httpServiceJava, config, $rootScope) {
        this.getPageData = function(type) {
            var url =  config.URL.LEARNER_PREFIX + type;
            return httpServiceJava.get(url);
        };
    });

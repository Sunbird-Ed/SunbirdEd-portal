'use strict';
angular.module('playerApp')
    .service('resourceService', function(httpServiceJava, config, $rootScope) {
        this.resources = function(req) {
            var url =  config.URL.LEARNER_PREFIX + config.URL.RESOURCE.GET;
            return httpServiceJava.get(url);
        };
    });

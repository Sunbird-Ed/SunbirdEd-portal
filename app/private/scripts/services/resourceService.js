'use strict';
angular.module('playerApp')
    .service('resourceService', function(httpServiceJava, config) {

        this.resources = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX  + config.URL.RESOURCE.GET;
            return httpServiceJava.post(url, req);
        }
    });

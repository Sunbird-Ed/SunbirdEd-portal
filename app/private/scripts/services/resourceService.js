'use strict';
angular.module('playerApp')
    .service('resourceService', function(javaService, config, $rootScope) {
        this.resources = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.RESOURCE.GET;
            return javaService.get(url);
        };
    });

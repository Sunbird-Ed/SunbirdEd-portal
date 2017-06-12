'use strict';
angular.module('playerApp')
    .service('resourceService', function(httpServiceJava, config) {


        function resources(req) {
            var url = config.URL.MOCK_API_BASE + config.URL.RESOURCE.GET;
            return httpServiceJava.post(url, req);
        }
        return {
            resources: resources
        };
    });
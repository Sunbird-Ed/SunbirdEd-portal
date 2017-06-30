'use strict';
angular.module('playerApp')
    .service('resourceService', function(javaService, config, $rootScope) {
        this.resources = function(req) {
            var url =  config.URL.LEARNER_PREFIX + config.URL.RESOURCE.GET;
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Consumer-ID': 'X-Consumer-ID',
                'X-Device-ID': 'X-Device-ID',
                'X-msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ts': '2017-05-25 10:18:56:578+0530',
                'X-Authenticated-Userid': $rootScope.token 

            };
                       return javaService.get(url,{},headers);
        };
    });
'use strict';

angular.module('playerApp')
    .service('setupService', ['config', 'httpServiceJava', function (config, httpServiceJava) {
        this.addOrgType = function (req) {
            var url = config.URL.ORG_TYPE.ADD;
            return httpServiceJava.post(url, req);
        };
        this.updateOrgType = function (req) {
            var url = config.URL.ORG_TYPE.UPDATE;
            return httpServiceJava.patch(url, req);
        };
        this.getOrgTypes = function () {
            var url = config.URL.ORG_TYPE.GET;
            return httpServiceJava.get(url);
        };
    }]);

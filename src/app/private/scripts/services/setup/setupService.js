/**
  * @namespace Services
  */

'use strict';

angular.module('playerApp')
.service('setupService', ['config', 'httpServiceJava', function (config, httpServiceJava) {
    /**
     * @class setupService
     * @desc service to manage org types
     * @memberOf Services
     */

        /**
         * @method addOrgType
         * @desc add new org type
         * @memberOf Services.setupService
         * @inner
         */
    this.addOrgType = function (req) {
        var url = config.URL.ORG_TYPE.ADD;
        return httpServiceJava.post(url, req);
    };
     /**
         * @method updateOrgType
         * @desc update org types
         * @memberOf Services.setupService
         * @inner
         */
    this.updateOrgType = function (req) {
        var url = config.URL.ORG_TYPE.UPDATE;
        return httpServiceJava.patch(url, req);
    };
     /**
         * @method getOrgTypes
         * @desc get list of  org type
         * @memberOf Services.setupService
         * @inner
         */
    this.getOrgTypes = function () {
        var url = config.URL.ORG_TYPE.GET;
        return httpServiceJava.get(url);
    };
}]);

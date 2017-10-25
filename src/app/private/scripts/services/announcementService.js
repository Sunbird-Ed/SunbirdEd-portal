'use strict';

angular.module('playerApp')
.service('announcementService', ['httpServiceJava', 'config', function (httpServiceJava, config) {
    /**
     * @class dashboardService
     * @desc Service to manage dashboard.
     * @memberOf Services
     */

            /**
             * @method getAdminDashboardData
             * @desc Get admin dashboard data
             * @memberOf Services.dashboardService
             * @param {Object}   req - Request Object
             * @param {string}  datasetType - Data type
             * @returns {Promise} Promise object represents admin dashboard data
             * @instance
             */
    this.getAnnouncementList = function () {
       //return httpServiceJava.get(config.URL.DASHBOARD.ORG_CREATION + '/' + req.org_id + '?period=' + req.period);
       
       return 'sssssss';
    };
     
}]);

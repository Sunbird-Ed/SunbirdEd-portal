'use strict';

/**
 * @ngdoc service
 * @name playerApp.adminService
 * @description
 * # adminService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('adminService', [
        'config',
        'httpServiceJava',
        '$rootScope',
        'portalTelemetryService',
        function (config, httpServiceJava, $rootScope, portalTelemetryService) {
            this.userSearch = function (req) {
                var url = config.URL.ADMIN.USER_SEARCH;
                return httpServiceJava.post(url, req);
            };
            this.orgSearch = function (req) {
                var url = config.URL.ADMIN.ORG_SEARCH;
                return httpServiceJava.post(url, req);
            };

            this.deleteUser = function (req) {
                var url = config.URL.ADMIN.DELETE_USER;
                return httpServiceJava.post(url, req);
            };

            this.updateRoles = function (req) {
                var url = config.URL.ADMIN.UPDATE_USER_ORG_ROLES;
                return httpServiceJava.post(url, req);
            };

            this.bulkUserUpload = function (req) {
                var url = config.URL.ADMIN.BULK.USERS_UPLOAD;
                return httpServiceJava.upload(url, req);
            };

            this.bulkOrgrUpload = function (req) {
                var url = config.URL.ADMIN.BULK.ORGANIZATIONS_UPLOAD;
                return httpServiceJava.upload(url, req);
            };

            this.bulkUploadStatus = function (processId) {
                var url = config.URL.ADMIN.BULK.STATUS + '/' + processId;
                return httpServiceJava.get(url);
            };

            this.addBadges = function (req) {
                var url = config.URL.BADGE.ASSIGN;
                return httpServiceJava.post(url, req);
            };
            this.getBadges = function () {
                var url = config.URL.BADGE.GET;
                return httpServiceJava.get(url);
            };
            this.setBadges = function (badges) {
                this.badges = badges.result.response;
            };

            this.getBadgesList = function () {
                return this.badges ? this.badges : this.getBadges().then(function (res) {
                    return res.result.response;
                });
            };
        }]);


'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * # contentService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('contentService', ['httpService', 'config', '$rootScope',
        function (httpService, config, $rootScope) {
            this.search = function (req) {
                return httpService.post(config.URL.CONTENT.SEARCH, req);
            };

            this.create = function (req) {
                req.content.organization = $rootScope.organisationNames;
                req.content.createdFor = $rootScope.organisationIds;
                req.content.creator = $rootScope.firstName + $rootScope.lastName;
                return httpService.post(config.URL.CONTENT.CREATE, req);
            };

            this.update = function (req, id) {
                var url = config.URL.CONTENT.UPDATE + '/' + id;
                return httpService.patch(url, req);
            };

            this.review = function (req, id) {
                var url = config.URL.CONTENT.REVIEW + '/' + id;
                return httpService.post(url, req);
            };

            this.publish = function (req, id) {
                var url = config.URL.CONTENT.PUBLISH + '/' + id;
                return httpService.post(url, req);
            };

            this.retire = function (id) {
                var url = config.URL.CONTENT.RETIRE + '/' + id;
                return httpService.remove(url);
            };

            this.reject = function (data, id) {
                var url = config.URL.CONTENT.REJECT + '/' + id;
                return httpService.post(url, data);
            };

            this.uploadMedia = function (req) {
                return httpService.upload(config.URL.CONTENT.UPLOAD_MEDIA, req);
            };

            this.getById = function (req, qs) {
                var url = config.URL.CONTENT.GET + '/' + req.contentId;
                return httpService.get(url, req, null, qs);
            };

            this.flag = function (req, contentId) {
                var url = config.URL.CONTENT.FLAG + '/' + contentId;
                return httpService.post(url, req);
            };
        }]);

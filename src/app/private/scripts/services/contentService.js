'use strict';

angular.module('playerApp')
    .service('contentService', ['httpService', 'config', '$rootScope', 'httpServiceJava',
        function (httpService, config, $rootScope, httpServiceJava) {
            this.create = function (req) {
                req.content.organization = $rootScope.organisationNames;
                req.content.createdFor = $rootScope.organisationIds;
                req.content.creator = $rootScope.firstName + $rootScope.lastName;
                return httpService.post(config.URL.CONTENT.CREATE, req);
            };

            this.publish = function (req, id) {
                var url = config.URL.CONTENT.PUBLISH + '/' + id;
                return httpService.post(url, req);
            };

            this.retire = function (req) {
                var url = config.URL.CONTENT.RETIRE;
                return httpService.remove(url, req);
            };

            this.reject = function (data, id) {
                var url = config.URL.CONTENT.REJECT + '/' + id;
                return httpService.post(url, data);
            };

            this.uploadMedia = function (req) {
                return httpServiceJava.upload(config.URL.CONTENT.UPLOAD_MEDIA, req);
            };

            this.getById = function (req, qs) {
                var url = config.URL.CONTENT.GET + '/' + req.contentId;
                return httpService.get(url, req, null, qs);
            };

            this.flag = function (req, contentId) {
                var url = config.URL.CONTENT.FLAG + '/' + contentId;
                return httpService.post(url, req);
            };

            this.acceptContentFlag = function (req, contentId) {
                var url = config.URL.CONTENT.ACCEPT_FLAG + '/' + contentId;
                return httpService.post(url, req);
            };

            this.discardContentFlag = function (req, contentId) {
                var url = config.URL.CONTENT.DISCARD_FLAG + '/' + contentId;
                return httpService.post(url, req);
            };
        }]);

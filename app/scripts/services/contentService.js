'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentService
 * @description
 * # contentService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('contentService', function(httpService, config) {

        function search(req) {
            var url = config.URL.BASE + config.URL.CONTENT.SEARCH;
            return httpService.postOperation(url, req);
        }

        function create(req) {
            var url = config.URL.BASE + config.URL.CONTENT.CREATE;
            return httpService.postOperation(url, req);
        }

        function update(req,id) {
            var url = config.URL.BASE + config.URL.CONTENT.UPDATE+"/"+id;
            return httpService.patchOperation(url, req);
        }

        function uploadMedia(req) {
            var url = config.URL.BASE + config.URL.CONTENT.UPLOAD_MEDIA;
            return httpService.upload(url, req);
        }

        return {
            search: search,
            create: create,
            uploadMedia: uploadMedia,
            update: update
        };

    });

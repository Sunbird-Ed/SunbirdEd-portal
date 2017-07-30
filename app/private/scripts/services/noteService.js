'use strict';

/**
 * @ngdoc service
 * @name playerApp.noteService
 * @description
 * @author Anuj Gupta
 * # notesService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('noteService', ['httpService', 'config', function (httpService, config) {
        this.search = function (req) {
            var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.SEARCH;
            return httpService.post(url, req);
        };

        this.create = function (req) {
            var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.CREATE;
            return httpService.post(url, req);
        };

        this.update = function (req) {
            var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.UPDATE + '/' + req.noteId;
            return httpService.patch(url, req);
        };

        this.get = function (req) {
            var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.GET + '/' + req.noteId;
            return httpService.get(url, req);
        };

        this.remove = function (req) {
            var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.DELETE + '/' + req.noteId;
            return httpService.remove(url, req);
        };
    }]);

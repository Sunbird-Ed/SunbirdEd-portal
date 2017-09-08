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
            return httpService.post(config.URL.NOTES.SEARCH, req);
        };

        this.create = function (req) {
            return httpService.post(config.URL.NOTES.CREATE, req);
        };

        this.update = function (req) {
            var url = config.URL.NOTES.UPDATE + '/' + req.noteId;
            return httpService.patch(url, req);
        };

        this.get = function (req) {
            var url = config.URL.NOTES.GET + '/' + req.noteId;
            return httpService.get(url, req);
        };

        this.remove = function (req) {
            var url = config.URL.NOTES.DELETE + '/' + req.noteId;
            return httpService.remove(url, req);
        };
    }]);

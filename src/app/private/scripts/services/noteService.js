'use strict';

angular.module('playerApp')
    .service('noteService', ['httpServiceJava', 'config', function (httpServiceJava, config) {
        this.search = function (req) {
            return httpServiceJava.post(config.URL.NOTES.SEARCH, req);
        };

        this.create = function (req) {
            return httpServiceJava.post(config.URL.NOTES.CREATE, req);
        };

        this.update = function (req) {
            var url = config.URL.NOTES.UPDATE + '/' + req.noteId;
            return httpServiceJava.patch(url, req);
        };

        this.remove = function (req) {
            var url = config.URL.NOTES.DELETE + '/' + req.noteId;
            return httpServiceJava.remove(url, req);
        };
    }]);

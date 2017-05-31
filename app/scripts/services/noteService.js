'use strict';

/**
 * @ngdoc service
 * @name studioApp.noteService
 * @description
 * # notesService
 * Service in the studioApp.
 */
angular.module('playerApp')
    .service('noteService', function(httpService, config) {

        function search(req) {
            var url = config.URL.BASE + config.URL.NOTES.SEARCH;
            return httpService.post(url, req);
        }

        function create(req) {
            var url = config.URL.BASE + config.URL.NOTES.CREATE;
            return httpService.post(url, req);
        }

        function update(req) {
            var url = config.URL.BASE + config.URL.NOTES.UPDATE + '/' + req.noteId;
            return httpService.patch(url, req);
        }

        function get(req) {
            var url = config.URL.BASE + config.URL.NOTES.GET + '/' + req.noteId;;
            return httpService.get(url, req);
        }

        function remove(req) {
            var url = config.URL.BASE + config.URL.NOTES.DELETE + '/' + req.noteId;;
            return httpService.remove(url, req);
        }

        return {
            search: search,
            create: create,
            update: update,
            get: get,
            remove: remove
        };
    });

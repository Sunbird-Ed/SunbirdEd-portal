'use strict';

/**
 * @ngdoc function
 * @name studioApp.controller:UsernotesctrlCtrl
 * @description
 * # UsernotesctrlCtrl
 * Controller of the studioApp
 */
angular.module('playerApp')
    .controller('NoteCtrl', function($timeout, $scope, noteService, config) {

        var userId = "1234567";
        var courseId = "do_11225192024707891216";
        $scope.update = {};
        $scope.add = {};
        $scope.update.showUpdateNote = false;
        $scope.notesList = [];

        $scope.initializeUIComponent = function() {
            $('#notesList').css({ 'height': ($(document).height()) + 'px' });
            //                $timeout(function () {
            //                    $('#searchFilterAccordian')
            //                            .accordion();
            //
            //                    $('.dropdown').dropdown({
            //                        useLabels: false,
            //                        forceSelection: false,
            //                        label: {
            //                            duration: 0
            //                        },
            //                        debug: true,
            //                        performance: true
            //                    });
            //                }, 1000);
        };

        /**
         * This function call search api and bind data
         * @param {type} request
         * @returns {undefined}
         */
        function search(request) {

            noteService.search(request).then(function(response) {
                    if (response && response.responseCode === "OK") {
                        $scope.error = {};
                        $scope.notesList = response.result.note;
                    } else {
                        handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
                });
        }

        /**
         * This function called on ng-init(), 
         * This function help to fetch the user notes.
         */
        $scope.ngInit = function() {
            showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
            var request = {
                filters: {
                    userId: userId
                },
                sort_by: {
                    "lastUpdatedOn": "desc"
                }
            };
            search(request);
        };

        /**
         * This function helps to show loader or any error message at the time of api call.
         * @param {Boolean} showMetaLoader
         * @param {String} messageClass
         * @param {String} message
         */
        function showLoaderWithMessage(showMetaLoader, messageClass, message) {
            var error = {};
            error.showError = true;
            error.showMetaLoader = showMetaLoader;
            error.messageClass = messageClass;
            error.message = message;
            $scope.error = error;
        }

        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function handleFailedResponse(message) {
            showLoaderWithMessage(false, "red", message);
            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

        /**
         * This function helps to create note
         * @param {Object} noteData
         */
        $scope.createNote = function(noteData) {

            var requestData = {
                note: {
                    note: noteData.note,
                    userId: userId,
                    title: noteData.title,
                    courseId: courseId
                }
            };

            showLoaderWithMessage(true, "", config.MESSAGES.NOTES.CREATE.START);
            noteService.create(requestData).then(function(response) {
                    if (response && response.responseCode === "OK") {
                        $scope.error = {};
                        $scope.notesList = $scope.notesList ? $scope.notesList : [];
                        $scope.notesList.push(response.result.note);
                        $scope.add.showCreateNote = false;
                    } else {
                        handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
                });
        };

        /**
         * This function helps to create note
         * @param {Object} noteId
         */
        $scope.removeNote = function(noteId) {

            var requestData = { noteId: noteId };

            showLoaderWithMessage(true, "", config.MESSAGES.NOTES.REMOVE.START);
            noteService.remove(requestData).then(function(response) {
                    if (response && response.responseCode === "OK") {
                        $scope.notesList = $scope.notesList.filter(function(note) {
                            return note.identifier !== noteId;
                        });
                        $scope.error = {};
                    } else {
                        handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
                });
        };

        /**
         * This function helps to update note
         * @param {Object} noteData
         */
        $scope.updateNote = function(noteData) {

            var requestData = {
                noteId: noteData.identifier,
                note: noteData
            };

            delete requestData.note['identifier'];

            showLoaderWithMessage(true, "", config.MESSAGES.NOTES.UPDATE.START);
            noteService.update(requestData).then(function(response) {
                    if (response && response.responseCode === "OK") {
                        $scope.notesList = $scope.notesList.filter(function(note) {
                            return note.identifier !== noteData.identifier;
                        });
                        $scope.notesList.push(response.result.note);
                        $scope.error = {};
                        $scope.update.showUpdateNote = false;
                    } else {
                        handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                });
        };

        /**
         * This function helps to search note
         * @param {String} searchText
         */
        $scope.searchNote = function(searchText) {
            var request = {
                query: searchText,
                filters: {
                    userId: userId
                },
                sort_by: {
                    "lastUpdatedOn": "desc"
                }
            };
            search(request);
        };

    });

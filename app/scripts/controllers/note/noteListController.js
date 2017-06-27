'use strict';

angular.module('playerApp').controller('NoteListCtrl', function ($rootScope, noteService, config, $window, $timeout, $state, $stateParams) {

    var noteList = this;
    noteList.userId = $window.localStorage.getItem('user') ? JSON.parse($window.localStorage.getItem('user')).userId : $rootScope.userId;
    noteList.courseId = $stateParams.courseId;
    noteList.contentId = $stateParams.contentId;
    noteList.add = {};
    noteList.update = {};
    noteList.update.showUpdateNote = false;
    noteList.add.showCreateNote = false;
    noteList.notesList = [];

    /**
     * This function helps to show loader or any error message at the time of api call.
     * @param {Boolean} showMetaLoader
     * @param {String} messageClass
     * @param {String} message
     */
    function showLoaderWithMessage(object, headerMessage, loaderMessage) {
        var loader = {};
        noteList[object] = {};
        loader.showLoader = true;
        loader.headerMessage = headerMessage;
        loader.loaderMessage = loaderMessage;
        noteList[object].loader = loader;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function showErrorMessage(object, isClose, message, messageType) {
        var error = {};
        noteList[object] = {};
        error.showError = true;
        error.isClose = isClose;
        error.message = message;
        error.messageType = messageType;
        noteList[object].error = error;
    }

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        
        var api = 'searchApi';
        showLoaderWithMessage(api,"", config.MESSAGES.NOTES.SEARCH.START);
        
        noteService.search(request).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList[api].loader.showLoader = false;
                noteList.notesList = response.result.note || [];
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, config.MESSAGES.NOTES.SEARCH.FAILED, config.MESSAGES.COMMON.ERROR);
            }
        })
        .catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, config.MESSAGES.NOTES.SEARCH.FAILED, config.MESSAGES.COMMON.ERROR);
        });
    }

    /**
     * This function called on ng-init(), 
     * This function help to fetch the user notes.
     */
    noteList.ngInit = function () {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteList.userId,
                courseId: noteList.courseId,
                contentId: noteList.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };

    /**
     * This function helps to create note
     * @param {Object} noteData
     */
    noteList.createNote = function (noteData) {
        
        var api = 'createApi';

        var requestData = {
            note: {
                note: noteData.note,
                userId: noteList.userId,
                title: noteData.title,
                courseId: noteList.courseId,
                contentId: noteList.contentId
            }
        };

        showLoaderWithMessage(api, "", config.MESSAGES.NOTES.CREATE.START);
        noteService.create(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList.push(response.result.note);
                noteList.add.showCreateNote = false;
                noteList[api].loader.showLoader = false;
                noteList.add = {};
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, config.MESSAGES.NOTES.CREATE.FAILED, config.MESSAGES.COMMON.ERROR);
//                handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
            }
        }).catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, config.MESSAGES.NOTES.CREATE.FAILED, config.MESSAGES.COMMON.ERROR);
//            handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
        });
    };

    /**
     * This function helps to create note
     * @param {Object} noteId
     */
    noteList.removeNote = function (noteId) {

        var requestData = {noteId1: noteId};
        var api = 'searchApi';
        showLoaderWithMessage(api,"", config.MESSAGES.NOTES.REMOVE.START);

        noteService.remove(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList = noteList.notesList.filter(function (note) {
                    return note.identifier !== noteId;
                });
                noteList[api].loader.showLoader = false;
                
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, config.MESSAGES.NOTES.REMOVE.FAILED, config.MESSAGES.COMMON.ERROR);
//                handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
            }
        })
        .catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, config.MESSAGES.NOTES.REMOVE.FAILED, config.MESSAGES.COMMON.ERROR);
//            handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
        });
    };

    /**
     * This function helps to update note
     * @param {Object} noteData
     */
    noteList.updateNote = function (noteData) {

        var requestData = {
            noteId: noteData.identifier,
            note: noteData
        };

        delete requestData.note['identifier'];
        
        var api = 'updateApi';
        showLoaderWithMessage(api, "", config.MESSAGES.NOTES.UPDATE.START);
        noteService.update(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList = noteList.notesList.filter(function (note) {
                    return note.identifier !== noteData.identifier;
                });
                noteList.notesList.push(response.result.note);
                noteList[api].loader.showLoader = false;
                noteList.update = {};
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, config.MESSAGES.NOTES.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
//                handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
            }
        })
        .catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, config.MESSAGES.NOTES.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
        });
    };

    /**
     * This function helps to search note
     * @param {String} searchText
     */
    noteList.searchNote = function (searchText) {
        var copyNoteList = angular.copy(noteList.notesList)
        noteList.notesList = searchText ? copyNoteList.filter(noteList.createSearchNoteFilter(searchText)) : noteList.notesList;
    };

    noteList.createSearchNoteFilter = function (query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.title.includes(lowercaseQuery) || item.note.includes(lowercaseQuery));
        };
    };

    noteList.closeNoteList = function () {

        if (noteList.courseId && noteList.contentId) {
            var params = {courseId: noteList.courseId, contentId: noteList.contentId, lectureView: 'yes'};
            $state.go('Toc', params);
        } else if (noteList.courseId) {
            var params = {courseId: noteList.courseId, lectureView: 'no'};
            $state.go('Toc', params);
        } else if (noteList.contentId) {
            var params = {contentId: noteList.contentId};
            $state.go('Resource', params);
        }

    };

});

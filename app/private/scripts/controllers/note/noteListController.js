'use strict';

angular.module('playerApp').controller('NoteListCtrl', function ($rootScope, noteService, config, $state, $stateParams, $timeout) {

    var noteList = this;
    noteList.userId = $rootScope.userId;
    noteList.courseId = $stateParams.courseId;
    noteList.contentId = $stateParams.contentId;
    noteList.tocId = $stateParams.tocId;
    noteList.add = {};
    noteList.update = {};
    noteList.update.showUpdateNote = false;
    noteList.add.showCreateNote = false;
    noteList.notesList = [];

    /**
     * This function helps to show loader with message.
     * @param {String} headerMessage
     * @param {String} loaderMessage
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
        showLoaderWithMessage(api, "", $rootScope.errorMessages.NOTES.SEARCH.START);

        noteService.search(request).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList[api].loader.showLoader = false;
                noteList.notesList = response.result.note || [];
                if (noteList.notesList.length === 0) {
                    noteList[api].error = showErrorMessage(api, false, $rootScope.errorMessages.NOTES.SEARCH.NO_RESULT, $rootScope.errorMessages.COMMON.INFO);
                }
                noteList.selectedNoteData = noteList.notesList[0];
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, $rootScope.errorMessages.NOTES.SEARCH.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        })
                .catch(function (error) {
                    noteList[api].loader.showLoader = false;
                    showErrorMessage(api, true, $rootScope.errorMessages.NOTES.SEARCH.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
    }

    /**
     * This function called on ng-init(), 
     * This function help to fetch the user notes.
     */
    noteList.ngInit = function () {
        showLoaderWithMessage(true, "", $rootScope.errorMessages.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteList.userId,
                courseId: noteList.tocId,
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
                courseId: noteList.tocId,
                contentId: noteList.contentId
            }
        };

        showLoaderWithMessage(api, "", $rootScope.errorMessages.NOTES.CREATE.START);
        noteService.create(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList.push(response.result.note);
                noteList.add.showCreateNote = false;
                noteList[api].loader.showLoader = false;
                noteList.add = {};
                noteList.showNoteList(response.result.note);
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, $rootScope.errorMessages.NOTES.CREATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        }).catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, $rootScope.errorMessages.NOTES.CREATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
        });
    };

    /**
     * This function helps to create note
     * @param {Object} noteId
     */
    noteList.removeNote = function (noteId) {

        var requestData = {noteId: noteId};
        var api = 'searchApi';
        showLoaderWithMessage(api, "", $rootScope.errorMessages.NOTES.REMOVE.START);
        noteList.hideRemoveNoteModel();
        noteService.remove(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList = noteList.notesList.filter(function (note) {
                    return note.identifier !== noteId;
                });
                noteList[api].loader.showLoader = false;
                noteList.showNoteList(noteList.notesList[noteList.notesList.length - 1], noteList.notesList.length - 1);
                if (noteList.notesList.length === 0) {
                    noteList[api].error = showErrorMessage(api, false, $rootScope.errorMessages.NOTES.SEARCH.NO_RESULT, $rootScope.errorMessages.COMMON.INFO);
                }
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, $rootScope.errorMessages.NOTES.REMOVE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        }).catch(function (error) {
            noteList[api].loader.showLoader = false;
            showErrorMessage(api, true, $rootScope.errorMessages.NOTES.REMOVE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
        });
    };

    noteList.openRemoveNoteModel = function (noteId) {
        noteList.removeNoteId = noteId;
        noteList.showRemoveNoteModel = true;
        $timeout(function () {
            $('#removeNoteModal').modal({
                onShow: function () {
                },
                onHide: function () {
                }
            }).modal('show');
        }, 10);
    };

    noteList.hideRemoveNoteModel = function () {
        $('#removeNoteModal').modal('hide');
        $('#removeNoteModal').modal('hide all');
        $('#removeNoteModal').modal('hide other');
        $('#removeNoteModal').modal('hide dimmer');
        noteList.removeNoteId = '';
        noteList.showRemoveNoteModel = false;
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

        var api = 'updateApi';
        showLoaderWithMessage(api, "", $rootScope.errorMessages.NOTES.UPDATE.START);
        noteService.update(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteList.notesList = noteList.notesList.filter(function (note) {
                    return note.identifier !== noteData.identifier;
                });
                noteList.notesList.push(response.result.note);
                noteList[api].loader.showLoader = false;
                noteList.update = {};
                noteList.showNoteList(response.result.note);
            } else {
                noteList[api].loader.showLoader = false;
                showErrorMessage(api, true, $rootScope.errorMessages.NOTES.UPDATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            }
        })
                .catch(function (error) {
                    noteList[api].loader.showLoader = false;
                    showErrorMessage(api, true, $rootScope.errorMessages.NOTES.UPDATE.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
    };

    /**
     * This function helps to search note
     * @param {String} searchText
     */
    noteList.searchNote = function (searchText) {
        var copyNoteList = angular.copy(noteList.notesList);
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
            var params = {tocId: noteList.tocId, courseId: noteList.courseId, contentId: noteList.contentId, lectureView: 'yes'};
            $state.go('Toc', params);
        } else if (noteList.courseId) {
            var params = {tocId: noteList.tocId, courseId: noteList.courseId, lectureView: 'no'};
            $state.go('Toc', params);
        } else if (noteList.contentId) {
            var params = {contentId: noteList.contentId};
            $state.go('Player', params);
        }
    };


    noteList.updateNoteData = function (note) {

        noteList.update.metaData = angular.copy(note);
    };

    noteList.showNoteList = function (note, index) {

        noteList.selectedIndex = index;
        if (noteList.selectedIndex != '0') {
            $("#notelistcontent0").removeClass('notelistborder');
        } else {
            $("#notelistcontent0").addClass('notelistborder');
        }
        noteList.selectedNoteData = note;
    }



});

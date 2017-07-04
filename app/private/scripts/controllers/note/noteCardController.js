'use strict'

angular.module('playerApp').controller('NoteCardCtrl', function($rootScope, $scope, noteService, config, $timeout, $state, $stateParams) {

    var noteCard = this;
    noteCard.userId = $rootScope.userId;
    noteCard.showNoteCard = $scope.shownotecard;
    noteCard.showNoteList = $scope.shownotelist;
    noteCard.showModalInLectureView = $scope.shownoteinlecture;
    noteCard.showModalInCourseView = $scope.shownoteincourse;
    noteCard.quantityOfNotes = 2;
    noteCard.courseId = $stateParams.courseId;
    noteCard.contentId = $stateParams.contentId;
    noteCard.contentName=$stateParams.contentName;
    noteCard.tocId = $stateParams.tocId;
    noteCard.add = {};
    noteCard.update = {};
    noteCard.showCreateNote = false;
    noteCard.showUpdateNote = false;
    noteCard.visibility = $scope.visibility;
    noteCard.notesList = [];
    
        /**
     * This function helps to show loader with message.
     * @param {String} headerMessage
     * @param {String} loaderMessage
     */
    function showLoaderWithMessage(headerMessage, loaderMessage) {
        var loader = {};
        loader.showLoader = true;
        loader.headerMessage = headerMessage;
        loader.loaderMessage = loaderMessage;
        return loader;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function showErrorMessage(isClose, message, messageType) {
        var error = {};
        error.showError = true;
        error.isClose = isClose;
        error.message = message;
        error.messageType = messageType;
        return error;
    }

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        
        var api = 'searchApi';
        noteCard[api] = {};
        noteCard[api].loader = showLoaderWithMessage("", config.MESSAGES.NOTES.SEARCH.START);
        
        noteService.search(request).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteCard[api].loader.showLoader = false;
                    noteCard.notesList = response.result.note || [];
                    if(noteCard.notesList.length === 0) {
                        noteCard[api].error = showErrorMessage(false, config.MESSAGES.NOTES.SEARCH.NO_RESULT, config.MESSAGES.COMMON.INFO);
                    }
                } else {
                noteCard[api].loader.showLoader = false;
                noteCard[api].error = showErrorMessage(false, config.MESSAGES.NOTES.SEARCH.FAILED, config.MESSAGES.COMMON.ERROR);
            }
        })
        .catch(function (error) {
            noteCard[api].loader.showLoader = false;
            noteCard[api].error = showErrorMessage(false, config.MESSAGES.NOTES.SEARCH.FAILED, config.MESSAGES.COMMON.ERROR);
        });
    }

    /**
     * This function called on ng-init(), 
     * This function help to fetch the user notes.
     */
    noteCard.ngInit = function() {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteCard.userId,
                courseId: noteCard.tocId,
                contentId: noteCard.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };

    $scope.updateContentId = function() {
        noteCard.contentId = $scope.contentid;
    };

    $scope.updateDataOnWatch = function(contentId) {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteCard.userId,
                courseId: noteCard.tocId,
                contentId: contentId
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
    noteCard.createNote = function(noteData) {

        var requestData = {
            note: {
                note: noteData.note,
                userId: noteCard.userId,
                title: noteData.title,
                courseId: noteCard.tocId,
                contentId: noteCard.contentId
            }
        };
        
        var api = 'createApi';
        noteCard[api] = {};
        noteCard[api].loader = showLoaderWithMessage("", config.MESSAGES.NOTES.CREATE.START);
        
        noteService.create(requestData).then(function(response) {
            if (response && response.responseCode === "OK") {
                noteCard[api].loader.showLoader = false;
                noteCard.hideAddModal();
                $rootScope.$emit("updateNotesListData", response.result.note);
            } else {
                noteCard[api].loader.showLoader = false;
                noteCard[api].error = showErrorMessage(true, config.MESSAGES.NOTES.CREATE.FAILED, config.MESSAGES.COMMON.ERROR);
            }
        })
        .catch(function (error) {
            noteCard[api].loader.showLoader = false;
            noteCard[api].error = showErrorMessage(true, config.MESSAGES.NOTES.CREATE.FAILED, config.MESSAGES.COMMON.ERROR);
        });
    };

    /**
     * This function helps to update note
     * @param {Object} noteData
     */
    noteCard.updateNote = function(noteData) {

        var requestData = {
            noteId: noteData.identifier,
            note: noteData
        };

        var api = 'updateApi';
        noteCard[api] = {};
        noteCard[api].loader = showLoaderWithMessage("", config.MESSAGES.NOTES.UPDATE.START);
        
        noteService.update(requestData).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteCard.hideUpdateModal();
                    noteCard[api].loader.showLoader = false;
                    noteCard.notesList = noteCard.notesList.filter(function (note) {
                        return note.identifier !== noteData.identifier;
                    });
                    noteCard.notesList.push(response.result.note);
                } else {
                noteCard[api].loader.showLoader = false;
                noteCard[api].error = showErrorMessage(true, config.MESSAGES.NOTES.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
            }
        })
        .catch(function (error) {
            noteCard[api].loader.showLoader = false;
            noteCard[api].error = showErrorMessage(true, config.MESSAGES.NOTES.UPDATE.FAILED, config.MESSAGES.COMMON.ERROR);
        });
    };
    
    noteCard.hideUpdateModal = function() { 
        $('#updateNoteModal') 
            .modal('hide'); 
        $('#updateNoteModal') 
            .modal('hide others'); 
        $('#updateNoteModal') 
            .modal('hide dimmer'); 
    };
    
    noteCard.hideAddModal = function() { 
        $('#addNoteModal') 
            .modal('hide'); 
        $('#addNoteModal') 
            .modal('hide others'); 
        $('#addNoteModal') 
            .modal('hide dimmer'); 
    };

    noteCard.clearUpdateNoteData = function() {
        noteCard.update.metaData.title = '';
        noteCard.update.metaData.note = '';
    };

    noteCard.closeUpdateNoteModal = function() {
        $timeout(function() {
            noteCard.showUpdateNote = false;
        }, 0);
    };

    noteCard.showUpdateNoteModal = function(note) {

        noteCard.showUpdateNote = true;
        $timeout(function() {
            $('#updateNoteModal').modal({
                onShow: function() {
                    noteCard.update.metaData = angular.copy(note);
                },
                onHide: function() {
                    noteCard.clearUpdateNoteData();
                    noteCard.closeUpdateNoteModal();
                    return true;
                }
            }).modal('show');
        }, 10);
    };

    noteCard.clearAddNoteData = function() {
        noteCard.add.title = '';
        noteCard.add.note = '';
    };

    noteCard.closeAddNoteModal = function() {
        $timeout(function() {
            noteCard.showCreateNote = false;
        }, 0);
    };

    noteCard.showAddNoteModal = function() {
        noteCard.showCreateNote = true;
        $timeout(function() {
            $('#addNoteModal').modal({
                onShow: function() {
                    noteCard.clearAddNoteData();
                },
                onHide: function() {
                    noteCard.clearAddNoteData();
                    noteCard.closeAddNoteModal();
                    return true;
                }
            }).modal('show');
        }, 10);
    };

    $rootScope.$on("updateNotesListData", function(e, content) {
        noteCard.notesList = noteCard.notesList ? noteCard.notesList : [];
        noteCard.notesList.push(content);
    });

    noteCard.showAllNoteList = function() {
        if(noteCard.courseId && $scope.contentid && noteCard.tocId) {
            var params = {courseId: noteCard.courseId, contentId: $scope.contentid, tocId : noteCard.tocId};
            $state.go('CourseContentNote', params);
        } else if (noteCard.courseId) {
            var params = {courseId: noteCard.courseId, tocId : noteCard.tocId};
            $state.go('CourseNote', params);
        } else if (noteCard.contentId) {
            var params = {contentId: noteCard.contentId,contentName:noteCard.contentName};
            $state.go('ContentNote',params);
        }
    };
});
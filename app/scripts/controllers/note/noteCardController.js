'use strict'

angular.module('playerApp').controller('NoteCardCtrl', function($rootScope, $scope, noteService, config, $window, $timeout, $state, $stateParams) {

    var noteCard = this;
    noteCard.userId = $window.localStorage.getItem('user') ? JSON.parse($window.localStorage.getItem('user')).userId : $rootScope.userId;
    noteCard.showNoteCard = $scope.shownotecard;
    noteCard.showNoteList = $scope.shownotelist;
    noteCard.showModalInLectureView = $scope.shownoteinlecture;
    noteCard.showModalInCourseView = $scope.shownoteincourse;
    noteCard.quantityOfNotes = 2;
    noteCard.courseId = $scope.courseid || $stateParams.courseId;
    noteCard.contentId = $scope.contentid || $stateParams.contentId;
    noteCard.tocId = $stateParams.tocId;
    noteCard.add = {};
    noteCard.update = {};
    noteCard.denyModalClass = '';
    noteCard.showCreateNote = false;
    noteCard.showUpdateNote = false;
    noteCard.visibility = $scope.visibility;
    noteCard.showModalError = false;
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
                    noteCard.error = {};
                    noteCard.notesList = response.result.note;
                    $rootScope.$emit("updateNotesListData", response.result.note);
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
                noteCard.ngInit();
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
//                    noteCard.ngInit();
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
            noteCard.denyModalClass = 'deny';
            noteCard.showUpdateNote = false;
        }, 0);
    };

    noteCard.showUpdateNoteModal = function(note) {

        noteCard.showUpdateNote = true;
        noteCard.denyModalClass = '';
        $timeout(function() {
            $('#updateNoteModal').modal({
                onShow: function() {
                    noteCard.update.metaData = angular.copy(note);
                },
                onHide: function() {
                    noteCard.closeUpdateNoteModal();
                    return true;
                },
                onDeny: function() {
                    console.log(noteCard.updateApi.error.showError)
                    return  !noteCard.updateApi.error.showError;
                }
            }).modal('show');
        }, 100);
    };

    noteCard.clearAddNoteData = function() {
        noteCard.add.title = '';
        noteCard.add.note = '';
    };

    noteCard.closeAddNoteModal = function() {
        $timeout(function() {
            noteCard.denyModalClass = 'deny';
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
        }, 100);
    };


    $rootScope.$on("updateNotesListData", function(e, content) {
        noteCard.denyModalClass = 'deny';
        noteCard.notesList = content;
    });

    noteCard.showAllNoteList = function() {
        if(noteCard.courseId && $scope.contentid && noteCard.tocId) {
            console.log("Note data with content and course", noteCard.courseId , $scope.contentid , noteCard.tocId);
            var params = {courseId: noteCard.courseId, contentId: $scope.contentid, tocId : noteCard.tocId};
            $state.go('CourseContentNote', params);
        } else if (noteCard.courseId) {
            console.log("Note data  course", noteCard.courseId , $scope.contentid, noteCard.tocId);
            var params = {courseId: noteCard.courseId, tocId : noteCard.tocId};
            $state.go('CourseNote', params);
        } else if (noteCard.contentId) {
            console.log("Note data with content", noteCard.courseId , $scope.contentid , noteCard.tocId);
            var params = {contentId: $scope.contentid};
            $state.go('ContentNote',params);
        }
    };
});
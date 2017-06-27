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

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        noteCard.notesList = [];
        noteService.search(request).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteCard.error = {};
                    noteCard.notesList = response.result.note;
                    $rootScope.$emit("updateNotesListData", response.result.note);
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
    noteCard.ngInit = function() {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: noteCard.userId,
                courseId: noteCard.courseId,
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
                courseId: noteCard.courseId,
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
                courseId: noteCard.courseId,
                contentId: noteCard.contentId
            }
        };

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.CREATE.START);
        noteService.create(requestData).then(function(response) {
            if (response && response.responseCode === "OK") {
                noteCard.ngInit();
                noteCard.error = {};
                noteCard.add = {};
                noteCard.add.showCreateNote = false;
                noteCard.add.showModalError = false;
            } else {
                noteCard.add.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
            }
        }).catch(function(error) {
            noteCard.add.showModalError = true;
            handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
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

        delete requestData.note['identifier'];

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.UPDATE.START);
        noteService.update(requestData).then(function(response) {
                if (response && response.responseCode === "OK") {
                    noteCard.ngInit();
                    noteCard.error = {};
                    noteCard.update.showUpdateNote = false;
                    noteCard.showModalError = false;
                } else {
                    noteCard.showModalError = true;
                    handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                }
            })
            .catch(function(error) {
                noteCard.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
            });
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
        $timeout(function() {
            $('#updateNoteModal').modal({
                onShow: function() {
                    noteCard.update.metaData = angular.copy(note);
                },
                onHide: function() {
                    noteCard.closeUpdateNoteModal();
                    return true;
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
        noteCard.error = error;
    }

    /**
     * This function called when api failed, and its show failed response for 2 sec.
     * @param {String} message
     */
    function handleFailedResponse(message) {
        showLoaderWithMessage(false, "red", message);
        $timeout(function() {
            noteCard.error = {};
        }, 2000);
    }

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
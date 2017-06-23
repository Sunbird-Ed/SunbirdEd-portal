'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('noteCard', function () {

    return {
        templateUrl: 'views/note/noteCard.html',
        restrict: 'E',
        scope: {
            shownotecard: '=',
            courseid: '=',
            contentid: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('contentid', function () {
                scope.updateDataOnWatch(scope.contentid);
            });

        },
        controller: 'NoteCardCtrl as noteCard'
    };
});

angular.module('playerApp').directive('noteList', function () {

    return {
        templateUrl: 'views/note/noteList.html',
        restrict: 'E',
        scope: {
            shownotelist: '=',
            courseid: '=',
            contentid: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('contentid', function () {

                scope.updateDataOnWatch(scope.contentid);
            });

        },
        controller: 'NoteCardCtrl as noteCard'
    };
});

angular.module('playerApp').directive('addNote', function () {

    return {
        templateUrl: 'views/note/noteAddCardModal.html',
        restrict: 'E',
        scope: {
            shownoteinlecture: '=',
            shownoteincourse: '=',
            courseid: '=',
            contentid: '=',
            visibility: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('contentid', function () {

                scope.updateContentId();
            });

        },
        controller: 'NoteCardCtrl as noteCard'
    };
});

angular.module('playerApp').controller('NoteCardCtrl', function ($rootScope, $scope, noteService, config, $window, $timeout) {

    var noteCard = this;
    var userId = $window.localStorage.getItem('user') ? JSON.parse($window.localStorage.getItem('user')).userId : $rootScope.userId;
    noteCard.showNoteCard = $scope.shownotecard;
    noteCard.showNoteList = $scope.shownotelist;
    noteCard.showModalInLectureView = $scope.shownoteinlecture;
    noteCard.showModalInCourseView = $scope.shownoteincourse;
    noteCard.quantityOfNotes = 2;
    noteCard.courseId = $scope.courseid;
    noteCard.contentId = $scope.contentid;
    noteCard.add = {};
    noteCard.update = {};
    noteCard.update.showUpdateNote = false;
    noteCard.add.showCreateNote = false;
    noteCard.denyModalClass = '';
    noteCard.showNoteModal = false;
    noteCard.visibility = $scope.visibility;

    /**
     * This function call search api and bind data
     * @param {type} request
     * @returns {undefined}
     */
    function search(request) {
        noteCard.notesList = [];
        noteService.search(request).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteCard.error = {};
                noteCard.notesList = response.result.note;
                $rootScope.$emit("updateNotesListData", response.result.note);
            } else {
                handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
            }
        })
                .catch(function (error) {
                    handleFailedResponse(config.MESSAGES.NOTES.SEARCH.FAILED);
                });
    }

    /**
     * This function called on ng-init(), 
     * This function help to fetch the user notes.
     */
    noteCard.ngInit = function () {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: userId,
                courseId: noteCard.courseId,
                contentId: noteCard.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };

    $scope.updateContentId = function () {
        noteCard.contentId = $scope.contentid;
    };

    $scope.updateDataOnWatch = function (contentId) {
        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.SEARCH.START);
        var request = {
            filters: {
                userId: userId,
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
    noteCard.createNote = function (noteData) {

        var requestData = {
            note: {
                note: noteData.note,
                userId: userId,
                title: noteData.title,
                courseId: noteCard.courseId,
                contentId: noteCard.contentId
            }
        };

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.CREATE.START);
        noteService.create(requestData).then(function (response) {
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
        }).catch(function (error) {
            noteCard.add.showModalError = true;
            handleFailedResponse(config.MESSAGES.NOTES.CREATE.FAILED);
        });
    };

    /**
     * This function helps to create note
     * @param {Object} noteId
     */
    noteCard.removeNote = function (noteId) {

        var requestData = {noteId: noteId};

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.REMOVE.START);
        noteService.remove(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteCard.notesList = noteCard.notesList.filter(function (note) {
                    return note.identifier !== noteId;
                });
                noteCard.error = {};
            } else {
                handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
            }
        })
                .catch(function (error) {
                    handleFailedResponse(config.MESSAGES.NOTES.REMOVE.FAILED);
                });
    };

    /**
     * This function helps to update note
     * @param {Object} noteData
     */
    noteCard.updateNote = function (noteData) {

        var requestData = {
            noteId: noteData.identifier,
            note: noteData
        };

        delete requestData.note['identifier'];

        showLoaderWithMessage(true, "", config.MESSAGES.NOTES.UPDATE.START);
        noteService.update(requestData).then(function (response) {
            if (response && response.responseCode === "OK") {
                noteCard.notesList = noteCard.notesList.filter(function (note) {
                    return note.identifier !== noteData.identifier;
                });
                noteCard.notesList.push(response.result.note);
//                noteCard.ngInit();
                noteCard.error = {};
                noteCard.update.showUpdateNote = false;
                noteCard.showModalError = false;
            } else {
                noteCard.showModalError = true;
                handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
            }
        })
                .catch(function (error) {
                    noteCard.showModalError = true;
                    handleFailedResponse(config.MESSAGES.NOTES.UPDATE.FAILED);
                });
    };

    /**
     * This function helps to search note
     * @param {String} searchText
     */
    noteCard.searchNote = function (searchText) {
        var request = {
            query: searchText,
            filters: {
                userId: userId,
                courseId: noteCard.courseId,
                contentId: noteCard.contentId
            },
            sort_by: {
                "lastUpdatedOn": "desc"
            }
        };
        search(request);
    };

    noteCard.showUpdateNoteModal = function (note) {
        noteCard.update.metaData = note;
        $('#updateNoteModal').modal('refresh').modal('show');
    };

    noteCard.showAddNoteModal = function () {

        $timeout(function () {
            $('#addNoteModal').modal({
                onShow: function () {
                    noteCard.add.title = '';
                    noteCard.add.note = '';
                },
                onHide: function () {
                    noteCard.add.title = '';
                    noteCard.add.note = '';
                    noteCard.visibility = false;
                    $('#addNoteForm')[0].reset();
                },
                onDeny: function () {
                    noteCard.add.title = '';
                    noteCard.add.note = '';
                    return true;
                }
            }).modal('show');
        }, 100);
    };

    noteCard.clearNote = function () {
        noteCard.add = {};
        noteCard.add.title = '';
        noteCard.add.note = '';
        $('#addNoteForm')[0].reset();
        noteCard.showNoteModal = false;
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
        $timeout(function () {
            noteCard.error = {};
        }, 2000);
    }

    $rootScope.$on("updateNotesListData", function (e, content) {
        noteCard.denyModalClass = 'deny';
        noteCard.notesList = content;
        noteCard.add.title = '';
        noteCard.add.note = '';
    });

    noteCard.showAllNoteList = function () {
        noteCard.showNoteList = true;
        $rootScope.$emit('showAllNoteList', true);
    };

    noteCard.closeNoteList = function () {
        noteCard.showNoteList = false;
        $rootScope.$emit('showAllNoteList', false);
    };

    $rootScope.$on("showAddNoteModal", function () {
        noteCard.showAddNoteModal();
    });
});
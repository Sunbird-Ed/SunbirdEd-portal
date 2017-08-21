'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.note:NoteCardCtrl
 * @author Anuj Gupta
 * @description
 * # NoteCardCtrl
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('NoteCardCtrl', ['$rootScope', '$scope', 'noteService', '$timeout',
        '$state', '$stateParams', 'toasterService', function ($rootScope, $scope, noteService,
            $timeout, $state, $stateParams, toasterService) {
            var noteCard = this;
            noteCard.userId = $rootScope.userId;
            noteCard.showNoteCard = $scope.shownotecard;
            noteCard.showModalInLectureView = $scope.shownoteinlecture;
            noteCard.showModalInCourseView = $scope.shownoteincourse;
            noteCard.quantityOfNotes = 2;
            noteCard.courseId = $stateParams.courseId;
            noteCard.contentId = $stateParams.contentId;
            noteCard.contentName = $stateParams.contentName;
            noteCard.add = {};
            noteCard.update = {};
            noteCard.showCreateNote = false;
            noteCard.showUpdateNote = false;
            noteCard.visibility = $scope.visibility;
            noteCard.sortBy = 'desc';
            noteCard.messages = $rootScope.errorMessages.NOTES;

            function searchNote(request) {
                var api = 'searchApi';
                noteCard[api] = {};
                noteCard[api].loader = toasterService.loader('', noteCard.messages.SEARCH.START);

                noteService.search(request).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard[api].loader.showLoader = false;
                        noteCard.notesList = response.result.note || [];
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error(noteCard.messages.SEARCH.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error(noteCard.messages.SEARCH.FAILED);
                });
            }

            $scope.updateContentId = function (contentId) {
                noteCard.contentId = contentId;
            };

            $scope.updateNoteMetaData = function (contentId) {
                noteCard.contentId = contentId;

                var request = {
                    filters: {
                        userId: noteCard.userId,
                        courseId: noteCard.courseId,
                        contentId: noteCard.contentId
                    },
                    sort_by: {
                        lastUpdatedOn: noteCard.sortBy
                    }
                };
                searchNote(request);
            };

            noteCard.hideAddNoteModal = function () {
                $timeout(function () {
                    $('#addNoteModal').modal('hide');
                    $('#addNoteModal').modal('hide dimmer');
                    $('#addNoteModal').modal('hide others');
                }, 0);
            };

            noteCard.createNote = function (noteData) {
                var requestData = {
                    note: {
                        note: noteData.note,
                        userId: noteCard.userId,
                        title: noteData.title,
                        courseId: noteCard.courseId,
                        contentId: noteCard.contentId
                    }
                };

                var api = 'createApi';
                noteCard[api] = {};
                noteCard[api].loader = toasterService.loader('', noteCard.messages.CREATE.START);

                noteService.create(requestData).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard[api].loader.showLoader = false;
                        noteCard.hideAddNoteModal();
                        $rootScope.$emit('updateNotesListData', response.result.note);
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error(noteCard.messages.CREATE.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error(noteCard.messages.CREATE.FAILED);
                });
            };

            noteCard.hideUpdateNoteModal = function () {
                $('#updateNoteModal').modal('hide');
                $('#updateNoteModal').modal('hide others');
                $('#updateNoteModal').modal('hide dimmer');
            };

            noteCard.updateNote = function (noteData) {
                var requestData = {
                    noteId: noteData.identifier,
                    note: noteData
                };

                var api = 'updateApi';
                noteCard[api] = {};
                noteCard[api].loader = toasterService.loader('', noteCard.messages.UPDATE.START);

                noteService.update(requestData).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard.hideUpdateNoteModal();
                        noteCard[api].loader.showLoader = false;
                        $rootScope.$emit('updateNotesListData', response.result.note, true);
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error(noteCard.messages.UPDATE.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error(noteCard.messages.UPDATE.FAILED);
                });
            };

            noteCard.clearUpdateNoteData = function () {
                noteCard.update.metaData.title = '';
                noteCard.update.metaData.note = '';
            };

            noteCard.closeUpdateNoteModal = function () {
                $timeout(function () {
                    noteCard.showUpdateNote = false;
                }, 0);
            };

            noteCard.showUpdateNoteModal = function (note) {
                if ($rootScope.videoElem) {
                    $rootScope.videoElem.pause();
                }
                noteCard.showUpdateNote = true;
                $timeout(function () {
                    $('#updateNoteModal').modal({
                        onShow: function () {
                            noteCard.update.metaData = angular.copy(note);
                        },
                        onHide: function () {
                            noteCard.clearUpdateNoteData();
                            noteCard.closeUpdateNoteModal();
                            return true;
                        }
                    }).modal('show');
                }, 10);
            };

            noteCard.clearAddNoteData = function () {
                noteCard.add.title = '';
                noteCard.add.note = '';
            };

            noteCard.closeAddNoteModal = function () {
                $timeout(function () {
                    noteCard.showCreateNote = false;
                }, 0);
            };

            noteCard.showAddNoteModal = function () {
                noteCard.showCreateNote = true;
                if ($rootScope.videoElem) {
                    $rootScope.videoElem.pause();
                }
                $timeout(function () {
                    $('#addNoteModal').modal({
                        onShow: function () {
                            noteCard.clearAddNoteData();
                        },
                        onHide: function () {
                            noteCard.clearAddNoteData();
                            noteCard.closeAddNoteModal();
                            return true;
                        }
                    }).modal('show');
                }, 10);
            };

            $rootScope.$on('updateNotesListData', function (e, content, status) {
                if (status) {
                    noteCard.notesList = noteCard.notesList.filter(function (note) {
                        return note.identifier !== content.identifier;
                    });
                    noteCard.notesList.push(content);
                } else {
                    noteCard.notesList = noteCard.notesList ? noteCard.notesList : [];
                    noteCard.notesList.push(content);
                }
            });

            noteCard.viewAllNotes = function () {
                var params = {};
                if (noteCard.courseId && noteCard.contentId) {
                    params = {
                        courseId: noteCard.courseId,
                        contentId: noteCard.contentId
                    };
                    $state.go('CourseContentNote', params);
                } else if (noteCard.courseId) {
                    params = {
                        courseId: noteCard.courseId
                    };
                    $state.go('CourseNote', params);
                } else if (noteCard.contentId) {
                    params = {
                        contentId: noteCard.contentId,
                        contentName: noteCard.contentName
                    };
                    $state.go('ContentNote', params);
                }
            };
        }]);

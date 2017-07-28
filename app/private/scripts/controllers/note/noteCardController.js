'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.note:noteCardController
 * @author Anuj Gupta
 * @description
 * # NoteCardCtrls
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
            noteCard.tocId = $stateParams.tocId;
            noteCard.add = {};
            noteCard.update = {};
            noteCard.showCreateNote = false;
            noteCard.showUpdateNote = false;
            noteCard.visibility = $scope.visibility;
            noteCard.sortBy = 'desc';

            function searchNote(request) {
                var api = 'searchApi';
                noteCard[api] = {};
                noteCard[api].loader = toasterService.loader('', $rootScope.errorMessages.NOTES
                                                                .SEARCH.START);

                noteService.search(request).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard[api].loader.showLoader = false;
                        noteCard.notesList = response.result.note || [];
                        if (noteCard.notesList.length === 0) {
                            noteCard.zeroNoteMessage = $rootScope.errorMessages.NOTES.SEARCH
                                                                .NO_RESULT;
                        }
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
                });
            }

            $scope.updateContentId = function (contentId) {
                noteCard.contentId = contentId;
            };

            $scope.updateNoteMetaData = function (contentId) {
                noteCard.contentId = contentId;
                toasterService.loader(true, '', $rootScope.errorMessages.NOTES.SEARCH.START);

                var request = {
                    filters: {
                        userId: noteCard.userId,
                        courseId: noteCard.tocId,
                        contentId: noteCard.contentId
                    },
                    sort_by: {
                        lastUpdatedOn: noteCard.sortBy
                    }
                };
                searchNote(request);
            };

            noteCard.hideAddNoteModal = function () {
                $('#addNoteModal').modal('hide');
                $('#addNoteModal').modal('hide others');
                $('#addNoteModal').modal('hide dimmer');
            };

            noteCard.createNote = function (noteData) {
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
                noteCard[api].loader = toasterService.loader('', $rootScope.errorMessages.NOTES
                                                                            .CREATE.START);

                noteService.create(requestData).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard[api].loader.showLoader = false;
                        noteCard.hideAddNoteModal();
                        $rootScope.$emit('updateNotesListData', response.result.note);
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
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
                noteCard[api].loader = toasterService.loader('', $rootScope.errorMessages.NOTES
                                                                .UPDATE.START);

                noteService.update(requestData).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        noteCard.hideUpdateNoteModal();
                        noteCard[api].loader.showLoader = false;
                        $rootScope.$emit('updateNotesListData', response.result.note, true);
                    } else {
                        noteCard[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
                    }
                }).catch(function () {
                    noteCard[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
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
                if (noteCard.courseId && noteCard.contentId && noteCard.tocId) {
                    params = {
                        courseId: noteCard.courseId,
                        contentId: noteCard.contentId,
                        tocId: noteCard.tocId
                    };
                    $state.go('CourseContentNote', params);
                } else if (noteCard.courseId) {
                    params = {
                        courseId: noteCard.courseId,
                        tocId: noteCard.tocId
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

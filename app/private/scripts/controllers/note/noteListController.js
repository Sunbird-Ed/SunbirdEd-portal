'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.note:NoteListCtrl
 * @author Anuj Gupta
 * @description
 * # NoteListCtrl
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('NoteListCtrl', ['$rootScope', 'noteService', '$state', '$stateParams',
        '$timeout', '$q', 'toasterService', function ($rootScope, noteService, $state,
            $stateParams, $timeout, $q, toasterService) {
            var noteList = this;
            noteList.userId = $rootScope.userId;
            noteList.courseId = $stateParams.courseId;
            noteList.contentId = $stateParams.contentId;
            noteList.contentName = $stateParams.contentName;
            noteList.tocId = $stateParams.tocId;
            noteList.add = {};
            noteList.update = {};
            noteList.update.showUpdateNote = false;
            noteList.add.showCreateNote = false;
            noteList.sortBy = 'desc';
            noteList.successResponseCode = 'OK';

            function searchNote(request) {
                var api = 'searchApi';
                noteList[api] = {};
                noteList[api].loader = toasterService.loader(api, '', $rootScope.errorMessages
                                                                            .NOTES.SEARCH.START);
                noteService.search(request).then(function (response) {
                    if (response && response.responseCode === noteList.successResponseCode) {
                        noteList[api].loader.showLoader = false;
                        noteList.notesList = response.result.note || [];
                        if (!noteList.notesList.length) {
                            noteList.zeroNoteMessage = $rootScope.errorMessages.NOTES.SEARCH
                                                                .NO_RESULT;
                        }
                        noteList.selectedNoteData = noteList.notesList[0];
                    } else {
                        noteList[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
                    }
                }).catch(function () {
                    noteList[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
                });
            }

            noteList.ngInit = function () {
                var request = {
                    filters: {
                        userId: noteList.userId,
                        courseId: noteList.tocId,
                        contentId: noteList.contentId
                    },
                    sort_by: {
                        lastUpdatedOn: noteList.sortBy
                    }
                };
                searchNote(request);
            };

            noteList.createNote = function (noteData) {
                var api = 'createApi';
                noteList[api] = {};
                noteList[api].loader = toasterService.loader(api, '', $rootScope.errorMessages
                                                                            .NOTES.CREATE.START);

                var requestData = {
                    note: {
                        note: noteData.note,
                        userId: noteList.userId,
                        title: noteData.title,
                        courseId: noteList.tocId,
                        contentId: noteList.contentId
                    }
                };

                noteService.create(requestData).then(function (response) {
                    if (response && response.responseCode === noteList.successResponseCode) {
                        noteList.notesList.push(response.result.note);
                        noteList.add.showCreateNote = false;
                        noteList[api].loader.showLoader = false;
                        noteList.add = {};
                        noteList.showNoteList(response.result.note);
                    } else {
                        noteList[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
                    }
                }).catch(function () {
                    noteList[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
                });
            };

            noteList.removeNote = function (noteId) {
                var api = 'removeApi';
                noteList[api] = {};
                noteList[api].loader = toasterService.loader(api, '', $rootScope.errorMessages
                                                                            .NOTES.REMOVE.START);
                var requestData = {
                    noteId: noteId
                };

                noteService.remove(requestData).then(function (response) {
                    if (response && response.responseCode === noteList.successResponseCode) {
                        noteList.hideRemoveNoteModel();
                        noteList.notesList = noteList.notesList.filter(function (note) {
                            return note.identifier !== noteId;
                        });
                        noteList[api].loader.showLoader = false;
                        noteList.showNoteList(noteList.notesList[noteList.notesList.length - 1],
                                                noteList.notesList.length - 1);
                        if (noteList.notesList.length === 0) {
                            noteList.zeroNoteMessage = $rootScope.errorMessages.NOTES.SEARCH
                                                                                .NO_RESULT;
                        }
                    } else {
                        noteList[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.REMOVE.FAILED);
                    }
                }).catch(function () {
                    noteList[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.REMOVE.FAILED);
                });
            };

            noteList.openRemoveNoteModel = function (noteId) {
                noteList.removeNoteId = noteId;
                noteList.showRemoveNoteModel = true;
                $timeout(function () {
                    $('#removeNoteModal').modal({
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

            noteList.updateNote = function (noteData) {
                var requestData = {
                    noteId: noteData.identifier,
                    note: noteData
                };

                var api = 'updateApi';
                noteList[api] = {};
                noteList[api].loader = toasterService.loader(api, '', $rootScope.errorMessages
                                                                            .NOTES.UPDATE.START);

                noteService.update(requestData).then(function (response) {
                    if (response && response.responseCode === noteList.successResponseCode) {
                        noteList.notesList = noteList.notesList.filter(function (note) {
                            return note.identifier !== noteData.identifier;
                        });
                        noteList.notesList.push(response.result.note);
                        noteList[api].loader.showLoader = false;
                        noteList.update = {};
                        noteList.showNoteList(response.result.note);
                    } else {
                        noteList[api].loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
                    }
                }).catch(function () {
                    noteList[api].loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
                });
            };

            noteList.closeNoteList = function () {
                var params = {};
                if (noteList.courseId && noteList.contentId) {
                    params = {
                        tocId: noteList.tocId,
                        courseId: noteList.courseId,
                        contentId: noteList.contentId,
                        lectureView: 'no'
                    };
                    $state.go('Toc', params);
                } else if (noteList.courseId) {
                    params = {
                        tocId: noteList.tocId,
                        courseId: noteList.courseId,
                        lectureView: 'yes'
                    };
                    $state.go('Toc', params);
                } else if (noteList.contentId) {
                    params = {
                        contentId: noteList.contentId,
                        contentName: noteList.contentName
                    };
                    $state.go('Player', params);
                }
            };

            noteList.updateNoteData = function (note) {
                noteList.update.metaData = angular.copy(note);
            };

            noteList.showNoteList = function (note, index) {
                noteList.selectedIndex = index;
                if (noteList.selectedIndex !== '0') {
                    $('#notelistcontent0').removeClass('notelistborder');
                } else {
                    $('#notelistcontent0').addClass('notelistborder');
                }
                noteList.selectedNoteData = note;
            };

            noteList.insertImage = function () {
                var defer = $q.defer();
                noteList.openAddImageModal(function (response) {
                    if (!response) {
                        defer.reject();
                    } else {
                        defer.resolve(response);
                    }
                });
                return defer.promise;
            };

            noteList.openAddImageModal = function (callback) {
                noteList.showAddImageModal = true;
                $('.wmd-prompt-background').css('z-index', 0);
                $('.wmd-prompt-background').css('position', 'initial');
                $timeout(function () {
                    $('#showAddImageModal').modal({
                        onShow: function () {
                            noteList.imageLink = 'http://';
                        },
                        onHide: function () {
                            noteList.showAddImageModal = false;
                            return callback(noteList.imageLink);
                        }
                    }).modal('show');
                }, 10);
            };

            noteList.closeAddImageModal = function (isCancle) {
                if (isCancle) {
                    noteList.imageLink = '';
                }
                $('#showAddImageModal').modal('hide');
                $('#showAddImageModal').modal('hide others');
                $('#showAddImageModal').modal('hide all');
                $('#showAddImageModal').modal('hide dimmer');
            };
        }]);

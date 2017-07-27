'use strict';

angular.module('playerApp').controller('NoteListCtrl', function($rootScope, noteService, config, $state, $stateParams, $timeout, $q, ToasterService) {
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
    noteList.notesList = [];

    function search(request) {
        var api = 'searchApi';
        noteList[api] = {};
        noteList[api].loader = ToasterService.loader(api, '', $rootScope.errorMessages.NOTES.SEARCH.START);

        noteService.search(request).then(function(response) {
            if (response && response.responseCode === 'OK') {
                noteList[api].loader.showLoader = false;
                noteList.notesList = response.result.note || [];
                if (noteList.notesList.length === 0) {
                    noteList.zeroNoteMessage = $rootScope.errorMessages.NOTES.SEARCH.NO_RESULT;
                }
                noteList.selectedNoteData = noteList.notesList[0];
            } else {
                noteList[api].loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
            }
        }).
        catch (function() {
            noteList[api].loader.showLoader = false;
            ToasterService.error($rootScope.errorMessages.NOTES.SEARCH.FAILED);
        });
    }

    noteList.ngInit = function() {
        var request = {
            filters: {
                userId: noteList.userId,
                courseId: noteList.tocId,
                contentId: noteList.contentId
            },
            sort_by: {
                lastUpdatedOn: 'desc'
            }
        };
        search(request);
    };

    noteList.createNote = function(noteData) {
        var api = 'createApi';
        noteList[api] = {};
        noteList[api].loader = ToasterService.loader(api, '', $rootScope.errorMessages.NOTES.CREATE.START);

        var requestData = {
            note: {
                note: noteData.note,
                userId: noteList.userId,
                title: noteData.title,
                courseId: noteList.tocId,
                contentId: noteList.contentId
            }
        };

        noteService.create(requestData).then(function(response) {
            if (response && response.responseCode === 'OK') {
                noteList.notesList.push(response.result.note);
                noteList.add.showCreateNote = false;
                noteList[api].loader.showLoader = false;
                noteList.add = {};
                noteList.showNoteList(response.result.note);
            } else {
                noteList[api].loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
            }
        }).
        catch (function() {
            noteList[api].loader.showLoader = false;
            ToasterService.error($rootScope.errorMessages.NOTES.CREATE.FAILED);
        });
    };

    /**
     * This function helps to create note
     * @param {Object} noteId
     */
    noteList.removeNote = function(noteId) {
        var api = 'searchApi';
        noteList[api] = {};
        noteList[api].loader = ToasterService.loader(api, '', $rootScope.errorMessages.NOTES.REMOVE.START);

        var requestData = {
            noteId: noteId
        };

        noteList.hideRemoveNoteModel();
        noteService.remove(requestData).then(function(response) {
            if (response && response.responseCode === 'OK') {
                noteList.notesList = noteList.notesList.filter(function(note) {
                    return note.identifier !== noteId;
                });
                noteList[api].loader.showLoader = false;
                noteList.showNoteList(noteList.notesList[noteList.notesList.length - 1], noteList.notesList.length - 1);
                if (noteList.notesList.length === 0) {
                    noteList.zeroNoteMessage = $rootScope.errorMessages.NOTES.SEARCH.NO_RESULT;
                }
            } else {
                noteList[api].loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.NOTES.REMOVE.FAILED);
            }
        }).
        catch (function() {
            noteList[api].loader.showLoader = false;
            ToasterService.error($rootScope.errorMessages.NOTES.REMOVE.FAILED);
        });
    };

    noteList.openRemoveNoteModel = function(noteId) {
        noteList.removeNoteId = noteId;
        noteList.showRemoveNoteModel = true;
        $timeout(function() {
            $('#removeNoteModal').modal({
                onShow: function() {},
                onHide: function() {}
            }).modal('show');
        }, 10);
    };

    noteList.hideRemoveNoteModel = function() {
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
    noteList.updateNote = function(noteData) {
        var requestData = {
            noteId: noteData.identifier,
            note: noteData
        };

        var api = 'updateApi';
        noteList[api] = {};
        noteList[api].loader = ToasterService.loader(api, '', $rootScope.errorMessages.NOTES.UPDATE.START);

        noteService.update(requestData).then(function(response) {
            if (response && response.responseCode === 'OK') {
                noteList.notesList = noteList.notesList.filter(function(note) {
                    return note.identifier !== noteData.identifier;
                });
                noteList.notesList.push(response.result.note);
                noteList[api].loader.showLoader = false;
                noteList.update = {};
                noteList.showNoteList(response.result.note);
            } else {
                noteList[api].loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
            }
        }).
        catch (function() {
            noteList[api].loader.showLoader = false;
            ToasterService.error($rootScope.errorMessages.NOTES.UPDATE.FAILED);
        });
    };

    noteList.searchNote = function(searchText) {
        var copyNoteList = angular.copy(noteList.notesList);
        noteList.notesList = searchText ? copyNoteList.filter(noteList.createSearchNoteFilter(searchText)) : noteList.notesList;
    };

    noteList.createSearchNoteFilter = function(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.title.includes(lowercaseQuery) || item.note.includes(lowercaseQuery));
        };
    };

    noteList.closeNoteList = function() {
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

    noteList.updateNoteData = function(note) {
        noteList.update.metaData = angular.copy(note);
    };

    noteList.showNoteList = function(note, index) {
        noteList.selectedIndex = index;
        if (noteList.selectedIndex !== '0') {
            $('#notelistcontent0').removeClass('notelistborder');
        } else {
            $('#notelistcontent0').addClass('notelistborder');
        }
        noteList.selectedNoteData = note;
    };

    noteList.insertImage = function() {
        var defer = $q.defer();
        noteList.openAddImageModal(function(response) {
            if (!response) {
                defer.reject();
            } else {
                defer.resolve(response);
            }
        });
        return defer.promise;
    };

    noteList.openAddImageModal = function(callback) {
        noteList.showAddImageModal = true;
        $('.wmd-prompt-background').css('z-index', 0);
        $('.wmd-prompt-background').css('position', 'initial');
        $timeout(function() {
            $('#showAddImageModal').modal({
                onShow: function() {
                    noteList.imageLink = 'http://';
                },
                onHide: function() {
                    noteList.showAddImageModal = false;
                    return callback(noteList.imageLink);
                }
            }).modal('show');
        }, 10);
    };

    noteList.closeAddImageModal = function(isCancle) {
        if (isCancle) {
            noteList.imageLink = '';
        }
        $('#showAddImageModal').modal('hide');
        $('#showAddImageModal').modal('hide others');
        $('#showAddImageModal').modal('hide all');
        $('#showAddImageModal').modal('hide dimmer');
    };
});
/**
 * name: noteListController
 * author: Anuj Gupta
 * Date: 23-09-2017
 */

'use strict';

describe('Controller: NoteListCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var userNotesSuccess = {
        id: '',
        ver: '',
        ts: '2017-09-23 18:06:03:821+0000',
        params: {
            resmsgid: null,
            msgid: '21263be3-befb-4e8a-9040-07b170fe7439',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {
            response: {
                count: 7,
                note: [{
                    note: 'Test',
                    identifier: '01233623626456268818',
                    updatedBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
                    createdDate: '2017-09-20 06:15:07:401+0000',
                    createdBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
                    contentId: 'do_2123215064116756481869',
                    id: '01233623626456268818',
                    updatedDate: '2017-09-20 06:15:07:401+0000',
                    title: 'Test',
                    userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6'
                }, {
                    note: 'Test update',
                    identifier: '0123362158323384320',
                    createdDate: '2017-09-20 05:24:03:013+0000',
                    updatedBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
                    createdBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
                    contentId: 'do_2123215064116756481869',
                    id: '0123362158323384320',
                    updatedDate: '2017-09-20 05:24:15:166+0000',
                    title: 'Test',
                    userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6'
                }, {
                    note: 'My notes 3',
                    identifier: '0123362128603217920',
                    createdDate: '2017-09-20 05:21:22:358+0000',
                    contentId: 'do_2123215064116756481869',
                    id: '0123362128603217920',
                    updatedDate: '2017-09-20 05:21:22:358+0000',
                    title: ' title 3 without tag',
                    userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6'
                }]
            }
        }
    };
    var userNotesFailed = {
        id: 'api.notes.get',
        ver: '1.0',
        ts: '2017-05-29T08:27:23.675Z',
        params: {
            resmsgid: 'a3eea6b0-4448-11e7-a70e-5760c232cdfc',
            msgid: null,
            status: 'failed',
            err: 'ERR_NOTE_GET_FAILED',
            errmsg: 'Get note detail failed'
        },
        responseCode: 'RESOURCE_NOT_FOUND',
        result: {}
    };

    var createNoteFailed = {
        id: 'api.note.create',
        ver: 'v1',
        ts: '2017-09-23 18:27:21:246+0000',
        params: {
            resmsgid: null,
            msgid: 'f2196ea1-c326-415d-b094-ae528830623d',
            err: 'CONTENT_ID_OR_COURSE_ID_REQUIRED',
            status: 'CONTENT_ID_OR_COURSE_ID_REQUIRED',
            errmsg: 'Please provide content id or course id'
        },
        responseCode: 'CLIENT_ERROR',
        result: {}
    };

    var createNoteSuccess = {
        id: '',
        ver: '',
        ts: '2017-09-23 18:28:52:350+0000',
        params: {
            resmsgid: null,
            msgid: '17bee712-7a81-44b8-bd94-97d114f38bcb',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {
            id: '01233872295157760017'
        }
    };

    var removeNoteSuccess = {
        id: '',
        ver: '',
        ts: '2017-09-23 18:33:23:643+0000',
        params: {
            resmsgid: null,
            msgid: '09add251-82e3-4405-8068-20594fb32dc8',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {}
    };

    var removeNoteFailed = {
        id: 'api.note.delete',
        ver: 'v1',
        ts: '2017-09-23 18:34:53:297+0000',
        params: {
            resmsgid: null,
            msgid: 'ea3a60c8-7fd5-4852-9e3a-91fdae40ed74',
            err: 'NOTE_ID_INVALID',
            status: 'NOTE_ID_INVALID',
            errmsg: 'Invalid note id'
        },
        responseCode: 'CLIENT_ERROR',
        result: {}
    };

    var updateNoteSuccess = {
        id: 'api.note.update',
        ver: 'v1',
        ts: '2017-09-23 18:33:23:643+0000',
        params: {
            resmsgid: null,
            msgid: '09add251-82e3-4405-8068-20594fb32dc8',
            err: null,
            status: 'success',
            errmsg: null
        },
        responseCode: 'OK',
        result: {}
    };

    var updateNoteFailed = {
        id: 'api.note.update',
        ver: 'v1',
        ts: '2017-09-23 18:34:53:297+0000',
        params: {
            resmsgid: null,
            msgid: 'ea3a60c8-7fd5-4852-9e3a-91fdae40ed74',
            err: 'NOTE_ID_INVALID',
            status: 'NOTE_ID_INVALID',
            errmsg: 'Invalid note id'
        },
        responseCode: 'CLIENT_ERROR',
        result: {}
    };

    var noteService,
        scope,
        rootScope,
        noteList,
        $q,
        deferred,
        timeout,
        errorMessage;

    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        });
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _noteService_, _$q_, _$timeout_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        noteService = _noteService_;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();
        noteList = $controller('NoteListCtrl', {
            $rootScope: rootScope,
            $scope: scope,
            noteService: noteService,
            courseId: "53453453"
        });
    }));

    describe('Search note service', function() {
        it('Should called search service', function () {
            spyOn(noteService, 'search').and.callThrough();
            noteService.search();
            expect(noteService.search).toBeDefined();
        });

        it('failed due to invalid request', function(done) {
            spyOn(noteService, 'search').and.returnValue(deferred.promise);
            deferred.resolve(userNotesFailed);
            spyOn(noteList, 'getAllNotes').and.callThrough();
            noteList.getAllNotes();
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
            done();
        });

        it('failed due to external error', function() {
            spyOn(noteService, 'search').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(noteList, 'getAllNotes').and.callThrough();
            noteList.getAllNotes();
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('success', function() {
            spyOn(noteService, 'search').and.returnValue(deferred.promise);
            deferred.resolve(userNotesSuccess);
            spyOn(noteList, 'getAllNotes').and.callThrough();
            noteList.getAllNotes();
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
            noteList.noteList = response.result.response.note;
            expect(noteList.noteList).not.toBe(undefined);
        });
    });

    describe('Create note', function() {
        it('called ', function () {
            var note = {
                note: "Test",
                userId: "4234234234",
                title: "Test",
                courseId: "2342323423",
                contentId: "w2323423423423"
            };
            spyOn(noteService, 'create').and.callThrough();
            noteService.create(note);
            expect(noteService.create).toBeDefined();
        });

        it('success', function() {
            var note = {
                note: "Test",
                userId: "4234234234",
                title: "Test",
                courseId: "2342323423",
                contentId: "w2323423423423"
            };

            spyOn(noteService, 'create').and.returnValue(deferred.promise);
            deferred.resolve(createNoteSuccess);
            spyOn(noteList, 'createNote').and.callThrough();
            noteList.createNote(note);
            note.createdBy = new Date();
            note.updatedBy = new Date();
            spyOn(noteList, 'showNoteList').and.callThrough();
            noteList.showNoteList(note);
            scope.$apply();
            var response = noteService.create().$$state.value;
            expect(response.result).not.toBe(undefined);
        });

        it('failed due to missing required field', function() {
            var note = {
                title: 'test title',
                note: 'test note'
            };

            spyOn(noteService, 'create').and.returnValue(deferred.promise);
            deferred.resolve(createNoteFailed);
            spyOn(noteList, 'createNote').and.callThrough();
            noteList.createNote(note);
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.create().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('failed due to external error', function() {
            var note = {
                title: 'test title',
                note: 'test note'
            };
            spyOn(noteService, 'create').and.returnValue(deferred.promise);
            deferred.reject();
            spyOn(noteList, 'createNote').and.callThrough();
            noteList.createNote(note);
            timeout.flush(2000);
            scope.$apply();
        });
    });

    describe('Remove note', function() {
        it('Should open remove note modal', function() {
            spyOn(noteList, 'openRemoveNoteModel').and.callThrough();
            noteList.openRemoveNoteModel('01233872295157760017');
            timeout.flush(10);
            scope.$apply();
        });

        it('Should called remove service', function() {
            spyOn(noteService, 'remove').and.callThrough();
            noteService.remove('01233872295157760017');
            expect(noteService.remove).toBeDefined();
        });

        it('Should remove note', function() {
            spyOn(noteService, 'remove').and.returnValue(deferred.promise);
            deferred.resolve(removeNoteSuccess);
            spyOn(noteList, 'removeNote').and.callThrough();
            noteList.removeNote('01233872295157760017');
            scope.$apply();
            var response = noteService.remove().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Should not remove due to invalid node id', function() {
            spyOn(noteService, 'remove').and.returnValue(deferred.promise);
            deferred.resolve(removeNoteFailed);
            spyOn(noteList, 'removeNote').and.callThrough();
            noteList.removeNote('0123387229515776001');
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.remove().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Should failed due to external error', function() {
            spyOn(noteService, 'create').and.returnValue(deferred.promise);
            deferred.reject();
            spyOn(noteList, 'removeNote').and.callThrough();
            noteList.removeNote();
            timeout.flush(2000);
            scope.$apply();
        });
    });

    describe('Update note', function() {

        var requestData = {
            noteId: "592ab407693f230bbd2e287b",
            request: {
                note: "Test",
                userId: "4234234234",
                title: "Test",
                courseId: "2342323423",
                contentId: "w2323423423423"
            }
        };

        it('failed due to invalid id', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.resolve(updateNoteFailed);
            spyOn(noteList, 'updateNote').and.callThrough();
            noteList.updateNote('592ab407693f230bbd2e287b');
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.update().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('failed due to external error', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.reject();
            spyOn(noteList, 'updateNote').and.callThrough();
            noteList.updateNote(requestData);
            timeout.flush(2000);
            scope.$apply();
        });

        it('success', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.resolve(updateNoteSuccess);
            spyOn(noteList, 'updateNote').and.callThrough();
            noteList.updateNote(requestData);
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.update().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Close note list", function() {
        it('with course id', function() {
            spyOn(noteList, 'closeNoteList').and.callThrough();
            noteList.closeNoteList();
        });

        it('with content id', function() {
            spyOn(noteList, 'closeNoteList').and.callThrough();
            noteList.closeNoteList({
                contentId: "53534534",
            });
        });

        it('with course id and content id', function() {
            spyOn(noteList, 'closeNoteList').and.callThrough();
            noteList.closeNoteList({
                contentId: "53534534",
                courseId: "53453453"
            });
        });
    });

    it('Should called open remove note modal', function() {
        spyOn(noteList, 'openRemoveNoteModel').and.callThrough();
        noteList.openRemoveNoteModel();
        timeout.flush(10);
        expect(noteList.showRemoveNoteModel).toBe(true);
    });

    it('Should called open remove note modal', function() {
        spyOn(noteList, 'hideRemoveNoteModel').and.callThrough();
        noteList.hideRemoveNoteModel();
        expect(noteList.showRemoveNoteModel).toBe(false);
    });

    it('Should called insert image', function() {
        spyOn(noteList, 'insertImage').and.callThrough();
        noteList.insertImage();
    });

    it('Should called update note data', function() {
        spyOn(noteList, 'updateNoteData').and.callThrough();
        noteList.updateNoteData();
    });

    it('Should called show note note', function() {
        spyOn(noteList, 'showNoteList').and.callThrough();
        noteList.showNoteList({}, 0);
        scope.$apply();
    });

    it('Should called insert image', function() {
        spyOn(noteList, 'openAddImageModal').and.callThrough();
        noteList.openAddImageModal();
        timeout.flush(10);
        expect(noteList.showAddImageModal).toBe(true);
    });

    it('Should called close image model', function() {
        spyOn(noteList, 'closeAddImageModal').and.callThrough();
        noteList.closeAddImageModal(true);
        timeout.flush(10);
        // expect(noteList.closeAddImageModal).toBe(true);
    });
});
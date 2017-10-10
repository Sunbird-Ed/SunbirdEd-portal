/**
 * name: noteCardController
 * author: Anuj Gupta
 * Date: 23-09-2017
 */

'use strict';

describe('Controller: NoteCardCtrl', function() {
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
        noteCard,
        $q,
        deferred,
        timeout,
        stateParams;

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
        stateParams = { contentId: '12123123124324', courseId : '12123123124324' };

        rootScope.userId = "rwerwerwerw";
        noteCard = $controller('NoteCardCtrl', {
            $rootScope: rootScope,
            $scope: scope,
            noteService: noteService,
            $stateParams: stateParams
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
            spyOn(scope, 'updateNoteMetaData').and.callThrough();
            scope.updateNoteMetaData('12123123124324');
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
            done();
        });

        it('failed due to external error', function(done) {
            spyOn(noteService, 'search').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(scope, 'updateNoteMetaData').and.callThrough();
            scope.updateNoteMetaData('12123123124324');
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
            done();
        });

        it('success', function(done) {
            spyOn(noteService, 'search').and.returnValue(deferred.promise);
            deferred.resolve(userNotesSuccess);
            spyOn(scope, 'updateNoteMetaData').and.callThrough();
            scope.updateNoteMetaData('12123123124324');
            scope.$apply();
            var response = noteService.search().$$state.value;
            expect(response).not.toBe(undefined);
            done();
        });
    });

    it("Should update content id", function() {
        var contentId  = '12123123124324';
        spyOn(scope, 'updateContentId').and.callThrough();
        scope.updateContentId(contentId);
        expect(noteCard.contentId).toBe(contentId);
    });

    it("Should open and close add image model", function() {
        spyOn(noteCard, 'insertImage').and.callThrough();
        noteCard.insertImage();
        spyOn(noteCard, 'openAddImageModal').and.callThrough();
        noteCard.openAddImageModal(function(err, res) {
            if(err) {

            }
        } );
        timeout.flush(10);
        noteCard.showCreateNote = true;
        spyOn(noteCard, 'closeAddImageModal').and.callThrough();
        noteCard.closeAddImageModal(true);
    });

    it("Should close model with update note", function() {
        noteCard.showCreateNote = false;
        noteCard.showUpdateNote = true;
        spyOn(noteCard, 'closeAddImageModal').and.callThrough();
        noteCard.closeAddImageModal(false);

        // spyOn(noteCard, 'insertImage').and.returnValue(deferred.promise);
        // deferred.resolve(userNotesSuccess);
    });

    it('Should call view all notes with course and content', function(done) {
        spyOn(noteCard, 'viewAllNotes').and.callThrough();
        noteCard.viewAllNotes();
        done();
    });

    it('Should call view all notes with course', function(done) {
        noteCard.contentId = '';
        spyOn(noteCard, 'viewAllNotes').and.callThrough();
        noteCard.viewAllNotes();
        done();
    });

    it('Should call view all notes with content', function(done) {
        noteCard.courseId = '';
        spyOn(noteCard, 'viewAllNotes').and.callThrough();
        noteCard.viewAllNotes();
        done();
    });

    it("Should open create model", function() {
        spyOn(noteCard, 'showAddNoteModal').and.callThrough();
        noteCard.showAddNoteModal();
        timeout.flush(10);
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
            spyOn(noteCard, 'createNote').and.callThrough();
            noteCard.createNote(note);
            note.createdBy = new Date();
            note.updatedBy = new Date();
            scope.$apply();
            var response = noteService.create().$$state.value;
            expect(response.result).not.toBe(undefined);
        });

        it('failed due to missing required field', function() {
            var note = {
                note: "Test",
                userId: "4234234234",
                title: "Test",
            };

            spyOn(noteService, 'create').and.returnValue(deferred.promise);
            deferred.resolve(createNoteFailed);
            spyOn(noteCard, 'createNote').and.callThrough();
            noteCard.createNote(note);
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
            spyOn(noteCard, 'createNote').and.callThrough();
            noteCard.createNote(note);
            timeout.flush(2000);
            scope.$apply();
        });

        it('failed due to invalid request', function(done) {
            spyOn(noteCard, 'hideAddNoteModal').and.callThrough();
            noteCard.hideAddNoteModal();
            timeout.flush(0);
            done();
        });

        it("Should clear and close add model", function() {
            noteCard.add.metaData = {note: "note", title: "title"};
            spyOn(noteCard, 'clearAddNoteData').and.callThrough();
            noteCard.clearAddNoteData();
            spyOn(noteCard, 'closeAddNoteModal').and.callThrough();
            noteCard.closeAddNoteModal();
            timeout.flush(0);
        });
    });

    it("Should open update model", function() {
        spyOn(noteCard, 'showUpdateNoteModal').and.callThrough();
        noteCard.showUpdateNoteModal();
        timeout.flush(10);
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

        it('Should called search service', function () {
            spyOn(noteService, 'update').and.callThrough();
            noteService.update(requestData);
            expect(noteService.update).toBeDefined();
        });


        it('failed due to invalid id', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.resolve(updateNoteFailed);
            spyOn(noteCard, 'updateNote').and.callThrough();
            noteCard.updateNote(requestData);
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.update().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('failed due to external error', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.reject();
            spyOn(noteCard, 'updateNote').and.callThrough();
            noteCard.updateNote(requestData);
            timeout.flush(2000);
            scope.$apply();
        });

        it('success', function() {
            spyOn(noteService, 'update').and.returnValue(deferred.promise);
            deferred.resolve(updateNoteSuccess);
            spyOn(noteCard, 'updateNote').and.callThrough();
            noteCard.updateNote(requestData);
            timeout.flush(2000);
            scope.$apply();
            var response = noteService.update().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it("Should clear and close update model", function() {
            noteCard.update.metaData = {note: "note", title: "title"};
            spyOn(noteCard, 'clearUpdateNoteData').and.callThrough();
            noteCard.clearUpdateNoteData();
            spyOn(noteCard, 'closeUpdateNoteModal').and.callThrough();
            noteCard.closeUpdateNoteModal();
            timeout.flush(0);
        });
    });


    
});
'use strict';
describe('Controller: NoteCtrl', function() {

    // load the controller's module
    beforeEach(module('playerApp'));
    var userNotesSuccessData = { "id": "api.notes.search", "ver": "1.0", "ts": "2017-05-29T08:23:35.228Z", "params": { "resmsgid": "1bc467c0-4448-11e7-a70e-5760c232cdfc", "msgid": "1bc13370-4448-11e7-a70e-5760c232cdfc", "status": "successful", "err": null, "errmsg": null }, "responseCode": "OK", "result": { "count": 3, "note": [{ "userId": "1234567", "courseId": "do_11225192024707891216", "note": "Note new", "title": "Title new", "lastUpdatedOn": "2017-05-29T04:16:43.124Z", "createdOn": "2017-05-29T04:16:43.124Z", "tags": [], "identifier": "592ba0aba7358b153cc760a2" }, { "userId": "1234567", "courseId": "12345678", "note": "note", "title": "title", "lastUpdatedOn": "2017-05-28T17:00:58.499Z", "createdOn": "2017-05-28T17:00:58.499Z", "tags": [], "identifier": "592b024a693f230bbd2e287c" }, { "userId": "1234567", "courseId": "do_11225192024707891216", "note": "My notes", "title": "Title", "lastUpdatedOn": "2017-05-28T11:27:03.704Z", "createdOn": "2017-05-28T11:27:03.704Z", "tags": [], "identifier": "592ab407693f230bbd2e287b" }] } };
    var userNotesFailedData = { "id": "api.notes.get", "ver": "1.0", "ts": "2017-05-29T08:27:23.675Z", "params": { "resmsgid": "a3eea6b0-4448-11e7-a70e-5760c232cdfc", "msgid": null, "status": "failed", "err": "ERR_NOTE_GET_FAILED", "errmsg": "Get note detail failed" }, "responseCode": "RESOURCE_NOT_FOUND", "result": {} };

    var createNoteSuccessData = { "id": "api.notes.create", "ver": "1.0", "ts": "2017-05-29T08:35:26.235Z", "params": { "resmsgid": "c38f76b0-4449-11e7-a70e-5760c232cdfc", "msgid": "c38823b0-4449-11e7-a70e-5760c232cdfc", "status": "successful", "err": null, "errmsg": null }, "responseCode": "OK", "result": { "note": { "userId": "1234567", "courseId": "12345678", "note": "test note", "title": "test title", "lastUpdatedOn": "2017-05-29T08:35:26.190Z", "createdOn": "2017-05-29T08:35:26.190Z", "tags": [], "identifier": "592bdd4e56c5e44194d4183a" } } };
    var createNoteFailedData = { "id": "api.notes.create", "ver": "1.0", "ts": "2017-05-29T08:36:07.909Z", "params": { "resmsgid": "dc666951-4449-11e7-a70e-5760c232cdfc", "msgid": null, "status": "failed", "err": "ERR_NOTE_CREATE_FIELDS_MISSING", "errmsg": "Required fields for create notes are missing" }, "responseCode": "CLIENT_ERROR", "result": {} };

    var removeNoteSuccessData = { "id": "api.notes.delete", "ver": "1.0", "ts": "2017-05-29T08:45:59.653Z", "params": { "resmsgid": "3d1b6150-444b-11e7-a70e-5760c232cdfc", "msgid": "3d1a9e00-444b-11e7-a70e-5760c232cdfc", "status": "successful", "err": null, "errmsg": null }, "responseCode": "OK", "result": {} };
    var removeNoteFailedData = { "id": "api.notes.delete", "ver": "1.0", "ts": "2017-05-29T08:45:15.449Z", "params": { "resmsgid": "22c26290-444b-11e7-a70e-5760c232cdfc", "msgid": null, "status": "failed", "err": "ERR_NOTE_DELETE_FAILED", "errmsg": "Delete note failed" }, "responseCode": "RESOURCE_NOT_FOUND", "result": {} };

    var updateNoteSuccessData = { "id": "api.notes.delete", "ver": "1.0", "ts": "2017-05-29T08:45:59.653Z", "params": { "resmsgid": "3d1b6150-444b-11e7-a70e-5760c232cdfc", "msgid": "3d1a9e00-444b-11e7-a70e-5760c232cdfc", "status": "successful", "err": null, "errmsg": null }, "responseCode": "OK", "result": {} };
    var updateNoteFailedData = { "id": "api.notes.update", "ver": "1.0", "ts": "2017-05-29T09:17:18.637Z", "params": { "resmsgid": "9d1195d1-444f-11e7-a70e-5760c232cdfc", "msgid": null, "status": "failed", "err": "ERR_NOTE_UPDATE_FIELDS_MISSING", "errmsg": "Required fields for update note are missing" }, "responseCode": "CLIENT_ERROR", "result": {} };


    var noteService, scope, $q, deferred, timeout;
    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _noteService_, _$q_, _$timeout_) {
        scope = $rootScope.$new();
        noteService = _noteService_;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();
        $controller('NoteCtrl', {
            $scope: scope,
            noteService: noteService,
            noteList: scope.noteList
        });
    }));

    it("Shouls initialize ui component", function() {

        spyOn(scope, "initializeUIComponent").and.callThrough();
        scope.initializeUIComponent();
        timeout.flush(1000);
        scope.$apply();
    });

    it("Shouls not search success user notes", function() {

        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.resolve(userNotesFailedData);
        spyOn(scope, "ngInit").and.callThrough();
        scope.ngInit();
        timeout.flush(2000);
        scope.$apply();
        var response = noteService.search().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it('Should search user notes', function() {
        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.resolve(userNotesSuccessData);
        spyOn(scope, "ngInit").and.callThrough();
        scope.ngInit();
        scope.$apply();
        var response = noteService.search().$$state.value;
        scope.noteList = response.result.note;
        expect(response).not.toBe(undefined);
    });

    it("Should failed search note due to external error", function() {

        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.reject();
        spyOn(scope, "ngInit").and.callThrough();
        scope.ngInit();
        timeout.flush(2000);
        scope.$apply();
    });

    it("Should create note", function() {

        var note = {
            title: "test title",
            note: "test note"
        };

        spyOn(noteService, 'create').and.returnValue(deferred.promise);
        deferred.resolve(createNoteSuccessData);
        spyOn(scope, "createNote").and.callThrough();
        scope.createNote(note);
        scope.$apply();
        var response = noteService.create().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should not create note", function() {

        var note = {
            title: "test title",
            note: "test note"
        };

        spyOn(noteService, 'create').and.returnValue(deferred.promise);
        deferred.resolve(createNoteFailedData);
        spyOn(scope, "createNote").and.callThrough();
        scope.createNote(note);
        timeout.flush(2000);
        scope.$apply();
        var response = noteService.create().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should failed create note due to external error", function() {
        var note = {
            title: "test title",
            note: "test note"
        };
        spyOn(noteService, 'create').and.returnValue(deferred.promise);
        deferred.reject();
        spyOn(scope, "createNote").and.callThrough();
        scope.createNote(note);
        timeout.flush(2000);
        scope.$apply();
    });

    it("Should remove user note", function() {
        //        scope.noteList = userNotesSuccessData.result.note;
        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.resolve(userNotesSuccessData);
        spyOn(scope, "ngInit").and.callThrough();
        scope.ngInit();
        scope.$apply();
        spyOn(noteService, 'remove').and.returnValue(deferred.promise);
        deferred.resolve(removeNoteSuccessData);
        spyOn(scope, "removeNote").and.callThrough();
        scope.removeNote("592ab407693f230bbd2e287b");
        scope.$apply();
        var response = noteService.remove().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should not remove user note", function() {

        spyOn(noteService, 'remove').and.returnValue(deferred.promise);
        deferred.resolve(removeNoteFailedData);
        spyOn(scope, "removeNote").and.callThrough();
        scope.removeNote("592ab407693f230bbd2e287b");
        timeout.flush(2000);
        scope.$apply();
        var response = noteService.remove().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should failed remove note due to external error", function() {

        spyOn(noteService, 'remove').and.returnValue(deferred.promise);
        deferred.reject();
        spyOn(scope, "removeNote").and.callThrough();
        scope.removeNote("592ab407693f230bbd2e287b");
        timeout.flush(2000);
        scope.$apply();
    });

    it("Should update user note", function() {

        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.resolve(userNotesSuccessData);
        spyOn(scope, "ngInit").and.callThrough();
        scope.ngInit();
        scope.$apply();
        spyOn(noteService, 'update').and.returnValue(deferred.promise);
        deferred.resolve(updateNoteSuccessData);
        spyOn(scope, "updateNote").and.callThrough();
        scope.updateNote("592ab407693f230bbd2e287b");
        scope.$apply();
        var response = noteService.update().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should not update user note", function() {

        spyOn(noteService, 'update').and.returnValue(deferred.promise);
        deferred.resolve(updateNoteFailedData);
        spyOn(scope, "updateNote").and.callThrough();
        scope.updateNote("592ab407693f230bbd2e287b");
        timeout.flush(2000);
        scope.$apply();
        var response = noteService.update().$$state.value;
        expect(response).not.toBe(undefined);
    });

    it("Should failed update note due to external error", function() {

        spyOn(noteService, 'update').and.returnValue(deferred.promise);
        deferred.reject();
        spyOn(scope, "updateNote").and.callThrough();
        scope.updateNote("592ab407693f230bbd2e287b");
        timeout.flush(2000);
        scope.$apply();
    });

    it('Should search user notes with query', function() {
        spyOn(noteService, 'search').and.returnValue(deferred.promise);
        deferred.resolve(userNotesSuccessData);
        spyOn(scope, "searchNote").and.callThrough();
        scope.searchNote();
        scope.$apply();
        var response = noteService.search().$$state.value;
        scope.noteList = response.result.note;
        expect(response).not.toBe(undefined);
    });
});

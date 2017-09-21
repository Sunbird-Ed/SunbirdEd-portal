'use strict';

describe('Controller: NoteListCtrl', function () {
    // load the controller's module
    beforeEach(module('playerApp'));
    var userNotesSuccessData = { id: 'api.notes.search', ver: '1.0', ts: '2017-05-29T08:23:35.228Z', params: { resmsgid: '1bc467c0-4448-11e7-a70e-5760c232cdfc', msgid: '1bc13370-4448-11e7-a70e-5760c232cdfc', status: 'successful', err: null, errmsg: null }, responseCode: 'OK', result: { count: 3, note: [{ userId: '1234567', courseId: 'do_11225192024707891216', note: 'Note new', title: 'Title new', lastUpdatedOn: '2017-05-29T04:16:43.124Z', createdOn: '2017-05-29T04:16:43.124Z', tags: [], identifier: '592ba0aba7358b153cc760a2' }, { userId: '1234567', courseId: '12345678', note: 'note', title: 'title', lastUpdatedOn: '2017-05-28T17:00:58.499Z', createdOn: '2017-05-28T17:00:58.499Z', tags: [], identifier: '592b024a693f230bbd2e287c' }, { userId: '1234567', courseId: 'do_11225192024707891216', note: 'My notes', title: 'Title', lastUpdatedOn: '2017-05-28T11:27:03.704Z', createdOn: '2017-05-28T11:27:03.704Z', tags: [], identifier: '592ab407693f230bbd2e287b' }] } };
    var userNotesFailedData = { id: 'api.notes.get', ver: '1.0', ts: '2017-05-29T08:27:23.675Z', params: { resmsgid: 'a3eea6b0-4448-11e7-a70e-5760c232cdfc', msgid: null, status: 'failed', err: 'ERR_NOTE_GET_FAILED', errmsg: 'Get note detail failed' }, responseCode: 'RESOURCE_NOT_FOUND', result: {} };

    var noteService,
        scope,
        rootScope,
        noteList,
        $q,
        deferred,
        timeout,
        errorMessage;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $controller, _noteService_, _$q_, _$timeout_, _errorMessages_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        noteService = _noteService_;
        errorMessage = _errorMessages_;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();
        rootScope.errorMessage = errorMessage;
        $controller('NoteListCtrl', {
            rootScope: rootScope,
            scope: scope,
            noteService: noteService,
            noteList: scope.noteList
        });
    }));

    // it('Should called search service', function () {
    //     spyOn(noteService, 'search').and.callThrough();
    //     noteService.search();
    //     expect(noteService.search).toBeDefined();
    // });
});

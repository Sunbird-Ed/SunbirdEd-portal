/**
 * name: noteListController
 * author: Anuj Gupta
 * Date: 23-09-2017
 */

'use strict'

describe('Controller: NoteListCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var noteService,
    scope,
    rootScope,
    noteList,
    $q,
    deferred,
    timeout,
    notesTestData = testData.notes

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _noteService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    noteService = _noteService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    noteList = $controller('NoteListCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      noteService: noteService,
      courseId: '53453453'
    })
  }))

  describe('Search note service', function () {
    it('Should called search service', function () {
      spyOn(noteService, 'search').and.callThrough()
      noteService.search()
      expect(noteService.search).toBeDefined()
    })

    it('failed due to invalid request', function (done) {
      spyOn(noteService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.userNotesFailed)
      spyOn(noteList, 'getAllNotes').and.callThrough()
      noteList.getAllNotes()
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('failed due to external error', function () {
      spyOn(noteService, 'search').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(noteList, 'getAllNotes').and.callThrough()
      noteList.getAllNotes()
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('success', function () {
      spyOn(noteService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.userNotesSuccess)
      spyOn(noteList, 'getAllNotes').and.callThrough()
      noteList.getAllNotes()
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
      noteList.noteList = response.result.response.note
      expect(noteList.noteList).not.toBe(undefined)
    })
  })

  describe('Create note', function () {
    it('called ', function () {
      var note = {
        note: 'Test',
        userId: '4234234234',
        title: 'Test',
        courseId: '2342323423',
        contentId: 'w2323423423423'
      }
      spyOn(noteService, 'create').and.callThrough()
      noteService.create(note)
      expect(noteService.create).toBeDefined()
    })

    it('success', function () {
      var note = {
        note: 'Test',
        userId: '4234234234',
        title: 'Test',
        courseId: '2342323423',
        contentId: 'w2323423423423'
      }

      spyOn(noteService, 'create').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.createNoteSuccess)
      spyOn(noteList, 'createNote').and.callThrough()
      noteList.createNote(note)
      note.createdBy = new Date()
      note.updatedBy = new Date()
      spyOn(noteList, 'showNoteList').and.callThrough()
      noteList.showNoteList(note)
      scope.$apply()
      var response = noteService.create().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('failed due to missing required field', function () {
      var note = {
        title: 'test title',
        note: 'test note'
      }

      spyOn(noteService, 'create').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.createNoteFailed)
      spyOn(noteList, 'createNote').and.callThrough()
      noteList.createNote(note)
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.create().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      var note = {
        title: 'test title',
        note: 'test note'
      }
      spyOn(noteService, 'create').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(noteList, 'createNote').and.callThrough()
      noteList.createNote(note)
      timeout.flush(2000)
      scope.$apply()
    })
  })

  describe('Remove note', function () {
    it('Should open remove note modal', function () {
      spyOn(noteList, 'openRemoveNoteModel').and.callThrough()
      noteList.openRemoveNoteModel('01233872295157760017')
      timeout.flush(10)
      scope.$apply()
    })

    it('Should called remove service', function () {
      spyOn(noteService, 'remove').and.callThrough()
      noteService.remove('01233872295157760017')
      expect(noteService.remove).toBeDefined()
    })

    it('Should remove note', function () {
      spyOn(noteService, 'remove').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.removeNoteSuccess)
      spyOn(noteList, 'removeNote').and.callThrough()
      noteList.removeNote('01233872295157760017')
      scope.$apply()
      var response = noteService.remove().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Should not remove due to invalid node id', function () {
      spyOn(noteService, 'remove').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.removeNoteFailed)
      spyOn(noteList, 'removeNote').and.callThrough()
      noteList.removeNote('0123387229515776001')
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.remove().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Should failed due to external error', function () {
      spyOn(noteService, 'create').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(noteList, 'removeNote').and.callThrough()
      noteList.removeNote()
      timeout.flush(2000)
      scope.$apply()
    })
  })

  describe('Update note', function () {
    var requestData = {
      noteId: '592ab407693f230bbd2e287b',
      request: {
        note: 'Test',
        userId: '4234234234',
        title: 'Test',
        courseId: '2342323423',
        contentId: 'w2323423423423'
      }
    }

    it('failed due to invalid id', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.updateNoteFailed)
      spyOn(noteList, 'updateNote').and.callThrough()
      noteList.updateNote('592ab407693f230bbd2e287b')
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.update().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(noteList, 'updateNote').and.callThrough()
      noteList.updateNote(requestData)
      timeout.flush(2000)
      scope.$apply()
    })

    it('success', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.updateNoteSuccess)
      spyOn(noteList, 'updateNote').and.callThrough()
      noteList.updateNote(requestData)
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.update().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Close note list', function () {
    it('with course id', function () {
      spyOn(noteList, 'closeNoteList').and.callThrough()
      noteList.closeNoteList()
    })

    it('with content id', function () {
      spyOn(noteList, 'closeNoteList').and.callThrough()
      noteList.closeNoteList({
        contentId: '53534534'
      })
    })

    it('with course id and content id', function () {
      spyOn(noteList, 'closeNoteList').and.callThrough()
      noteList.closeNoteList({
        contentId: '53534534',
        courseId: '53453453'
      })
    })
  })

  it('Should called open remove note modal', function () {
    spyOn(noteList, 'openRemoveNoteModel').and.callThrough()
    noteList.openRemoveNoteModel()
    timeout.flush(10)
    expect(noteList.showRemoveNoteModel).toBe(true)
  })

  it('Should called open remove note modal', function () {
    spyOn(noteList, 'hideRemoveNoteModel').and.callThrough()
    noteList.hideRemoveNoteModel()
    expect(noteList.showRemoveNoteModel).toBe(false)
  })

  it('Should called insert image', function () {
    spyOn(noteList, 'insertImage').and.callThrough()
    noteList.insertImage()
  })

  it('Should called update note data', function () {
    spyOn(noteList, 'updateNoteData').and.callThrough()
    noteList.updateNoteData()
  })

  it('Should called show note note', function () {
    spyOn(noteList, 'showNoteList').and.callThrough()
    noteList.showNoteList({}, 0)
    scope.$apply()
  })

  it('Should called insert image', function () {
    spyOn(noteList, 'openAddImageModal').and.callThrough()
    noteList.openAddImageModal()
    timeout.flush(10)
    expect(noteList.showAddImageModal).toBe(true)
  })

  it('Should called close image model', function () {
    spyOn(noteList, 'closeAddImageModal').and.callThrough()
    noteList.closeAddImageModal(true)
    timeout.flush(10)
    // expect(noteList.closeAddImageModal).toBe(true);
  })
})

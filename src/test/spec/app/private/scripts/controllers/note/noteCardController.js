/**
 * name: noteCardController
 * author: Anuj Gupta
 * Date: 23-09-2017
 */

'use strict'

describe('Controller: NoteCardCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var noteService,
    scope,
    rootScope,
    noteCard,
    $q,
    deferred,
    timeout,
    stateParams,
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
    stateParams = { contentId: '12123123124324', courseId: '12123123124324' }

    rootScope.userId = 'rwerwerwerw'
    noteCard = $controller('NoteCardCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      noteService: noteService,
      $stateParams: stateParams
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
      spyOn(scope, 'updateNoteMetaData').and.callThrough()
      scope.updateNoteMetaData('12123123124324')
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('failed due to external error', function (done) {
      spyOn(noteService, 'search').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(scope, 'updateNoteMetaData').and.callThrough()
      scope.updateNoteMetaData('12123123124324')
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('success', function (done) {
      spyOn(noteService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.userNotesSuccess)
      spyOn(scope, 'updateNoteMetaData').and.callThrough()
      scope.updateNoteMetaData('12123123124324')
      scope.$apply()
      var response = noteService.search().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })
  })

  it('Should update content id', function () {
    var contentId = '12123123124324'
    spyOn(scope, 'updateContentId').and.callThrough()
    scope.updateContentId(contentId)
    expect(noteCard.contentId).toBe(contentId)
  })

  it('Should open and close add image model', function () {
    spyOn(noteCard, 'insertImage').and.callThrough()
    noteCard.insertImage()
    spyOn(noteCard, 'openAddImageModal').and.callThrough()
    noteCard.openAddImageModal(function (err, res) {
      if (err) {

      }
    })
    timeout.flush(10)
    noteCard.showCreateNote = true
    spyOn(noteCard, 'closeAddImageModal').and.callThrough()
    noteCard.closeAddImageModal(true)
  })

  it('Should close model with update note', function () {
    noteCard.showCreateNote = false
    noteCard.showUpdateNote = true
    spyOn(noteCard, 'closeAddImageModal').and.callThrough()
    noteCard.closeAddImageModal(false)

    // spyOn(noteCard, 'insertImage').and.returnValue(deferred.promise);
    // deferred.resolve(notesTestData.userNotesSuccess);
  })

  it('Should call view all notes with course and content', function (done) {
    spyOn(noteCard, 'viewAllNotes').and.callThrough()
    noteCard.viewAllNotes()
    done()
  })

  it('Should call view all notes with course', function (done) {
    noteCard.contentId = ''
    spyOn(noteCard, 'viewAllNotes').and.callThrough()
    noteCard.viewAllNotes()
    done()
  })

  it('Should call view all notes with content', function (done) {
    noteCard.courseId = ''
    spyOn(noteCard, 'viewAllNotes').and.callThrough()
    noteCard.viewAllNotes()
    done()
  })

  it('Should open create model', function () {
    spyOn(noteCard, 'showAddNoteModal').and.callThrough()
    noteCard.showAddNoteModal()
    timeout.flush(10)
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
      spyOn(noteCard, 'createNote').and.callThrough()
      noteCard.createNote(note)
      note.createdBy = new Date()
      note.updatedBy = new Date()
      scope.$apply()
      var response = noteService.create().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('failed due to missing required field', function () {
      var note = {
        note: 'Test',
        userId: '4234234234',
        title: 'Test'
      }

      spyOn(noteService, 'create').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.createNoteFailed)
      spyOn(noteCard, 'createNote').and.callThrough()
      noteCard.createNote(note)
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
      spyOn(noteCard, 'createNote').and.callThrough()
      noteCard.createNote(note)
      timeout.flush(2000)
      scope.$apply()
    })

    it('failed due to invalid request', function (done) {
      spyOn(noteCard, 'hideAddNoteModal').and.callThrough()
      noteCard.hideAddNoteModal()
      timeout.flush(0)
      done()
    })

    it('Should clear and close add model', function () {
      noteCard.add.metaData = {note: 'note', title: 'title'}
      spyOn(noteCard, 'clearAddNoteData').and.callThrough()
      noteCard.clearAddNoteData()
      spyOn(noteCard, 'closeAddNoteModal').and.callThrough()
      noteCard.closeAddNoteModal()
      timeout.flush(0)
    })
  })

  it('Should open update model', function () {
    spyOn(noteCard, 'showUpdateNoteModal').and.callThrough()
    noteCard.showUpdateNoteModal()
    timeout.flush(10)
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

    it('Should called search service', function () {
      spyOn(noteService, 'update').and.callThrough()
      noteService.update(requestData)
      expect(noteService.update).toBeDefined()
    })

    it('failed due to invalid id', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.updateNoteFailed)
      spyOn(noteCard, 'updateNote').and.callThrough()
      noteCard.updateNote(requestData)
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.update().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(noteCard, 'updateNote').and.callThrough()
      noteCard.updateNote(requestData)
      timeout.flush(2000)
      scope.$apply()
    })

    it('success', function () {
      spyOn(noteService, 'update').and.returnValue(deferred.promise)
      deferred.resolve(notesTestData.updateNoteSuccess)
      spyOn(noteCard, 'updateNote').and.callThrough()
      noteCard.updateNote(requestData)
      timeout.flush(2000)
      scope.$apply()
      var response = noteService.update().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Should clear and close update model', function () {
      noteCard.update.metaData = {note: 'note', title: 'title'}
      spyOn(noteCard, 'clearUpdateNoteData').and.callThrough()
      noteCard.clearUpdateNoteData()
      spyOn(noteCard, 'closeUpdateNoteModal').and.callThrough()
      noteCard.closeUpdateNoteModal()
      timeout.flush(0)
    })
  })
})

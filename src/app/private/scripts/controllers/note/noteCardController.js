'use strict'

angular.module('playerApp')
  .controller('NoteCardCtrl', ['$rootScope', '$scope', 'noteService', '$timeout',
    '$state', '$stateParams', '$q', 'toasterService', function ($rootScope, $scope, noteService,
      $timeout, $state, $stateParams, $q, toasterService) {
      var noteCard = this
      noteCard.userId = $rootScope.userId
      noteCard.userName = $rootScope.firstName + ' ' + $rootScope.lastName
      noteCard.showNoteCard = $scope.shownotecard
      noteCard.showModalInLectureView = $scope.shownoteinlecture
      noteCard.showModalInCourseView = $scope.shownoteincourse
      noteCard.quantityOfNotes = 2
      noteCard.courseId = $stateParams.courseId
      noteCard.contentId = $stateParams.contentId
      noteCard.contentName = $stateParams.contentName
      noteCard.add = {}
      noteCard.update = {}
      noteCard.showCreateNote = false
      noteCard.showUpdateNote = false
      noteCard.visibility = $scope.visibility
      noteCard.sortBy = 'desc'

      function searchNote (request) {
        var api = 'searchApi'
        noteCard[api] = {}
        noteCard[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0057)

        noteService.search(request).then(function (response) {
          if (response && response.responseCode === 'OK') {
            noteCard[api].loader.showLoader = false
            noteCard.notesList = response.result.response.note || []
          } else {
            noteCard[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0033)
          }
        }).catch(function () {
          noteCard[api].loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0033)
        })
      }

      $scope.updateContentId = function (contentId) {
        noteCard.contentId = contentId
      }

      $scope.updateNoteMetaData = function (contentId) {
        noteCard.contentId = contentId

        var requestData = {
          request: {
            filters: {
              userId: noteCard.userId,
              courseId: noteCard.courseId,
              contentId: noteCard.contentId
            },
            sort_by: {
              updatedDate: noteCard.sortBy
            }
          }
        }
        searchNote(requestData)
      }

      noteCard.hideAddNoteModal = function () {
        $timeout(function () {
          $('#addNoteModal').modal('hide')
          $('#addNoteModal').modal('hide dimmer')
          $('#addNoteModal').modal('hide others')
        }, 0)
      }
      noteCard.insertImage = function () {
        var defer = $q.defer()
        noteCard.openAddImageModal(function (response) {
          if (!response) {
            defer.reject()
          } else {
            defer.resolve(response)
          }
        })
        return defer.promise
      }

      noteCard.openAddImageModal = function (callback) {
        noteCard.showAddImageModal = true
        $('.wmd-prompt-background').css('z-index', 0)
        $('.wmd-prompt-background').css('position', 'initial')
        $timeout(function () {
          $('#showAddImageModal').modal({
            allowMultiple: true,
            onShow: function () {
              noteCard.imageLink = 'http://'
            },
            onHide: function () {
              noteCard.showAddImageModal = false
              return callback(noteCard.imageLink)
            }
          }).modal('show')
        }, 10)
      }

      noteCard.closeAddImageModal = function (isCancel) {
        noteCard.isCancel = false
        noteCard.showUpdateModal = false
        if (isCancel) {
          noteCard.imageLink = ''
          noteCard.isCancel = true
        }
        if (noteCard.showCreateNote) {
          noteCard.showAddNoteModal()
        } else if (noteCard.showUpdateNote) {
          noteCard.showUpdateModal = true
          noteCard.showUpdateNoteModal(noteCard.update.metaData)
        }
        $('#showAddImageModal').modal('hide')
        $('#showAddImageModal').modal('hide others')
        $('#showAddImageModal').modal('hide all')
        $('#showAddImageModal').modal('hide dimmer')
        $('.ui.coupled.modal.transition.hidden').remove()
      }

      noteCard.createNote = function (noteData) {
        var requestData = {
          request: {
            note: noteData.note,
            userId: noteCard.userId,
            title: noteData.title,
            courseId: noteCard.courseId,
            contentId: noteCard.contentId,
            createdBy: noteCard.userName,
            updatedBy: noteCard.userId
          }
        }

        var api = 'createApi'
        noteCard[api] = {}
        noteCard[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0054)

        noteService.create(requestData).then(function (response) {
          if (response && response.responseCode === 'OK') {
            noteCard[api].loader.showLoader = false
            var addNoteData = angular.copy(requestData.request)
            addNoteData.createdDate = new Date().toISOString()
            addNoteData.updatedDate = new Date().toISOString()
            addNoteData.id = response.result.id
            noteCard.hideAddNoteModal()
            $rootScope.$emit('updateNotesListData', addNoteData)
          } else {
            noteCard[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0030)
          }
        }).catch(function () {
          noteCard[api].loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0030)
        })
      }

      noteCard.hideUpdateNoteModal = function () {
        $('#updateNoteModal').modal('hide')
        $('#updateNoteModal').modal('hide others')
        $('#updateNoteModal').modal('hide dimmer')
      }

      noteCard.updateNote = function (noteData) {
        var requestData = {
          noteId: noteData.id,
          request: {
            note: noteData.note,
            title: noteData.title,
            tags: noteData.tags,
            updatedBy: noteCard.userId
          }
        }

        var api = 'updateApi'
        noteCard[api] = {}
        noteCard[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0059)

        noteService.update(requestData).then(function (response) {
          if (response && response.responseCode === 'OK') {
            noteCard[api].loader.showLoader = false
            var addNoteData = angular.copy(noteData)
            addNoteData.updatedDate = new Date().toISOString()
            noteCard.hideUpdateNoteModal()
            $rootScope.$emit('updateNotesListData', addNoteData, true)
          } else {
            noteCard[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0034)
          }
        }).catch(function () {
          noteCard[api].loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0034)
        })
      }

      noteCard.clearUpdateNoteData = function () {
        noteCard.update.metaData.title = ''
        noteCard.update.metaData.note = ''
      }

      noteCard.closeUpdateNoteModal = function () {
        $timeout(function () {
          noteCard.showUpdateNote = false
        }, 0)
      }

      noteCard.showUpdateNoteModal = function (note) {
        noteCard.showUpdateNote = true
        $timeout(function () {
          $('#updateNoteModal').modal({
            allowMultiple: true,
            onShow: function () {
              noteCard.update.metaData = angular.copy(note)
              if (noteCard.isCancel) {
                noteCard.imageLink = ''
                noteCard.isCancel = false
              }
            },
            onHide: function () {
              if (!noteCard.imageLink && !noteCard.isCancel && !noteCard.showUpdateModal) {
                noteCard.clearUpdateNoteData()
                noteCard.closeUpdateNoteModal()
              }
              return true
            }
          }).modal('show')
        }, 10)
      }

      noteCard.clearAddNoteData = function () {
        noteCard.add.title = ''
        noteCard.add.note = ''
      }

      noteCard.closeAddNoteModal = function () {
        $timeout(function () {
          noteCard.showCreateNote = false
        }, 0)
      }

      noteCard.showAddNoteModal = function () {
        noteCard.showCreateNote = true
        $timeout(function () {
          $('#addNoteModal').modal({
            allowMultiple: true,
            onShow: function () {
              if (!noteCard.imageLink && !noteCard.isCancel) {
                $('.ui.coupled.modal.transition.hidden').remove()
                noteCard.clearAddNoteData()
              } else {
                noteCard.imageLink = ''
                noteCard.isCancel = false
              }
            },
            onHide: function () {
              if (!noteCard.imageLink && !noteCard.isCancel) {
                noteCard.clearAddNoteData()
                noteCard.closeAddNoteModal()
              }
              return true
            }
          }).modal('show')
        }, 10)
      }

      $rootScope.$on('updateNotesListData', function (e, content, isUpdate) {
        if (isUpdate && noteCard.notesList) {
          noteCard.notesList = noteCard.notesList.filter(function (note) {
            return note.id !== content.id
          })
          noteCard.notesList.push(content)
        } else {
          noteCard.notesList = noteCard.notesList ? noteCard.notesList : []
          noteCard.notesList.push(content)
        }
      })

      noteCard.viewAllNotes = function () {
        var params = {}
        if (noteCard.courseId && noteCard.contentId) {
          params = {
            courseId: noteCard.courseId,
            contentId: noteCard.contentId
          }
          $state.go('CourseContentNote', params)
        } else if (noteCard.courseId) {
          params = {
            courseId: noteCard.courseId
          }
          $state.go('CourseNote', params)
        } else if (noteCard.contentId) {
          params = {
            contentId: noteCard.contentId,
            contentName: noteCard.contentName
          }
          $state.go('ContentNote', params)
        }
      }
    }])

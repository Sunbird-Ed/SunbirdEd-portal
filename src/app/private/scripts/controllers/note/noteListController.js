'use strict'

angular.module('playerApp')
    .controller('NoteListCtrl', ['$rootScope', 'noteService', '$state', '$stateParams',
      '$timeout', '$q', 'toasterService', function ($rootScope, noteService, $state,
            $stateParams, $timeout, $q, toasterService) {
        var noteList = this
        noteList.userId = $rootScope.userId
        noteList.userName = $rootScope.firstName + ' ' + $rootScope.lastName
        noteList.courseId = $stateParams.courseId
        noteList.contentId = $stateParams.contentId
        noteList.contentName = $stateParams.contentName
        noteList.add = {}
        noteList.update = {}
        noteList.update.showUpdateNote = false
        noteList.add.showCreateNote = false
        noteList.sortBy = 'desc'
        noteList.successResponseCode = 'OK'

        function searchNote (request) {
          var api = 'searchApi'
          noteList[api] = {}
          noteList[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0057)
          noteService.search(request).then(function (response) {
            if (response && response.responseCode === noteList.successResponseCode) {
              noteList[api].loader.showLoader = false
              noteList.notesList = response.result.response.note || []
              noteList.selectedNoteData = noteList.notesList[0]
              noteList.showNoteList(noteList.notesList[0])
            } else {
              noteList[api].loader.showLoader = false
              toasterService.error($rootScope.messages.fmsg.m0033)
            }
          }).catch(function () {
            noteList[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0033)
          })
        }

        noteList.getAllNotes = function () {
          var requestData = {
            request: {
              filters: {
                userId: noteList.userId,
                courseId: noteList.courseId,
                contentId: noteList.contentId
              },
              sort_by: {
                updatedDate: noteList.sortBy
              }
            }
          }
          searchNote(requestData)
        }

        noteList.createNote = function (noteData) {
          var api = 'createApi'
          noteList[api] = {}
          noteList[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0054)

          var requestData = {
            request: {
              note: noteData.note,
              userId: noteList.userId,
              title: noteData.title,
              courseId: noteList.courseId,
              contentId: noteList.contentId,
              createdBy: noteList.userName,
              updatedBy: noteList.userId
            }
          }

          noteService.create(requestData).then(function (response) {
            if (response && response.responseCode === noteList.successResponseCode) {
              noteList.add.showCreateNote = false
              noteList[api].loader.showLoader = false
              var addNoteData = angular.copy(requestData.request)
              addNoteData.createdDate = new Date().toISOString()
              addNoteData.updatedDate = new Date().toISOString()
              addNoteData.id = response.result.id
              noteList.add = {}
              noteList.notesList.push(addNoteData)
              noteList.showNoteList(addNoteData)
            } else {
              noteList[api].loader.showLoader = false
              toasterService.error($rootScope.messages.fmsg.m0030)
            }
          }).catch(function () {
            noteList[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0030)
          })
        }

        noteList.removeNote = function (noteId) {
          var api = 'removeApi'
          noteList[api] = {}
          noteList[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0056)
          var requestData = {
            noteId: noteId
          }

          noteService.remove(requestData).then(function (response) {
            if (response && response.responseCode === noteList.successResponseCode) {
              noteList.hideRemoveNoteModel()
              noteList.notesList = noteList.notesList.filter(function (note) {
                return note.id !== noteId
              })
              noteList[api].loader.showLoader = false
              noteList.showNoteList(noteList.notesList[noteList.notesList.length - 1],
                                                noteList.notesList.length - 1)
            } else {
              noteList[api].loader.showLoader = false
              toasterService.error($rootScope.messages.fmsg.m0032)
            }
          }).catch(function () {
            noteList[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0032)
          })
        }

        noteList.openRemoveNoteModel = function (noteId) {
          noteList.removeNoteId = noteId
          noteList.showRemoveNoteModel = true
          $timeout(function () {
            $('#removeNoteModal').modal({
            }).modal('show')
          }, 10)
        }

        noteList.hideRemoveNoteModel = function () {
          $('#removeNoteModal').modal('hide')
          $('#removeNoteModal').modal('hide all')
          $('#removeNoteModal').modal('hide other')
          $('#removeNoteModal').modal('hide dimmer')
          noteList.removeNoteId = ''
          noteList.showRemoveNoteModel = false
        }

        noteList.updateNote = function (noteData) {
          var requestData = {
            noteId: noteData.id,
            request: {
              note: noteData.note,
              title: noteData.title,
              tags: noteData.tags,
              updatedBy: noteList.userId
            }
          }

          var api = 'updateApi'
          noteList[api] = {}
          noteList[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0059)

          noteService.update(requestData).then(function (response) {
            if (response && response.responseCode === noteList.successResponseCode) {
              noteList.notesList = noteList.notesList.filter(function (note) {
                return note.id !== noteData.id
              })
              var addNoteData = angular.copy(noteData)
              addNoteData.updatedDate = new Date().toISOString()
              noteList.notesList.push(addNoteData)
              noteList[api].loader.showLoader = false
              noteList.update = {}
              noteList.showNoteList(addNoteData)
            } else {
              noteList[api].loader.showLoader = false
              toasterService.error($rootScope.messages.fmsg.m0034)
            }
          }).catch(function () {
            noteList[api].loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0034)
          })
        }

        noteList.closeNoteList = function () {
          var params = {}
          if (noteList.courseId && noteList.contentId) {
            params = {
              courseId: noteList.courseId,
              contentId: noteList.contentId,
              lectureView: 'no'
            }
            $state.go('Toc', params)
          } else if (noteList.courseId) {
            params = {
              courseId: noteList.courseId,
              lectureView: 'yes'
            }
            $state.go('Toc', params)
          } else if (noteList.contentId) {
            params = {
              contentId: noteList.contentId,
              contentName: noteList.contentName
            }
            $state.go('Player', params)
          }
        }

        noteList.updateNoteData = function (note) {
          noteList.update.metaData = angular.copy(note)
        }

        noteList.showNoteList = function (note, index) {
          noteList.selectedIndex = index
          if (noteList.selectedIndex !== '0') {
            $('#notelistcontent0').removeClass('notelistborder')
          } else {
            $('#notelistcontent0').addClass('notelistborder')
          }
          noteList.selectedNoteData = note
        }

        noteList.insertImage = function () {
          var defer = $q.defer()
          noteList.openAddImageModal(function (response) {
            if (!response) {
              defer.reject()
            } else {
              defer.resolve(response)
            }
          })
          return defer.promise
        }

        noteList.openAddImageModal = function (callback) {
          noteList.showAddImageModal = true
          $('.wmd-prompt-background').css('z-index', 0)
          $('.wmd-prompt-background').css('position', 'initial')
          $timeout(function () {
            $('#showAddImageModal').modal({
              onShow: function () {
                noteList.imageLink = 'http://'
              },
              onHide: function () {
                noteList.showAddImageModal = false
                return callback(noteList.imageLink)
              }
            }).modal('show')
          }, 10)
        }

        noteList.closeAddImageModal = function (isCancel) {
          if (isCancel) {
            noteList.imageLink = ''
          }
          $('#showAddImageModal').modal('hide')
          $('#showAddImageModal').modal('hide others')
          $('#showAddImageModal').modal('hide all')
          $('#showAddImageModal').modal('hide dimmer')
        }
      }])

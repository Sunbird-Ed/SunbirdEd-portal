'use strict'

angular.module('playerApp')
  .controller('ContentLessonController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', 'toasterService', '$scope', 'configService', function (contentService, $timeout,
      $state, config, $rootScope, toasterService, $scope, configService) {
      var contentLesson = this
      contentLesson.formDropdown = configService.getWorkspaceStdMtrlDrpdown()
      // contentLesson.lessonTypes = config.DROPDOWN.COMMON.lessonTypes
      // contentLesson.audiences = config.DROPDOWN.COMMON.audiences
      // contentLesson.ageGroup = config.DROPDOWN.COMMON.ageGroup
      contentLesson.languages = contentLesson.formDropdown.languages
      contentLesson.grades = contentLesson.formDropdown.grades
      contentLesson.mediums = contentLesson.formDropdown.medium
      contentLesson.subjects = contentLesson.formDropdown.subjects
      contentLesson.boards = contentLesson.formDropdown.boards
      contentLesson.resourceType = contentLesson.formDropdown.resourceType
      contentLesson.showCreateSlideShowModal = false
      contentLesson.slideShowCreated = false
      contentLesson.userId = $rootScope.userId
      contentLesson.accept = false

      contentLesson.hideCreateSlideShowModal = function () {
        $('#createSlideShowModal')
          .modal('hide')
        $('#createSlideShowModal')
          .modal('hide others')
        $('#createSlideShowModal')
          .modal('hide dimmer')
      }

      contentLesson.initilizeView = function () {
        contentLesson.showCreateSlideShowModal = true
        $timeout(function () {
          $('.multiSelectDropDown')
            .dropdown()
          $('.singleSelectDropDown')
            .dropdown()
          $('#createSlideShowModal').modal({
            allowMultiple: true,
            onHide: function () {
              contentLesson.clearCreateSlideShowData()
              if (!contentLesson.slideShowCreated) {
                $state.go('WorkSpace.ContentCreation')
              }
            }
          }).modal('show')
        }, 10)
      }

      contentLesson.createContent = function (requestData) {
        contentService.create(requestData).then(function (res) {
          if (res && res.responseCode === 'OK') {
            contentLesson.slideShowCreated = true
            contentLesson.showCreateSlideShowModal = false
            contentLesson.loader.showLoader = false
            contentLesson.hideCreateSlideShowModal()
            contentLesson.initEKStepCE(res.result.content_id)
          } else {
            contentLesson.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0007)
          }
        }).catch(function () {
          contentLesson.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0007)
        })
      }

      contentLesson.saveMetaData = function (data) {
        contentLesson.loader = toasterService.loader('', $rootScope.messages.stmsg.m0013)

        var requestBody = angular.copy(data)

        requestBody.mimeType = config.CreateLessonMimeType
        requestBody.createdBy = contentLesson.userId

        requestBody.name = requestBody.name ? requestBody.name : 'Untitled lesson'
        requestBody.contentType = requestBody.contentType ? requestBody.contentType : 'Resource'
        if (requestBody.language) {
          requestBody.language = [requestBody.language]
        }

        var requestData = {
          content: requestBody
        }
        contentLesson.createContent(requestData)
      }

      contentLesson.clearCreateSlideShowData = function () {
        contentLesson.data = {}
      }

      contentLesson.initEKStepCE = function (contentId) {
        var params = { contentId: contentId }
        $state.go('ContentEditor', params)
      }
      $scope.$on('selectedConcepts', function (event, args) {
        contentLesson.data.concepts = args.selectedConcepts
      })
    }
  ])

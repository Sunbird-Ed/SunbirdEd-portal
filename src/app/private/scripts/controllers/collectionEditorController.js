'use strict'

angular.module('playerApp')
  .controller('CollectionEditorController', ['config', '$stateParams', 'toasterService', '$sce',
    '$state', '$timeout', '$rootScope', 'contentService', 'permissionsService', 'workSpaceUtilsService',
    function (config, $stateParams, toasterService, $sce, $state, $timeout, $rootScope, contentService,
      permissionsService, workSpaceUtilsService) {
      var collectionEditor = this
      collectionEditor.contentId = $stateParams.contentId
      collectionEditor.framework = $stateParams.framework
      collectionEditor.openCollectionEditor = function (data) {
        $('#collectionEditor').iziModal({
          title: '',
          iframe: true,
          iframeURL: '/thirdparty/bower_components/collection-editor-iframe/index.html',
          navigateArrows: false,
          fullscreen: false,
          openFullscreen: true,
          closeOnEscape: false,
          overlayClose: false,
          overlay: false,
          history: false,
          overlayColor: '',
          onClosed: function () {
            collectionEditor.openModel()
          }
        })

        window.context = {
          user: {
            id: $rootScope.userId,
            name: $rootScope.firstName + ' ' + $rootScope.lastName
          },
          sid: $rootScope.sessionId,
          contentId: collectionEditor.contentId,
          pdata: {
            id: org.sunbird.portal.appid,
            ver: '1.0'
          },
          etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
          channel: org.sunbird.portal.channel,
          framework: collectionEditor.framework,
          env: data.type.toLowerCase()
        }

        window.config = {
          corePluginsPackaged: true,
          modalId: 'collectionEditor',
          dispatcher: 'local',
          apislug: '/action',
          alertOnUnload: true,
          headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
          loadingImage: '',
          plugins: [{
            id: 'org.ekstep.sunbirdcommonheader',
            ver: '1.1',
            type: 'plugin'
          },
          {
            id: 'org.ekstep.lessonbrowser',
            ver: '1.3',
            type: 'plugin'
          }],
          localDispatcherEndpoint: '/collection-editor/telemetry',
          editorConfig: {
            mode: 'Edit',
            contentStatus: 'draft',
            rules: {
              levels: 7,
              objectTypes: collectionEditor.getTreeNodes(data.type)
            },
            defaultTemplate: {}
          },
          previewConfig: {
            repos: ['/content-plugins/renderer'],
            plugins: [{
              id: 'org.sunbird.player.endpage',
              ver: 1.0,
              type: 'plugin'
            }],
            showEndPage: false
          },
          editorType: data.type
        }
        if (data.type.toLowerCase() === 'textbook') {
          window.config.plugins.push({
            id: 'org.ekstep.suggestcontent',
            ver: '1.0',
            type: 'plugin'
          })
        }
        window.config.editorConfig.publishMode = false
        window.config.editorConfig.isFalgReviewer = false
        if ($stateParams.state === 'WorkSpace.UpForReviewContent' &&
          _.intersection(permissionsService.getCurrentUserRoles(),
            ['CONTENT_REVIEWER', 'CONTENT_REVIEW']).length > 0) {
          window.config.editorConfig.publishMode = true
        } else if ($stateParams.state === 'WorkSpace.FlaggedContent' &&
          _.intersection(permissionsService.getCurrentUserRoles(),
            ['FLAG_REVIEWER']).length > 0) {
          window.config.editorConfig.isFalgReviewer = true
        }

        var validateModal = {
          state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
            'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent', 'LimitedPublishedContent'],
          status: ['Review', 'Draft', 'Live', 'Flagged', 'Unlisted'],
          mimeType: 'application/vnd.ekstep.content-collection'
        }

        var req = { contentId: collectionEditor.contentId }
        var qs = { fields: 'createdBy,status,mimeType', mode: 'edit' }
        if ($stateParams.state === 'WorkSpace.FlaggedContent') {
          delete qs.mode
        }

        contentService.getById(req, qs).then(function (response) {
          if (response && response.responseCode === 'OK') {
            var rspData = response.result.content
            rspData.state = $stateParams.state
            rspData.userId = $rootScope.userId

            if (collectionEditor.validateRequest(rspData, validateModal)) {
              collectionEditor.updateModeAndStatus(response.result.content.status)
              $timeout(function () {
                $('#collectionEditor').iziModal('open')
              }, 100)
            } else {
              toasterService.warning($rootScope.messages.imsg.m0004)
              $state.go('Home')
            }
          }
        })
      }

      collectionEditor.validateRequest = function (reqData, validateData) {
        var status = reqData.status
        var createdBy = reqData.createdBy
        var state = reqData.state
        var userId = reqData.userId
        var validateDataStatus = validateData.status
        if (reqData.mimeType === validateData.mimeType) {
          var isStatus = _.indexOf(validateDataStatus, status) > -1
          var isState = _.indexOf(validateData.state, state) > -1
          if (isStatus && isState && createdBy !== userId) {
            return true
          } else if (isStatus && isState && createdBy === userId) {
            return true
          } else if (isStatus && createdBy === userId) {
            return true
          }
          return false
        }
        return false
      }

      collectionEditor.getTreeNodes = function (type) {
        var editorConfig = []
        switch (type) {
        case 'Course':
          editorConfig.push({
            type: 'Course',
            label: 'Course',
            isRoot: true,
            editable: true,
            childrenTypes: [
              'CourseUnit',
              'Collection',
              'Resource',
              'Story',
              'Worksheet'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-book'
          },
          {
            type: 'CourseUnit',
            label: 'Course Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'CourseUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          })
          return editorConfig
        case 'Collection':
          editorConfig.push({
            type: 'Collection',
            label: 'Collection',
            isRoot: true,
            editable: true,
            childrenTypes: [
              'Collection',
              'Resource',
              'Story',
              'Worksheet'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          })
          return editorConfig
        case 'LessonPlan':
          editorConfig.push({
            type: 'LessonPlan',
            label: 'LessonPlan',
            isRoot: true,
            editable: true,
            childrenTypes: [
              'LessonPlanUnit',
              'Collection',
              'Resource',
              'Story',
              'Worksheet'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-book'
          },
          {
            type: 'LessonPlanUnit',
            label: 'LessonPlan Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'LessonPlanUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          })
          return editorConfig
        default:

          editorConfig.push({
            type: 'TextBook',
            label: 'Textbook',
            isRoot: true,
            editable: true,
            childrenTypes: [
              'TextBookUnit',
              'Collection',
              'Resource',
              'Story',
              'Worksheet'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-book'
          },
          {
            type: 'TextBookUnit',
            label: 'Textbook Unit',
            isRoot: false,
            editable: true,
            childrenTypes: [
              'TextBookUnit',
              'Collection',
              'Resource'
            ],
            addType: 'Editor',
            iconClass: 'fa fa-folder-o'
          },
          {
            type: 'Collection',
            label: 'Collection',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Resource',
            label: 'Resource',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Story',
            label: 'Story',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          },
          {
            type: 'Worksheet',
            label: 'Worksheet',
            isRoot: false,
            editable: false,
            childrenTypes: [

            ],
            addType: 'Browser',
            iconClass: 'fa fa-file-o'
          })
          return editorConfig
        }
      }

      collectionEditor.updateModeAndStatus = function (status) {
        if (status.toLowerCase() === 'draft') {
          window.config.editorConfig.mode = 'Edit'
          window.config.editorConfig.contentStatus = 'draft'
        }
        if (status.toLowerCase() === 'review') {
          window.config.editorConfig.mode = 'Read'
          window.config.editorConfig.contentStatus = 'draft'
        }
        if (status.toLowerCase() === 'live') {
          window.config.editorConfig.mode = 'Edit'
          window.config.editorConfig.contentStatus = 'live'
        }
        if (status.toLowerCase() === 'flagged') {
          window.config.editorConfig.mode = 'Read'
          window.config.editorConfig.contentStatus = 'flagged'
        }
      }
      collectionEditor.openCollectionEditor($stateParams)

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        if (fromState.name === 'CollectionEditor') {
          var state = $('#collectionEditor').iziModal('getState')
          if (state === 'opened') {
            if (document.getElementById('collectionEditor')) {
              document.getElementById('collectionEditor').remove()
            }
          }
        }
      })

      collectionEditor.openModel = function () {
        collectionEditor.showModal = true
        $('#modalCollectionEditor').modal('show')
        $timeout(function () {
          workSpaceUtilsService.hideRemoveModel('#modalCollectionEditor')
          if (document.getElementById('collectionEditor')) {
            document.getElementById('collectionEditor').remove()
          }
          if (document.getElementById('modalCollectionEditor')) {
            document.getElementById('modalCollectionEditor').remove()
          }
          collectionEditor.showModal = false
          if ($stateParams.state) {
            $state.go($stateParams.state)
          } else {
            $state.go('WorkSpace.DraftContent')
          }
        }, 2000)
      }
    }])

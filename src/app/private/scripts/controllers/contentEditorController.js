'use strict'

angular.module('playerApp')
  .controller('ContentEditorController', ['config', '$stateParams', 'toasterService',
    '$state', 'contentService', '$timeout', '$rootScope', 'workSpaceUtilsService',
    function (config, $stateParams, toasterService, $state, contentService, $timeout, $rootScope,
      workSpaceUtilsService) {
      var contentEditor = this
      contentEditor.contentId = $stateParams.contentId
      contentEditor.openContentEditor = function () {
        window.context = {
          user: {
            id: $rootScope.userId,
            name: $rootScope.firstName + ' ' + $rootScope.lastName
          },
          sid: $rootScope.sessionId,
          contentId: contentEditor.contentId,
          pdata: {
            id: org.sunbird.portal.appid,
            ver: '1.0'
          },
          etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
          channel: org.sunbird.portal.channel
        }
        window.config = {
          baseURL: '',
          modalId: 'contentEditor',
          apislug: '/action',
          alertOnUnload: true,
          headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
          aws_s3_urls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-' +
                        org.sunbird.portal.ekstep_env + '/', 'https://ekstep-public-' +
                        org.sunbird.portal.ekstep_env + '.s3-ap-south-1.amazonaws.com/'],
          plugins: [
            {
              id: 'org.ekstep.sunbirdcommonheader',
              ver: '1.1',
              type: 'plugin'
            }
          ],
          dispatcher: 'local',
          localDispatcherEndpoint: '/content-editor/telemetry',
          showHelp: false,
          previewConfig: {
            repos: ['/content-plugins/renderer'],
            plugins: [{
              id: 'org.sunbird.player.endpage',
              ver: 1.0,
              type: 'plugin'
            }],
            showEndPage: false
          }
        }
        $('#contentEditor').iziModal({
          title: '',
          iframe: true,
          iframeURL: '/thirdparty/bower_components/content-editor-iframe/index.html',
          navigateArrows: false,
          fullscreen: false,
          openFullscreen: true,
          closeOnEscape: false,
          overlayClose: false,
          overlay: false,
          overlayColor: '',
          history: false,
          onClosed: function () {
            contentEditor.openModel()
          }
        })
        $timeout(function () {
          $('#contentEditor').iziModal('open')
        }, 100)
      }

      var validateModal = {
        state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
          'WorkSpace.PublishedContent', 'LimitedPublishedContent'],
        status: ['Review', 'Draft', 'Live', 'Unlisted'],
        mimeType: config.CreateLessonMimeType
      }

      contentEditor.checkContentAccess = function (reqData, validateData) {
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

      contentEditor.getContentData = function () {
        var req = { contentId: contentEditor.contentId }
        var qs = { fields: 'createdBy,status,mimeType', mode: 'edit' }

        contentService.getById(req, qs).then(function (response) {
          if (response && response.responseCode === 'OK') {
            var rspData = response.result.content
            rspData.state = $stateParams.state
            rspData.userId = $rootScope.userId

            if (contentEditor.checkContentAccess(rspData, validateModal)) {
              contentEditor.openContentEditor()
            } else {
              toasterService.warning($rootScope.messages.imsg.m0004)
              $state.go('Home')
            }
          } else {
            toasterService.warning($rootScope.messages.imsg.m0004)
            $state.go('Home')
          }
        })
      }

      contentEditor.init = function () {
        org.sunbird.portal.eventManager.addEventListener('sunbird:portal:editor:close',
          function () {
            if ($stateParams.state) {
              $state.go($stateParams.state)
            } else {
              $state.go('WorkSpace.DraftContent')
            }
          })

        org.sunbird.portal.eventManager.addEventListener('sunbird:portal:content:review',
                function (event, data) { //eslint-disable-line
            if ($stateParams.state) {
              $state.go($stateParams.state)
            } else {
              $state.go('WorkSpace.DraftContent')
            }
          })

        window.addEventListener('editor:metadata:edit', function (event, data) {
          org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:editmeta')
        })

        window.addEventListener('editor:window:close', function (event, data) {
          org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close')
        })

        window.addEventListener('editor:content:review', function (event, data) {
          org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review',
            event.detail.contentId)
        })
      }

      contentEditor.init()
      contentEditor.getContentData()

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        if (fromState.name === 'ContentEditor') {
          var state = $('#contentEditor').iziModal('getState')
          if (state === 'opened') {
            document.getElementById('contentEditor').remove()
          }
        }
      })

      contentEditor.openModel = function () {
        contentEditor.showModal = true
        $('#modalContentEditor').modal('show')
        $timeout(function () {
          workSpaceUtilsService.hideRemoveModel('#modalContentEditor')
          if (document.getElementById('contentEditor')) {
            document.getElementById('contentEditor').remove()
          }
          if (document.getElementById('modalContentEditor')) {
            document.getElementById('modalContentEditor').remove()
          }
          contentEditor.showModal = false
          if ($stateParams.state) {
            $state.go($stateParams.state)
          } else {
            $state.go('WorkSpace.DraftContent')
          }
        }, 2000)
      }
    }])

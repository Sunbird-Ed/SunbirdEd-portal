'use strict'

angular.module('loginApp')
  .controller('contentPlayerCtrl', ['$state', '$scope', '$timeout', '$stateParams', '$rootScope',
    'config', 'contentService', 'toasterService', '$location', '$anchorScroll',
    function ($state, $scope, $timeout, $stateParams, $rootScope, config, contentService,
      toasterService, $location, $anchorScroll) {
      $scope.isHeader = $scope.isheader
      $scope.isClose = $scope.isclose
      $scope.showModalInLectureView = true
      $scope.contentProgress = 0

      $scope.getContentEditorConfig = function (data) {
        var configuration = {}
        configuration.context = config.ekstep_CP_config.context
        configuration.context.contentId = $scope.contentData.identifier
        configuration.context.sid = $rootScope.sessionId
        configuration.context.uid = $rootScope.userId
        configuration.context.partner = []
        configuration.context.cdata = [{
          id: $stateParams.courseId,
          type: 'course'
        }]
        configuration.config = config.ekstep_CP_config.config
        configuration.config.plugins = config.ekstep_CP_config.config.plugins
        configuration.config.repos = config.ekstep_CP_config.config.repos
        configuration.metadata = $scope.contentData
        configuration.data = $scope.contentData.mimeType !== config.MIME_TYPE.ecml ? {} : data.body
        return configuration
      }

      $scope.adjustPlayerHeight = function () {
        var playerWidth = $('#contentViewerIframe').width()
        if (playerWidth) {
          var height = playerWidth * (9 / 16)
          $('#contentViewerIframe').css('height', height + 'px')
        }
      }

      function showPlayer (data) {
        $scope.contentData = data
        $scope._instance = {
          id: $scope.contentData.identifier,
          ver: $scope.contentData.pkgVersion
        }
        $scope.showMetaData = $scope.isshowmetaview
        $rootScope.contentId = $scope.contentData.identifier
        $scope.showIFrameContent = true
        var iFrameSrc = config.ekstep_CP_config.baseURL
        $timeout(function () {
          var previewContentIframe = $('#contentViewerIframe')[0]
          previewContentIframe.src = iFrameSrc
          previewContentIframe.onload = function () {
            $scope.adjustPlayerHeight()
            var configuration = $scope.getContentEditorConfig(data)
            previewContentIframe.contentWindow.initializePreview(configuration)
            $scope.gotoBottom()
          }
        }, 0)
      }

      function getContent (contentId) {
        var req = { contentId: contentId }
        var qs = {
          fields: 'body,editorState,stageIcons,templateId,languageCode,template,' +
                        'gradeLevel,status,concepts,versionKey,name,appIcon,contentType,owner,' +
                        'domain,code,visibility,createdBy,description,language,mediaType,' +
                        'osId,languageCode,createdOn,lastUpdatedOn,audience,ageGroup,' +
                        'attributions,artifactUrl,mimeType,medium,year,publisher'
        }
        contentService.getById(req, qs).then(function (response) {
          if (response && response.responseCode === 'OK') {
            if (config.CONTENT_TYPE.resource.indexOf(response.result.content.contentType) === -1) {
              toasterService.warning($rootScope.messages.fmsg.m0065)
              $state.go('Landing')
            }
            $scope.errorObject = {}
            if (response.result.content.mimeType === config.MIME_TYPE.collection) {
              var contentData = response.result.content
              window.localStorage.setItem('redirectUrl', '/preview/collection/' +
              contentId + '/' + contentData.name + '/')
              $state.go('PublicCollection', { contentId: contentData.identifier, name: contentData.name })
            } else {
              showPlayer(response.result.content)
              if (!$scope.isClose) {
                $rootScope.titleName = response.result.content.name
                window.localStorage.setItem('redirectUrl', '/content/' + contentId + '/' + response.result.content.name)
              }
            }
          } else {
            toasterService.error($rootScope.messages.fmsg.m0049)
            $state.go('Landing')
          }
        }).catch(function () {
          toasterService.error($rootScope.messages.fmsg.m0049)
          $state.go('Landing')
        })
      }

      $scope.close = function () {
        $scope.visibility = false
        // playerTelemetryUtilsService.endTelemetry({ progress: $scope.contentProgress });
        // window.removeEventListener('renderer:telemetry:event', function () {
        //     org.sunbird.portal.eventManager.dispatchEvent('sunbird:player:telemetry',
        //                                     event.detail.telemetryData);
        // });
      }

      $scope.init = function () {
        $scope.errorObject = {}
        getContent($scope.id)
      }

      $scope.gotoBottom = function () {
        $('html, body').animate({
          scrollTop: $('#player-auto-scroll').offset().top
        }, 500)
      }
    }])

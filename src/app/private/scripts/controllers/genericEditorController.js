'use strict'

angular.module('playerApp')
  .controller('GenericEditorController', ['config', '$stateParams', 'toasterService', '$sce',
    '$state', '$timeout', '$rootScope', 'contentService', 'permissionsService', 'workSpaceUtilsService',
    'searchService', function (config, $stateParams, toasterService, $sce, $state, $timeout, $rootScope,
      contentService, permissionsService, workSpaceUtilsService, searchService) {
      var genericEditor = this
      genericEditor.contentId = (_.isUndefined($stateParams.contentId) ||
        _.isNull($stateParams.contentId)) ? '' : $stateParams.contentId
      genericEditor.framework = $stateParams.framework

      genericEditor.setContext = function () {
        window.context = {
          user: {
            id: $rootScope.userId,
            name: $rootScope.firstName + ' ' + $rootScope.lastName,
            orgIds: $rootScope.organisationIds
          },
          sid: $rootScope.sessionId,
          contentId: genericEditor.contentId,
          pdata: {
            id: org.sunbird.portal.appid,
            ver: '1.0',
            pid: 'sunbird-portal'
          },
          tags: _.concat([], org.sunbird.portal.channel),
          channel: org.sunbird.portal.channel,
          env: 'genericeditor',
          framework: genericEditor.framework
        }

        // open editor after setting context
        genericEditor.openGenericEditor()
      }

      genericEditor.openGenericEditor = function () {
        $('#genericEditor').iziModal({
          title: '',
          iframe: true,
          iframeURL: '/thirdparty/bower_components/generic-editor-iframe/index.html',
          navigateArrows: false,
          fullscreen: false,
          openFullscreen: true,
          closeOnEscape: false,
          overlayClose: false,
          overlay: false,
          history: false,
          overlayColor: '',
          onClosed: function () {
            genericEditor.openModel()
          }
        })

        window.config = {
          corePluginsPackaged: true,
          modalId: 'genericEditor',
          dispatcher: 'local',
          apislug: '/action',
          alertOnUnload: true,
          headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
          loadingImage: '',
          plugins: [{
            id: 'org.ekstep.sunbirdcommonheader',
            ver: '1.4',
            type: 'plugin'
          },
          {
            id: 'org.ekstep.metadata',
            ver: '1.0',
            type: 'plugin'
          },
          {
            id: 'org.ekstep.sunbirdmetadata',
            ver: '1.0',
            type: 'plugin'
          }],
          previewConfig: {
            'repos': ['/content-plugins/renderer'],
            plugins: [{
              'id': 'org.sunbird.player.endpage',
              ver: 1.0,
              type: 'plugin'
            }],
            showEndPage: false
          }

        }
        // Add search criteria
        if (searchService.updateReqForChannelFilter()) {
          window.config.searchCriteria = searchService.updateReqForChannelFilter()
        }

        $timeout(function () {
          $('#genericEditor').iziModal('open')
        }, 100)
      }

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        if (fromState.name === 'GenericEditor') {
          var state = $('#genericEditor').iziModal('getState')
          if (state === 'opened') {
            document.getElementById('genericEditor').remove()
          }
        }
      })

      genericEditor.openModel = function () {
        genericEditor.showModal = true
        $('#modalGenericEditor').modal('show')
        $timeout(function () {
          workSpaceUtilsService.hideRemoveModel('#modalGenericEditor')
          if (document.getElementById('genericEditor')) {
            document.getElementById('genericEditor').remove()
          }
          if (document.getElementById('modalGenericEditor')) {
            document.getElementById('modalGenericEditor').remove()
          }
          genericEditor.showModal = false
          if ($stateParams.state) {
            $state.go($stateParams.state)
          } else if ($rootScope.contentModelBackLinkName) {
            $state.go($rootScope.contentModelBackLinkName)
          } else {
            $state.go('WorkSpace.AllUploadedContent')
          }
        }, 2000)
      }

      genericEditor.getFramework = function () {
        searchService.getChannel().then(function (res) {
          if (res.responseCode === 'OK') {
            window.context.framework = res.result.channel.defaultFramework
            genericEditor.framework = res.result.channel.defaultFramework
          } else {
            window.context.framework = null
          }
          genericEditor.setContext()
        }).catch(function (error) {
          genericEditor.setContext()
          console.log('error is ......', error)
        })
      }

      if ($stateParams.framework) {
        genericEditor.setContext()
      } else {
        genericEditor.getFramework()
      }
    }])

'use strict'

angular.module('playerApp')
  .controller('GenericEditorController', ['config', '$stateParams', 'toasterService', '$sce',
    '$state', '$timeout', '$rootScope', 'contentService', 'permissionsService', 'workSpaceUtilsService',
    function (config, $stateParams, toasterService, $sce, $state, $timeout, $rootScope, contentService,
      permissionsService, workSpaceUtilsService) {
      var genericEditor = this
      genericEditor.contentId = (_.isUndefined($stateParams.contentId) ||
      _.isNull($stateParams.contentId)) ? '' : $stateParams.contentId
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
            ver: '1.0'
          },
          etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
          channel: org.sunbird.portal.channel,
          env: 'genericeditor'
        }

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
            ver: '1.1',
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

        $timeout(function () {
          $('#genericEditor').iziModal('open')
        }, 100)
      }

      genericEditor.openGenericEditor()

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
    }])

'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:genericEditorController
 * @description
 */
angular.module('playerApp')
  .controller('GenericEditorController', ['config', '$stateParams', 'toasterService', '$sce',
      '$state', '$timeout', '$rootScope', 'contentService', 'permissionsService', function (config,
    $stateParams, toasterService, $sce, $state, $timeout, $rootScope, contentService,
    permissionsService) {
          var genericEditor = this;
          genericEditor.contentId = (_.isUndefined($stateParams.contentId) || _.isNull($stateParams.contentId)) ? '' : $stateParams.contentId;
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
                  overlayColor: '',
                  onClosed: function () {
                      if ($stateParams.state) {
                          $state.go($stateParams.state);
                      } else {
                          $state.go('WorkSpace.DraftContent');
                      }
                  }
              });

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
                  channel: org.sunbird.portal.channel
              };

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
                      ver: '1.0',
                      type: 'plugin'
                  }]
              };

              $timeout(function () {
                  $('#genericEditor').iziModal('open');
              }, 100);
          };

          genericEditor.openGenericEditor();
      }]);

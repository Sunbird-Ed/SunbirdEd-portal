'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentEditorController', function(config, $stateParams, $location, $sce, $state, $rootScope) {

        var contentEditor = this;
        contentEditor.contentId = $stateParams.contentId;

        contentEditor.openContentEditor = function(contentId) {

            window.context = config.ekstep_CE_config.context;
            window.context.content_id = contentId;
            window.config = config.ekstep_CE_config.config;
            var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
            contentEditor.ekURL = $sce.trustAsResourceUrl(baseURL + "/ekContentEditor?contentId=" + contentId);
        };

        contentEditor.init = function() {
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:editor:editmeta", function() {
                var params = {contentId : contentEditor.contentId}
                $state.go("EditContent", params);
            });
            
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:editor:close", function() {
                $state.go("WorkSpace.DraftContent");
            });
            
            window.addEventListener('editor:metadata:edit', function(event, data) {
                console.info('Sunbird edit metadata is calling');
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:editmeta');
            });
            
             window.addEventListener('editor:window:close', function(event, data) {
                console.info('Sunbird editor is closing');
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close');
            });
        };
        
        contentEditor.init();
        contentEditor.openContentEditor($stateParams.contentId);
    });

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

        contentEditor.closeContentEditor = function() {
            $state.go("WorkSpace.DraftContent");
        };

        contentEditor.openEditContentForm = function() {
            $state.go("EditSlideShow");
        };

        contentEditor.init = function() {
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:editmetadata", function() {
                $state.go("EditSlideShow");
            });
            
            window.addEventListener('editor:metadata:edit', function(event, data) {
                console.info('Sunbird edit metadata is calling');
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editmetadata');
            });
        };
        contentEditor.init();
        contentEditor.openContentEditor($stateParams.contentId);
        
                
        

    });

'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentEditorController', function(config, $stateParams, $location, $sce, $state) {
        
        var contentEditor = this;
        contentEditor.contentId = $stateParams.contentId;
        
        contentEditor.openContentEditor = function(contentId) {
            
            window.context = config.ekstep_CE_config.context;
            window.context.content_id = contentId;
            window.config = config.ekstep_CE_config.config;
            var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
            contentEditor.ekURL = $sce.trustAsResourceUrl(baseURL+"/ekContentEditor?contentId="+contentId);
        };
        
        contentEditor.closeContentEditor = function() {
            $state.go("WorkSpace.DraftContent");
        };
        
        contentEditor.openEditContentForm = function() {
            $state.go("EditSlideShow");
        };
        
        contentEditor.openContentEditor($stateParams.contentId);
        
});
'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:collectionEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('CollectionEditorController', function(config, $stateParams, $location, $sce, $state, $rootScope) {

        var collectionEditor = this;
        collectionEditor.contentId = $stateParams.contentId;

        collectionEditor.opencollectionEditor = function(contentId, type) {
            window.collectionEditor = {};
            window.collectionEditor.config = config.collection_Editor_Config[type];
            window.collectionEditor.config.context.contentId = contentId;
            window.collectionEditor.config.context.ui = $rootScope.userId;
            var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
            collectionEditor.url = $sce.trustAsResourceUrl(baseURL + "/collectionEditor");
        };
        
        collectionEditor.opencollectionEditor($stateParams.contentId, $stateParams.type);
    });

'use strict';
/**
 * @ngdoc function
 * @name playerApp.controller:collectionEditorController
 * @description
 */
angular.module('playerApp')
  .controller('CollectionEditorController', function(config, $stateParams, toasterService, $sce, $state, $timeout, $rootScope, contentService, permissionsService) {

    var collectionEditor = this;
    collectionEditor.contentId = $stateParams.contentId;
    collectionEditor.openCollectionEditor = function(data) {

      $("#collectionEditor").iziModal({
        title: '',
        iframe: true,
        iframeURL: "/thirdparty/bower_components/collection-editor-iframe/index.html",
        navigateArrows: false,
        fullscreen: false,
        openFullscreen: true,
        closeOnEscape: false,
        overlayClose: false,
        overlay: false,
        overlayColor: '',
        onClosed: function() {
          if ($stateParams.state) {
            $state.go($stateParams.state);
          } else {
            $state.go("WorkSpace.DraftContent");
          }
        }
      });

      window.context = {
        user: {
          id: $rootScope.userId,
          name: $rootScope.firstName + ' ' + $rootScope.lastName
        },
        sid: $rootScope.sessionId,
        contentId: collectionEditor.contentId,
        pdata: {
            "id": org.sunbird.portal.appid,
            "ver": "1.0"
        },
        etags: { app: [], partner: [], dims: org.sunbird.portal.dims },
        channel: org.sunbird.portal.channel
      };

      window.config = {
        corePluginsPackaged: true,
        modalId: 'collectionEditor',
        dispatcher: 'local',
        apislug: '/action',
        alertOnUnload: true,
        headerLogo: !_.isUndefined($rootScope.orgLogo) ? $rootScope.orgLogo : '',
        loadingImage: '',
        plugins: [ { "id": "org.ekstep.sunbirdcollectionheader", "ver": "1.0", "type": "plugin" } ],
        localDispatcherEndpoint: '/collection-editor/telemetry',
        editorConfig: {
          "mode": "Edit",
          "contentStatus": "draft",
          "rules": {
            "levels": 3,
            "objectTypes": collectionEditor.getTreeNodes(data.type)
          },
          "defaultTemplate": {}
        }
      }

      window.config.editorConfig.publishMode = false;
      if ($stateParams.state === "WorkSpace.UpForReviewContent" && _.intersection(permissionsService.getCurrentUserRoles(), ['CONTENT_REVIEWER', 'CONTENT_REVIEW']).length > 0) {
        window.config.editorConfig.publishMode = true;
      }

      var validateModal = {
        state: ["WorkSpace.UpForReviewContent", "WorkSpace.ReviewContent", "WorkSpace.PublishedContents"],
        status: ["Review", "Draft", "Live"],
        mimeType: "application/vnd.ekstep.content-collection"
      };

      var req = { contentId: collectionEditor.contentId };
      var qs = { fields: 'createdBy,status,mimeType' }

      contentService.getById(req, qs).then(function(response) {
        if (response && response.responseCode === 'OK') {
            var rspData = response.result.content;
            rspData.state = $stateParams.state;
            rspData.userId = $rootScope.userId;

            if (collectionEditor.validateRequest(rspData, validateModal)) {
                collectionEditor.updateModeAndStatus(response.result.content.status);
                $timeout(function() {
                  $('#collectionEditor').iziModal('open');
                }, 100);
            } else {
                toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                $state.go('Home');
            }
        }
      });
    };

    collectionEditor.validateRequest = function(reqData, validateData) {
        var status = reqData.status;
        var createdBy = reqData.createdBy;
        var state = reqData.state;
        var userId = reqData.userId;
        var validateDataStatus = validateData.status;
        if (reqData.mimeType === validateData.mimeType) {
            var isStatus = _.indexOf(validateDataStatus, status) > -1 ? true : false;
            var isState = _.indexOf(validateData.state, state) > -1 ? true : false;
            if (isStatus && isState && createdBy !== userId) {
              return true;
            } else if (isStatus && isState && createdBy === userId) {
              return true;
            } else if (isStatus && createdBy === userId) {
              return true;
            } else {
              return false;
            }
        } else {
            return false;
        }
    };

    collectionEditor.getTreeNodes = function(type) {
      var editorConfig = [];
      switch (type) {
        case 'Course':
            editorConfig.push({ "type": "Course", "label": "Course", "isRoot": true, "editable": true, "childrenTypes": ["CourseUnit", "Collection", "Story", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-book" }, { "type": "CourseUnit", "label": "Course Unit", "isRoot": false, "editable": true, "childrenTypes": ["CourseUnit", "Collection", "Story", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
            return editorConfig;
        case 'Collection':
            editorConfig.push({ "type": "Collection", "label": "Collection", "isRoot": true, "editable": true, "childrenTypes": ["Collection", "Story", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
            return editorConfig;
        default:
            editorConfig.push({ "type": "TextBook", "label": "Textbook", "isRoot": true, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Story", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-book" }, { "type": "TextBookUnit", "label": "Textbook Unit", "isRoot": false, "editable": true, "childrenTypes": ["TextBookUnit", "Collection", "Story", "Worksheet"], "addType": "Editor", "iconClass": "fa fa-folder" }, { "type": "Collection", "label": "Collection", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Story", "label": "Story", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" }, { "type": "Worksheet", "label": "Worksheet", "isRoot": false, "editable": false, "childrenTypes": [], "addType": "Browser", "iconClass": "fa fa-file" });
            return editorConfig;
      }
    };

    collectionEditor.updateModeAndStatus = function(status) {
        if (status.toLowerCase() === "draft") {
            window.config.editorConfig.mode = "Edit";
            window.config.editorConfig.contentStatus = "draft";
        }
        if (status.toLowerCase() === "review") {
            window.config.editorConfig.mode = "Read";
            window.config.editorConfig.contentStatus = "draft";
        }
        if (status.toLowerCase() === "live") {
            window.config.editorConfig.mode = "Edit";
            window.config.editorConfig.contentStatus = "live";
        }
    }
    collectionEditor.openCollectionEditor($stateParams);
  });

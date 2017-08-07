angular.module('org.sunbird.header:headerApp', []).controller('mainController', ['$scope', function($scope) {

    var plugin = { id: "org.sunbird.header", ver: "1.0" };
    $scope.editorState = undefined;
    $scope.saveBtnEnabled = true;
    $scope.userDetails = !_.isUndefined(window.context) ? window.context.user : undefined;
    $scope.telemetryService = org.ekstep.contenteditor.api.getService(ServiceConstants.TELEMETRY_SERVICE);
    $scope.sunbirdLogo = ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/images/sunbird_logo.png");

    $scope.setEditorState = function(event, data) {
        if (data) $scope.editorState = data;
    };


    $scope.saveContent = function(event, options) {
        options = options || { successPopup: true, failPopup: true, callback: function(){} };
        if ($scope.saveBtnEnabled) {
            $scope.saveBtnEnabled = false;
            org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
            // TODO: Show saving dialog
            var contentBody = org.ekstep.contenteditor.stageManager.toECML();
            $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
                if (err) {
                    if (res && !ecEditor._.isUndefined(res.responseJSON)) {
                        // This could be converted to switch..case to handle different error codes
                        if (res.responseJSON.params.err == "ERR_STALE_VERSION_KEY")
                            $scope.showConflictDialog(options);
                    } else {
                        if(options && options.failPopup) $scope.saveNotification('error');
                    }
                } else if (res && res.data.responseCode == "OK") {
                    if(options && options.successPopup) $scope.saveNotification('success');
                }
                $scope.saveBtnEnabled = true;
                if (typeof options.callback === "function") options.callback(err, res);
            }, options);
        }
    }

    $scope.saveBrowserContent = function(event, options) {
        // Fetch latest versionKey and then save the content from browser
        $scope.fetchPlatformContentVersionKey(function(platformContentVersionKey) {
            //Invoke save function here...
            $scope.saveContent(event, options);
        });
    }

    $scope.patchContent = function(metadata, body, cb, options) {
        if (org.ekstep.contenteditor.migration.isMigratedContent()) {
            if (!metadata) metadata = {};
            metadata.oldContentBody = $scope.oldContentBody;
            metadata.editorState = JSON.stringify($scope.editorState);
            var migrationPopupCb = function(err, res) {
                if (res) $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
                if (err) options && options.callback('save action interrupted by user');
            }
            $scope.showMigratedContentSaveDialog(migrationPopupCb);
        } else {
            metadata.editorState = JSON.stringify($scope.editorState);
            $scope.contentService.saveContent(org.ekstep.contenteditor.api.getContext('contentId'), metadata, body, cb);
        }
    }

    $scope.showMigratedContentSaveDialog = function(callback) {
        var instance = $scope;
        $scope.popupService.open({
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/partials/migratedContentSaveMsg.html"),
            controller: ['$scope', function($scope) {
                $scope.saveContent = function() {
                    org.ekstep.contenteditor.migration.clearMigrationFlag();                    
                    callback(undefined, true);
                }

                $scope.enableSaveBtn = function() {
                    instance.saveBtnEnabled = true;
                    callback(true, undefined);
                }
            }],
            showClose: false,
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.routeToContentMeta = function(save) {
        if (save) {
            org.ekstep.pluginframework.eventManager.dispatchEvent('content:before:save');
            var contentBody = org.ekstep.contenteditor.stageManager.toECML();
            $scope.patchContent({ stageIcons: JSON.stringify(org.ekstep.contenteditor.stageManager.getStageIcons()) }, contentBody, function(err, res) {
                if (res) {
                    $scope.saveNotification('success');
                    window.location.assign(window.context.editMetaLink);
                }
                if (err) $scope.saveNotification('error');
            });
        } else {
            window.location.assign(window.context.editMetaLink);
        }
    };

    $scope.saveNotification = function(message) {
        var template = (message === 'success') ? "editor/partials/saveSuccessMessage.html" : "editor/partials/saveErrorMessage.html";
        var config = {
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, template),
            controller: ['$scope', 'mainCtrlScope', function($scope, mainCtrlScope) {
                $scope.fireTelemetry = function(menu, menuType) {
                    mainCtrlScope.fireTelemetry(menu, menuType);
                }
            }],
            resolve: {
                mainCtrlScope: function() {
                    return $scope;
                }
            },
            showClose: false
        }
        $scope.popupService.open(config);
    };

    $scope.showConflictDialog = function(options) {
        var instance = $scope;
        $scope.popupService.open({
            template: ecEditor.resolvePluginResource(plugin.id, plugin.ver, "editor/partials/conflictDialog.html"),
            controller: ['$scope', function($scope) {
                //Platform copy
                $scope.previewPlatformContent = function() {
                    instance.previewPlatformContent();
                };
                $scope.saveBrowserContent = function() {
                    instance.saveBrowserContent(undefined, options);
                    $scope.closeThisDialog();
                };
                //Existing copy
                $scope.previewContent = function() {
                    instance.previewContent();
                };
                $scope.refreshContent = function() {
                    instance.refreshContent();
                };
                $scope.firetelemetry = function(menu, menuType) {
                    instance.telemetryService.interact({ "type": "click", "subtype": "popup", "target": menuType, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
                };
                $scope.showAdvancedOption = false;
            }],
            className: 'ngdialog-theme-plain header-conflict-dialog',
            showClose: false,
            closeByDocument: true,
            closeByEscape: true
        });
    };

    $scope.editContentMeta = function() {
        /**
         * Dispatching custom event to parent;
         */
        var editMetadata = new CustomEvent('editor:metadata:edit')
        window.parent.dispatchEvent(editMetadata);

    };

    $scope.sendForReview = function(contentId) {
        /**
         * Dispatching custom event to parent;
         */
        console.log("sendForReview event called");
        var send = new CustomEvent('editor:content:review', {
                "detail": {
                    "contentId": contentId
                }
            });
        window.parent.dispatchEvent(send);

    };

    $scope.closeEditor = function(){
         /**
         * Dispatching custom event to parent;
         */
        var closeEditor = new CustomEvent('editor:window:close')
        window.parent.dispatchEvent(closeEditor);

    };

    $scope.previewContent = function(fromBeginning) {
        var currentStage = _.isUndefined(fromBeginning) ? true : false;
        org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: org.ekstep.contenteditor.stageManager.toECML(), 'currentStage': currentStage });
    };

    $scope.refreshContent = function() {
        // Refresh the browser as user want to fetch the version from platform
        location.reload();
    }

    $scope.previewPlatformContent = function() {
        // Fetch latest content body from Platform and then show preview
        $scope.fetchPlatformContentBody(function(platformContentBody) {
            org.ekstep.pluginframework.eventManager.dispatchEvent("atpreview:show", { contentBody: platformContentBody, 'currentStage': true });
        });
    };

    $scope.fetchPlatformContentVersionKey = function(cb) {
        // Get the latest VersionKey and then save content
        org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContentVersionKey(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
            if (err) {
                alert("Failed to get updated version key. Please report an issue.");
            }
            // if versionKey is available, pass success and save
            if (content.versionKey) {
                cb(content);
            }
        });
    };

    $scope.fetchPlatformContentBody = function(cb) {
        // Get the latest VersionKey and then save content
        org.ekstep.contenteditor.api.getService(ServiceConstants.CONTENT_SERVICE).getContent(org.ekstep.contenteditor.api.getContext('contentId'), function(err, content) {
            if (err) {
                alert("Failed to get updated content. Please report an issue.");
            }
            if (content && content.body) {
                try {
                    var contentBody = JSON.parse(content.body);
                    cb(contentBody);
                } catch (e) {
                    alert("Failed to parse body from platform. Please report an issue.");
                    //contentBody = $scope.convertToJSON(content.body);
                }
            }
        });
    };

    $scope.fireEvent = function(event) {
        if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
    };

    $scope.fireTelemetry = function(menu, menuType) {
        $scope.telemetryService.interact({ "type": "click", "subtype": "menu", "target": menuType, "pluginid": 'org.ekstep.ceheader', 'pluginver': '1.0', "objectid": menu.id, "stage": org.ekstep.contenteditor.stageManager.currentStage.id });
    };

    ecEditor.addEventListener('org.ekstep.editorstate:state', $scope.setEditorState, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:save', $scope.saveContent, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:save:force', $scope.saveBrowserContent, $scope);
    ecEditor.addEventListener('org.ekstep.ceheader:meta:edit', $scope.editContentMeta, $scope);
    org.ekstep.contenteditor.api.jQuery('.browse.item.at').popup({ on: 'click', setFluidWidth: false, position: 'bottom right' });

}]);

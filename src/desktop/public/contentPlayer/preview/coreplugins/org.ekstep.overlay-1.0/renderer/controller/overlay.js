'use strict';

app.controllerProvider.register("OverlayController", function($scope, $rootScope, $compile, $stateParams) {
    var globalConfig = EkstepRendererAPI.getGlobalConfig();
    $rootScope.isItemScene = false;
    $rootScope.menuOpened = false;
    $rootScope.stageId = undefined;
    $scope.state_off = "off";
    $scope.state_on = "on";
    $scope.state_disable = "disable";
    $scope.showOverlayGoodJob = true;
    $scope.showOverlayTryAgain = true;
    $scope.overlayEvents = ["overlaySubmit", "overlayMenu", "overlayReload", "overlayGoodJob", "overlayTryAgain"];
    $scope.overlayVisible = false;
    $scope.pluginInstance = undefined;
    $scope.imageBasePath = globalConfig.assetbase;
    $scope.showTeacherIns = true;
    $scope.showReload = true;
    $scope.showContentClose = false;
    $scope.init = function() {

        /**
         * renderer:overlay:show event to show the overlay on top the content.
         * @event renderer:overlay:show
         * @listens renderer:overlay:show
         * @memberof EkstepRendererEvents
         */
        EkstepRendererAPI.addEventListener("renderer:overlay:show", $scope.showOverlay);

        /**
         * renderer:overlay:hide event to hide the overlay.
         * @event renderer:overlay:hide
         * @listens renderer:overlay:hide
         * @memberof EkstepRendererEvents
         */

        EkstepRendererAPI.addEventListener("renderer:overlay:hide", $scope.hideOverlay);

        EkstepRendererAPI.addEventListener("renderer:content:start", $scope.showOverlay);

        $scope.pluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.overlay");
        if (globalConfig.languageInfo) {
            for (var key in globalConfig.languageInfo) {
                AppLables[key] = globalConfig.languageInfo[key];
            }
        }
        $scope.AppLables = AppLables;
        if (!_.isUndefined(globalConfig.overlay.menu) && !globalConfig.overlay.menu.showTeachersInstruction)
            $scope.showTeacherIns = globalConfig.overlay.menu.showTeachersInstruction;
        if (!globalConfig.overlay.showReload)
            $scope.showReload = globalConfig.overlay.showReload;
        if (globalConfig.overlay.showContentClose)
            $scope.showContentClose = globalConfig.overlay.showContentClose;
        var evtLenth = $scope.overlayEvents.length;
        for (var i = 0; i < evtLenth; i++) {
            var eventName = $scope.overlayEvents[i];
            EventBus.addEventListener(eventName, $scope.overlayEventHandler, $scope);
        }


        /**
         * sceneEnter event will tigger when the scene is got changed(i.e. when user navigates form one scene to another scene)
         * @event sceneEnter
         * @listens sceneEnter
         * @memberof EkstepRendererEvents
         */

        EventBus.addEventListener("sceneEnter", function(data) {
            $scope.showOverlay();
            $rootScope.stageData = data.target;
            $rootScope.stageId = !_.isUndefined($rootScope.stageData) ? $rootScope.stageData._id : undefined;
        });
        if ($scope.pluginInstance) {
            console.log("Show overlay is failed to on event handler");
            if (globalConfig.overlay.showOverlay) {
                $scope.overlayVisible = $scope.pluginInstance.overlayVisible;
                $scope.safeApply();
            }
        }
    }

    $scope.showOverlay = function() {
        if (!globalConfig.overlay.showOverlay) return;

        $scope.overlayVisible = true;
        $scope.safeApply();
    }

    $scope.hideOverlay = function() {
        $scope.overlayVisible = false;
        $scope.safeApply();
    }

    $scope.navigate = function(navType) {
        if (!$rootScope.content) {
            // if $rootScope.content is not available get it from the base controller
            org.ekstep.contentrenderer.getContentMetadata($stateParams.itemId);
        }
        GlobalContext.currentContentId = $rootScope.content.identifier;
        GlobalContext.currentContentMimeType = $rootScope.content.mimeType;
        TelemetryService.interact("TOUCH", navType, null, {
            stageId: EkstepRendererAPI.getCurrentStageId()
        });
        if (navType === "next") {

        /**
         * actionNavigateNext  event used to navigate to next stage from the current stage of the content.
         * @event actionNavigateNext
         * @fires actionNavigateNext
         * @memberof EkstepRendererEvents
         */
            EventBus.dispatch("actionNavigateNext", navType);
            EventBus.dispatch("nextClick");

        } else if (navType === "previous") {

        /**
         * actionNavigatePrevious  event used to navigate to previous stage from the current stage of the content.
         * @event actionNavigatePrevious
         * @fires actionNavigatePrevious
         * @memberof EkstepRendererEvents
         */
            EventBus.dispatch("actionNavigatePrevious", navType);
            EventBus.dispatch("previousClick");
        }
    }

    $scope.loadOverlay = function() {
        var gameArea = angular.element('#gameArea');
    }

    $rootScope.defaultSubmit = function() {
        /**
         * actionDefaultSubmit  will dispatch to eval the item(question's).
         * @event actionDefaultSubmit
         * @fires actionDefaultSubmit
         * @memberof EkstepRendererEvents
         */
        EventBus.dispatch("actionDefaultSubmit");
    }

    $scope.openUserSwitchingModal = function() {
        TelemetryService.interact("TOUCH", "gc_open_userswitch", "TOUCH", {
            stageId: EkstepRendererAPI.getCurrentStageId() ? EkstepRendererAPI.getCurrentStageId() : $rootScope.pageId
        });

        /**
         * actionDefaultSubmit  event used to show the userswitch model.
         * @event event:openUserSwitchingModal
         * @fires event:openUserSwitchingModal
         * @memberof EkstepRendererEvents
         */
        EventBus.dispatch("event:openUserSwitchingModal");
        $scope.hideMenu();
    }

    $scope.overlayEventHandler = function(event) {
        //Switch case to handle HTML elements(Next, Previous, Submit, etc..)
        switch (event.type) {
            case "overlaySubmit":
                if (event.target === "off") {
                    $scope.showOverlaySubmit = false;
                } else {
                    $scope.showOverlaySubmit = true;
                    (event.target === "disable") ? $rootScope.enableEval = false: $rootScope.enableEval = true;
                }
                break;
            case "overlayMenu":
                break;
            case "overlayReload":
                break;
            case "overlayGoodJob":
                $scope.showOverlayGoodJob = event.target;
                EkstepRendererAPI.addEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hidePopup, $scope);
                break;
            case "overlayTryAgain":
                $scope.showOverlayTryAgain = event.target;
                EkstepRendererAPI.addEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hidePopup, $scope);
                break;
            default:
                break;
        }
        $rootScope.safeApply();
    }

    $scope.openMenu = function() {
        //display a layer to disable clicking and scrolling on the gameArea while menu is shown
        if (jQuery('.menu-overlay').css('display') == "block") {
            $scope.hideMenu();
            return;
        }
        $scope.menuOpened = true;
        TelemetryService.interact("TOUCH", "gc_menuopen", "TOUCH", {
            stageId: $rootScope.stageId
        });
        jQuery('.menu-overlay').css('display', 'block');
        jQuery(".gc-menu").show();
        jQuery(".gc-menu").animate({
            "marginLeft": ["0%", 'easeOutExpo']
        }, 700, function() {});
        EkstepRendererAPI.addEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hideMenu, $scope);
    }

    $scope.hideMenu = function() {
        if (EkstepRendererAPI.hasEventListener(EkstepRendererEvents['renderer:device:back'])) EkstepRendererAPI.removeEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hideMenu, $scope);
        $scope.menuOpened = false;
        TelemetryService.interact("TOUCH", "gc_menuclose", "TOUCH", {
            stageId: $rootScope.stageId
        });
        jQuery('.menu-overlay').css('display', 'none');
        jQuery(".gc-menu").animate({
            "marginLeft": ["-35%", 'easeOutExpo']
        }, 700, function() {});
        $rootScope.safeApply();
    }

    $scope.replayContent = function() {
        var data = {
            'interactId': 'ge_replay',
            'callback': $scope.replayCallback
        };
        $scope.hideMenu();
        EkstepRendererAPI.dispatchEvent('renderer:content:close', undefined, data);
    }

    $scope.replayCallback = function() {
        /**
         * renderer:content:replay  event used to replay the current playing content.
         * @event renderer:content:replay
         * @fires renderer:content:replay
         * @memberof EkstepRendererEvents
         */
        if (content.primaryCategory && content.primaryCategory.toLowerCase() === 'course assessment'){
            org.ekstep.service.content.checkMaxLimit(content).then(function(response){
                if(response){
                    window.postMessage({
                        event: 'renderer:maxLimitExceeded',
                        data: {
                        }
                    })
                } else{
                    EkstepRendererAPI.dispatchEvent('renderer:content:replay');
                }
            });
        }else{
            EkstepRendererAPI.dispatchEvent('renderer:content:replay');
        }
    }

    $scope.init();
});

app.compileProvider.directive('mute', function($rootScope) {
    return {
        restrict: 'E',
        template: '<div ng-click="toggleMute()"><img ng-src="{{muteImg}}"/><span> Turn {{AppLables.mute}} Sound </span></div>',
        link: function(scope, url) {

            /**
             * renderer:overlay:unmute  event used to unmute the content audio from the menu.
             * @event renderer:overlay:unmute
             * @listens renderer:overlay:unmute
             * @memberof EkstepRendererEvents
             */

            EkstepRendererAPI.addEventListener('renderer:overlay:unmute', function() {
                scope.muteImg = scope.imageBasePath + "audio_icon.png";
                AppLables.mute = "Off";
                AudioManager.unmute();
            });

            /**
             * renderer:overlay:mute  event used to mute the content audio from the menu.
             * @event renderer:overlay:mute
             * @listens renderer:overlay:mute
             * @memberof EkstepRendererEvents
             */
            EkstepRendererAPI.addEventListener('renderer:overlay:mute', function() {
                    AudioManager.mute();
                    scope.muteImg = scope.imageBasePath + "audio_mute_icon.png";
                    AppLables.mute = "On";
            });
            EkstepRendererAPI.dispatchEvent('renderer:overlay:unmute');
            scope.toggleMute = function() {
                if (AudioManager.muted) {
                    EkstepRendererAPI.dispatchEvent('renderer:overlay:unmute');
                } else {
                    EkstepRendererAPI.dispatchEvent('renderer:overlay:mute');
                }
                TelemetryService.interact("TOUCH", AudioManager.muted ? "gc_mute" : "gc_unmute", "TOUCH", {
                    stageId: EkstepRendererAPI.getCurrentStageId()
                });
            }
        }
    }
});

app.compileProvider.directive('reloadStage', function($rootScope) {
    return {
        restrict: 'E',
        template: '<span class="reload-stage" onclick="EventBus.dispatch(\'actionReload\')"><img id="reload_id" ng-show="reload !== state_off" ng-src="{{imageBasePath}}icn_replayaudio.png" style="width:100%;"/></span>',
        link: function(scope) {

            scope.toggleReload = function(event) {
                var val;
                var globalConfig = EkstepRendererAPI.getGlobalConfig();
                var defaultValue = globalConfig.overlay.showReload ? "on" : "off";
                switch (event.type) {
                    case "renderer:stagereload:show":
                        val = "on";
                        break;
                    case "renderer:stagereload:hide":
                        val = "off";
                        break;
                    default:
                        val = defaultValue;
                }
                scope.reload = val;
                $rootScope.safeApply();
            };
            /**
             * 'renderer:stagereload:show' Event to show the stage reload icon.
             * @event renderer:stagereload:show
             * @listen renderer:stagereload:show
             * @memberOf EkstepRendererEvents
             */
            EkstepRendererAPI.addEventListener("renderer:stagereload:show", scope.toggleReload, scope);
            /**
             * 'renderer:stagereload:hide' Event to hide the stage reload icon.
             * @event renderer:stagereload:hide
             * @listen renderer:stagereload:hide
             * @memberOf EkstepRendererEvents
             */
            EkstepRendererAPI.addEventListener("renderer:stagereload:hide", scope.toggleReload, scope)
        }
    }
});

app.compileProvider.directive('menu', function($rootScope, $sce) {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope) {
            scope.navigationTop = false;
            scope.getTemplate = function() {
                return scope.pluginInstance._menuTP;
            }
            scope.changeNavigation = function (event) {
                switch (event.target.tempName) {
                    case "navigationTop": scope.navigationTop = true; break;
                    default: scope.navigationTop = false; break;
                }
            }
			EkstepRendererAPI.addEventListener("renderer:navigation:load", scope.changeNavigation, scope);
        },
        template: "<div ng-include=getTemplate()></div>"
    }
});

app.compileProvider.directive('stageInstructions', function($rootScope) {
    return {
        restrict: 'E',
        template: '<div ng-class="{\'icon-opacity\' : !stageData.params.instructions}" ng-click="showInstructions()"><img ng-src="{{imageBasePath}}icn_teacher.png" style="z-index:2;" alt="note img"/><span> {{AppLables.instructions}} </span></div>',
        controller: function($scope, $rootScope) {
            $scope.stageInstMessage = "";
            $scope.showInst = false;

            $scope.showInstructions = function() {
                $scope.stageInstMessage = ($rootScope.stageData && $rootScope.stageData.params && $rootScope.stageData.params.instructions) ? $rootScope.stageData.params.instructions : null;

                $scope.showInst = ($scope.stageInstMessage != null) ? true : false;
                $scope.logIntract("gc_showInst");
            }

            $scope.closeInstructions = function() {
                $scope.showInst = false;
                $scope.logIntract("gc_closeInst");
            }

            $scope.logIntract = function(eleId) {
                TelemetryService.interact("TOUCH", eleId, "TOUCH", {
                    stageId: Renderer.theme._currentStage
                });
            }

            /*
             * If menu is getting hide, then hide teacher instructions as well
             */
            $scope.$watch("menuOpened", function() {
                if (!$rootScope.menuOpened) {

                    $scope.showInst = false;
                }
            });
        }
    }
});

app.compileProvider.directive('assess', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            show: '='
        },
        template: '<a class="assess" ng-class="assessStyle" href="javascript:void(0);" ng-click="onSubmit()">{{showOverlaySubmit}} <!-- enabled --><img ng-src="{{image}}"/></a>',
        link: function(scope, element) {
            scope.labelSubmit = AppLables.submit;
        },
        controller: function($scope, $rootScope, $timeout) {
            $scope.isEnabled = false;
            $scope.assessStyle = 'assess-disable';

            $rootScope.$watch('enableEval', function() {
                $scope.isEnabled = $rootScope.enableEval;
                if ($scope.isEnabled) {
                    $timeout(function() {
                        // This timeout is required to apply the changes(because it is calling by JS)
                        $scope.assessStyle = 'assess-enable';
                        $scope.image = globalConfig.assetbase + "submit_enable.png";
                    }, 100);
                } else {
                    //Disable state
                    $scope.assessStyle = 'assess-disable';
                    $scope.image = globalConfig.assetbase + "submit_disable.png";
                }
            });

            $scope.onSubmit = function() {
                if ($scope.isEnabled) {
                    $rootScope.defaultSubmit();
                    EventBus.dispatch("submitClick");
                }
            }
        }
    }
});

app.compileProvider.directive('goodJob', function($rootScope) {
    return {
        restrict: 'E',
        template: '<div class="popup"> <div class="popup-overlay" ng-click="hidePopup()"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-goodjob-popup"> <div class="correct-answer" style=" text-align: center;"> <div class="banner"> <img ng-src="{{imageBasePath}}banner3.png" height="100%" width="100%"> </div> <div class="sign-board"> <img ng-src="{{imageBasePath}}check.png" id="correctButton" width="40%" /> </div> </div> <div id="popup-buttons-container"> <div ng-click="hidePopup(); moveToNextStage(\'next\');" class="primary center button">{{AppLables.next}}</div> </div> </div> </div> </div>',
        controller: function($scope, $rootScope, $timeout) {
            $scope.retryAssessment = function(id, e) {
                $scope.hidePopup(id);
                EventBus.dispatch("retryClick");
            }

            $scope.hidePopup = function(id) {
                TelemetryService.interact("TOUCH", id ? id : "gc_popupclose", "TOUCH", {
                    stageId: ($rootScope.pageId == "endpage" ? "endpage" : $rootScope.stageId)
                });
                window.PLAYER_STAGE_START_TIME = Date.now()/1000;
                if (EkstepRendererAPI.hasEventListener(EkstepRendererEvents['renderer:device:back'])) EkstepRendererAPI.removeEventListener(EkstepRendererEvents['renderer:device:back'], $scope.hidePopup, $scope);
                $scope.showOverlayGoodJob = false;
                $scope.showOverlayTryAgain = false;
                $rootScope.safeApply();
            }

            $scope.moveToNextStage = function(navType) {
                EkstepRendererAPI.unRegisterEval();
                EventBus.dispatch("actionNavigateSkip", navType);
                EventBus.dispatch("skipClick");
            }
        }
    }
});

app.compileProvider.directive('tryAgain', function($rootScope) {
    return {
        restrict: 'E',
        template: '<div class="popup"> <div class="popup-overlay" ng-click="hidePopup()"></div> <div class="popup-full-body"> <div class="font-lato assess-popup assess-tryagain-popup"> <div class="wrong-answer" style=" text-align: center;"> <div class="banner"> <img ng-src="{{imageBasePath}}banner2.png" height="100%" width="100%"> </div> <div class="sign-board"><img ng-src="{{imageBasePath}}incorrect.png" width="40%" id="incorrectButton" /> </div> </div> <div id="popup-buttons-container"> <div ng-click="hidePopup(); moveToNextStage(\'next\');" class="left button">{{AppLables.next}}</div> <div ng-click="retryAssessment(\'gc_retry\', $event);" href="javascript:void(0);" class="right primary button">{{AppLables.tryAgain}}</div> </div> </div> </div> </div>'
    }
});

app.compileProvider.directive('contentClose', function($rootScope) {
    return {
        restrict: 'E',
        template: '<span class="content-close" ng-click="closeContent();" ng-show="showContentClose !== state_off"><img id="content_close" ng-src="{{contentCloseIcon}}" style="width:100%;"/></span>',
        link: function(scope) {
            scope.contentCloseIcon = EkstepRendererAPI.resolvePluginResource(scope.pluginInstance._manifest.id, scope.pluginInstance._manifest.ver, "renderer/assets/icons/content-close.png");

            scope.toggleContentClose = function(event) {
                var val;
                var globalConfig = EkstepRendererAPI.getGlobalConfig();
                var defaultValue = globalConfig.overlay.showContentClose ? "on" : "off";
                switch (event.type) {
                    case "renderer:contentclose:show":
                        val = "on";
                        break;
                    case "renderer:contentclose:hide":
                        val = "off";
                        break;
                    default:
                        val = defaultValue;
                }
                scope.showContentClose = val;
                $rootScope.safeApply();
            };

            scope.closeContent = function () {
                EkstepRendererAPI.dispatchEvent('renderer:content:end');
                EventBus.dispatch('actionContentClose');
                TelemetryService.interact("TOUCH", "content_close", "TOUCH", {
                    stageId: $rootScope.stageId
                });
            };

            /**
             * renderer:contentclose:show Event to show the close icon.
             * @event renderer:contentclose:show
             * @listen renderer:contentclose:show
             * @memberOf EkstepRendererEvents
             */
            EkstepRendererAPI.addEventListener("renderer:contentclose:show", scope.toggleContentClose, scope);
            /**
             * renderer:contentclose:hide Event to hide the close icon.
             * @event renderer:contentclose:hide
             * @listen renderer:contentclose:hide
             * @memberOf EkstepRendererEvents
             */
            EkstepRendererAPI.addEventListener("renderer:contentclose:hide", scope.toggleContentClose, scope)
        }
    }
});

//#sourceURL=overlay.js
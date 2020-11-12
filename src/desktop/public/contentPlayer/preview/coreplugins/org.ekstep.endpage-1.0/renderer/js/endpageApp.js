
app.controllerProvider.register("endPageController", function($scope, $rootScope, $state,$element, $stateParams) {
    var globalConfig = EkstepRendererAPI.getGlobalConfig();
    $scope.showEndPage = false;
    $scope.showFeedbackArea = true;
    $scope.commentModel = '';
    $scope.showFeedbackPopup = false;
    $scope.userRating = 0;
    $scope.popUserRating = 0;
    $scope.stringLeft = 130;
    $scope.selectedRating = 0;
    $scope.creditsBody = '<div class="gc-popup-new credit-popup"><div class="gc-popup-title-new"> {{AppLables.credit}}</div> <div class="gc-popup-body-new"><div class="font-lato credit-body-icon-font"><div class="content-noCredits" ng-show="content.imageCredits == null && content.voiceCredits == null && content.soundCredits == null">{{AppLables.noCreditsAvailable}}</div><table style="width:100%; table-layout: fixed;"><tr ng-hide="content.imageCredits==null"><td class="credits-title">{{AppLables.image}}</td><td class="credits-data">{{content.imageCredits}}</td></tr><tr ng-hide="content.voiceCredits==null"><td class="credits-title">{{AppLables.voice}}</td><td class="credits-data">{{content.voiceCredits}}</td></tr><tr ng-hide="content.soundCredits==null"><td class="credits-title">{{AppLables.audio}}</td><td class="credits-data">{{content.soundCredits}}</td></tr></table></div></div></div>';
    $scope.imageBasePath = globalConfig.assetbase;
    $scope.pluginInstance = {};
    $scope.arrayToString = function(array) {
        return (_.isString(array)) ? array : (!_.isEmpty(array) && _.isArray(array)) ? array.join(", ") : "";
    };
    $scope.ep_openUserSwitchingModal = function() {
        EventBus.dispatch("event:openUserSwitchingModal", {'logGEEvent': $scope.pluginInstance._isAvailable});
    };
    $scope.setCredits = function(key) {
        if ($scope.content[key]) {
            $scope.content[key] = $scope.arrayToString($scope.content[key]);
        } else {
            $scope.content[key] = null;
        }
    };
    $scope.setLicense = function(){
        $scope.licenseAttribute = $scope.content.license || 'CC BY 4.0'
    };
    $scope.showCredits = function(key) {
        if ($scope.content.imageCredits == null && $scope.content.voiceCredits == null && $scope.content.soundCredits == null) {
            console.warn("No metadata imageCredits,voiceCredites and soundCredits");
        }
        $scope.CreditPopup = true;
        TelemetryService.interact("TOUCH", "gc_credit", "TOUCH", {stageId: "ContentApp-CreditsScreen", subtype: ""}, "GE_INTERACT");
    }
    $scope.replayContent = function() {
        var data = {
            'interactId' : 'ge_replay',
            'callback': $scope.replayCallback
        };
        EkstepRendererAPI.dispatchEvent('renderer:content:close', undefined, data);
    }
    $scope.replayCallback = function(){
        EkstepRendererAPI.hideEndPage();
        EkstepRendererAPI.dispatchEvent('renderer:content:replay');
    }
    $scope.showFeedback = function(param) {
        $scope.userRating = param;
        $scope.popUserRating = param;
        $scope.showFeedbackPopup = true;
        $scope.enableFeedbackSubmit();
    }

    $scope.updatePopUserRating = function(param) {
        $scope.popUserRating = param;
        $scope.enableFeedbackSubmit();
    }
    $scope.enableFeedbackSubmit = function() {
        $scope.enableFeedBackButton  =  $scope.popUserRating > 0 || $scope.stringLeft < 130 ? false : true
    }

    $scope.submitFeedback = function() {
        $scope.userRating = $scope.popUserRating;
        $scope.selectedRating = $scope.userRating;
        $scope.hideFeedback();
        var eks = {
            type: "RATING",
            rating: $scope.userRating,
            context: {
                type: "Content",
                id: $rootScope.content.identifier,
                stageid: $rootScope.pageId
            },
            comments: jQuery('#commentText').val()
        }
        TelemetryService.sendFeedback(eks);
    }
    $scope.hideFeedback = function() {
        $scope.showFeedbackPopup = false;
        $scope.stringLeft = 130;
        $scope.userRating = $scope.selectedRating;
    }
    $scope.setTotalTimeSpent = function() {
        var endEvent = _.filter(TelemetryService._data, function(event) {
            if (event) {
                return event.name == "OE_END";
            }
        })
        var startTime = endEvent.length > 0 ? endEvent[endEvent.length - 1].startTime : 0;
        console.log("startTime: ", startTime);
        if (startTime) {
            var totalTime = Math.round((new Date().getTime() - startTime) / 1000);
            var mm = Math.floor(totalTime / 60);
            var ss = Math.floor(totalTime % 60);
            $scope.totalTimeSpent = (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
            console.log("$scope.totalTimeSpent: ", $scope.totalTimeSpent);
        } else {
            $scope.showFeedbackArea = false;
        }
    }
    $scope.getTotalScore = function(id) {
        if ("undefined" != typeof cordova) {
            org.ekstep.service.content.getLearnerAssessment(GlobalContext.user.uid, id, GlobalContext.game.contentExtras)
                .then(function(score) {
                    if (score && score.total_questions) {
                        $scope.showScore = true;
                        $scope.$apply(function() {
                            $scope.totalScore = (score.total_correct + "/" + score.total_questions);
                        });
                    } else {
                        $scope.showScore = false
                    }
                })
        } else {
            $scope.showScore = false
        }
    }
    $scope.commentLength = function() {
        if ($('#commentText').val().length > 130)
            $('#commentText').val($('#commentText').val().slice(0, 130));
        $scope.stringLeft = 130 - $('#commentText').val().length;
        $scope.enableFeedbackSubmit();
    }
    $scope.handleEndpage = function() {
        $rootScope.pageId = "ContentApp-Endpage";
        $scope.pluginInstance = EkstepRendererAPI.getPluginObjs("org.ekstep.endpage")
        $scope.setLicense();
        TelemetryService.interact("TOUCH", $rootScope.content.identifier, "TOUCH", {
            stageId: "ContentApp-EndScreen",
            subtype: ""
        }, "GE_INTERACT");
        EkstepRendererAPI.dispatchEvent('renderer:init:relatedContent');
        var creditsPopup = angular.element(jQuery("popup[id='creditsPopup']"));
        creditsPopup.trigger("popupUpdate", {
            "content": $rootScope.content
        });
        setTimeout(function() {
            $rootScope.$apply();
        }, 1000);
        $scope.setCredits('imageCredits');
        $scope.setCredits('soundCredits');
        $scope.setCredits('voiceCredits');
        window.addEventListener('native.keyboardshow', epKeyboardShowHandler, true);
        window.addEventListener('native.keyboardhide', epKeyboardHideHandler, true);
        EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
        $scope.setTotalTimeSpent();
        $scope.getTotalScore($rootScope.content.identifier);
        $scope.showFeedback(0);
    }

    function epKeyboardShowHandler() {
        angular.element('#gcFbPopup').addClass('gc-fc-popup-keyboard');
    }
    function epKeyboardHideHandler() {
        angular.element('#gcFbPopup').removeClass('gc-fc-popup-keyboard');
    }
    $scope.initEndpage = function() {
        $scope.handleEndpage();
    };

    /**
     * renderer:endpage:show Event to show the endpage.
     * @event renderer:endpage:show
     * @listen renderer:endpage:show
     * @memberOf EkstepRendererEvents
     */
    EkstepRendererAPI.addEventListener('renderer:endpage:show', function() {
        $scope.showEndPage = true;
        $scope.initEndpage();
        $scope.safeApply();
    });

    /**
     * renderer:endpage:hide Event to hide the endpage.
     * @event renderer:endpage:hide
     * @listen renderer:endpage:hide
     * @memberOf EkstepRendererEvents
     */
    EkstepRendererAPI.addEventListener('renderer:endpage:hide',function() {
        $scope.showEndPage = false;
        $scope.safeApply();
    });
});
app.controllerProvider.register('RelatedContentCtrl', function($scope, $rootScope, $state, $stateParams) {
        $scope.showRelatedContent = false;
        $scope.contentShowMore = false;
        $scope.showRelatedContentHeader = true;
        $scope.relatedContents = [];
        $scope.relatedContentResp = null;
        $scope.contentExtras = undefined;

        $scope.playRelatedContent = function(content, index) {
            var contentId = [];
            // collectionPath = $scope.relatedContentPath;

            // If hierarchyInfo is available then it's a collection or textbook, else it's a related content
            var eleId = content.hierarchyInfo ? "gc_nextcontent" : "gc_relatedcontent";

            var values = [];
            var contentIds = [];
            TelemetryService.interact("TOUCH", eleId, "TOUCH", {
                stageId: $rootScope.pageId,
                subtype: "",
                values: values
            }, "GE_INTERACT");
            GlobalContext.game.id = content.identifier
            GlobalContext.game.pkgVersion = content.pkgVersion;

            // Check is content is downloaded or not in Genie.
            var contentExtras = _.isUndefined($scope.relatedContentResp.contentExtras) ? null : $scope.relatedContentResp.contentExtras;

            org.ekstep.service.content.getContentAvailability(content.identifier)
                .then(function(contetnIsAvailable) {
                    if (contetnIsAvailable) {
                        // This is required to setup current content details which is going to play
                        org.ekstep.contentrenderer.getContentMetadata(content.identifier, function(obj) {
                            console.log("Related content data:", content);
                            GlobalContext.game.contentExtras = contentExtras;
                            EkstepRendererAPI.hideEndPage();
                            $rootScope.content = obj;
                            if (window.content.mimeType == obj.mimeType){
                                window.content = obj;
                                EkstepRendererAPI.clearStage();
                                EkstepRendererAPI.dispatchEvent('renderer:content:close');
                                EkstepRendererAPI.dispatchEvent('renderer:content:load');
                                EkstepRendererAPI.dispatchEvent('renderer:player:show');
                                EkstepRendererAPI.dispatchEvent('renderer:splash:show');
                            } else {
                                window.content = obj;
                                EkstepRendererAPI.dispatchEvent('renderer:launcher:load', undefined, window.content);
                            }
                        });
                    } else {
                        $scope.navigateToDownloadPage(contentExtras, content.identifier);
                    }
                })
                .catch(function(err) {
                    console.info("contentNotAvailable : ", err);
                    $scope.navigateToDownloadPage(contentExtras, content.identifier);
                });
        }
        $scope.navigateToDownloadPage = function(contentExtras, contentId) {
            var deepLinkURL = "ekstep://c/" + contentId;
            if (!_.isEmpty(contentExtras)) {
                contentExtras = JSON.stringify(contentExtras);
                deepLinkURL += "&contentExtras=" + contentExtras;
            }
            window.open(deepLinkURL, "_system");
        }
        $scope.getRelatedContent = function(contentExtras) {
            org.ekstep.service.content.getRelatedContent(contentExtras, content.identifier, GlobalContext.user.uid)
            .then(function(item) {
                if (!_.isEmpty(item)) {
                    $scope.relatedContentResp = item;
                    var list = [];
                    if(item.nextContent){
                        if(item.nextContent.contents){
                            var relatedContents = item.nextContent.contents;

                            // releated contents list
                            $scope.showRelatedContent = true;
                            // $scope.relatedContentPath = relatedContents;
                            list = _.first(_.isArray(relatedContents) ? relatedContents : [relatedContents], 2);
                        } else {
                            // Next content of the collection
                            $scope.showRelatedContent = true;
                            $scope.contentShowMore = true;
                            list = [item.nextContent];
                            list = _.each(list, function(content) {
                                content.appIcon = content.basePath + '/' + content.contentData.appIcon;
                            });
                        }
                    }
                    if (list.length != 0) {
                        $scope.$apply(function() {
                            $scope.relatedContents = list;
                            jQuery('#endPageLoader').hide();
                        });
                    } else {
                        $scope.showRelatedContentHeader = false;
                        jQuery('#endPageLoader').hide();
                    }
                }
            })
        }

        $scope.renderRelatedContent = function(id) {
            var contentExtras = null;
            if (_.isUndefined($scope.contentExtras) || _.isEmpty($scope.contentExtras)) {
                if (("undefined" != typeof cordova)) {
                    $scope.getRelatedContent(contentExtras);
                }
            } else {
                contentExtras = $scope.contentExtras;
                $scope.getRelatedContent(contentExtras);
            }
        }

        $scope.init = function() {
            if ("undefined" != typeof cordova) {
                $scope.renderRelatedContent($rootScope.content.identifier);
            } else {
                jQuery('#endPageLoader').hide();
                $scope.showRelatedContentHeader = false;
            }
        }
        EkstepRendererAPI.addEventListener('renderer:init:relatedContent',function(){
            $scope.init();
        })
    });
app.compileProvider.directive('starRating', function($rootScope) {
    return {
        //reference: http://jsfiddle.net/manishpatil/2fahpk7s/
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&",
            emptyRating: '@',
            selectedRating: '@'
        },
        restrict: 'EA',
        template: "<div style='display: inline-block; padding: 1%; cursor:pointer; width:12%; height:45%;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && rating_empty || rating_selected }}' \
                    ng-Click='isolatedClick($index + 1)' style='height:100%;' \></img> \
            </div>",
        compile: function(element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function($scope, $element, $attrs, $rootScope) {
            $scope.maxRatings = [];
            var globalConfig = EkstepRendererAPI.getGlobalConfig();
            $scope.rating_empty = globalConfig.assetbase + $scope.emptyRating;
            $scope.rating_selected = globalConfig.assetbase + $scope.selectedRating;

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function(param) {
                if ($scope.readOnly == 'true') return;

                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };
        }
    };
})

var endPage = angular.module("sunbird-summary-endpage",[]);
endPage.controller("endPageController", function($scope, $rootScope, $state,$element, $stateParams) {
    var globalConfig = EkstepRendererAPI.getGlobalConfig();
    $scope.showEndPage = false;
    $rootScope.pageId = "sunbird-player-Endpage";
    $scope.pluginManifest = {"id": "org.sunbird.assess.endpage", "ver": "1.0"};
    $scope.genieIcon;
    $scope.endpageBackground;
    $scope.replayIcon;
    $scope.userScore = undefined;
    $scope.totalScore = undefined;
    $scope.displayScore = undefined;

    /**
     * @property - {Object} which holds previous content of current content
     */     
    $scope.previousContent = {};
    /**
     * @property - {Object} which holds next content of current content
     */
    $scope.nextContent = {};
    $scope.isCordova = window.cordova ? true : false;
    $scope.pluginInstance = {};
    $scope.arrayToString = function(array) {
        return (_.isString(array)) ? array : (!_.isEmpty(array) && _.isArray(array)) ? array.join(", ") : "";
    };
    $scope.setLicense = function(){
        $scope.licenseAttribute = $scope.playerMetadata.license || 'Licensed under CC By 4.0 license'
    };

    $scope.getTotalScore = function(id) {
        var totalScore = 0, maxScore = 0;
        var teleEvents = org.ekstep.service.content.getTelemetryEvents();
        if (!_.isEmpty(teleEvents) && !_.isUndefined(teleEvents.assess)) {
            _.forEach(teleEvents.assess, function(value) {
                if(value.edata.score) {
                    totalScore = totalScore + value.edata.score;
                }
                if(value.edata.item.maxscore) {
                    maxScore = maxScore + value.edata.item.maxscore;
                } else {
                    maxScore = maxScore + 0;
                }
            });
            $scope.userScore = $scope.convert(totalScore);
            $scope.totalScore = $scope.convert(maxScore);
        } 
    };
   
    $scope.replayContent = function() {
        if (!isbrowserpreview && content.primaryCategory && content.primaryCategory.toLowerCase() === 'course assessment'){
            org.ekstep.service.content.checkMaxLimit(content).then(function(response){
                if (response && response.isCloseButtonClicked){
                    return;
                }
                else if(response && response.limitExceeded) {
                        window.postMessage({
                        event: 'renderer:maxLimitExceeded',
                        data: {
                        }
                    })
                    return;
                } else{
                    $scope.replayCallback();
                }
            });
        }else if (!$scope.isCordova && content.primaryCategory && content.primaryCategory.toLowerCase() === 'course assessment'){
            $scope.replayAssessment();
        }else{
            $scope.replayCallback();
        }
    };

    $scope.replayAssessment = function(){
        content.currentAttempt = content.currentAttempt + 1
        if (content.maxAttempt <= content.currentAttempt){
            window.postMessage('renderer:maxLimitExceeded');
            return;
        }else{
            $scope.replayPlayer();
        }
    };
    
    $scope.replayCallback = function(){
        EkstepRendererAPI.hideEndPage();
        EkstepRendererAPI.dispatchEvent('renderer:content:replay');
    };
    
    $scope.setTotalTimeSpent = function() {
        var endEvent = _.filter(TelemetryService._data, function(event) {
            if (event) {
                return event.name == "OE_END";
            }
        })
        var startTime = endEvent.length > 0 ? endEvent[endEvent.length - 1].startTime : 0;
        if (startTime) {
            var totalTime = Math.round((new Date().getTime() - startTime) / 1000);
            var mm = Math.floor(totalTime / 60);
            var ss = Math.floor(totalTime % 60);
            $scope.totalTimeSpent = (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
        } else {
            $scope.showFeedbackArea = false;
        }
    };
    $scope.openGenie = function(){
        EkstepRendererAPI.dispatchEvent('renderer:genie:click');
    };
    
    $scope.handleEndpage = function() {
        $scope.setLicense();
        if(!_.isUndefined($scope.playerMetadata.displayScore)) {
            $scope.displayScore = $scope.playerMetadata.displayScore;
        } else {
            $scope.displayScore = true;
        }

        if (_(TelemetryService.instance).isUndefined()) {
            var otherData = GlobalContext.config.otherData;
            !_.isUndefined(otherData.cdata) ? correlationData.push(otherData.cdata) : correlationData.push({"id": CryptoJS.MD5(Math.random().toString()).toString(),"type": "ContentSession"});
            TelemetryService.init(tsObj._gameData, tsObj._user, correlationData, otherData);
        }

        TelemetryService.interact("TOUCH", $rootScope.content.identifier, "TOUCH", {
            stageId: "ContentApp-EndScreen",
            subtype: "ContentID"
        });
       
        setTimeout(function() {
            $rootScope.$apply();
        }, 1000);
        EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
        $scope.setTotalTimeSpent();
        $scope.getTotalScore($rootScope.content.identifier);
        $scope.getRelevantContent($rootScope.content.identifier);
    };
    
    /**
     * @description - which helps to get previous and next content of current content
     */
    $scope.getRelevantContent = function(contentId){
        if (!isbrowserpreview) {
            if(!_.has($scope.previousContent, contentId) && !_.has($scope.nextContent, contentId)){
                var requestBody = {
                    "contentIdentifier": contentId,
                    "hierarchyInfo": $rootScope.content.hierarchyInfo,
                    "next": true,
                    "prev": true
                };
                //Call getPreviousAndNextContent function which is present inside interfaceService.js by passing current content-id and user-id 
                org.ekstep.service.content.getRelevantContent(JSON.stringify(requestBody)).then(function(response){
                    if(response){
                        $scope.previousContent[contentId] = response.prev;
                        $scope.nextContent[contentId] = response.next;
                    } else{
                        console.log('Error has occurred');
                    }
                });
            }
        }
    };

    /**
     * @description - to play next or previous content
     */
    $scope.contentLaunch = function(contentType, contentId) {
        var eleId = (contentType === 'previous') ? "gc_previousContent" : "gc_nextcontentContent";
        TelemetryService.interact("TOUCH", eleId, "TOUCH", {
            stageId: "ContentApp-EndScreen",
            plugin: $scope.pluginManifest
        }, "GE_INTERACT");

        var contentToPlay = (contentType === 'previous') ? $scope.previousContent[contentId] : $scope.nextContent[contentId];
        var contentMetadata = {};

        $scope.checkMaxLimit(contentToPlay, function(response){
            if (response && response.isCloseButtonClicked){
                return;
            }
            else if (response && response.limitExceeded) {
                    window.postMessage({
                    event: 'renderer:maxLimitExceeded',
                    data: {
                    }
                })
                return;
            }
            if(contentToPlay){
                contentMetadata = contentToPlay.content.contentData;
                _.extend(contentMetadata,  _.pick(contentToPlay.content, "hierarchyInfo", "isAvailableLocally", "basePath", "rollup"));
                contentMetadata.basepath = contentMetadata.basePath;
                $rootScope.content = window.content = content = contentMetadata;
            }

            if (contentToPlay.content.isAvailableLocally) {
                    EkstepRendererAPI.hideEndPage();
                    var object = {
                        'config': GlobalContext.config,
                        'data': undefined,
                        'metadata': contentMetadata
                    }
                    GlobalContext.config = mergeJSON(AppConfig, contentMetadata);
                    window.globalConfig = GlobalContext.config;

                    org.ekstep.contentrenderer.initializePreview(object)
                    EkstepRendererAPI.dispatchEvent('renderer:player:show');
            } else {
                if(contentMetadata.identifier && window.parent.hasOwnProperty('onContentNotFound')) {
                    window.parent.onContentNotFound(contentMetadata.identifier, contentMetadata.hierarchyInfo);
                } else {
                    console.warn('Content not Available');
                }
            }
        });
    };

    $scope.checkMaxLimit = function(contentToPlay, callback) {
        var contentMetadata = contentToPlay.content.contentData
        if (contentToPlay.content && contentToPlay.content.primaryCategory.toLowerCase() === 'course assessment'){
            org.ekstep.service.content.checkMaxLimit(contentMetadata).then(function(response){
                if(response){
                    callback(response);
                } else{
                    console.log('Error has occurred');
                    callback(false);
                }
            });
        }else{
            callback(false);
        }
    };

    $scope.initEndpage = function() {
        $scope.playerMetadata = content;
        $scope.leftArrowIcon = EkstepRendererAPI.resolvePluginResource($scope.pluginManifest.id, $scope.pluginManifest.ver, "renderer/assets/left-arrow.svg");
        $scope.rightArrowIcon = EkstepRendererAPI.resolvePluginResource($scope.pluginManifest.id, $scope.pluginManifest.ver, "renderer/assets/right-arrow.svg");
        $scope.handleEndpage();
    };
    EkstepRendererAPI.addEventListener('renderer:content:end', function() {
            $scope.initEndpage();
            $scope.safeApply();
    });
    EkstepRendererAPI.addEventListener('renderer:endpage:show', function() {
        $scope.showEndPage = true;
        $scope.initEndpage();
        document.webkitExitFullscreen();
        $scope.safeApply();
    });
    EkstepRendererAPI.addEventListener('renderer:endpage:hide',function() {
        $scope.showEndPage = false;
        org.ekstep.service.content.clearTelemetryEvents();
        $scope.safeApply();
    });

    $scope.convert = function(num) {
        num = num.toString(); //If it's not already a String
        var index = num.indexOf(".");
        if(index > 0){
            var floatVal = num.slice(index + 1, index + 3)
            var numSplitVal = num.split('.');
            num = numSplitVal[0] + '.'+ floatVal;
        }
        return Number(num); //If you need it back as a Number
    };
     
});
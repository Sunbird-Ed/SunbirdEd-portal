'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
var app = angular.module('playerApp');

app.directive('contentPlayer', function ($sce) {

    var controller = function ($scope, contentService) {
        
        function showPlayer(contentData) {
            $scope.contentData = contentData;
            
            $scope.showMetaData = $scope.isshowmetaview;
            if ($scope.contentData.mimeType === 'application/vnd.ekstep.ecml-archive' || $scope.contentData.mimeType === 'application/vnd.ekstep.html-archive')
            {
                $scope.showIFrameContent = true;
                $scope.iFrameSrc = "https://dev.ekstep.in/assets/public/preview/preview.html?webview=true&id=" + $scope.contentData.identifier;
            }
        }
        
        /**
         * This function helps to show loader or any error message at the time of api call.
         * @param {Boolean} showMetaLoader
         * @param {String} messageClass
         * @param {String} message
         */
        function showLoaderWithMessage(showMetaLoader, messageClass, message, closeButton, tryAgainButton) {
            var error = {};
            error.showError = true;
            error.showMetaLoader = showMetaLoader;
            error.messageClass = messageClass;
            error.message = message;
            error.showCloseButton = closeButton;
            error.showTryAgainButton = tryAgainButton;
            $scope.errorObject = error;
        }
        
        function getContent(contentId) {
            var req = {contentId : contentId};
            
            contentService.getById(req).then(function(response) {
                if(response && response.responseCode === 'OK') {
                    $scope.errorObject = {};
                    showPlayer(response.result.content);
                } else {
                    var message = "Unable to play, please try Again or close."
                    showLoaderWithMessage(false, 'red', message, true, true);
                }
            }).catch(function(error) {
                var message = "Unable to play, please try Again or close."
                showLoaderWithMessage(false, 'red', message, true, true);
            });
        }

        if($scope.body) {
            showPlayer($scope.body);
        }else if($scope.id) {
            getContent($scope.id);
        };

        $scope.close = function () {
            $scope.errorObject = {};
            $scope.visibility = false;
        };
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
        
        $scope.tryAgain = function() {
            $scope.errorObject = {};
            getContent($scope.id);
        };
    };
    return {
        templateUrl: '/views/contentplayer/player.html',
        restrict: 'E',
        scope: {
            id: '=',
            body: '=',
            visibility: '=',
            isshowmetaview: '='
        },
        controller: controller,
    };
});

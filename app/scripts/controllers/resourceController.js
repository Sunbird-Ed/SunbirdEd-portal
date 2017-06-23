'use strict';

angular.module('playerApp')
    .controller('resourceCtrl', function(resourceService, $log, $scope, $rootScope, $sessionStorage, $timeout, $location) {
        var resource = this;
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.searchResult = [];

        function handleFailedResponse(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
            error.responseCode = errorResponse.responseCode;
            error.error = error;
        }
        resource.sections = function() {
            var req = {
                'request': {
                    'context': {
                        'userId': 'user1'
                    }
                }
            };
            resourceService.resources(req).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    resource.page = successResponse.result.page.sections;

                } else {
                    handleFailedResponse(successResponse);
                }
            }).catch(function(error) {
                $log.warn(error);
                handleFailedResponse(error);
            });
        };
        resource.sections();
        
        $rootScope.$on("showAllNoteList", function (e, noteListStatus) {
            resource.showAllNoteList = noteListStatus;
        });
    });

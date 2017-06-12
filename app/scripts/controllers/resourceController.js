'use strict';

angular.module('playerApp')
    .controller('resourceCtrl', function(resourceService, $log, $scope, $sessionStorage, $timeout, $location) {
        var resource = this;
        resource.sections = function() {
            var req = {
                'request': {
                    'context': {
                        'userId': 'user1'
                    }
                }
            };

            resource.loadCarousel = function() {
                $('.regular').not('.slick-initialized').slick({
                    infinite: true,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    prevArrow: false,
                });
                $('.popup-button').popup();

                $('.ui .progress').progress();


            };
            resourceService.resources(req).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    resource.page = successResponse.result.page.sections;
                    console.log(resource.page);
                } else {
                    $log.warn('enrolledCourses', successResponse);
                    handleFailedResponse(successResponse);
                }
            }).catch(function(error) {
                $log.warn(error);
                handleFailedResponse(error);
            });
        };
        resource.sections();
    });
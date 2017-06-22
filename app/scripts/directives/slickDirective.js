'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('addSlick', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (scope.$last) {
                    $(element).parent().not('.slick-initialized').slick({
                        infinite: false,
                        slidesToShow: 4,
                        slidesToScroll: 4
                    });
            }
        }
    };
});

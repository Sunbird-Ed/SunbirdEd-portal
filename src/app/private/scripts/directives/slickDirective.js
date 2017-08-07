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
            $(element).closest('.slick-slider').find('.slick-prev').hide();

            $(element).parent().not('.slick-initialized').on('afterChange', function(event, slick, currentSlide) {
                console.log(currentSlide);
                var prebutton = $(element).closest('.slick-slider').find('.slick-prev');
                var nextbutton = $(element).closest('.slick-slider').find('.slick-next');
                var totalCount = slick.slideCount;

                var totalSlidelength = Math.floor(totalCount /4);
                var currentSlideLength = Math.floor(currentSlide /4);

                if(totalCount%4 !== 0) {
                    if (currentSlide === 0 && totalCount > 4) {
                        prebutton.hide();
                        nextbutton.show();
                    } else if (currentSlide > 0 && currentSlideLength === totalSlidelength) {
                        prebutton.show();
                        nextbutton.hide();
                    }  else if (totalCount >= currentSlide + 4 ) {
                        nextbutton.show();
                        prebutton.show();
                    }
                } else {
                    if (currentSlide === 0 && totalCount > 4) {
                        prebutton.hide();
                        nextbutton.show();
                    } else if (currentSlide > 0 && currentSlideLength !== totalSlidelength) {
                        prebutton.show();
                        nextbutton.hide();
                    }  else if (totalCount >= currentSlide + 4 ) {
                        nextbutton.show();
                        prebutton.show();
                    }
                }
                 
                
            });

        }
    };
});

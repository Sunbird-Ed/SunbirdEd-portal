'use strict'

angular.module('playerApp').directive('addSlick', function () {
  return {
    restrict: 'A',
        link: function (scope, element, attrs) {// eslint-disable-line
          if (scope.$last) {
            $(element).parent().not('.slick-initialized').slick({
              infinite: false,
              slidesToShow: 4,
              slidesToScroll: 4,
              responsive: [
                {
                  breakpoint: 2800,
                  settings: {
                    slidesToShow: 8,
                    slidesToScroll: 4
                  }
                },
                {
                  breakpoint: 2200,
                  settings: {
                    slidesToShow: 6,
                    slidesToScroll: 4
                  }
                },
                {
                  breakpoint: 2000,
                  settings: {
                    slidesToShow: 5,
                    slidesToScroll: 4
                  }
                },
                {
                  breakpoint: 1400,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                  }
                },
                {
                  breakpoint: 1024,
                  settings: {
                    unslick: true
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            })
          }
          $(element).closest('.slick-slider').find('.slick-prev').hide()

          $(element).parent()
            .not('.slick-initialized')
            .on('afterChange', function (event, slick, currentSlide) {
              var prebutton = $(element)
                                .closest('.slick-slider').find('.slick-prev')
              var nextbutton = $(element)
                                 .closest('.slick-slider').find('.slick-next')
              var totalCount = slick.slideCount

              var totalSlidelength = Math.floor(totalCount / 4)
              var currentSlideLength = Math.floor(currentSlide / 4)

              if (totalCount % 4 !== 0) {
                if (currentSlide === 0 && totalCount > 4) {
                  prebutton.hide()
                  nextbutton.show()
                } else if (currentSlide > 0 &&
                        currentSlideLength === totalSlidelength) {
                  prebutton.show()
                  nextbutton.hide()
                } else if (totalCount >= currentSlide + 4) {
                  nextbutton.show()
                  prebutton.show()
                }
              } else if (currentSlide === 0 && totalCount > 4) {
                prebutton.hide()
                nextbutton.show()
              } else if (currentSlide > 0 &&
                    currentSlideLength !== totalSlidelength) {
                prebutton.show()
                nextbutton.hide()
              } else if (totalCount >= currentSlide + 4) {
                nextbutton.show()
                prebutton.show()
              }
            })
        }
  }
})

'use strict'

angular.module('playerApp')
    .directive('applyScript', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          $('.popup-button').popup()
          $('#content-search-filter-accordion').accordion()
          $('.ui.accordion').accordion({ exclusive: false })
          $timeout(function () {
            $('.courseHeader-rating')
                    .rating('disable')
            $('.ui .progress').progress()
            $('.course-progress').progress()
          }, 0)
          $('.dropdown.resource-search-filter').dropdown({
            useLabels: false,
            forceSelection: false,
            label: {
              duration: 0
            },
            debug: false,
            performance: true
          })
          $('.dropdown.course-search-filter').dropdown({
            useLabels: false,
            forceSelection: false,
            label: {
              duration: 0
            },
            debug: false,
            performance: true
          })
          $('.signupMultiple').dropdown({
                    // useLabels: false,
          })
                // $('.ui.radio.checkbox')
                //     .checkbox('attach events', '.toggle.button');
          $('#multi-select-sort').dropdown()
          $('#dropdown-menu-list-header').dropdown({
            useLabels: false,
            forceSelection: false,
            label: {
              duration: 0
            },
            debug: false,
            performance: true
          })

          $('#headerSearch').dropdown()

          var today = new Date()

          var getDate = function (date) {
            if (!date) { return '' }
            var day = date.getDate()
            var month = date.getMonth() + 1
            var year = date.getFullYear()
            return day + '/' + month + '/' + year
          }

          $('#example2').calendar({
            type: 'date',
            maxDate: today,
            formatter: {
              date: getDate
            }
          })

          $('#start').calendar({
            type: 'date',
            maxDate: today,
            endCalendar: $('#start'),
            formatter: {
              date: getDate
            }
          })
          $('#end').calendar({
            type: 'date',
            maxDate: today,
            startCalendar: $('#end'),
            formatter: {
              date: getDate
            },
            onChange: function (date, text) {
              angular.element($('#endDateInput')
                        .val(text)).triggerHandler('input')
                        // $('#endDateInput').val(text);
            }
          })
          $('#rangestartAdd').calendar({
            type: 'date',
            maxDate: today,
            endCalendar: $('#rangeendAdd'),
            formatter: {
              date: getDate
            }
          })
          $('#rangeendAdd').calendar({
            type: 'date',
            maxDate: today,
            startCalendar: $('#rangestartAdd'),
            formatter: {
              date: getDate
            }
          })

          $('.rangeStart').calendar({
            type: 'date',
            maxDate: today,
            endCalendar: $('.rangeEnd'),
            formatter: {
              date: getDate
            }
          })
          $('.rangeEnd').calendar({
            type: 'date',
            maxDate: today,
            startCalendar: $('.rangeStart'),
            formatter: {
              date: getDate
            }
          })

          $('#editDob').calendar({
            type: 'date',
            maxDate: today,
            formatter: {
              date: getDate
            }
          })
        }
      }
    }])

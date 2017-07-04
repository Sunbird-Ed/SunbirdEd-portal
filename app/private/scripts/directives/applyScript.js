'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:applyScript
 * @description
 * # applyScript
 */
angular.module('playerApp')
    .directive('applyScript', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $('.ui .progress').progress();
                $('.course-progress').progress();
                $('.popup-button').popup();
                $('#address-accordion').accordion();
                $('#experience-accordion').accordion();
                $('#education-accordion').accordion();
                $('#content-search-filter-accordion').accordion();
                $('.ui.accordion').accordion({ exclusive: false });
                $('.ui.radio.checkbox')
                    .checkbox();
                $('.ui.rating')
                    .rating({
                        maxRating: 5
                    }).rating('disable', true);
                $('.dropdown.content-search-filter').dropdown({
                    useLabels: false,
                    forceSelection: false,
                    label: {
                        duration: 0,
                    },
                    debug: false,
                    performance: true,
                });
                $('#multi-select-sort').dropdown();
                $('#dropdown-menu-list-header').dropdown({
                    useLabels: false,
                    forceSelection: false,
                    label: {
                        duration: 0,
                    },
                    debug: false,
                    performance: true,
                });

                $('#headerSearch').dropdown();

                if (attrs.id === 'content-video-player-youtube-holder') {
                    var oldPlayer = document.getElementById('content-video-player-youtube');
                    videojs(oldPlayer).dispose();
                    $(element).append('<video id=\'content-video-player-youtube\' height=\'100%\' width=\'100%\' class=\'video-js player-video\' controls  data-setup=\'{ "fluid": true,"techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": ""}] }\'></video>');
                    videojs('content-video-player-youtube').ready(function() {
                        var newPlayer = this;
                        newPlayer.src({ type: 'video/youtube', src: attrs.videosrc });
                    });
                }
                $('#example2').calendar({
                    type: 'date',
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            return day + '/' + month + '/' + year;
                        }
                    }
                });
                $('#rangestart').calendar({
                    type: 'date',
                    endCalendar: $('#rangeend'),
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            return day + '/' + month + '/' + year;
                        }
                    }
                });
                $('#rangeend').calendar({
                    type: 'date',
                    startCalendar: $('#rangestart'),
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            return day + '/' + month + '/' + year;
                        }
                    }
                });
            }
        };
    });
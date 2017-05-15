'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, $log) {
        var content = this;
        content.keyword = '';
        content.filters = {};
        content.languages = [
            "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Marathi", "Punjabi", "Tamil", "Telugu"
        ];
        content.contentTypes = [
            "Story", "Worksheet", "Collections", "Game", "Plugin", "Template"
        ]
        content.statuses = [
            "Draft", "Live", "Review", "Flagged", "Flag Draft", "Flag Review"
        ]

        content.selectedLanguage = '';
        content.selectedContentType = '';
        content.selectedStatus = '';

        content.listView = false;
        content.searchContent = function() {

            var req = {
                "query": content.keyword,
                "filters": content.filters,
                "params": {
                    "cid": "12"
                }
            }

            contentService.search(req).then(function(res) {
                    console.log(res);
                    if (res.responseCode === "OK") {
                        content.data = res.result;

                    }
                }),
                function(errorMessage) {
                    $log.warn(errorMessage);
                };
        };

        content.toggleView = function(isList) {
            content.listView = isList;
        }
        content.loadRating = function() {
            $('.ui.rating')
                .rating({

                    maxRating: 5

                }).rating("disable", true);

            $('.popup-button').popup({ inline: true });
        };

        content.searchContent();


        function initSemanticUi() {
            $('.ui.accordion')
                .accordion();

            $('.dropdown').dropdown({
                useLabels: false,
                forceSelection: false,
                label: {
                    duration: 0,
                },
                debug: true,
                performance: true,
            });

        }
        window.onload = initSemanticUi;
        content.applyFilter = function() {
            if (content.selectedLanguage) {
                content.filters['language'] = content.selectedLanguage;
            };
            if (content.selectedLessonType) {
                content.filters['contentType'] = content.selectedContentType;
            }
            if (content.selectedStatus) {
                content.filters['status'] = content.selectedStatus;
            }
            content.searchContent();

        };
        content.resetFilter = function() {
            content.filters = {};
            content.searchContent();
            $('.dropdown').dropdown('clear');

        }

    });
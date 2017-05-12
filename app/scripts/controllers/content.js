'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('ContentCtrl', function (contentService, $log) {
            var content = this;
            content.keyword = '';

            content.listView = false;
            content.searchContent = function () {
                var req = {
                    "request": {
                        "query": content.keyword,
                        "filters": {

                        }
                    },
                    "params": {
                        "cid": "12"
                    }
                }

                contentService.search(req).then(function (res) {
                    console.log(res);
                    if (res.responseCode === "OK") {
                        content.data = res.result;

                    }
                }), function (errorMessage) {
                    $log.warn(errorMessage);
                };
            };

            content.toggleView = function (isList)
            {
                content.listView = isList;
            }
            content.loadRating = function () {
                $('.ui.rating')
                        .rating({

                            maxRating: 5

                        }).rating("disable", true);
            };
            content.searchContent();

        });


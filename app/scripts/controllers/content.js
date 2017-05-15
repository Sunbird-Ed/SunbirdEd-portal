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
            content.data = [];
            content.autosuggest_data = [];

            content.searchContent = function ($event) {
                content.enableLoader(true);
                var req = {
                    "query": content.keyword,
                    "filters": {
                    },
                    "params": {
                        "cid": "12"
                    }
                }
                contentService.search(req).then(function (res) {
                    content.enableLoader(false);
                    console.log(res);
                    if (res.responseCode === "OK") {
                        //if $event is passed then search is to get only autosuggest else to get the content
                        if ($event != undefined && content.keyword != '')
                        {
                            content.autosuggest_data = res.result;
                        } else
                        {
                            content.data = res.result;
                            content.autosuggest_data = [];
                        }
                    }
                }), function (errorMessage) {
                    $log.warn(errorMessage);
                };
            };
            //to show/hide in-search loading bar
            content.enableLoader = function (isEnabled) {
                if (isEnabled) {
                    $('#search-input-container').addClass('loading');
                } else
                {
                    $('#search-input-container').removeClass('loading');
                }
            }
            //toggle between grid and listview
            content.toggleView = function (isList)
            {
                content.listView = isList;
            }
            // to apply star rating and more.. popup once content is ready
            content.loadRating = function () {
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating("disable", true);
                $('.popup-button').popup();
            };
            content.searchContent();
            //if any item is selected from autosuggest search then set that as keyword
            content.setSearchText = function (text)
            {
                content.keyword = text;
                content.searchContent();
            }          

        });

        
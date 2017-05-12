'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
  .controller('MainCtrl', function (contentService, $log,  $scope) {
    var vm = this;
    vm.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    getContent();


    // contentService.getSearchContent(req).then(function (res) {
    //   console.log('search response', res.result.content);
    //   if (res.responseCode === "OK") {
    //     vm.data = res.result.content;
    //   }
    // }), function (errorMessage) {
    //   $log.warn(errorMessage);
    // }

    function getContent(req) {
                var req = {
                  query : "test",
                  filters : {

                  }
                }
                contentService.search(req).then(function (response) {
                    if(response.responseCode === "OK" && response.result.count > 0) {
                        $scope.contentList = response.result.content;
                        console.log(' $scope.contentList', $scope.contentList);
                    } else {
                        $scope.showNoContentFound = true;
                    }
                }), function (errorMessage) {
                    $log.warn(errorMessage);
                };
            };

            $scope.loadRating = function() {
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        })
                        .rating("disable", true);
            };
  });

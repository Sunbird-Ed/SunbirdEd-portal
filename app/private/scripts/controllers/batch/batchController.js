'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.batch:BatchController
 * @description
 * # BatchController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('BatchController', ['$rootScope', '$timeout', '$state','$scope', '$stateParams', 'config', 
        'batchService', function($rootScope, $timeout, $state, $scope, $stateParams, config, batchService) {
            var batch = this;
            batch.userList = config.DROPDOWN.COMMON.grades;
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;

            batch.showCreateBatchModal = function () {
                $timeout(function () {
                    console.log('batch.userList ', batch.userList);
                    $('.multiSelectDropDown')
                            .dropdown();
                    $("#createBatchModal").modal({
                        onShow: function () {
                            $('#rangestartAdd').calendar({
                                type: 'date',
                                endCalendar: $('#rangeendAdd')
                            });
                            $('#rangeendAdd').calendar({
                                type: 'date',
                                startCalendar: $('#rangestartAdd')
                            });
                        },
                        onHide: function () {
                            var params = {
                                courseId: $stateParams.courseId,
                                lectureView: $stateParams.lectureView
                            };
                            $state.go('Toc', params);
                        }
                    }).modal("show");
                }, 10);
            };
        }
    ]);

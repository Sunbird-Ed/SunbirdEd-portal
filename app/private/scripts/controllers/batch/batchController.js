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
            batch.userList = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'];
            batch.menterList = ['Mentor1', 'Mentor2', 'Mentor3', 'Mentor4', 'Mentor5', 'Mentor6']
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;
            batch.submitted = false;

            batch.showCreateBatchModal = function () {
                $timeout(function () {
                    $('.multiSelectDropDown')
                            .dropdown();
                    $('.ui.calendar').calendar({refresh: true});
                    $("#createBatchModal").modal({
                        onShow: function () {
                            $('.ui.calendar.rangestartAdd').calendar({
                                type: 'date',
                                minDate: new Date(),
                                onChange: function (date, text, mode) {
                                    if(_.isUndefined(batch.data)){
                                        batch.data = { startdate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() }
                                    }else{
                                        batch.data.startdate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
                                    }
                                    $('.ui.calendar.rangeendAdd').calendar({
                                        type: 'date',
                                        minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                                        onChange: function (date, text, mode) {
                                            if(_.isUndefined(batch.data)){
                                                batch.data = { enddate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() }
                                            }else{
                                                batch.data.enddate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
                                            }
                                        }
                                    });
                                }

                            });
                            $('.ui.calendar.rangeendAdd').calendar({
                                type: 'date',
                                minDate: new Date(),
                                startCalendar: $('.ui.calendar.rangestartAdd'),
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

            batch.createBatch = function(data){
                if(batch.createBatch.$valid){
                    var requestBody = angular.copy(data);
                    requestBody.courseId = batch.courseId;
                    requestBody.createdBy = batch.userId;

                    //batchService.create(requestBody);
                    console.log('requestBody', JSON.stringify(requestBody));
                }
            }

        }
    ]);

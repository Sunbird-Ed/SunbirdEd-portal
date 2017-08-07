'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.batch:BatchUpdateController
 * @description
 * # BatchController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('BatchUpdateController', ['$rootScope', '$timeout', '$state','$scope', '$stateParams', 'config', 
        'batchService', 'toasterService' ,function($rootScope, $timeout, $state, $scope, $stateParams, config, batchService, toasterService) {
            var batchUpdate = this;
            batchUpdate.userList = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'];
            batchUpdate.menterList = ['Mentor1', 'Mentor2', 'Mentor3', 'Mentor4', 'Mentor5', 'Mentor6']
            batchUpdate.userId = $rootScope.userId;
            batchUpdate.courseId = $stateParams.courseId;
            batchUpdate.submitted = false;
            batchUpdate.batchData = '';

            batchUpdate.showUpdateBatchModal = function () {
                batchUpdate.batchData = batchService.getBatchData();
                $timeout(function () {
                    $('#users').dropdown('set selected',batchUpdate.batchData.users);
                    $('#mentors').dropdown('set selected',batchUpdate.batchData.mentors);
                    if(batchUpdate.batchData.enrollmenttype == 'open'){
                        $('input:radio[name="enrollmenttype"]').filter('[value="open"]').attr('checked', true);
                    }else{
                        $('input:radio[name="enrollmenttype"]').filter('[value="invite-only"]').attr('checked', true);
                    }
                    $('.ui.calendar').calendar({refresh: true});
                    var startDate = new Date(batchUpdate.batchData.startdate),
                        currentDate = new Date();
                    if(currentDate < startDate){
                        startDate = currentDate;
                    }
                    $("#updateBatchModal").modal({
                        onShow: function () {
                            $('.ui.calendar#rangestartAdd').calendar({
                                type: 'date',
                                minDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                                formatter: {
                                    date: function (date, settings) {
                                        return $filter('date')(date, "yyyy-MM-dd")
                                    }
                                },
                                onChange: function (date, text, mode) {
                                    batchUpdate.batchData.startdate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
                                    $('.ui.calendar#rangeendAdd').calendar({
                                        type: 'date',
                                        minDate: new Date(startDate.getFullYear(), startDate.getMonth(),  parseInt(startDate.getDate()) + 1),
                                        formatter: {
                                            date: function (date, settings) {
                                                return $filter('date')(date, "yyyy-MM-dd")
                                            }
                                        },
                                        onChange: function (date, text, mode) {
                                            batchUpdate.batchData.enddate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
                                        }
                                    });
                                }

                            });
                            $('.ui.calendar#rangeendAdd').calendar({
                                type: 'date',
                                minDate: new Date(startDate.getFullYear(), startDate.getMonth(), parseInt(startDate.getDate()) + 1),
                                formatter: {
                                    date: function (date, settings) {
                                        return $filter('date')(date, "yyyy-MM-dd")
                                    }
                                },
                                startCalendar: $('.ui.calendar#rangestartAdd'),
                            });
                            $('.ui.calendar #startdate').val(batchUpdate.batchData.startdate);
                            $('.ui.calendar #enddate').val(batchUpdate.batchData.enddate);
                        },
                        onHide: function () {
                            var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'));
                            $state.go(previousUrl.name, previousUrl.params);
                        }
                    }).modal("show");
                }, 10);
            };

            batchUpdate.updateBatchDetails = function(){

            }
        }
    ]);

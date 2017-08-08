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
        'batchService', '$filter' ,function($rootScope, $timeout, $state, $scope, $stateParams, config, batchService, $filter) {
            var batchUpdate = this;
            batchUpdate.userList = [
                {name: 'User1', image: 'jenny.jpg'},
                {name: 'User2', image: 'elliot.jpg'},
                {name: 'User3', image: 'stevie.jpg'},
                {name: 'User4', image: 'christian.jpg'},
                {name: 'User5', image: 'matt.jpg'},
                {name: 'User6', image: 'justen.jpg'},
                {name: 'User7', image: 'user_logo.png'}
            ];
            batchUpdate.menterList = [
                {name: 'Mentor1', image: 'jenny.jpg'},
                {name: 'Mentor2', image: 'elliot.jpg'},
                {name: 'Mentor3', image: 'stevie.jpg'},
                {name: 'Mentor4', image: 'christian.jpg'},
                {name: 'Mentor5', image: 'matt.jpg'},
                {name: 'Mentor6', image: 'justen.jpg'}
            ];
            batchUpdate.userId = $rootScope.userId;
            batchUpdate.courseId = $stateParams.courseId;
            batchUpdate.submitted = false;
            batchUpdate.batchData = '';

            batchUpdate.showUpdateBatchModal = function () {
                batchUpdate.batchData = batchService.getBatchData();
                batchUpdate.selectedUsers = [];
                batchUpdate.selectedMentors = [];
                _.forEach(batchUpdate.batchData.users, function(value){
                    batchUpdate.selectedUsers.push(_.find(batchUpdate.userList, ['name', value]))
                    batchUpdate.userList = _.reject(batchUpdate.userList, ['name', value]);
                })
                _.forEach(batchUpdate.batchData.mentors, function(mentorVal){
                    batchUpdate.selectedMentors.push(_.find(batchUpdate.menterList, ['name', mentorVal]))
                    batchUpdate.menterList = _.reject(batchUpdate.menterList, ['name', mentorVal]);
                })
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

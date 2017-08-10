'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.batch:BatchUpdateController
 * @description
 * # BatchController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('BatchUpdateController', ['$rootScope', '$timeout', '$state','$scope', '$stateParams', 
    'config', 'batchService', '$filter' ,function($rootScope, $timeout, $state, $scope, 
        $stateParams, config, batchService, $filter) {
            var batchUpdate = this;
            batchUpdate.userList = [];
            batchUpdate.menterList = [];
            batchUpdate.userId = $rootScope.userId;
            batchUpdate.submitted = false;
            batchUpdate.batchData = '';
            batchUpdate.batchId = $stateParams.batchId;

            batchUpdate.init = function(){
                batchUpdate.getUserList();
            }

            batchUpdate.getBatchDetails = function(){
                batchUpdate.batchData = batchService.getBatchData();
                if(_.isEmpty(batchUpdate.batchData)){
                    batchService.getBatchDetails({ "batchId" : batchUpdate.batchId }).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            batchUpdate.batchData = response.result.response;
                            batchUpdate.showUpdateBatchModal();
                        }else{
                            toasterService.error('Error Message');    
                        }
                    }).catch(function () {
                        toasterService.error('Error Message');
                    });
                }else{
                    batchUpdate.showUpdateBatchModal();                    
                }
            }

            batchUpdate.showUpdateBatchModal = function () {
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
                    if(batchUpdate.batchData.enrollmentType == 'open'){
                        $('input:radio[name="enrollmentType"]').filter('[value="open"]').attr('checked', true);
                    }else{
                        $('input:radio[name="enrollmentType"]').filter('[value="invite-only"]').attr('checked', true);
                    }
                    $('.ui.calendar').calendar({refresh: true});
                    var startDate = new Date(batchUpdate.batchData.startDate),
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
                                    batchUpdate.batchData.startDate = text;
                                    $('.ui.calendar#rangeendAdd').calendar({
                                        type: 'date',
                                        minDate: new Date(startDate.getFullYear(), startDate.getMonth(),  parseInt(startDate.getDate()) + 1),
                                        formatter: {
                                            date: function (date, settings) {
                                                return $filter('date')(date, "yyyy-MM-dd")
                                            }
                                        },
                                        onChange: function (date, text, mode) {
                                            batchUpdate.batchData.enddate = text;
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
                            $('.ui.calendar #startdate').val(batchUpdate.batchData.startDate);
                            $('.ui.calendar #enddate').val(batchUpdate.batchData.endDate);
                        },
                        onHide: function () {
                            var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'));
                            $state.go(previousUrl.name, previousUrl.params);
                        }
                    }).modal("show");
                }, 10);
            };

            batchUpdate.getUserList = function(){
                var request = {
                    "request": {
                        "filters" : {
                            "organisations.organisationId": [$rootScope.organisationIds.toString()]
                        }
                    }
                };
                batchService.getUserList(request).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        _.forEach(response.result.response.content, function(userData){
                            if(userData.identifier != $rootScope.userId){
                                var user = {
                                    id: userData.identifier,
                                    name:  userData.firstName +' '+ userData.lastName,
                                    avatar: userData.avatar
                                }
                                _.forEach(userData.organisations, function(userOrgData){
                                    if(_.indexOf(userOrgData.roles, "COURSE_MENTOR") != -1){
                                        batchUpdate.menterList.push(user);   
                                    }
                                });
                                batchUpdate.userList.push(user);
                            }
                        });
                        batchUpdate.getBatchDetails();
                    }else{
                        toasterService.error('Error Message');    
                    }
                    console.log('response ', response);
                }).catch(function () {
                    toasterService.error('Error Message');
                });
            };

            batchUpdate.hideUpdateBatchModal = function () {
                $('#updateBatchModal').modal('hide');
                $('#updateBatchModal').modal('hide others');
                $('#updateBatchModal').modal('hide dimmer');
                var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'));
                $state.go(previousUrl.name, previousUrl.params);
            };

            batchUpdate.updateBatchDetails = function(data){
                if($scope.updateBatch.$valid){
                    console.log('data ', data);
                    var request = {
                        "request" : {
                            "name": data.name,
                            "description": data.description,
                            "enrollmentType": data.enrollmentType,
                            "startDate": data.startDate,
                            "endDate": data.endDate,
                            "createdFor": data.createdFor,
                            "id": data.id
                        }
                    }
                    if(data.enrollmentType != 'open'){
                        request.request.mentors = _.concat(data.mentors, batchUpdate.selectedMentors);
                        request.request.users = _.concat(data.users, batchUpdate.selectedUsers);
                    }
                    batchService.update(request).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            batchUpdate.hideUpdateBatchModal();
                        }else{
                            toasterService.error('Error Message');    
                        }
                    }).catch(function () {
                        toasterService.error('Error Message');
                    });
                }
            }
        }
    ]);

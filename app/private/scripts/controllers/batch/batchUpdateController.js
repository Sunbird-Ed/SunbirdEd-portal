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
                _.forEach(batchUpdate.batchData.participant, function(value, key){
                    if(!_.isUndefined(_.find(batchUpdate.userList, ['id', key]))){
                        batchUpdate.selectedUsers.push(_.find(batchUpdate.userList, ['id', key]));
                        batchUpdate.userList = _.reject(batchUpdate.userList, ['id', key]);
                    }
                })
                _.forEach(batchUpdate.batchData.mentors, function(mentorVal, key){
                    if(!_.isUndefined(_.find(batchUpdate.menterList, ['id', mentorVal]))){
                        batchUpdate.selectedMentors.push(_.find(batchUpdate.menterList, ['id', mentorVal]));
                        batchUpdate.menterList = _.reject(batchUpdate.menterList, ['id', mentorVal]);
                    }
                })
                $timeout(function () {
                    $('#users').dropdown();
                    $('#mentors').dropdown();
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
            };

            batchUpdate.updateBatchDetails = function(data){
                if($scope.updateBatch.$valid){
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
                        data.mentors = $("#mentors").dropdown("get value").split(",");
                        var selected = []; 
                        _.forEach(batchUpdate.selectedMentors, function(value){
                            selected.push(value.id);
                        });
                        request.request.mentors = _.concat(_.compact(data.mentors), selected);
                    }
                    batchService.update(request).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            if(data.users && data.users.length > 0){
                                var userRequest = {
                                    "request" : {
                                        "userIds": data.users
                                    }
                                }
                                batchService.addUsers(userRequest, response.result.batchId).then(function (response) {
                                    if (response && response.responseCode === 'OK') {
                                        batchUpdate.hideUpdateBatchModal();
                                    }else{
                                        toasterService.error(errorMessages.BATCH.ADD_USERS.FAILED);
                                    }
                                }).catch(function () {
                                    toasterService.error(errorMessages.BATCH.ADD_USERS.FAILED);
                                });
                            }else{
                                batchUpdate.hideUpdateBatchModal();
                            }
                        }else{
                            toasterService.error(errorMessages.BATCH.UPDATE.FAILED);    
                        }
                    }).catch(function () {
                        toasterService.error(errorMessages.BATCH.UPDATE.FAILED);
                    });
                }
            }
        }
    ]);

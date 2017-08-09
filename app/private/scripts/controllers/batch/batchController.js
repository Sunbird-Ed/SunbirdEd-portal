'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.batch:BatchController
 * @description
 * # BatchController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('BatchController', ['$rootScope', '$timeout', '$state','$scope', '$stateParams', 
    'batchService', '$filter', 'permissionsService', function($rootScope, $timeout, $state, 
        $scope, $stateParams, batchService, $filter, permissionsService) {
            var batch = this;
            batch.userList = [];
            batch.menterList = [];
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;
            batch.submitted = false;
            batch.showBatchCard = $scope.showbatchcard;
            batch.quantityOfBatchs = 3;
            batch.userName = $rootScope.firstName + ' ' + $rootScope.lastName;
            batch.status = 1;
            batch.statusOptions = [
                { name: 'Ongoing', value: 1 },
                { name: 'New', value: 0 }
            ];
            
            batch.showCreateBatchModal = function () {
                batch.getUserList();
                $timeout(function () {
                    $('#users,#mentors').dropdown({ forceSelection: false, fullTextSearch: true });
                    $('.ui.calendar').calendar({refresh: true});
                    $('input:radio[name="enrollmentType"]').filter('[value="invite-only"]').attr('checked', true);
                    $("#createBatchModal").modal({
                        onShow: function () {
                            $('.ui.calendar#rangestartAdd').calendar({
                                type: 'date',
                                minDate: new Date() ,
                                formatter: {
                                    date: function (date, settings) {
                                       return $filter('date')(date, "yyyy-MM-dd")
                                    }
                                },
                                onChange: function (date, text, mode) {
                                    if(_.isUndefined(batch)){
                                        batch = { data : { startDate : text } }; 
                                    }else if(_.isUndefined(batch.data)){
                                        batch.data = { startDate : text };
                                    }else{
                                        batch.data.startDate = text;
                                    }
                                    $('.ui.calendar#rangeendAdd').calendar({
                                        type: 'date',
                                        minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                                        formatter: {
                                            date: function (date, settings) {
                                                return $filter('date')(date, "yyyy-MM-dd")
                                            }
                                        },
                                        onChange: function (date, text, mode) {
                                            if(_.isUndefined(batch)){
                                                batch = { data : { endDate : text } };
                                            }else if(_.isUndefined(batch.data)){
                                                batch.data = { endDate : text };
                                            }else{
                                                batch.data.endDate = text;
                                            }
                                        }
                                    });
                                }

                            });
                            $('.ui.calendar#rangeendAdd').calendar({
                                type: 'date',
                                minDate: new Date(),
                                formatter: {
                                    date: function (date, settings) {
                                        return $filter('date')(date, "yyyy-MM-dd")
                                    }
                                },
                                startCalendar: $('.ui.calendar#rangestartAdd'),
                            });
                        },
                        onHide: function () {
                            var previousUrl = JSON.parse(window.localStorage.getItem('previousURl'));
                            $state.go(previousUrl.name, previousUrl.params);
                        }
                    }).modal("show");
                }, 10);
            };

            batch.hideCreateBatchModal = function () {
                $('#createBatchModal').modal('hide');
                $('#createBatchModal').modal('hide others');
                $('#createBatchModal').modal('hide dimmer');
            };

            batch.addBatch = function(data){
                if($scope.createBatch.$valid){
                    if(data.enrollmentType != 'open'){
                        data.users = $("#users").dropdown("get value").split(",");
                        data.mentors = $("#mentors").dropdown("get value").split(",");
                    }
                    var requestBody = angular.copy(data);
                    requestBody.courseId = batch.courseId;
                    requestBody.createdBy = batch.userId;
                    requestBody.createdFor = $rootScope.organisationIds;
                    var request = {
                        "request" : requestBody
                    }
                    batchService.create(request).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            batch.hideCreateBatchModal();
                        }else{
                            toasterService.error('Error Message');    
                        }
                    }).catch(function () {
                        toasterService.error('Error Message');
                    });
                }
            };

            batch.clearBatchData = function(){
                $('#users,#mentors').dropdown('restore defaults');  
                $('#createBatch').form('reset');
            }

            batch.getCouserBatchesList = function () {
                // var request = {
                //     filters: {
                //         userId: batch.userId,
                //         courseId: batch.courseId
                //     },
                //     sort_by: { createdOn: 'desc' }
                // };
                // batchService.getAllBatchs(request).then(function (response) {
                //     if (response && response.responseCode === 'OK') {
                //         batch.batchList = response.result.note || [];
                //     } else {
                //         toasterService.error(batch.messages.SEARCH.FAILED);
                //     }
                // }).catch(function () {
                //     toasterService.error(batch.messages.SEARCH.FAILED);
                // });
                batch.batchList = [{"identifier":"01230667636753203225","name":"Batch1","description":"description1","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-27","status":"1","users":["User1", "User2", "User3"],"mentors":["Mentor1","Mentor2"]},{"identifier":"01230667636753203225","name":"Batch2","description":"description2","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-08-27","enddate":"2017-09-27","status":"0","users":["User3","User4","User2","User5"],"mentors":["Mentor3","Mentor5"]},{"identifier":"01230667636753203225","name":"Batch3","description":"description3","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-03","status":"2","users":["User3","User6"],"mentors":["Mentor5","Mentor3"]}];
            };

            batch.showUpdateBatchModal = function(batchData){
                batchService.setBatchData(batchData);
                $state.go('updateBatch', {batchId: batchData.identifier});
            };

            batch.getUserList = function(){
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
                                        batch.menterList.push(user);   
                                    }
                                });
                                batch.userList.push(user);
                            }
                        });
                    }else{
                        toasterService.error('Error Message');    
                    }
                    console.log('response ', response);
                }).catch(function () {
                    toasterService.error('Error Message');
                });
            };
        }
    ]);

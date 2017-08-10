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
    'batchService', '$filter', 'permissionsService', 'errorMessages', 'toasterService', 
    function($rootScope, $timeout, $state, $scope, $stateParams, batchService, $filter, 
    permissionsService, errorMessages, toasterService) {
            var batch = this;
            batch.userList = [];
            batch.menterList = [];
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;
            batch.submitted = false;
            batch.showBatchCard = $scope.showbatchcard;
            batch.quantityOfBatchs = 3;
            batch.userName = $rootScope.firstName + ' ' + $rootScope.lastName;
            batch.showBatchDetailsPage = false;
            batch.isMentor = false;
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
                    }else{
                        data.users = [];
                        data.mentors = [];
                    }
                    var request = {
                        "request" : {
                            "courseId": batch.courseId,
                            "name": data.name,
                            "description": data.description,
                            "enrollmentType": data.enrollmentType,
                            "startDate": data.startDate,
                            "endDate": data.endDate,
                            "createdBy": batch.userId,
                            "createdFor": $rootScope.organisationIds,
                            "mentors": data.mentors
                        }
                    }
                    batchService.create(request).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            if(data.users && data.users.length > 0){
                                var userRequest = {
                                    "request" : {
                                        "userIds": data.users
                                    }
                                }
                                batchService.addUsers(userRequest, response.result.batchId).then(function (response) {
                                    if (response && response.responseCode === 'OK') {
                                        batch.hideCreateBatchModal();
                                    }else{
                                        toasterService.error(errorMessages.BATCH.ADD_USERS.FAILED);
                                    }
                                }).catch(function () {
                                    toasterService.error(errorMessages.BATCH.ADD_USERS.FAILED);
                                });
                            }else{
                                batch.hideCreateBatchModal();
                            }
                        }else{
                            toasterService.error(errorMessages.BATCH.CREATE.FAILED);  
                        }
                    }).catch(function () {
                        toasterService.error(errorMessages.BATCH.CREATE.FAILED);
                    });
                }
            };

            batch.clearBatchData = function(){
                $('#users,#mentors').dropdown('restore defaults');  
                $('#createBatch').form('reset');
            }

            batch.getCouserBatchesList = function () {
                var request = {
                    "request": {
                        "filters": {
                            courseId: batch.courseId
                        },
                        "sort_by": { createdDate: 'desc' }
                    }
                };
                request.request.filters.status = (_.isUndefined(batch.status)) ? "1" : batch.status.toString();
                if(_.intersection(permissionsService.getCurrentUserRoles(),
                           ['COURSE_MENTOR']).length > 0){
                    batch.isMentor = true;
                    request.request.filters.createdBy = batch.userId;
                }
                console.log(JSON.stringify(request));
                batchService.getAllBatchs(request).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        console.log(response.result.response.count, response.result.response);
                        batch.batchList = response.result.response.content || [];
                    } else {
                        toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
                    }
                }).catch(function () {
                    toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
                });
                // batch.batchList = [{"identifier":"01230667636753203225","name":"Batch1","description":"description1","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-27","status":"1","users":["User1", "User2", "User3"],"mentors":["Mentor1","Mentor2"]},
                // {"identifier":"0123073618825707529","name":"Batch2","description":"description2","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-08-27","enddate":"2017-09-27","status":"0","users":["User3","User4","User2","User5"],"mentors":["Mentor3","Mentor5"]},
                // {"identifier":"01230667636753203225","name":"Batch3","description":"description3","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-03","status":"2","users":["User3","User6"],"mentors":["Mentor5","Mentor3"]}];
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
                        toasterService.error(errorMessages.BATCH.GET_USERS.FAILED);
                    }
                    console.log('response ', response);
                }).catch(function () {
                    toasterService.error(errorMessages.BATCH.GET_USERS.FAILED);
                });
            };

            batch.showBatchDetails = function(batchData){
                $('#batchDetails').iziModal('open');
                $rootScope.$broadcast('batch.view', batchData);    
            }

            $rootScope.$on('batch.view', function (e, batch) {
                    batch.batchInfo = batch;    
            })

            $timeout(function () {
                $('#batchDetails').iziModal({
                    title: '',
                    fullscreen: false,
                    openFullscreen: true,
                    closeOnEscape: false,
                    overlayClose: false,
                    overlay: false,
                    overlayColor: ''
                });        
            },500);
            
        }
    ]);

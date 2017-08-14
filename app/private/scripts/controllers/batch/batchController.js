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
    'batchService', '$filter', 'permissionsService', 'errorMessages', 'toasterService', 'courseService',
    function($rootScope, $timeout, $state, $scope, $stateParams, batchService, $filter, 
    permissionsService, errorMessages, toasterService, courseService) {
            var batch = this;
            batch.userList = [];
            batch.menterList = [];
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;
            batch.coursecreatedby = $stateParams.coursecreatedby;
            batch.submitted = false;
            batch.showBatchCard = $scope.showbatchcard;
            batch.quantityOfBatchs = 3;
            batch.isMentor = false;
            batch.status = 1;
            batch.statusOptions = [
                { name: 'Ongoing', value: 1 },
                { name: 'New', value: 0 }
            ];
            batch.batchInfo = undefined;
            batch.showCreateBatchModal = function () {
                batch.getUserList();
                $timeout(function () {
                    batch.data = {enrollmentType : "invite-only"};
                    $('input:radio[name="enrollmentType"]').filter('[value="invite-only"]').attr('checked', true);
                    $('#users,#mentors').dropdown({ forceSelection: false, fullTextSearch: true });
                    $('.ui.calendar').calendar({refresh: true});
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
                            "mentors": _.compact(data.mentors)
                        }
                    }
                    batchService.create(request).then(function (response) {
                        if (response && response.responseCode === 'OK') {
                            if(data.users && data.users.length > 0){
                                var userRequest = {
                                    "request" : {
                                        "userIds": _.compact(data.users)
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
                        batch.userList = [];
                        batch.userNames = [];
                        _.forEach(response.result.response.content, function(val){
                            batch.userList.push(val.createdBy);
                        });
                        batch.userList = _.compact(_.uniq(batch.userList));
                        var req = {
                            "request": {
                                "filters":{
                                    "identifier": batch.userList 
                                }
                            }
                        }
                        batchService.getUserList(req).then(function (res) {
                            if (res && res.responseCode === 'OK') {
                                _.forEach(res.result.response.content, function(val){
                                    batch.userNames[val.userId] = val.firstName +' '+ val.lastName;
                                });
                            }else{
                               toasterService.error(errorMessages.BATCH.GET_USERS.FAILED); 
                            }
                        }).catch(function () {
                            toasterService.error(errorMessages.BATCH.GET_USERS.FAILED);
                        });
                        batch.batchList = response.result.response.content || [];
                    } else {
                        toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
                    }
                }).catch(function () {
                    toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
                });
            };

            batch.showUpdateBatchModal = function(batchData, coursecreatedby){
                batchService.setBatchData(batchData);
                $state.go('updateBatch', {batchId: batchData.identifier, coursecreatedby: coursecreatedby});
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
                //$rootScope.batchInfo = angular.copy(batchData);
                //$rootScope.$broadcast('batchDetails',batchData) 
                $('#batchDetails').modal('show');
            };

            batch.enrollUserToCourse = function(batchId){
                var req = {
                    "request":{
                        courseId: batch.courseId,
                        userId: batch.userId,
                        batchId: batchId
                    }
                }

                courseService.enrollUserToCourse(req).then(function (response) {
                    if (response && response.responseCode === 'OK') {
                        
                    }else{
                        toasterService.error(errorMessages.Courses.ENROLL.ERROR);
                    }
                }).catch(function () {
                    toasterService.error(errorMessages.Courses.ENROLL.ERROR);
                });
            };
        }
    ]);

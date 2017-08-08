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
        'batchService', '$filter' ,function($rootScope, $timeout, $state, $scope, $stateParams, batchService, $filter) {
            var batch = this;
            batch.userList = [
                {id: '1', name: 'User1', image: 'jenny.jpg'},
                {id: '2', name: 'User2', image: 'elliot.jpg'},
                {id: '3', name: 'User3', image: 'stevie.jpg'},
                {id: '4', name: 'User4', image: 'christian.jpg'},
                {id: '5', name: 'User5', image: 'matt.jpg'},
                {id: '6', name: 'User6', image: 'justen.jpg'},
                {id: '7', name: 'User7', image: 'user_logo.png'}
            ];
            batch.menterList = [
                {id: '1', name: 'Mentor1', image: 'jenny.jpg'},
                {id: '2', name: 'Mentor2', image: 'elliot.jpg'},
                {id: '3', name: 'Mentor3', image: 'stevie.jpg'},
                {id: '4', name: 'Mentor4', image: 'christian.jpg'},
                {id: '5', name: 'Mentor5', image: 'matt.jpg'},
                {id: '6', name: 'Mentor6', image: 'justen.jpg'}
            ];
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
                $timeout(function () {
                    $('#users,#mentors').dropdown({ forceSelection: false });
                    $('.ui.calendar').calendar({refresh: true});
                    $('input:radio[name="enrollmenttype"]').filter('[value="invite-only"]').attr('checked', true);
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
                                        batch = { data : { startdate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() } }; 
                                    }else if(_.isUndefined(batch.data)){
                                        batch.data = { startdate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() };
                                    }else{
                                        batch.data.startdate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
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
                                                batch = { data : { enddate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() } };
                                            }else if(_.isUndefined(batch.data)){
                                                batch.data = { enddate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() };
                                            }else{
                                                batch.data.enddate = date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate()
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

            batch.addBatch = function(data){
                if($scope.createBatch.$valid){
                    if(data.enrollmenttype != 'open'){
                        data.users = $("#users").dropdown("get value").split(",");
                        data.mentors = $("#mentors").dropdown("get value").split(",");
                    }
                    var requestBody = angular.copy(data);
                    requestBody.courseId = batch.courseId;
                    requestBody.createdBy = batch.userId;
                    requestBody.createdFor = $rootScope.organisationIds;
                    data.users = $("#users").dropdown("get value");
                    //batchService.create(requestBody);
                    console.log('requestBody', JSON.stringify(requestBody));
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
                //     sort_by: { createdOn: 'desc' },
                //     offset: 0,
                //     limit: 10
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
                batch.batchList = [{"identifier":"do_123454","name":"Batch1","description":"description1","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-27","status":"1","users":["User1", "User2", "User3"],"mentors":["Mentor1","Mentor2"]},{"identifier":"do_123455","name":"Batch2","description":"description2","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-08-27","enddate":"2017-09-27","status":"0","users":["User3","User4","User2","User5"],"mentors":["Mentor3","Mentor5"]},{"identifier":"do_123456","name":"Batch3","description":"description3","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-03","status":"2","users":["User3","User6"],"mentors":["Mentor5","Mentor3"]}];
            };

            batch.showUpdateBatchModal = function(batchData){
                batchService.setBatchData(batchData);
                $state.go('updateBatch', {batchId: batchData.identifier});
            }
        }
    ]);

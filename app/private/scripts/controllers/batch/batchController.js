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
            batch.userList = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'];
            batch.menterList = ['Mentor1', 'Mentor2', 'Mentor3', 'Mentor4', 'Mentor5', 'Mentor6']
            batch.userId = $rootScope.userId;
            batch.courseId = $stateParams.courseId;
            batch.submitted = false;
            batch.showBatchCard = $scope.showbatchcard;
            batch.quantityOfBatchs = 3;
            batch.userName = $rootScope.firstName + ' ' + $rootScope.lastName;

            batch.showCreateBatchModal = function () {
                $timeout(function () {
                    $('#users,#mentors').dropdown();
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
                                    batch = { data : { startdate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() } }; 
                                    $('.ui.calendar#rangeendAdd').calendar({
                                        type: 'date',
                                        minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                                        formatter: {
                                            date: function (date, settings) {
                                                return $filter('date')(date, "yyyy-MM-dd")
                                            }
                                        },
                                        onChange: function (date, text, mode) {
                                            batch = { data : { enddate : date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate() } };
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

            batch.createBatch = function(data){
                if(batch.createBatch.$valid){
                    var requestBody = angular.copy(data);
                    requestBody.courseId = batch.courseId;
                    requestBody.createdBy = batch.userId;
                    requestBody.createdFor = $rootScope.organisationIds;

                    //batchService.create(requestBody);
                    console.log('requestBody', JSON.stringify(requestBody));
                }
            };

            batch.clearBatchData = function(){
                $('#users,#mentors').dropdown('restore defaults');  
                $('#createBatch').form('reset');
            }

            $scope.getCouserBatches = function () {
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
                batch.batchList = [{"identifier":"do_123454","name":"Batch1","description":"description1","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-27","status":"1","users":["User1","User2"],"mentors":["Mentor1","Mentor2"]},{"identifier":"do_123455","name":"Batch2","description":"description2","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-08-27","enddate":"2017-09-27","status":"0","users":["User3","User4"],"mentors":["Mentor3","Mentor5"]},{"identifier":"do_123456","name":"Batch3","description":"description3","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-03","status":"2","users":["User3","User6"],"mentors":["Mentor5","Mentor3"]}];
            };

            batch.showUpdateBatchModal = function(batchData){
                batchService.setBatchData(batchData);
                $state.go('updateBatch', {batchId: batchData.identifier});
            }
        }
    ]);

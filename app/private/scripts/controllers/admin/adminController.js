'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:adminController
 * @author Poonam Sharma
 * @description
 * # adminController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('adminController', ['adminService', '$timeout', '$state', 'config', '$rootScope', '$scope',
        function (adminService, $timeout, $state, config, $rootScope, $scope) {
            console.log('inside conroller', $scope.data);
            var admin = this;
            admin.userName = '';
            admin.searchUser = function () {
                var searchReq = {
                    id: 'unique API ID',
                    ts: '2013/10/15 16:16:39',
                    params: {

                    },
                    request: {

                        filters: {
        	                objectType: ['user'],
                            name: 'newUser1'
                            // 'education.address.country': 'India'
                        },
                        offset: 0,
                        limit: 5
                    }
                };
                adminService.searchUser(searchReq).then(function (users) {
                    console.log('users', users.result.response.response);
                    admin.searchedUsers = users.result.response.response;
                });

                console.log('trying to search user', admin.userName);
            };
            admin.deleteUser = function (userId) {
                var removeReq = {
                    params: { },
                    request: {
                        userId: '187c69ab-6a9e-42b6-a81e-d18f4e430e55'
                    }
                };
                adminService.deleteUser(removeReq).then(function (res) {
                    if (res.result.response === 'SUCCESS') {
                        admin.searchedUsers = admin.searchedUsers.filter(function (user) {
                            return user.userId !== userId;
                        });
                    }
                });
            };
        }]);

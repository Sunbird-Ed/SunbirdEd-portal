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
    .controller('adminController', [
        'adminService',
        '$timeout',
        '$state',
        'config',
        '$rootScope',
        '$scope', function (adminService, $timeout, $state, config, $rootScope, $scope) {
            console.log('inside conroller', $scope.users);

            var admin = this;
            admin.userRoles = config.USER_ROLES;
            admin.searchedUsers = $scope.users;
            admin.userName = '';
            admin.exportUsers = function () {
                alasql('SELECT firstName AS Name, email AS Email ' +
                         'INTO CSV(\'Users.csv\',{headers:true}) FROM ?', [admin.searchedUsers]);
            };
            admin.deleteUser = function (userId) {
                var removeReq = {
                    params: { },
                    request: {
                        userId: userId
                    }
                };
                adminService.deleteUser(removeReq).then(function (res) {
                    if (res.result.response === 'SUCCESS') {
                        console.log('res of deleter', res);
                        console.log('admin.searchedUsers before delete', admin.searchedUsers.length);
                        admin.searchedUsers = admin.searchedUsers.filter(function (user) {
                            return user.userId !== userId;
                        });
                        console.log('admin.searchedUsers after delete', admin.searchedUsers.length);
                    }
                });
            };
            admin.createOrg = function () {
                var orgRequest = {
                    params: { },
                    request: {
                        orgName: 'TamilNadu',
                        description: 'Tamil Nadu Board',
                        preferredLanguage: 'English',
                        orgCode: 'TN1',
                        source: 'testGov11',
                        externalId: 'QWE'

                    }
                };
                adminService.createOrg(orgRequest).then(function (res) {
                    if (res.responseCode === 'OK') {
                        admin.newOrgId = res.result.organisationId;
                    }
                });
            };
        }]);
         // admin.searchUser = function () {
            //     var searchReq = {
            //         id: 'unique API ID',
            //         ts: '2013/10/15 16:16:39',
            //         params: {

            //         },
            //         request: {

            //             filters: {
        	//                 objectType: ['user'],
            //                 name: 'newUser1'
            //                 // 'education.address.country': 'India'
            //             },
            //             offset: 0,
            //             limit: 5
            //         }
            //     };
            //     adminService.searchUser(searchReq).then(function (users) {
            //         console.log('users', users.result.response.response);
            //         admin.searchedUsers = users.result.response.response;
            //     });

            //     console.log('trying to search user', admin.userName);
            // };

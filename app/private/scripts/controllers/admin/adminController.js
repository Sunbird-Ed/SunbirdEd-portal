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
        '$scope',
        'contentService',
        function (adminService, $timeout, $state, config, $rootScope, $scope, contentService) {
            var admin = this;
            admin.userRoles = config.USER_ROLES;
            admin.searchResult = $scope.users;
            admin.userName = '';
            admin.bulkUsers = {};
        // modal init
            admin.showModal = function () {
                $('#changeUserRoles').modal('show');
            };
            admin.modalInit = function () {
                $timeout(function () {
                    $('#userOrgs').dropdown();
                }, 1000);
                $('.roleChckbox').checkbox();
            };
            // download list of user or organization
            admin.downloadUsers = function (key, list) {
                if (key === 'Users') {
                    list.forEach(function (user) {
                        user.organisationsName = [];
                        if (user.organisations) {
                            user.organisations.forEach(function (org) {
                                user.organisationsName.push(org.orgName);
                            });
                        }
                    });
                    alasql('SELECT firstName AS firstName,lastName AS lastName,phone AS phone,'
                    + 'email AS email,organisationsName AS Organisations,userName AS userName '
                    + 'INTO CSV(\'Users.csv\',{headers:true}) FROM ?'
                    , [list]);
                } else if (key === 'Organisations') {
                    list.forEach(function (org) {
                        switch (org.status) {
                        case 0:org.status = 'INACTIVE'; break;
                        case 1:org.status = 'ACTIVE'; break;
                        case 2:org.status = 'BLOCKED'; break;
                        case 3:org.status = 'RETIRED'; break;
                        default :break;
                        }
                    });
                    alasql('SELECT orgName AS orgName,orgType AS orgType,'
                    + 'noOfMembers AS noOfMembers,channel AS channel'
                    + 'status AS Status INTO CSV(\'Organizations.csv\',{headers:true}) FROM ?'
                    , [list]);
                }
            };
 // upload for bulk user create

            admin.openImageBrowser = function () {
                if (!((admin.bulkUsers.provider && admin.bulkUsers.externalid)
                    || admin.bulkUsers.OrgId)) {
                    admin.bulkUploadError = true;
                    admin.bulkUploadErrorMessage = 'you should enter Provider and External Id ' +
                                                    'Or Organization Id';

                    $timeout(function () {
                        admin.bulkUploadError = false;
                        admin.bulkUploadErrorMessage = '';
                        admin.bulkUsers = {};
                    }, 2000);
                } else { $('#uploadCSV').click(); }
            };
            $scope.validateFile = function (files) {
                var fd = new FormData();
                var reader = new FileReader();
                if (files[0] && files[0].name.match(/.(csv|xlsx)$/i)
                    && files[0].size < 4000000) {
                    fd.append('file', files[0]);

                    reader.onload = function () {
                        admin.createNewUsers();
                    };
                    admin.fileName = files[0].name;
                    reader.readAsDataURL(files[0]);
                    admin.fileToUpload = fd;
                } else {
                    toasterService.warning('');
                }
            };
            admin.createNewUsers = function (file) {
                var newUsersReq = {
                    user: admin.fileToUpload,
                    organisationId: admin.bulkUsers.OrgId, // valid or
                    externalid: admin.bulkUsers.externalid, // valid and
                    provider: admin.bulkUsers.provider// valid
                };
                console.log('newUsersReq', newUsersReq);
                adminService.bulkUserUpload(newUsersReq).then(function (res) {
                    console.log('res bulk users', res);
                });
            };
            admin.closeBulkUploadError = function () {
                admin.bulkUploadError = false;
                admin.bulkUploadErrorMessage = '';
                admin.bulkUsers = {};
            };
// edit roles
            admin.isUserRole = function (role, list) {
                return list.includes(role);
            };
            admin.editRoles = function (role, userRoles) {
                if (userRoles.includes(role) === true) {
                    admin.selectedOrgUserRoles.pop(role);
                } else {
                    admin.selectedOrgUserRoles.push(role);
                }
            };
            admin.updateRoles = function (userId, orgId, roles) {
                var req = {
                    request: {
                        userId: userId,
                        organisationId: orgId,
                        roles: roles

                    }
                };
                console.log('req or role udate', req);
                adminService.updateRoles(req).then(function (res) {
                    console.log('res of update', res);
                });
            };
// delete user
            admin.deleteUser = function (userId) {
                var removeReq = {
                    params: { },
                    request: {
                        userId: userId
                    }
                };
                console.log('removeReq', removeReq);
                adminService.deleteUser(removeReq).then(function (res) {
                    if (res.result.response === 'SUCCESS') {
                        console.log('res of deleter', res);
                        console.log('admin.searchResult before delete', admin.searchResult.length);
                        admin.searchResult = admin.searchResult.filter(function (user) {
                            return user.userId !== userId;
                        });
                        console.log('admin.searchResult after delete', admin.searchResult.length);
                    }
                });
            };

                 // create org
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

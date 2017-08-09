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
        'contentService', 'toasterService',
        function (adminService, $timeout, $state, config, $rootScope, $scope,
            contentService, toasterService) {
            var admin = this;
            admin.userRoles = config.USER_ROLES;
            admin.searchResult = $scope.users;
            admin.userName = '';
            admin.bulkUsers = {};
        // modal init
            admin.addOrgNameToOrganizations = function () {
                if ($rootScope.search.selectedSearchKey === 'Users') {
                    admin.searchResult.forEach(function (user) {
                        if (user.organisations) {
                            admin.getOrgName(function (orgIdAndNames) {
                                user.organisations.forEach(function (userOrg) {
                                    var orgNameAndId = orgIdAndNames.find(function (org) {
                                        return org.orgId === userOrg.organisationId;
                                    });
                                    if (orgNameAndId) { userOrg.orgName = orgNameAndId.orgName; }
                                });
                            });
                        }
                    });
                }
            };
            admin.showModal = function (orgs) {
                $('#changeUserRoles').modal({
                    onShow: function () {
                        admin.userOrganisations = orgs;
                        admin.selectedOrgUserRoles = [];
                    },
                    onHide: function () {
                        admin.userOrganisations = [];
                        admin.selectedOrgUserRoles = [];
                        return true;
                    }
                }).modal('show');
                // admin.getOrgName(function (orgIdAndNames) {
                //     admin.userOrganisations.forEach(function (userOrg) {
                //         var orgNameAndId = orgIdAndNames.find(function (org) {
                //             return org.orgId === userOrg.organisationId;
                //         });
                //         if (orgNameAndId) { userOrg.orgName = orgNameAndId.orgName; }
                //     });
                // });
            };

            admin.modalInit = function () {
                $timeout(function () {
                    $('#userOrgs').dropdown();
                }, 0);
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

            admin.openImageBrowser = function (key) {
                if (key === 'users') {
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
                    } else { $('#uploadUsrsCSV').click(); }
                } else if (key === 'organizations') {
                    $('#uploadOrgCSV').click();
                }
            };
            $scope.validateFile = function (files, key) {
                var fd = new FormData();
                var reader = new FileReader();
                if (files[0] && files[0].name.match(/.(csv|xlsx)$/i)
                    && files[0].size < 4000000) {
                    reader.onload = function () {
                        if (key === 'users') {
                            fd.append('user', files[0]);
                            admin.createNewUsers(fd);
                        } else if (key === 'organizations') {
                            fd.append('org', files[0]);
                            admin.createNewOrganizations(fd);
                        }
                    };
                    admin.fileName = files[0].name;
                    reader.readAsDataURL(files[0]);
                    admin.fileToUpload = fd;
                } else {
                    toasterService.error(apiMessages.ERROR.get);
                }
            };
            admin.createNewUsers = function () {
                var organisationId = admin.bulkUsers.OrgId;
                // var newUsersReq = { user: file, organisationId: organisationId };
                //     organisationId: admin.bulkUsers.OrgId, // valid or
                //     externalid: admin.bulkUsers.externalid, // valid and
                //     provider: admin.bulkUsers.provider// valid
                // };
                // console.log('newUsersReq', newUsersReq);
                admin.fileToUpload.append('organisationId', organisationId);
                adminService.bulkUserUpload(admin.fileToUpload).then(function (res) {
                    if (res.responseCode === 'OK') {
                        admin.bulkUsersProcessId = res.result.processId;
                        admin.bulkUsersRes = res.result.response;
                    }
                });
            };
            admin.createNewOrganizations = function () {
                adminService.bulkOrgrUpload(admin.fileToUpload).then(function (res) {
                    if (res.responseCode === 'OK') {
                        admin.bulkOrgProcessId = res.result.processId;
                        admin.bulkOrgRes = res.result.response;
                    }
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

                adminService.updateRoles(req).then(function (res) {
                    if (res.responseCode === 'OK') {
                        toasterService.success($rootScope.errorMessages.ADMIN.roleUpdateSuccess);
                        $('#changeUserRoles').modal('hide');
                    } else {
                        $('#changeUserRoles').modal('hide');
                        // profile.isError = true;
                        toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    }
                }).catch(function (err) {
                    profile.isError = true;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
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

                adminService.deleteUser(removeReq).then(function (res) {
                    if (res.result.response === 'SUCCESS') {
                        admin.searchResult = admin.searchResult.filter(function (user) {
                            return user.userId !== userId;
                        });
                    }
                }).catch(function (err) {
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
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
            // checkStatus
            admin.checkStatus = function (processID) {

            };

            // getOrgnames
            admin.getOrgName = function (cb) {
                var identifiers = [];

                admin.searchResult.forEach(function (user) {
                    if (user.organisations) {
                        var ids = user.organisations.map(function (org) {
                            return org.organisationId;
                        });
                        identifiers = _.union(identifiers, ids);
                    }
                });
                var req = { request: {

                    filters: {
                        identifier: identifiers

                    }

                } };
                adminService.orgSearch(req).then(function (res) {
                    var orgIdAndNames = res.result.response.content.map(function (org) {
                        return {
                            orgName: org.orgName,
                            orgId: org.identifier
                        };
                    });
                    cb(orgIdAndNames);
                });
            };
        }]);


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
        'toasterService',
        function (adminService, $timeout, $state, config, $rootScope, $scope,
            contentService, toasterService) {
            var admin = this;
            admin.userRoles = config.USER_ROLES;
            admin.searchResult = $scope.users;
            // admin.userName = '';
            admin.bulkUsers = {};

            admin.sampleOrgCSV = [{ orgName: null,
                isRootOrg: null,
                channel: null,
                externalId: null,
                provider: null,
                description: null
            }];
            admin.sampleUserCSV = [{
                firstName: null,
                lastName: null,
                phone: null,
                email: null,
                Organisations: null,
                userName: null
            }
            ];
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
            // open editRoles modal
            admin.showModal = function (userId, orgs) {
                $('#changeUserRoles').modal({
                    onShow: function () {
                        admin.userId = userId;
                        admin.userOrganisations = orgs;
                        admin.selectedOrgUserRoles = [];
                        $('#userOrgs').dropdown('restore defaults');
                    },
                    onHide: function () {
                        admin.userId = '';
                        admin.userOrganisations = [];
                        admin.selectedOrgUserRoles = [];
                        return true;
                    }
                }).modal('show');
            };
            admin.modalInit = function () {
                $timeout(function () {
                    $('#userOrgs').dropdown();
                }, 0);
                $('.roleChckbox').checkbox();
            };
            // open delete modal
            admin.showdeleteModal = function (id, firstName, lastName) {
                $('#deleteUserConfirmation').modal({
                    onShow: function () {
                        admin.deletingUserId = id;
                        admin.deletingUserFullName = firstName + ' ' + lastName;
                    },
                    onHide: function () {
                        admin.deletingUserId = '';
                        admin.deletingUserFullName = '';
                        return true;
                    }
                }).modal('show');
            };
             // open  upload csv modal

            admin.orgBulkUpload = function () {
                $('#orgBulkUpload').modal('refresh');
                $('#orgBulkUpload').modal({
                    onShow: function () {
                        admin.fileName = '';
                        admin.bulkOrgProcessId = '';
                    },
                    onHide: function () {
                        return true;
                    }
                }).modal('show');
            };
            admin.userBulkUpload = function () {
                $('#userBulkUpload').modal('refresh');
                $('#userBulkUpload').modal({
                    onShow: function () {
                        admin.fileName = '';
                        admin.bulkUsersProcessId = '';
                    },
                    onHide: function () {
                        return true;
                    }
                }).modal('show');
            };
            admin.statusBulkUpload = function () {
                $('#statusBulkUpload').modal('refresh');
                $('#statusBulkUpload').modal({
                    onShow: function () {
                        $('#statusForm').form('reset');
                        admin.uploadStatusKey = '';
                        admin.bulkUploadStatus = {};
                        admin.bulkUploadStatus.processId = '';
                        admin.processID = '';
                    },
                    onHide: function () {
                        admin.bulkUploadStatus = {};
                        admin.bulkUploadStatus.processId = '';
                        return true;
                    }
                }).modal('show');
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
                    + 'noOfMembers AS noOfMembers,channel AS channel, '
                    + 'status AS Status INTO CSV(\'Organizations.csv\',{headers:true}) FROM ?'
                    , [list]);
                }
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
                        toasterService.success($rootScope.errorMessages.ADMIN.deleteSuccess);
                        admin.searchResult = admin.searchResult.filter(function (user) {
                            return user.userId !== userId;
                        });
                    } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                }).catch(function (err) {
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
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
                        $('#changeUserRoles').modal('hide', function () {
                            $('#changeUserRoles').modal('hide');
                        });
                    } else {
                        $('#changeUserRoles').modal('hide', function () {
                            $('#changeUserRoles').modal('hide');
                        });
                        // profile.isError = true;
                        toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    }
                }).catch(function (err) {
                    profile.isError = true;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
            };

            // bulk upload

            admin.openImageBrowser = function (key) {
                // admin.loader = toasterService.loader('', 'validating file');
                if (key === 'users') {
                    if (!((admin.bulkUsers.provider && admin.bulkUsers.externalid)
                    || admin.bulkUsers.OrgId)) {
                        admin.bulkUploadError = true;
                        admin.bulkUploadErrorMessage =
                         'you should enter Provider and External Id Or Organization Id';

                        $timeout(function () {
                            admin.bulkUploadError = false;
                            admin.bulkUploadErrorMessage = '';
                            admin.bulkUsers = {};
                        }, 2000);
                    } else { $('#uploadUsrsCSV').click(); }
                } else if (key === 'organizations') {
                    $('#orgUploadCSV').click();
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
                            admin.bulkUploadUsers(fd);
                        } else if (key === 'organizations') {
                            fd.append('org', files[0]);
                            admin.bulkUploadOrganizations(fd);
                        }
                    };
                    admin.fileName = files[0].name;
                    reader.readAsDataURL(files[0]);
                    admin.fileToUpload = fd;
                } else {
                    toasterService.error('upload failed');
                }
            };
            admin.bulkUploadUsers = function () {
                admin.fileToUpload.append('organisationId', admin.bulkUsers.OrgId);
                admin.fileToUpload.append('externalid', admin.bulkUsers.externalid);
                admin.fileToUpload.append('provider', admin.bulkUsers.provider);
                admin.loader = toasterService.loader('', 'uploading users');
                $timeout(function () {
                    adminService.bulkUserUpload(admin.fileToUpload).then(function (res) {
                        admin.loader.showLoader = false;
                        if (res.responseCode === 'OK') {
                            admin.bulkUsersProcessId = res.result.processId;
                            admin.bulkUsersRes = res.result.response;
                            toasterService.success('users uploaded successfully');
                        } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                    }).catch(function (err) {
                        admin.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    });
                }, 5000);
            };
            admin.bulkUploadOrganizations = function () {
                admin.loader = toasterService.loader('', 'uploading Organizations');
                adminService.bulkOrgrUpload(admin.fileToUpload).then(function (res) {
                    admin.loader.showLoader = false;
                    if (res.responseCode === 'OK') {
                        admin.bulkOrgProcessId = res.result.processId;
                        admin.bulkOrgRes = res.result.response;
                        toasterService.success('Organizations uploaded successfully');
                    } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                }).catch(function (err) {
                    admin.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
            };
            admin.closeBulkUploadError = function () {
                admin.bulkUploadError = false;
                admin.bulkUploadErrorMessage = '';
                admin.bulkUsers = {};
            };
            admin.getBulkUloadStatus = function (id, key) {
                admin.loader = toasterService.loader('', 'getting status ');
                adminService.bulkUploadStatus(id).then(function (res) {
                    admin.loader.showLoader = false;
                    $('#statusBulkUpload').modal('refresh');
                    if (res.responseCode === 'OK') {
                        admin.uploadStatusKey = key;
                        admin.bulkUploadStatus.success = res.result.response[0].successResult;
                        admin.bulkUploadStatus.failure = res.result.response[0].failureResult;
                        admin.bulkUploadStatus.processId = res.result.response[0].processId;
                    } else {
                        toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    }
                }).catch(function (err) {
                    admin.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    console.log('some error');
                });
            };
            admin.downloadSample = function (key) {
                if (key === 'users') {
                    alasql('SELECT * INTO CSV(\'Sample_Users.csv\', {headers: true}) FROM ?',
                [admin.sampleUserCSV]);
                } else if (key === 'organizations') {
                    alasql(' SELECT *  INTO CSV(\'Sample_Organizations.csv\', {headers: true}) FROM ?',
                [admin.sampleOrgCSV]);
                }
            };
                 // create org
            // admin.createOrg = function () {
            //     var orgRequest = {
            //         params: { },
            //         request: {
            //             orgName: 'TamilNadu',
            //             description: 'Tamil Nadu Board',
            //             preferredLanguage: 'English',
            //             orgCode: 'TN1',
            //             source: 'testGov11',
            //             externalId: 'QWE'

            //         }
            //     };
            //     adminService.createOrg(orgRequest).then(function (res) {
            //         if (res.responseCode === 'OK') {
            //             admin.newOrgId = res.result.organisationId;
            //         }
            //     });
            // };
        }]);


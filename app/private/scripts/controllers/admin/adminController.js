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
        'permissionsService',
        'searchService',
        function (adminService, $timeout, $state, config, $rootScope, $scope,
            contentService, toasterService, permissionsService, searchService
        ) {
            var admin = this;
            admin.searchResult = $scope.users;
            admin.bulkUsers = {};
            // sample CSV
            admin.sampleOrgCSV = [{
                orgName: 'orgName',
                isRootOrg: 'isRootOrg',
                channel: 'channel',
                externalId: 'externalId',
                provider: 'provider',
                description: 'description'
            }];
            admin.sampleUserCSV = [{
                firstName: 'firstName',
                lastName: 'lastName',
                phone: 'phone',
                email: 'email',
                userName: 'userName',
                password: 'password',
                provider: 'provider',
                phoneVerified: 'phoneVerified',
                emailVerified: 'emailVerified',
                roles: 'roles',
                position: 'position',
                grade: 'grade',
                location: 'location',
                dob: 'dob',
                aadhaarNo: 'aadhaarNo',
                gender: 'gender',
                language: 'language',
                profileSummary: 'profileSummary',
                subject: 'subject'
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
            // OVERRIDE USERS SEARCH RESULT AND ADD ORGNAME TO RESULT
            admin.addOrgNameToOrganizations = function () {
                admin.currentUserRoles = permissionsService.getCurrentUserRoles();
                if ($rootScope.search.selectedSearchKey === 'Users') {
                    admin.getOrgName(function (orgIdAndNames) {
                        admin.searchResult.forEach(function (user) {
                            if (user.organisations) {
                                var isSystemAdminUser = user.organisations[0].roles
                                                    .includes('SYSTEM_ADMINISTRATION');
                                if (isSystemAdminUser === true) {
                                    user.isEditableProfile = admin.currentUserRoles
                                    .includes('SYSTEM_ADMINISTRATION');
                                } else if (!isSystemAdminUser) {
                                    user.isEditableProfile = true;
                                }
                                user.organisations.forEach(function (userOrg) {
                                    var orgNameAndId = orgIdAndNames.find(function (org) {
                                        return org.orgId === userOrg.organisationId;
                                    });
                                    if (orgNameAndId) { userOrg.orgName = orgNameAndId.orgName; }
                                });
                            }
                        });
                    });
                }
            };
            // MODAL INIT
            admin.modalInit = function () {
                $timeout(function () {
                    $('#userOrgs').dropdown();
                }, 0);
                $('.roleChckbox').checkbox();
            };
            // open editRoles modal
            admin.showModal = function (identifier, orgs) {
                $('#changeUserRoles').modal({
                    onShow: function () {
                        admin.identifier = identifier;
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

            // open delete modal
            admin.showdeleteModal = function (id, firstName, lastName) {
                $('#deleteUserConfirmation').modal({
                    onShow: function () {
                        admin.deletingIdentifier = id;
                        admin.deletingUserFullName = firstName + ' ' + lastName || '';
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
                        admin.loader = {};
                    },
                    onHide: function () {
                        admin.loader = {};
                        return true;
                    }
                }).modal('show');
            };
            admin.userBulkUpload = function () {
                $('#userBulkUpload').modal('refresh');
                $('#userBulkUpload').modal({
                    onShow: function () {
                        admin.bulkUsers = {};
                        admin.fileName = '';
                        admin.bulkUsersProcessId = '';
                        $('#bulkUsers').form('reset');
                        admin.loader = {};
                        admin.isUploadLoader = false;
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
                    var nullReplacedToEmpty = JSON.stringify(list).replace(/null/g, '""');
                    var users = JSON.parse(nullReplacedToEmpty);
                    alasql('SELECT firstName AS firstName,lastName AS lastName, '
                    + ' organisationsName AS Organisations ,location AS Location, grade AS Grades, '
                    + 'language AS Language ,subject as Subjects '
                    + ' INTO CSV(\'Users.csv\',{headers:true ,separator:","}) FROM ?'
                    , [users]);
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
                    var orgNullReplacedToEmpty = JSON.stringify(list).replace(/null/g, '""');
                    var organizations = JSON.parse(orgNullReplacedToEmpty);
                    alasql('SELECT orgName AS orgName,orgType AS orgType,'
                    + 'noOfMembers AS noOfMembers,channel AS channel, '
                    + 'status AS Status INTO CSV(\'Organizations.csv\',{headers:true,separator:","}) FROM ?'
                    , [organizations]);
                }
            };

            // delete user
            admin.deleteUser = function (identifier) {
                var removeReq = {
                    params: { },
                    request: {
                        userId: identifier
                    }
                };

                adminService.deleteUser(removeReq).then(function (res) {
                    if (res.result.response === 'SUCCESS') {
                        toasterService.success($rootScope.errorMessages.ADMIN.deleteSuccess);
                        admin.searchResult = admin.searchResult.filter(function (user) {
                            if (user.identifier === identifier) {
                                user.status = 0;
                            }
                            return user;
                        });
                    } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                }).catch(function (err) {// eslint-disable-line
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
            admin.updateRoles = function (identifier, orgId, roles) {
                var req = {
                    request: {
                        userId: identifier,
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
                }).catch(function (err) {// eslint-disable-line
                    profile.isError = true;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
            };

            // bulk upload

            admin.openImageBrowser = function (key) {
                if (key === 'users') {
                    if (!((admin.bulkUsers.provider && admin.bulkUsers.externalid)
                    || admin.bulkUsers.OrgId)) {
                        admin.bulkUploadError = true;
                        admin.bulkUploadErrorMessage =
                         $rootScope.errorMessages.ADMIN.bulkUploadErrorMessage;
                        if (!admin.bulkUploadError) {
                            $timeout(function () {
                                admin.bulkUploadError = false;
                                admin.bulkUploadErrorMessage = '';
                                admin.bulkUsers = {};
                            }, 5000);
                        }
                    } else if (!admin.bulkUploadError) {
                        admin.isUploadLoader = true;
                        $('#uploadUsrsCSV').click();
                    }
                } else if (key === 'organizations') {
                    admin.isUploadLoader = true;
                    $('#orgUploadCSV').click();
                }
            };
            $scope.validateFile = function (files, key) {
                var fd = new FormData();
                var reader = new FileReader();
                if (files[0] && files[0].name.match(/.(csv)$/i)) {
                    // && files[0].size < 4000000) {
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
                    toasterService.error($rootScope.errorMessages.ADMIN.notCSVFile);
                }
            };
            admin.bulkUploadUsers = function () {
                $('#uploadUsrsCSV').val('');
                admin.loader = toasterService
                                .loader('', $rootScope.errorMessages.ADMIN.uploadingUsers);
                admin.fileToUpload.append('organisationId', admin.bulkUsers.OrgId);
                admin.fileToUpload.append('externalid', admin.bulkUsers.externalid);
                admin.fileToUpload.append('provider', admin.bulkUsers.provider);

                adminService.bulkUserUpload(admin.fileToUpload).then(function (res) {
                    admin.loader.showLoader = false;
                    if (res.responseCode === 'OK') {
                        admin.bulkUsersProcessId = res.result.processId;
                        admin.bulkUsersRes = res.result.response;
                        toasterService.success($rootScope.errorMessages.ADMIN.userUploadSuccess);
                    } else if (res.responseCode === 'CLIENT_ERROR') {
                        toasterService.error(res.params.errmsg);
                    } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                }).catch(function (err) {// eslint-disable-line
                    admin.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
            };
            admin.bulkUploadOrganizations = function () {
                $('#orgUploadCSV').val('');
                admin.loader = toasterService
                .loader('', $rootScope.errorMessages.ADMIN.uploadingOrgs);
                adminService.bulkOrgrUpload(admin.fileToUpload).then(function (res) {
                    admin.loader.showLoader = false;
                    if (res.responseCode === 'OK') {
                        admin.bulkOrgProcessId = res.result.processId;
                        admin.bulkOrgRes = res.result.response;
                        toasterService.success($rootScope.errorMessages.ADMIN.orgUploadSuccess);
                    } else if (res.responseCode === 'CLIENT_ERROR') {
                        toasterService.error(res.params.errmsg);
                    } else { toasterService.error($rootScope.errorMessages.ADMIN.fail); }
                }).catch(function (err) {// eslint-disable-line
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
                admin.loader = toasterService.loader('', 'Getting status ');
                adminService.bulkUploadStatus(id).then(function (res) {
                    admin.loader.showLoader = false;
                    $('#statusBulkUpload').modal({ observeChanges: true }).modal('refresh');
                    if (res.responseCode === 'OK') {
                        admin.uploadStatusKey = key;
                        admin.bulkUploadStatus.success = res.result.response[0].successResult;
                        admin.bulkUploadStatus.failure = res.result.response[0].failureResult;
                        admin.bulkUploadStatus.processId = res.result.response[0].processId;
                        toasterService.success($rootScope.errorMessages.ADMIN.statusSuccess);
                    } else {
                        toasterService.error($rootScope.errorMessages.ADMIN.fail);
                    }
                }).catch(function (err) {// eslint-disable-line
                    admin.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.ADMIN.fail);
                });
            };
            admin.downloadSample = function (key) {
                if (key === 'users') {
                    alasql('SELECT * INTO CSV(\'Sample_Users.csv\', {headers: false,separator:","}) FROM ?',
                [admin.sampleUserCSV]);
                } else if (key === 'organizations') {
                    alasql(' SELECT *  INTO CSV(\'Sample_Organizations.csv\',' +
                    ' {headers: false,separator:","}) FROM ?',
                [admin.sampleOrgCSV]);
                }
            };
            admin.getUserRoles = function () {
                admin.userRolesList = [];
                admin.userRoles = permissionsService.allRoles();
            };
            admin.openPublicProfile = function (id, user) {
                searchService.setPublicUserProfile(user);
                $state.go('PublicProfile', { userId: window.btoa(id), userName: user.firstName });
            };
            admin.getUserRoles();
        }]);


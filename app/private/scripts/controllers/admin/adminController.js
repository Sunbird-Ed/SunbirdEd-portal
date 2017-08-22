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

            // user Roles
            admin.getUserRoles = function () {
                admin.userRolesList = [];
                admin.userRoles = permissionsService.allRoles();
            };
            // public profile
            admin.openPublicProfile = function (id, user) {
                searchService.setPublicUserProfile(user);
                $state.go('PublicProfile', { userId: window.btoa(id), userName: user.firstName });
            };
            admin.getUserRoles();
        }]);


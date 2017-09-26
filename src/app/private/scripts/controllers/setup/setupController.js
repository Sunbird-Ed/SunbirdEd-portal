'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:setupController
 * @author Poonam Sharma
 * @description
 * # setupController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('setupController', [

        '$rootScope',
        'searchService',
        'setupService',
        'toasterService',

        function ($rootScope, searchService, setupService, toasterService) {
            var setup = this;
            setup.getOrgTypes = function () {
                searchService.getOrgTypeS().then(function (res) {
                    setup.orgTypes = res;
                });
            };
            setup.openUpdateModal = function (orgType) {
                $('#updateOrgType').modal({
                    onShow: function () {
                        setup.selectedOrg = {};
                        setup.selectedOrg.orgType = orgType;
                    },
                    onHide: function () {
                        setup.selectedOrg = {};
                        return true;
                    }
                }).modal('show');
            };
            setup.openAddTypeModal = function () {
                $('#addOrgType').modal({
                    onShow: function () {
                        setup.newOrgType = '';
                    },
                    onHide: function () {
                        setup.newOrgType = '';
                        return true;
                    }
                }).modal('show');
            };

            setup.addOrgType = function (orgType) {
                var req = {
                    request: {
                        name: orgType
                    }
                };

                setupService.addOrgType(req).then(function (res) {
                    try {
                        if (res.responseCode === 'OK') {
                            toasterService.success(orgType + ' added successfully');
                        } else throw new Error(res.params.errmsg);
                    } catch (err) {
                        if (err.message) {
                            toasterService.error(err.message);
                        } else {
                            toasterService.error('Adding a new org type failed, please try again later');
                        }
                    }
                });
            };

            setup.updateOrgType = function (orgType) {
                var req = {
                    request: orgType
                };
                setupService.updateOrgType(req).then(function (res) {
                    try {
                        if (res.responseCode === 'OK') {
                            toasterService.success(orgType.name + ' updated successfully');
                        } else throw new Error(res.params.errmsg);
                    } catch (err) {
                        if (err.message) {
                            toasterService.error(err.message);
                        } else {
                            toasterService.error('Org  type update failed, please try again later');
                        }
                    }
                });
            };
            setup.getOrgs = function () {
                searchService.getOrgTypes().then(function (res) {
                    if (res.responseCode === 'OK') {
                        searchService.setOrgTypes(res.result.response);
                    }
                    // else throw new Error('');
                });
            };
            setup.getOrgTypes();
        }
    ]);

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
        'setupService',
        'toasterService',

        function ($rootScope, setupService, toasterService) {
            var setup = this;
            var errorMessage = $rootScope.errorMessages.SETUP;

            setup.getOrgTypes = function () {
                setup.loader = toasterService.loader('', 'loading please wait');
                setupService.getOrgTypes().then(function (res) {
                    setup.loader.showLoader = false;
                    try {
                        if (res.responseCode === 'OK') {
                            setup.orgTypes = angular.copy(res.result.response);
                        } else if (res.responseCode === 'CLIENT_ERROR') {
                            throw new Error(res.params.errmsg);
                        } else throw new Error('');
                    } catch (err) {
                        if (err.message) {
                            toasterService.error(err.message);
                        } else {
                            toasterService.error(errorMessage.GET_FAILURE);
                        }
                    }
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
                $('#updateOrgType').modal('refresh');
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
                            toasterService.success(orgType + errorMessage.ADD_SUCCESS);
                            setup.getOrgTypes();
                        } else if (res.responseCode === 'CLIENT_ERROR') {
                            throw new Error(res.params.errmsg);
                        } else throw new Error('');
                    } catch (err) {
                        if (err.message) {
                            toasterService.error(err.message);
                        } else {
                            toasterService.error(errorMessage.ADD_FAILURE);
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
                            toasterService.success(orgType.name + errorMessage.UPDATE_SUCCESS);
                            setup.getOrgTypes();
                        } else if (res.responseCode === 'CLIENT_ERROR') {
                            throw new Error(res.params.errmsg);
                        } else throw new Error('');
                    } catch (err) {
                        if (err.message) {
                            toasterService.error(err.message);
                        } else {
                            toasterService.error(errorMessage.UPDATE_FAILURE);
                        }
                    }
                });
            };
            setup.getOrgTypes();
        }
    ]);

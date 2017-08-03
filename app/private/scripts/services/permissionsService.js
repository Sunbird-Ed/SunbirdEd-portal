'use strict';

/**
 * @ngdoc service
 * @name playerApp.permissionsService
 * @description
 * # permissionsService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('permissionsService', ['httpServiceJava', 'config', '$rootScope',
        function (httpServiceJava, config, $rootScope) {
            var self = this;
            var rolesAndPermissions = [];
            var currentUserRoles = [];
            var currentRoleActions = [];
            this.setRolesAndPermissions = function (data) {
                var rolePermissions = _.cloneDeep(data.roles);
                _.forEach(rolePermissions, function (r, p) {
                    var mainRole = { role: r.id, actions: [] };
                    _.forEach(r.actionGroups, function (ag) {
                        var subRole = { role: ag.id, actions: ag.actions };
                        mainRole.actions = _.concat(mainRole.actions, ag.actions);
                        rolesAndPermissions.push(subRole);
                    });
                    rolesAndPermissions.push(mainRole);
                });
                rolesAndPermissions = _.uniqBy(rolesAndPermissions, 'role');
            },
            this.setCurrentUserRoles = function (roles) {
                currentUserRoles = roles;
                this.setCurrentRoleActions(roles);
            },
            this.setCurrentRoleActions = function (roles) {
                _.forEach(roles, function (r) {
                    var roleActions = _.filter(rolesAndPermissions, { role: r });
                    if (_.isArray(roleActions) && roleActions.length > 0) {
                        currentRoleActions = _.concat(currentRoleActions,
                                                        _.map(roleActions[0].actions, 'id'));
                    }
                });
            },

            // if flag is true than and we check equality if data is string and
            // if data is array check if it is array check role/actions exists in array
            this.checkRolesPermissions = function (data, flag) {
                if (currentUserRoles && currentUserRoles.length > 0) {
                    if (!this.checkActionsPermissions(data, flag)) {
                        if (_.isArray(data)) {
                            if ((_.intersection(data, currentUserRoles).length === 0) && !flag) {
                                return true;
                            }
                            return ((_.intersection(data, currentUserRoles).length > 0) && flag);
                        }
                    } else {
                        return true;
                    }
                }
                return false;
            };

        // if flag is true than and we check equality if data is string and
        // if data is array check if it is array check role/actions exists in array
            this.checkActionsPermissions = function (data, flag) {
                if (_.isArray(data)) {
                    if ((_.intersection(data, currentRoleActions).length === 0) && !flag) {
                        return false;
                    }
                    return ((_.intersection(data, currentRoleActions).length > 0) && flag);
                }
                return false;
            };

            this.getPermissionsData = function () {
                return httpServiceJava.get(config.URL.ROLES.READ);
            };

            this.getCurrentUserRoles = function () {
                return currentUserRoles;
            };

            this.getCurrentUserProfile = function () {
                var url = config.URL.USER.GET_PROFILE + '/' + $rootScope.userId;
                return httpServiceJava.get(url);
            };
        }]);

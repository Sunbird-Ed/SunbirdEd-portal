'use strict'

angular.module('playerApp')
  .service('permissionsService', ['restfulLearnerService', 'config', '$rootScope',
    function (restfulLearnerService, config, $rootScope) {
      /**
     * @class permissionsService
     * @desc Service to manages permissions for user.
     * @memberOf Services
     */
      var self = this
      var rolesAndPermissions = []
      var currentUserRoleMap = {}
      var currentUserRoles = []
      var currentRoleActions = []
      var mainRoles = []
      /**
             * @method setRolesAndPermissions
             * @desc Set roles and permissions
             * @memberOf Services.permissionsService
             * @param {object}  data - Data object containing user roles
             * @instance
             */
      this.setRolesAndPermissions = function (data) {
        var rolePermissions = _.cloneDeep(data.roles)
        _.forEach(rolePermissions, function (r, p) {
          var mainRole = { role: r.id, actions: [], roleName: r.name }
          mainRoles.push(mainRole)
          _.forEach(r.actionGroups, function (ag) {
            var subRole = { role: ag.id, actions: ag.actions, roleName: ag.name }
            mainRole.actions = _.concat(mainRole.actions, ag.actions)
            rolesAndPermissions.push(subRole)
          })
          rolesAndPermissions.push(mainRole)
        })
        rolesAndPermissions = _.uniqBy(rolesAndPermissions, 'role')
      }
      /**
             * @method setCurrentUserRoleMap
             * @desc Set current user role map
             * @memberOf Services.permissionsService
             * @param {object}  orgRoleMap -Org role map

             * @instance
             */
      this.setCurrentUserRoleMap = function (orgRoleMap) {
        currentUserRoleMap = orgRoleMap
      }
      /**
             * @method setCurrentUserRoles
             * @desc Set current user roles
             * @memberOf Services.permissionsService
             * @param {object[]}  roles - List of user roles
             * @instance
             */
      this.setCurrentUserRoles = function (roles) {
        currentUserRoles = roles
        this.setCurrentRoleActions(roles)
      }
      /**
             * @method setCurrentRoleActions
             * @desc Set current user role's actions
             * @memberOf Services.permissionsService
             * @param {object[]}  roles - List of user roles
             * @instance
             */
      this.setCurrentRoleActions = function (roles) {
        _.forEach(roles, function (r) {
          var roleActions = _.filter(rolesAndPermissions, { role: r })
          if (_.isArray(roleActions) && roleActions.length > 0) {
            currentRoleActions = _.concat(currentRoleActions,
              _.map(roleActions[0].actions, 'id'))
          }
        })
      }
      /**
             * @method checkRolesPermissions
             * @desc Check permissions for user role
             * @memberOf Services.permissionsService
             * @param {object[]}  data - User data
             *  @param {string}  flag - Flag
             * @instance
             */
      this.checkRolesPermissions = function (data, flag) {
        if (currentUserRoles && currentUserRoles.length > 0) {
          if (!this.checkActionsPermissions(data, flag)) {
            if (_.isArray(data)) {
              if ((_.intersection(data, currentUserRoles).length === 0) && !flag) {
                return true
              }
              return ((_.intersection(data, currentUserRoles).length > 0) && flag)
            }
          } else {
            return true
          }
        }
        return false
      }
      /**
             * @method checkActionsPermissions
             * @desc Check actions for user permissions
             * @memberOf Services.permissionsService
             * @param {object[]}  data - Data
             *  @param {string}  flag - Flag
             * @instance
             */
      this.checkActionsPermissions = function (data, flag) {
        if (_.isArray(data)) {
          if ((_.intersection(data, currentRoleActions).length === 0) && !flag) {
            return false
          }
          return ((_.intersection(data, currentRoleActions).length > 0) && flag)
        }
        return false
      }

      /**
             * @method getPermissionsData
             * @desc Get permissions  data
             * @memberOf Services.permissionsService
             * @returns {Promise} Promise object represents permissions data
             * @instance
             */
      this.getPermissionsData = function () {
        return restfulLearnerService.get(config.URL.ROLES.READ)
      }
      /**
             * @method allRoles
             * @desc Get all existing user roles
             * @memberOf Services.permissionsService
             * @returns {Object[]} List of all existing user roles
             * @instance
             */
      this.allRoles = function () {
        // console.log(rolesAndPermissions)
        return rolesAndPermissions
      }
      /**
             * @method getCurrentUserRoleMap
             * @desc Get current user role map
             * @memberOf Services.permissionsService
             * @returns {Object} Object of current user role map
             * @instance
             */
      this.getCurrentUserRoleMap = function () {
        return currentUserRoleMap
      }
      /**
             * @method getCurrentUserRoles
             * @desc Get  current user roles
             * @memberOf Services.permissionsService
             * @returns {Object[]} Object of current user roles
             * @instance
             */
      this.getCurrentUserRoles = function () {
        return currentUserRoles
      }
      /**
             * @method getCurrentUserProfile
             * @desc Get  current user profile
             * @memberOf Services.permissionsService
             * @returns {Promise} Promise object represents current user profile
             * @instance
             */
      this.getCurrentUserProfile = function () {
        var url = config.URL.USER.GET_PROFILE + '/' + $rootScope.userId
        return restfulLearnerService.get(url)
      }

      this.getMainRoles = function () {
        return mainRoles
      }

      this.setRoleOrgMap = function (profile) {
        var roles = []
        _.forEach(profile.organisations, function (org) {
          roles = roles.concat(org.roles)
        })
        roles = _.uniq(roles)
        this.roleOrgMap = {}
        _.forEach(roles, function (role) {
          _.forEach(profile.organisations, function (org) {
            self.roleOrgMap[role] = self.roleOrgMap[role] || []
            if (_.indexOf(org.roles, role) > -1) {}
            self.roleOrgMap[role].push(org.organisationId)
          })
        })
      }

      this.getRoleOrgMap = function () {
        return _.cloneDeep(this.roleOrgMap)
      }
    }])

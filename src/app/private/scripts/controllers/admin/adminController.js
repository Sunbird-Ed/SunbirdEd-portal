'use strict'

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
    'userService',
    function (adminService, $timeout, $state, config, $rootScope, $scope,
      contentService, toasterService, permissionsService, searchService, userService
    ) {
      /**
     * @class adminController
     * @desc change user settings
     * @memberOf Controllers
     */
      var admin = this
      admin.searchResult = $scope.users
      admin.courseMentorRole = { roleName: 'Course Mentor', role: 'COURSE_MENTOR' }

      admin.badges = adminService.getBadgesList()
      /**
         * @method getOrgName
         * @desc get organizations name
         * @memberOf Controllers.adminController
         * @inner
         */
      admin.getOrgName = function () {
        var identifiers = []
        admin.searchResult.forEach(function (user) {
          if (user.organisations) {
            var ids = user.organisations.map(function (org) {
              return org.organisationId
            })
            identifiers = _.union(identifiers, ids)
          }
        })
        var req = {
          request: {
            filters: {
              identifier: identifiers
            }
          }
        }
        return adminService.orgSearch(req).then(function (res) {
          var orgIdAndNames = res.result.response.content.map(function (org) {
            return {
              orgName: org.orgName,
              orgId: org.identifier
            }
          })
          return orgIdAndNames
        })
      }
      // OVERRIDE USERS SEARCH RESULT AND ADD ORGNAME TO RESULT
      admin.addOrgNameToOrganizations = function () {
        admin.currentUserRoles = permissionsService.getCurrentUserRoles()
        admin.currentUserRoleMap = permissionsService.getCurrentUserRoleMap()
        if ($rootScope.search.selectedSearchKey === 'Users') {
          admin.getOrgName().then(function (orgIdAndNames) {
            admin.searchResult.forEach(function (user) {
              if (user.roles) {
                // if user is sys admin, only a sys admin can edit
                var isSystemAdminUser = user.roles.includes('SYSTEM_ADMINISTRATION')
                if (isSystemAdminUser === true) {
                  user.isEditableProfile = admin.currentUserRoles
                    .includes('SYSTEM_ADMINISTRATION')
                }
              }
              if (user.organisations) {
                user.organisations.forEach(function (userOrg) {
                  var adminRoles = admin.currentUserRoleMap[userOrg.organisationId]
                  // if user belongs to an org in which the current logged in user is ORG_ADMIN, set editable to true
                  if (typeof (user.isEditableProfile) === 'undefined' && (_.indexOf(adminRoles, 'ORG_ADMIN') > -1 ||
                    _.indexOf(adminRoles, 'SYSTEM_ADMINISTRATION') > -1)) {
                    user.isEditableProfile = true
                  }
                  var orgNameAndId = orgIdAndNames.find(function (org) {
                    return org.orgId === userOrg.organisationId
                  })
                  if (orgNameAndId) { userOrg.orgName = orgNameAndId.orgName }
                })
              }
              // if current logged in user is ORG_ADMIN, SYSTEM_ADMINISTRATION of the root org of the user, set editable to true
              if (user.rootOrgId === $rootScope.rootOrgId &&
                $rootScope.rootOrgAdmin === true) {
                user.isEditableProfile = true
              }
            })
          })
        }
      }
      // open editRoles modal
      admin.showModal = function (identifier, orgs, profileLevelRoles) {
        $timeout(function () {
          $('#changeUserRoles').modal({
            onShow: function () {
              admin.setDefaultSelected(orgs)
              admin.identifier = identifier
              admin.userOrganisations = orgs
              admin.selectedOrgUserRoles = []
              admin.profileLevelRoles = profileLevelRoles
              admin.isCourseMentorUser = profileLevelRoles.includes(admin.courseMentorRole.role)
              admin.isGlobalRoleChange = false
              admin.isOrgRoleChange = false
              $('.roleChckbox').checkbox()
            },
            onHide: function () {
              admin.userId = ''
              admin.userOrganisations = []
              admin.selectedOrgUserRoles = []
              admin.profileLevelRoles = []
              admin.isCourseMentorUser = false
              return true
            }
          }).modal('show')
        }, 100)
      }

      // open delete modal
      admin.showdeleteModal = function (id, firstName, lastName) {
        $('#deleteUserConfirmation').modal({
          onShow: function () {
            admin.deletingIdentifier = id
            admin.deletingUserFullName = firstName + ' ' + lastName || ''
          },
          onHide: function () {
            admin.deletingUserId = ''
            admin.deletingUserFullName = ''
            return true
          }
        }).modal('show')
      }

      // download list of user or organization
      admin.downloadUsers = function (key, list) {
        if (key === 'Users') {
          list.forEach(function (user) {
            user.organisationsName = []
            if (user.organisations) {
              user.organisations.forEach(function (org) {
                user.organisationsName.push(org.orgName)
              })
            }
          })
          var nullReplacedToEmpty = JSON.stringify(list).replace(/null/g, '""')
          var users = JSON.parse(nullReplacedToEmpty)
          alasql('SELECT firstName AS [First Name],lastName AS [Last Name], ' +
            ' organisationsName AS Organizations ,location AS Location, grade AS Grades, ' +
            'language AS Language ,subject as Subjects ' +
            ' INTO CSV(\'Users.csv\',{headers:true ,separator:","}) FROM ?', [users])
        } else if (key === 'Organisations') {
          list.forEach(function (org) {
            switch (org.status) {
            case 0:
              org.status = 'INACTIVE'
              break
            case 1:
              org.status = 'ACTIVE'
              break
            case 2:
              org.status = 'BLOCKED'
              break
            case 3:
              org.status = 'RETIRED'
              break
            default:
              break
            }
          })
          var orgNullReplacedToEmpty = JSON.stringify(list).replace(/null/g, '""')
          var organizations = JSON.parse(orgNullReplacedToEmpty)
          alasql('SELECT orgName AS orgName,orgType AS orgType,' +
            'noOfMembers AS noOfMembers,channel AS channel, ' +
            'status AS Status INTO CSV(\'Organizations.csv\',{headers:true,separator:","}) FROM ?',
          [organizations])
        }
      }

      // delete user
      admin.deleteUser = function (identifier) {
        var removeReq = {
          params: {},
          request: {
            userId: identifier
          }
        }

        adminService.deleteUser(removeReq).then(function (res) {
          if (res.result.response === 'SUCCESS') {
            toasterService.success($rootScope.messages.smsg.m0029)
            admin.searchResult = admin.searchResult.filter(function (user) {
              if (user.identifier === identifier) {
                user.status = 0
              }
              return user
            })
          } else { toasterService.error($rootScope.messages.fmsg.m0051) }
        }).catch(function (err) { // eslint-disable-line
          toasterService.error($rootScope.messages.fmsg.m0051)
        })
      }

      // edit roles
      admin.isUserRole = function (role, list) {
        return list.includes(role)
      }
      admin.editRoles = function (role, userRoles) {
        admin.isOrgRoleChange = true
        if (userRoles.includes(role) === true) {
          admin.selectedOrgUserRoles = admin.selectedOrgUserRoles.filter(function (selectedRole) {
            return selectedRole !== role
          })
        } else {
          admin.selectedOrgUserRoles.push(role)
        }
      }

      admin.editGlobalRoles = function (role) {
        admin.isGlobalRoleChange = true
        if (admin.isCourseMentorUser === true) {
          admin.isCourseMentorUser = false
          admin.profileLevelRoles = _.without(admin.profileLevelRoles, role)
        } else {
          admin.isCourseMentorUser = true
          admin.profileLevelRoles.push(role)
        }
      }

      admin.hideChangeRoleModel = function () {
        if (admin.isUserRoleUpdate && admin.isOrgRoleUpdated) {
          $('#changeUserRoles').modal('hide', function () {
            $('#changeUserRoles').modal('hide')
          })
        }
      }

      admin.updateRoles = function (identifier, orgId, roles) {
        if (admin.isOrgRoleChange) {
          var req = {
            request: {
              userId: identifier,
              organisationId: orgId,
              roles: roles
            }
          }
          admin.isOrgRoleUpdated = false
          adminService.updateRoles(req).then(function (res) {
            if (res.responseCode === 'OK') {
              admin.isOrgRoleUpdated = true
              admin.isOrgRoleChange = false
              toasterService.success($rootScope.messages.smsg.m0028)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0076)
            }
            admin.hideChangeRoleModel()
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0051)
          })
        }
      }

      admin.updateGlobalLevelRoles = function (userid, roles) {
        if (admin.isGlobalRoleChange) {
          var index = admin.profileLevelRoles && admin.profileLevelRoles.indexOf('public')
          if (index > -1) {
            admin.profileLevelRoles[index] = 'PUBLIC'
          }
          var request = {
            request: {
              userId: userid,
              roles: roles
            }
          }
          admin.isUserRoleUpdate = false
          adminService.updateRoles(request).then(function (res) {
            if (res.responseCode === 'OK') {
              admin.isUserRoleUpdate = true
              admin.isGlobalRoleChange = false
              toasterService.success($rootScope.messages.smsg.m0042)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0077)
            }
            admin.hideChangeRoleModel()
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0051)
          })
        }
      }

      // user Roles
      admin.getUserRoles = function () {
        admin.userRolesList = []
        var roles = permissionsService.getMainRoles()
        admin.userRoles = roles.filter(function (role) {
          return role.role !== 'ORG_ADMIN' && role.role !== 'SYSTEM_ADMINISTRATION' && role.role !== 'ADMIN'
        })
      }
      // public profile
      admin.openPublicProfile = function (id, user) {
        searchService.setPublicUserProfile(user)
        $state.go('PublicProfile', { userId: window.btoa(id), userName: user.firstName })
      }

      admin.setDefaultSelected = function (organizations) {
        if (organizations.length > 0) {
          $timeout(function () {
            var orgDropdown = $('#userOrgs').dropdown()
            orgDropdown.dropdown('set text', organizations[0].orgName)
            orgDropdown.dropdown({ allowTab: false })
            admin.selectedOrgUserRoles = organizations[0].roles
            admin.selectedOrgUserId = organizations[0].organisationId
          }, 0)
        }
      }

      admin.assignBadgeModal = function (id) {
        $('#assignBadge').modal({
          onShow: function () {
            admin.userIdentifier = id
            admin.disableAsignButton = false
            $timeout(function () {
              $('#badgeDropdown').dropdown()
            }, 100)
          },
          onHide: function () {
            admin.userIdentifier = ''
            admin.userBadges = []
            return true
          }
        }).modal('show')
      }

      admin.assignBadge = function (badge, identifier) {
        var newBadge = {
          params: {},
          request: {
            badgeTypeId: badge.id,
            receiverId: identifier
          }
        }

        adminService.addBadges(newBadge).then(function (res) {
          if (res.responseCode === 'OK') {
            admin.recievedBadge.name = badge.name
            admin.recievedBadge.userId = identifier
            admin.newBadgeAssigned = false
            toasterService.success(badge.name + ' assigned successfully')
          } else {
            toasterService.error(res.params.errmsg)
            admin.disableAsignButton = false
          }
        }).catch(function () {
          admin.disableAsignButton = false
          toasterService.error('Some thing went wrong. please try again later..')
        })
      }
      admin.getBadgeName = function (user) {
        user.userBadgeS = []
        if (user.badges) {
          user.badges.forEach(function (badge) {
            var userBadge = admin.badges.find(function (badgE) {
              return badgE.id === badge.badgeTypeId
            })
            user.userBadgeS.push(userBadge)
          })
        }
      }
      admin.getUserRoles()

      admin.checkPermissionToUpdateGlobalRole = function () {
        return $rootScope.rootOrgAdmin
      }
    }
  ])

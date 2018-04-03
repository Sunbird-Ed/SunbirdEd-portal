'use strict'

angular.module('playerApp').controller('AppCtrl', ['$scope', 'permissionsService', '$rootScope',
  'userService', '$q', 'config', '$location', '$timeout',
  'telemetryService', 'messages', 'frmelmnts', 'sessionService',
  'learnService', '$http', 'searchService', 'toasterService', 'adminService', '$state', '$window',
  function ($scope, permissionsService, $rootScope, userService, $q, config,
    $location, $timeout, telemetryService, messages, frmelmnts,
    sessionService, learnService, $http, searchService, toasterService, adminService, $state, $window) {
    $rootScope.userId = $('#userId').attr('value')
    $rootScope.sessionId = $('#sessionId').attr('value')
    $rootScope.cdnUrl = $('#cdnUrl').attr('value') || ''
    $rootScope.language = $('#defaultPortalLanguage').attr('value') || 'en'
    $rootScope.messages = messages[$rootScope.language]
    $rootScope.frmelmnts = frmelmnts[$rootScope.language]
    $rootScope.searchKey = ''
    $rootScope.enrolledCourseIds = {}
    telemetryService.setConfigData('env', 'home')
    telemetryService.setConfigData('message', 'Content read')
    /**
     * This function contentModelSetBackLink is to store back link value for modal popup close dynamically.
     * **/
    $rootScope.contentModelSetBackLink = function () {
      $rootScope.contentModelBackLinkName = $state.current.name
    }

    /**
         * This condition is for public content to private content after login
         */
    if (window.localStorage.redirectUrl) {
      $location.path(window.localStorage.redirectUrl)
      delete window.localStorage.redirectUrl
    }

    $rootScope.openLink = function (url) {
      $location.path(url)
    }

    $scope.$watch('$root.language', function (newVal, oldVal) {
      if (oldVal !== newVal) {
        window.localStorage.language = $rootScope.language
        $window.location.reload()
      }
    })

    $rootScope.mergeObjects = function (obj1, obj2) {
      var objMerge = ''
      if (Object.keys(obj1).length > 0) {
        objMerge = JSON.stringify(obj1) + JSON.stringify(obj2)
        objMerge = objMerge.replace(/\}\{/, ',')
        objMerge = JSON.parse(objMerge)
      } else {
        objMerge = obj2
      }
      return objMerge
    }

    $('body').click(function (e) {
      if ($(e.target).closest('div.dropdown-menu-list').prop('id') === 'search-suggestions') {
        return false
      }
      $('body').find('.dropdown-menu-list').removeClass('visible').addClass('hidden')
    })

    $scope.logout = function () {
      window.document.location.replace('/logout')
    }
    // get user profile
    $scope.userProfile = function (profileData) {
      $rootScope.avatar = profileData.avatar
      $rootScope.firstName = profileData.firstName
      $rootScope.lastName = profileData.lastName
      $rootScope.userName = profileData.userName
      var userRoles = profileData.roles
      $rootScope.organisations = profileData.organisations
      $rootScope.profileCompleteness = profileData.completeness
      $rootScope.profileMissingFields = profileData.missingFields || []
      var organisationNames = []
      var orgRoleMap = {}

      var rootOrg = (profileData.rootOrg && !_.isUndefined(profileData.rootOrg.hashTagId)) ? profileData.rootOrg.hashTagId : md5('sunbird'); //eslint-disable-line
      org.sunbird.portal.channel = rootOrg
      $rootScope.rootOrgId = profileData.rootOrgId
      $rootScope.rootOrgAdmin = false
      var organisationIds = []

      _.forEach(profileData.organisations, function (org) {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles)
          if (org.organisationId === profileData.rootOrgId &&
           (_.indexOf(org.roles, 'ORG_ADMIN') > -1 ||
            _.indexOf(org.roles, 'SYSTEM_ADMINISTRATION') > -1)) {
            $rootScope.rootOrgAdmin = true
          }
          orgRoleMap[org.organisationId] = org.roles
        }
        if (org.organisationId) {
          organisationIds.push(org.organisationId)
        }
        if (org.orgName) {
          organisationNames.push(org.orgName)
        }
      })
      if ($rootScope.rootOrgId) {
        organisationIds.push($rootScope.rootOrgId)
      }

      // set role org map
      permissionsService.setRoleOrgMap(profileData)

      organisationIds = _.uniq(organisationIds)
      $rootScope.organisationNames = organisationNames
      $rootScope.organisationIds = angular.copy(organisationIds)
      org.sunbird.portal.dims = _.concat(organisationIds, org.sunbird.portal.channel)
      permissionsService.setCurrentUserRoleMap(orgRoleMap)
      permissionsService.setCurrentUserRoles(userRoles)
      $rootScope.initializePermissionDirective = true
      $scope.getTelemetryConfigData(profileData)
      telemetryService.init()
      $scope.setRootOrgInfo(profileData)
    }

    $scope.getTelemetryConfigData = function () {
      org.sunbird.portal.sid = $rootScope.sessionId
      org.sunbird.portal.uid = $rootScope.userId

      $http.get('/get/envData').then(function (res) {
        org.sunbird.portal.appid = res.data.appId
        org.sunbird.portal.ekstep_env = res.data.ekstep_env
      })
        .catch(function () {
          org.sunbird.portal.appid = 'sunbird.portal'
          org.sunbird.portal.ekstep_env = 'qa'
        })
        .finally(function () {
          org.sunbird.portal.init()
          // portalTelemetryService.init()
        })
    }

    $scope.setRootOrgInfo = function (profileData) {
      if (profileData.rootOrg) {
        // set Page Title
        document.title = (!_.isUndefined(profileData.rootOrg.orgName)) ? profileData.rootOrg.orgName : 'Sunbird'
        $http.get('/v1/tenant/info/' + profileData.rootOrg.slug).then(function (res) {
          if (res && res.statusText === 'OK') {
            $rootScope.orgLogo = res.data.result.logo
            var link = document.createElement('link')
            var oldLink = document.getElementById('dynamic-favicon')
            link.id = 'dynamic-favicon'
            link.rel = 'icon'
            link.href = res.data.result.favicon
            if (oldLink) {
              document.head.removeChild(oldLink)
            }
            document.head.appendChild(link)
          }
        }).catch(function (err) {
          console.log('app controller', err)
          toasterService.error($rootScope.messages.fmsg.m0057)
        })
      }
    }

    $scope.getProfile = function (fields) {
      var userProfile = userService.getCurrentUserProfile()
      if (!(_.isEmpty(userProfile))) {
        $scope.userProfile(userProfile)
      } else {
        userService.getUserProfile($rootScope.userId, fields).then(function (res) {
          if (res && res.responseCode === 'OK') {
            var profileData = res.result.response
            // console.log(profileData.organisations[0].organisationId)
            userService.setCurrentUserProfile(profileData)
            $scope.userProfile(profileData)
          } else {
            // error handler
          }
        }).catch(function (error) {
          console.log('err', error)
          // error handler
        })
      }
    }
    $scope.getProfile('completeness,missingFields')

    $rootScope.closeRoleAccessError = function () {
      $rootScope.accessDenied = ''
    }

    $scope.getMyCourses = function () {
      sessionService.setSessionData('ENROLLED_COURSES', undefined)
      learnService.enrolledCourses($rootScope.userId).then(function (successResponse) {
        if (successResponse && successResponse.responseCode === 'OK') {
          $rootScope.enrolledCourses = successResponse.result.courses
          $rootScope.enrolledCourseIds =
                                $rootScope.arrObjsToObject($rootScope.enrolledCourses, 'courseId')
          sessionService.setSessionData('ENROLLED_COURSES', {
            uid: $rootScope.userId,
            courseArr: $rootScope.enrolledCourses,
            courseObj: $rootScope.enrolledCourseIds
          })
        } else {
          $rootScope.enrolledCourses = undefined
          sessionService.setSessionData('ENROLLED_COURSES', undefined)
        }
      })
    }
    $rootScope.arrObjsToObject = function (array, key) {
      var objData = {}
      array.forEach(function (item) {
        objData[item[key]] = item
      })
      return objData
    }
    if (!$rootScope.enrolledCourses) {
      $scope.getMyCourses()
    }
    // dont remove this .to load progress bars in cards
    $rootScope.loadProgress = function () {
      $('.course-progress').progress('reset')
      $timeout(function () {
        $('.course-progress').progress()
      }, 100)
    }

    $rootScope.getConcept = function (offset, limit, callback) {
      var req = {
        filters: {
          objectType: ['Concept']
        },
        offset: offset,
        limit: limit
      }
      searchService.search(req).then(function (res) {
        if (res.result && res.result && _.isArray(res.result.concepts)) {
          _.forEach(res.result.concepts, function (value) {
            $scope.concepts.push(value)
          })
          if ((res.result.count > offset) && res.result.count > (offset + limit)) {
            offset += limit
            limit = res.result.count - limit
            $rootScope.getConcept(offset, limit, callback)
          } else {
            callback(null, $scope.concepts)
          }
        }
      })
        .catch(function (err) {
          callback(err, null)
        })
    }
    if (!$rootScope.concepts) {
      $scope.concepts = []
      $rootScope.getConcept(0, 200, function (err, conceptArr) {
        if (err) {
          toasterService.error($rootScope.messages.fmsg.m0015)
        } else {
          $rootScope.concepts = conceptArr
        }
      })
    }
    // badges
    $scope.getBadges = function () {
      adminService.getBadges().then(function (res) {
        if (res.responseCode === 'OK') {
          adminService.setBadges(res)
        }
      })
    }
    // orgTypes
    $scope.getOrgTypes = function () {
      searchService.getOrgTypes().then(function (res) {
        if (res.responseCode === 'OK') {
          searchService.setOrgTypes(res.result.response)
        }
        // else throw new Error('');
      })
    }

    $scope.openProfileView = function () {
      $state.go('Profile')
    }

    // telemetry interact event
    $rootScope.generateInteractEvent = function (env, objId, objType, objVer, edataId, pageId, objRollup) {
      telemetryService.interactTelemetryData(env, objId, objType, objVer, edataId, pageId, objRollup)
    }

    // telemetry start event
    $rootScope.generateStartEvent = function (env, objId, objType, objVer, startContentType,
      pageId, mode) {
      telemetryService.startTelemetryData(env, objId, objType, objVer, startContentType,
        pageId, mode)
    }

    // telemetry end event
    $rootScope.generateEndEvent = function (env, objId, objType, objVer, startContentType,
      pageId, mode) {
      telemetryService.endTelemetryData(env, objId, objType, objVer, startContentType,
        pageId, mode)
    }

    $scope.getBadges()
    $scope.getOrgTypes()

    $window.onbeforeunload = function () {
      document.dispatchEvent(new CustomEvent('TelemetryEvent', { detail: { name: 'window:unload' } }))
    }
  }])

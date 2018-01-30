
describe('Controller: adminController', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var adminService
  var timeout
  var scope
  var contentService
  var toasterService
  var permissionsService
  var searchService
  var deferred
  var $state,
    modal
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  beforeEach(inject(function ($rootScope,
    $controller,
    _adminService_,
    _contentService_,
    _toasterService_,
    _permissionsService_,
    _searchService_,
    _$timeout_,
    _$q_,
    _$state_

  ) {
    adminService = _adminService_
    contentService = _contentService_
    toasterService = _toasterService_
    permissionsService = _permissionsService_
    scope = $rootScope.$new()
    timeout = _$timeout_
    $state = _$state_

    searchService = _searchService_
    deferred = _$q_.defer()
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    setFixtures('<div class="ui modal" id="changeUserRoles"></div>')
    adminCtl = $controller('adminController', {
      $scope: scope,
      $rootScope: $rootScope,
      adminService: adminService,
      contentService: contentService,
      toasterService: toasterService,
      permissionsService: permissionsService,
      $modal: modal,
      $state: $state

    })
    scope.users = [{ name: 'abc', roles: ['a', 'b'], organisations: [{ id: 123 }] }]
    adminCtl.searchResult = scope.users
    $rootScope.search = { selectedSearchKey: 'Users' }
    if (typeof Array.prototype.find !== 'function') {
      Array.prototype.find = function (iterator) { // eslint-disable-line no-extend-native
        var list = Object(this)
        var length = list.length >>> 0
        var thisArg = arguments[1]
        var value

        for (var i = 0; i < length; i++) {
          value = list[i]
          if (iterator.call(thisArg, value, i, list)) {
            return value
          }
        }
        return undefined
      }
    }
    if (typeof Array.prototype.includes !== 'function') {
      Array.prototype.includes = function (iterator) { // eslint-disable-line no-extend-native
        var list = Object(this)
        var length = list.length >>> 0

        for (var i = 0; i < length; i++) {
          // if (iterator.call(thisArg, value, i, list)) {
          //     return value;
          // }
          return true
        }
        return undefined
      }
    }
  }))
  it('should get org names', function (done) {
    spyOn(adminCtl, 'getOrgName').and.callThrough()
    spyOn(adminService, 'orgSearch').and.returnValue(deferred.promise)
    var res = { result: { response: { content: { orgName: 'xyz', identifier: 1213 } } } }
    deferred.resolve(res)
    adminCtl.getOrgName(function () {})
    adminService.orgSearch()
    scope.$apply()
    expect(adminService.orgSearch).toHaveBeenCalled()
    done()
  })
  it('should add org name to organization', function (done) {
    spyOn(adminCtl, 'addOrgNameToOrganizations').and.callThrough()
    spyOn(permissionsService, 'getCurrentUserRoles').and.callThrough()
    spyOn(permissionsService, 'getCurrentUserRoleMap').and.callThrough()
    spyOn(adminCtl, 'getOrgName').and.returnValue(deferred.promise)
    var res = [{ orgName: 'ABC ', orgId: '01231148953349324812' },
      { orgName: 'XYZ Institution', orgId: '01229679766115942443' }]
    deferred.resolve(res)
    adminCtl.addOrgNameToOrganizations()
    adminCtl.getOrgName()
    scope.$apply()
    expect(adminCtl.getOrgName).toHaveBeenCalled()
    done()
  })
  xit('should download users', function (done) {
    spyOn(adminCtl, 'downloadUsers').and.callThrough()
    spyOn(adminService, 'userSearch').and.returnValue(deferred.promise)
    var res = {result: {response: {content: [
      { organisations: [{ organisationsName: 'organisationsName' }] },
      { organisations: [{ organisationsName: 'organisationsName' }] }] }}}// {responseCode: 'OK', { result: { response: { content: [{ lastName: 'xyz', identifier: 1213 },{ lastName: 'ABC', identifier: 18913 }] }}}}
    deferred.resolve(res)
    adminCtl.downloadUsers('Users', res.result.response.content)
    adminService.userSearch()
    scope.$apply()
    var response = adminService.userSearch().$$state.value
    expect(response).not.toBe(undefined)
    adminCtl.adminService = response.result.response.content
    expect(adminCtl.adminService).not.toBe(undefined)
    expect(adminCtl.downloadUsers).toHaveBeenCalled()
    done()
  })
  xit('should download Organizations', function (done) {
    spyOn(adminCtl, 'downloadUsers').and.callThrough()
    spyOn(adminService, 'orgSearch').and.returnValue(deferred.promise)
    var res = {org: {status: ['INACTIVE', 'ACTIVE', 'BLOCKED', 'RETIRED']}}
    deferred.resolve(res)
    adminCtl.downloadUsers('Organisations', [
      { status: 'INACTIVE' },
      { status: 'ACTIVE' },
      { status: 'BLOCKED' },
      { status: 'RETIRED' }])
    adminService.orgSearch()
    scope.$apply()
    var response = adminService.orgSearch().$$state.value
    expect(response).not.toBe(undefined)
    adminCtl.adminService = response.org.status
    expect(adminCtl.adminService).not.toBe(undefined)
    expect(adminCtl.downloadUsers).toHaveBeenCalled()
    done()
  })
  xit('should add user search result in csv to download', function (done) {
    spyOn(adminCtl, 'addSearchResultInExcel').and.callThrough()
    var res = {result: {response: {content: [
      { organisations: [{ organisationsName: 'organisationsName' }] },
      { organisations: [{ organisationsName: 'organisationsName' }] }] }}}
    adminCtl.addSearchResultInExcel('Users', res.result.response.content)
    scope.$apply()
    expect(adminCtl.addSearchResultInExcel).toHaveBeenCalled()
    done()
  })
  xit('should add org search result in csv to download', function (done) {
    spyOn(adminCtl, 'addSearchResultInExcel').and.callThrough()
    var res = {org: {status: ['INACTIVE', 'ACTIVE', 'BLOCKED', 'RETIRED']}}
    adminCtl.addSearchResultInExcel('Organisations', res.org.status)
    scope.$apply()
    done()
  })
  it('should delete user', function (done) {
    spyOn(adminCtl, 'deleteUser').and.callThrough()
    spyOn(adminService, 'deleteUser').and.returnValue(deferred.promise)
    var res = { result: { response: 'SUCCESS' } }
    deferred.resolve(res)
    adminCtl.deleteUser()
    adminService.deleteUser()
    scope.$apply()
    expect(toasterService.success).toHaveBeenCalled()
    done()
  })
  it('should fail to delete user', function (done) {
    spyOn(adminCtl, 'deleteUser').and.callThrough()
    spyOn(adminService, 'deleteUser').and.returnValue(deferred.promise)
    var res = { result: { response: '' } }
    deferred.resolve(res)
    adminCtl.deleteUser()
    adminService.deleteUser()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should fail to delete user API(server error)', function (done) {
    spyOn(adminCtl, 'deleteUser').and.callThrough()
    spyOn(adminService, 'deleteUser').and.returnValue(deferred.promise)
    var res = { result: { response: '' } }
    deferred.reject(res)
    adminCtl.deleteUser()
    adminService.deleteUser()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should test if user role', function (done) {
    spyOn(adminCtl, 'isUserRole').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()
    adminCtl.isUserRole('role', ['role'])
    scope.$apply()
    done()
  })

  it('should update user roles', function (done) {
    spyOn(adminCtl, 'updateRoles').and.callThrough()
    spyOn(adminService, 'updateRoles').and.returnValue(deferred.promise)
    var res = { responseCode: 'OK' }
    deferred.resolve(res)
    adminCtl.updateRoles()
    adminService.updateRoles()
    scope.$apply()
    expect(toasterService.success).toHaveBeenCalled()
    done()
  })

  it('should fail to update user roles', function (done) {
    spyOn(adminCtl, 'updateRoles').and.callThrough()
    spyOn(adminService, 'updateRoles').and.returnValue(deferred.promise)
    var res = { responseCode: '' }
    deferred.resolve(res)
    adminCtl.updateRoles()
    adminService.updateRoles()
    setFixtures('<div class="ui modal" id="changeUserRoles"></div>')
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should fail to update user roles API(server error)', function (done) {
    spyOn(adminCtl, 'updateRoles').and.callThrough()
    spyOn(adminService, 'updateRoles').and.returnValue(deferred.promise)
    var res = { responseCode: '' }
    deferred.reject(res)
    adminCtl.updateRoles()
    adminService.updateRoles()
    setFixtures('<div class="ui modal" id="changeUserRoles"></div>')
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should get user roles', function (done) {
    spyOn(adminCtl, 'getUserRoles').and.callThrough()
    spyOn(permissionsService, 'allRoles').and.returnValue(deferred.promise)
    var res = [{}, {}]
    deferred.resolve(res)
    adminCtl.getUserRoles()
    permissionsService.allRoles()
    scope.$apply()
    expect(adminCtl.userRoles).not.toBeUndefined()
    done()
  })
  it('should open public profile', function (done) {
    spyOn(adminCtl, 'openPublicProfile').and.callThrough()
    spyOn(searchService, 'setPublicUserProfile').and.callThrough()
    spyOn($state, 'go')
    adminCtl.openPublicProfile(123, { firstName: 'avd' })
    searchService.setPublicUserProfile()
    scope.$apply()
    expect($state.go).toHaveBeenCalledWith('PublicProfile', { userId: window.btoa(123), userName: 'avd' })
    done()
  })

  it('should call assignBadgeModal', function (done) {
    setFixtures('<div class="ui modal" id="assignBadge"></div>')
    spyOn(adminCtl, 'assignBadgeModal').and.callThrough()
    adminCtl.assignBadgeModal(123)
    expect(adminCtl.assignBadgeModal).toHaveBeenCalled()
    timeout.flush(100)
    done()
  })

  it('should assign badge to user', function (done) {
    spyOn(adminCtl, 'assignBadge').and.callThrough()
    spyOn(adminService, 'addBadges').and.returnValue(deferred.promise)
    var res = { responseCode: 'OK' }
    deferred.resolve(res)
    adminCtl.recievedBadge = {}
    adminCtl.assignBadge({ id: 123, name: 'abc' }, 121)
    adminService.addBadges()
    scope.$apply()
    expect(toasterService.success).toHaveBeenCalled()
    done()
  })
  it('should fail to assign badge to user ', function (done) {
    spyOn(adminCtl, 'assignBadge').and.callThrough()
    spyOn(adminService, 'addBadges').and.returnValue(deferred.promise)
    var res = { responseCode: '' }
    deferred.resolve(res)
    adminCtl.disableAsignButton = ''
    adminCtl.recievedBadge = {}
    adminCtl.assignBadge({ id: 123, name: '' }, 0)
    adminService.addBadges()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    expect(adminCtl.disableAsignButton).toEqual(false)
    done()
  })
  it('should get badge name ', function (done) {
    spyOn(adminCtl, 'getBadgeName').and.callThrough()
    adminCtl.badges = [{}, {}]
    spyOn(Array.prototype, 'find').and.callThrough()
    adminCtl.getBadgeName({ badges: [{}, {}] })
    scope.$apply()
    done()
  })
  it('should show modal', function (done) {
    spyOn(adminCtl, 'showModal').and.callThrough()
    adminCtl.showModal(123, 'AP')
    expect(adminCtl.showModal).toHaveBeenCalled()
    timeout.flush(100)
    done()
  })

  it('should call showdeleteModal', function (done) {
    setFixtures('<div class="ui modal" id="deleteUserConfirmation"></div>')
    spyOn(adminCtl, 'showdeleteModal').and.callThrough()
    adminCtl.showdeleteModal(123, 'ntp102', 'ntpuser')
    expect(adminCtl.showdeleteModal).toHaveBeenCalled()
    done()
  })

  it('should edit user roles modal', function (done) {
    spyOn(adminCtl, 'editRoles').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()
    adminCtl.selectedOrgUserRoles = ['abc', 'cdf']
    adminCtl.editRoles('abc', ['abc', 'cdf'])
    done()
  })
  it('should edit user roles modal', function (done) {
    spyOn(adminCtl, 'editRoles').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()
    adminCtl.selectedOrgUserRoles = []
    adminCtl.editRoles('abc', [])
    done()
  })

  it('should set Default Selected roles', function (done) {
    spyOn(adminCtl, 'setDefaultSelected').and.callThrough()
    adminCtl.setDefaultSelected([{}, {}])
    timeout.flush()
    expect(adminCtl.selectedOrgUserId).not.toBe(null)
    done()
  })
})

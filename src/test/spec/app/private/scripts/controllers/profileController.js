'use strict'

describe('Controller: ProfileController', function () {
  beforeEach(module('playerApp'))
  var
    profileCtrl,
    scope,
    rootScope,
    toasterService,
    contentService,
    userService,
    searchService,
    learnService,
    adminService,
    workSpaceUtilsService,
    deferred,
    deferred1,
    deferred2,
    $q,
    $timeout,
    formValidation
  var userProfile = testData.mockProfile.userProfile
  var isPermanentChecked = testData.mockProfile.isPermanentChecked
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  beforeEach(inject(function (
    $controller,
    $rootScope,
    _toasterService_,
    _contentService_,
    _userService_,
    _searchService_,
    _learnService_,
    _adminService_,
    _workSpaceUtilsService_,
    _$q_,
    _$timeout_,
    _formValidation_) {
    rootScope = $rootScope
    toasterService = _toasterService_
    contentService = _contentService_
    userService = _userService_
    searchService = _searchService_
    learnService = _learnService_
    adminService = _adminService_
    workSpaceUtilsService = _workSpaceUtilsService_
    formValidation = _formValidation_
    deferred = _$q_.defer()
    $q = _$q_
    $timeout = _$timeout_
    scope = $rootScope.$new()
    spyOn(userService, 'getUserProfile').and.returnValue(deferred.promise)
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    spyOn(toasterService, 'warning').and.callThrough()

    profileCtrl = $controller('ProfileController', {
      $scope: scope,
      rootScope: rootScope,
      contentService: contentService,
      userService: userService,
      formValidation: formValidation,
      searchService: searchService,
      learnService: learnService,
      workSpaceUtilsService: workSpaceUtilsService

    })
    if (typeof Array.prototype.includes !== 'function') {
      Array.prototype.includes = function (iterator) { // eslint-disable-line no-extend-native
        var list = Object(this)
        var length = list.length >>> 0
        var value // eslint-disable-line no-unused-vars

        for (var i = 0; i < length; i++) {
          value = list[i]
          return true
        }
        return undefined
      }
    }
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
    spyOn(Array.prototype, 'find').and.callThrough()
  }
  ))

  it('should get user profile', function (done) {
    spyOn(profileCtrl, 'getProfile').and.callThrough()
    spyOn(profileCtrl, 'processProfileData').and.callThrough()

    spyOn(profileCtrl, 'getUserBadges').and.callThrough()
    var mockProfile = {
      responseCode: 'OK',
      result: { response: {
        name: 'hello',
        jobProfile: {},
        address: {},
        education: {},
        lastLoginTime: 3,
        badges: [],
        missingFields: [],
        completeness: {},
        webPages: [{ type: 'fb', url: '' },
          { type: 'twitter', url: '' },
          { type: 'in', url: '' }]
      } }
    }

    deferred.resolve(mockProfile)
    profileCtrl.getProfile()
    userService.getUserProfile()
    scope.$apply()
    expect(profileCtrl.processProfileData).toHaveBeenCalled()
    done()
  })
  it('should fail to get user profile', function (done) {
    spyOn(profileCtrl, 'getProfile').and.callThrough()
    spyOn(profileCtrl, 'processProfileData').and.callThrough()
    var mockProfileFailed = {
      responseCode: 'CLIENT_ERROR'
    }
    deferred.resolve(mockProfileFailed)
    profileCtrl.getProfile()
    userService.getUserProfile()
    scope.$apply()
    expect(profileCtrl.processProfileData).toHaveBeenCalled()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should update user profile', function (done) {
    spyOn(userService, 'updateUserProfile').and.returnValue(deferred.promise)
    spyOn(profileCtrl, 'updateProfile').and.callThrough()
    var updateReq = {
      name: 'new name'
    }
    var updateRes = {
      responseCode: 'OK',
      result: { response: 'SUCCESS' }
    }
    deferred.resolve(updateRes)
    profileCtrl.updateProfile(updateReq)
    userService.updateUserProfile()
    scope.$apply()
    userService.updateUserProfile().then(function (result) {
      expect(result).toBe(true)
      done()
    })
    done()
  })
  it('should show client error on update user profile', function (done) {
    spyOn(userService, 'updateUserProfile').and.returnValue(deferred.promise)
    spyOn(profileCtrl, 'updateProfile').and.callThrough()
    var updateReq = {
      name: 'new name'
    }
    var updateRes = {
      responseCode: 'CLIENT_ERROR',
      params: { errmsg: 'client error' }
    }
    deferred.resolve(updateRes)
    profileCtrl.updateProfile(updateReq)
    userService.updateUserProfile()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should show server error on update user profile', function (done) {
    spyOn(userService, 'updateUserProfile').and.returnValue(deferred.promise)
    spyOn(profileCtrl, 'updateProfile').and.callThrough()
    var updateReq = {
      name: 'new name'
    }
    var updateRes = {}
    deferred.resolve(updateRes)
    profileCtrl.updateProfile(updateReq)
    userService.updateUserProfile()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  // update profile
  it('should open browser', function (done) {
    spyOn(profileCtrl, 'openImageBrowser').and.callThrough()
    profileCtrl.openImageBrowser()
    done()
  })
  it('should return a valid image', function (done) {
    spyOn(profileCtrl, 'validateAvatar').and.callThrough()
    var files = [{ name: 'name.jpg', size: 40000 }]
    profileCtrl.validateAvatar(files)
    expect(profileCtrl.icon).not.toBeUndefined()
    done()
  })
  xit('should return a invalid image', function (done) {
    spyOn(profileCtrl, 'validateAvatar').and.callThrough()
    var files = [{ name: 'name.txt', size: 8000000 }]
    profileCtrl.validateAvatar(files)
    expect(profileCtrl.icon).toBeUndefined()
    expect(function () { parser.parse(raw) }).toThrow('') // eslint-disable-line no-undef
    expect(toasterService.warning).toHaveBeenCalled()

    done()
  })

  it('should update avatar', function (done) {
    deferred1 = $q.defer()
    deferred2 = $q.defer()
    spyOn(profileCtrl, 'updateAvatar').and.callThrough()
    spyOn(profileCtrl, 'validateAvatar').and.returnValue(deferred1.promise)
    spyOn(contentService, 'uploadMedia').and.returnValue(deferred2.promise)
    profileCtrl.updateAvatar()
    profileCtrl.validateAvatar(files) // eslint-disable-line no-use-before-define
    deferred1.resolve(true)
    scope.$apply()
    contentService.uploadMedia()
    var updateRes = { responseCode: 'OK', result: { url: 'url' } }
    deferred2.resolve(updateRes)
    scope.$apply()
    var files = [{ name: 'name.jpg', size: 400000 }]

    expect(contentService.uploadMedia).toHaveBeenCalled()

    done()
  })
  it('should edit basic profile', function (done) {
    spyOn(profileCtrl, 'EditBasicProfile').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'webLink').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    profileCtrl.user = { webPages: [{}, {}], socialMedia: {} }
    profileCtrl.basicProfile = { socialMedia: {} }
    profileCtrl.EditBasicProfile()
    scope.$apply()
    expect(profileCtrl.webLink).toHaveBeenCalled()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should edit user phone number ', function (done) {
    spyOn(profileCtrl, 'EditBasicProfile').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'webLink').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    profileCtrl.user = { webPages: [], socialMedia: {}, phone: 9809898098 }
    profileCtrl.basicProfile = { socialMedia: {}, phone: 9809898095 }
    profileCtrl.EditBasicProfile()
    scope.$apply()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should edit social media links  phone number ', function (done) {
    spyOn(profileCtrl, 'EditBasicProfile').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'webLink').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    profileCtrl.user = { webPages: [{}, {}], socialMedia: [{ type: 'fb', url: 'https//' }], phone: 9809898098 }
    profileCtrl.basicProfile = { socialMedia: {}, phone: 9809898095 }
    profileCtrl.EditBasicProfile()
    scope.$apply()
    expect(profileCtrl.webPages).not.toBeUndefined()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not update basic info ', function (done) {
    spyOn(profileCtrl, 'EditBasicProfile').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(false)
    spyOn(profileCtrl, 'webLink').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    profileCtrl.user = {firstName: ''}
    profileCtrl.EditBasicProfile()
    scope.$apply()
    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should add a new address info ', function (done) {
    spyOn(profileCtrl, 'addAddress').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var address = {addressLine1: 'test', city: 'test'}
    profileCtrl.address = []
    profileCtrl.addAddress(address)
    scope.$apply()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should show add a new address link ', function (done) {
    spyOn(profileCtrl, 'processProfileData').and.callThrough()
    spyOn(profileCtrl, 'showAddAddress').and.callThrough()
    profileCtrl.address = []
    scope.$apply()
    expect(profileCtrl.isAddAddress).toBe(true)
    done()
  })

  it('should not show add a new address link ', function (done) {
    spyOn(profileCtrl, 'processProfileData').and.callThrough()
    spyOn(profileCtrl, 'showAddAddress').and.callThrough()
    profileCtrl.showAddAddress(userProfile.result.response.address)
    expect(profileCtrl.isAddAddress).toBe(false)
    done()
  })
  it('should Permanent radio button  checked by default', function (done) {
    spyOn(profileCtrl, 'processProfileData').and.callThrough()
    spyOn(profileCtrl, 'showAddAddress').and.callThrough()
    profileCtrl.showAddAddress(isPermanentChecked.result.response.address)
    expect(profileCtrl.ischekedCurrent).toBe(false)
    done()
  })
  it('should not validate new address values ', function (done) {
    spyOn(profileCtrl, 'addAddress').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(false)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var address = {}
    profileCtrl.addAddress(address)
    scope.$apply()
    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should edit user address  ', function (done) {
    spyOn(profileCtrl, 'editAddress').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var address = {}
    profileCtrl.address = []
    profileCtrl.editAddress(address)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not validate edit  address values ', function (done) {
    spyOn(profileCtrl, 'editAddress').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue([false, true, 'ab'])
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()

    var address = []
    profileCtrl.editAddress(address)
    formValidation.validate()
    scope.$apply()
    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should delete user address  ', function (done) {
    spyOn(profileCtrl, 'deleteAddress').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var address = {}
    profileCtrl.deleteAddress(address)
    scope.$apply()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  // education
  it('should add a new education info ', function (done) {
    spyOn(profileCtrl, 'addEducation').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var education = {degree: 'test', name: 'test'}
    profileCtrl.education = []
    profileCtrl.addEducation(education)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not validate new education values ', function (done) {
    spyOn(profileCtrl, 'addEducation').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(false)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var education = {degree: '', name: ''}
    profileCtrl.education = []
    profileCtrl.addEducation(education)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should edit user education  ', function (done) {
    spyOn(profileCtrl, 'editEducation').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var education = [{}]
    profileCtrl.education = []
    profileCtrl.editEducation(education)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not validate edit education values ', function (done) {
    spyOn(profileCtrl, 'editEducation').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue([false, true, 'ab'])
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()
    var education = []
    profileCtrl.editEducation(education)
    formValidation.validate()
    scope.$apply()
    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should delete user education  ', function (done) {
    spyOn(profileCtrl, 'deleteEducation').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var education = []
    profileCtrl.deleteEducation(education)
    scope.$apply()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })

  // experience
  it('should add a new experience info ', function (done) {
    spyOn(profileCtrl, 'addExperience').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var experience = {jobName: 'test', orgName: 'test'}
    profileCtrl.experience = []
    profileCtrl.addExperience(experience)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not validate new experience values ', function (done) {
    spyOn(profileCtrl, 'addExperience').and.callThrough()
    spyOn(profileCtrl, 'getFieldsToValidate').and.returnValue(['firstName', 'lastNmae'])
    spyOn(formValidation, 'validate').and.returnValue(false)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var experience = {}
    profileCtrl.education = []
    profileCtrl.addExperience(experience)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should edit user experience  ', function (done) {
    spyOn(profileCtrl, 'editExperience').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue(true)
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var experience = [{}]
    profileCtrl.experience = []
    profileCtrl.editExperience(experience)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  it('should not validate edit experience values ', function (done) {
    spyOn(profileCtrl, 'editExperience').and.callThrough()
    spyOn(formValidation, 'validate').and.returnValue([false, true, 'ab'])
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    spyOn(Array.prototype, 'includes').and.callThrough()
    var experience = []
    profileCtrl.editExperience(experience)
    formValidation.validate()

    scope.$apply()
    expect(profileCtrl.updateUserInfo).not.toHaveBeenCalled()
    done()
  })
  it('should delete user experience  ', function (done) {
    spyOn(profileCtrl, 'deleteExperience').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var experience = {}
    profileCtrl.deleteExperience(experience)
    scope.$apply()
    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  // summary
  it('should edit summary ', function (done) {
    spyOn(profileCtrl, 'EditDetails').and.callThrough()
    spyOn(profileCtrl, 'updateUserInfo').and.callThrough()
    var details = 'hello'
    profileCtrl.EditDetails(details)
    scope.$apply()

    expect(profileCtrl.updateUserInfo).toHaveBeenCalled()
    done()
  })
  // check current job
  it('should  return current job not exist ', function (done) {
    spyOn(profileCtrl, 'checkCurrentJob').and.callThrough()
    profileCtrl.experience = [{ isCurrentJob: true }, { isCurrentJob: false }]
    var experience = { isCurrentJob: false }
    profileCtrl.experience = { find: function () {} }
    spyOn(profileCtrl.experience, 'find').and.callThrough()
    profileCtrl.checkCurrentJob(experience, true)
    scope.$apply()
    expect(profileCtrl.isCurrentJobExist).toBe(false)

    done()
  })
  it('should  return current job  exist ', function (done) {
    spyOn(profileCtrl, 'checkCurrentJob').and.callThrough()
    profileCtrl.experience = [{ isCurrentJob: false }, { isCurrentJob: false }]
    var experience = { isCurrentJob: false, id: 12 }
    profileCtrl.experience = { find: function () { return { id: 123 } } }
    spyOn(profileCtrl.experience, 'find').and.callThrough()
    profileCtrl.checkCurrentJob(experience, true)
    scope.$apply()
    expect(profileCtrl.isCurrentJobExist).toBe(true)

    done()
  })
  it('should  set checkbox value', function (done) {
    spyOn(profileCtrl, 'setJobProfileCheckbox').and.callThrough()

    profileCtrl.setJobProfileCheckbox({}, true)
    scope.$apply()

    done()
  })
  it('should get content list', function (done) {
    spyOn(profileCtrl, 'getCreatedContentList').and.callThrough()
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    profileCtrl.contentList = ''
    deferred.resolve({ responseCode: 'OK', result: { content: [] } })
    profileCtrl.getCreatedContentList()
    searchService.search()
    scope.$apply()
    expect(profileCtrl.contentList).not.toBeUndefined()
    done()
  })
  it('should return badges list ', function (done) {
    spyOn(profileCtrl, 'getbadges').and.callThrough()
    spyOn(learnService, 'enrolledCourses').and.returnValue(deferred.promise)
    deferred.resolve({ responseCode: 'OK',
      result: {
        courses: [{ leafNodesCount: 1, progress: 1 }] } })
    profileCtrl.getbadges()
    learnService.enrolledCourses()
    scope.$apply()
    expect(profileCtrl.badges).not.toBeUndefined()
    done()
  })

  it('should open previewCollection player ', function (done) {
    spyOn(profileCtrl, 'openContentPlayer').and.callThrough()
    spyOn(workSpaceUtilsService, 'previewCollection').and.returnValue(deferred.promise)
    var item = { mimeType: 'application/vnd.ekstep.content-collection' }
    profileCtrl.openContentPlayer(item)
    scope.$apply()
    expect(workSpaceUtilsService.previewCollection).toHaveBeenCalled()

    done()
  })
  it('should open previewContent player ', function (done) {
    spyOn(profileCtrl, 'openContentPlayer').and.callThrough()
    spyOn(workSpaceUtilsService, 'previewContent').and.returnValue(deferred.promise)
    var item = { }
    profileCtrl.openContentPlayer(item)
    scope.$apply()
    expect(workSpaceUtilsService.previewContent).toHaveBeenCalled()

    done()
  })
  it('should return getProfileObject ', function (done) {
    spyOn(profileCtrl, 'getProfileObject').and.callThrough()
    var item = { }
    profileCtrl.getProfileObject(item)
    scope.$apply()

    done()
  })

  it('should return  education form  changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()

    profileCtrl.updateAction('education')
    scope.$apply()
    expect(profileCtrl.educationForm).toBe(true)
    done()
  })

  it('should return  address form  changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()

    profileCtrl.updateAction('address')
    scope.$apply()
    expect(profileCtrl.addressForm).toBe(true)
    done()
  })
  it('should return  jobProfile form  changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()

    profileCtrl.updateAction('jobProfile')
    scope.$apply()
    expect(profileCtrl.experienceForm).toBe(true)
    done()
  })
  it('should return  basic form  changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()

    profileCtrl.updateAction('firstName')
    scope.$apply()
    // expect(profileCtrl.basicProfileForm).toBe(true);
    done()
  })
  it('should return  avatar   changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()
    spyOn(profileCtrl, 'openImageBrowser').and.callThrough()
    profileCtrl.updateAction('avatar')
    scope.$apply()
    expect(profileCtrl.openImageBrowser).toHaveBeenCalled()
    done()
  })

  it('should return  profile summary form  changes', function (done) {
    spyOn(profileCtrl, 'updateAction').and.callThrough()
    profileCtrl.updateAction('profileSummary')
    scope.$apply()
    expect(profileCtrl.openDiscriptionEdit).toBe(true)
    done()
  })

  it('should get user Badges', function (done) {
    spyOn(profileCtrl, 'getUserBadges').and.callThrough()
    spyOn(adminService, 'getBadgesList').and.returnValue([{ badgeTypeId: 123, name: 'test' },
      { badgeTypeId: 222, name: 'test' }])
    profileCtrl.user = { badges: [{ id: 123, name: 'test' }, { id: 222, name: 'test' }] }
    profileCtrl.getUserBadges()
    adminService.getBadgesList()

    scope.$apply()
    expect(profileCtrl.badges).not.toBe(null)
    done()
  })

  it('should format date', function (done) {
    spyOn(profileCtrl, 'formateDate').and.callThrough()
    var users = [{ updatedDate: '22-2-1993' }]
    profileCtrl.formateDate(users)
    scope.$apply()
    done()
  })
  it('should get content logo', function (done) {
    spyOn(profileCtrl, 'getContentLogo').and.callThrough()
    var content = {appIcon: 'abc', mimeType: ['config.MIME_TYPE.pdf', 'config.MIME_TYPE.mp4']}
    profileCtrl.getContentLogo(content)
    scope.$apply()
    done()
  })

  it('should call setEditStart', function (done) {
    spyOn(profileCtrl, 'setEditStart').and.callThrough()
    profileCtrl.setEditStart('121', '1', '22-2-2017')
    $timeout.flush(500)
    scope.$apply()
    done()
  })

  it('should call setEditEnd', function (done) {
    spyOn(profileCtrl, 'setEditEnd').and.callThrough()
    profileCtrl.setEditEnd('121', '1', '22-2-2017')
    $timeout.flush(500)
    scope.$apply()
    done()
  })

  it('should call setDob', function (done) {
    setFixtures('<div class="ui calendar" id="editDob"></div>')
    spyOn(profileCtrl, 'setDob').and.callThrough()
    profileCtrl.user = {dob: '22-2-1993'}
    profileCtrl.setDob()
    $timeout.flush(100)
    scope.$apply()
    done()
  })

  it('should call setDropdownValue', function (done) {
    spyOn(profileCtrl, 'setDropdownValue').and.callThrough()
    profileCtrl.user = {languages: 'English'}
    profileCtrl.setDropdownValue()
    $timeout.flush(100)
    scope.$apply()
    done()
  })

  it('should call setSubject', function (done) {
    spyOn(profileCtrl, 'setSubject').and.callThrough()
    profileCtrl.user = {subjects: 'Science'}
    profileCtrl.setSubject()
    $timeout.flush(100)
    scope.$apply()
    done()
  })

  it('should call setEditSubject', function (done) {
    spyOn(profileCtrl, 'setEditSubject').and.callThrough()
    profileCtrl.setEditSubject('ntptest', '1', 'Math')
    $timeout.flush(100)
    scope.$apply()
    done()
  })

  it('should call setSelectedGrades', function (done) {
    spyOn(profileCtrl, 'setSelectedGrades').and.callThrough()
    profileCtrl.user = {grade: 'Grade1'}
    profileCtrl.setSelectedGrades()
    $timeout.flush(100)
    scope.$apply()
    done()
  })

  it('should call cancelEditExperience', function (done) {
    spyOn(profileCtrl, 'cancelEditExperience').and.callThrough()
    profileCtrl.user = {jobProfile: 'teacher'}
    profileCtrl.cancelEditExperience()
    scope.$apply()
    done()
  })

  it('should call openAddSkillModal', function (done) {
    spyOn(profileCtrl, 'openAddSkillModal').and.callThrough()
    setFixtures('<div id="addSkillModal" class="ui modal"></div>')
    profileCtrl.openAddSkillModal()
    $timeout.flush(50)
    scope.$apply()
    done()
  })

  it('should call addSkills', function (done) {
    spyOn(profileCtrl, 'addSkills').and.callThrough()
    profileCtrl.userSkills = ['Java', 'AngularJs', 'Nodejs']
    setFixtures('<div id="addSkill" class="ui fluid addSkillsMarginCursor multiple search selection dropdown"></div>')
    profileCtrl.addSkills()
    scope.$apply()
    done()
  })

  it('should call setLimit', function (done) {
    spyOn(profileCtrl, 'setLimit').and.callThrough()
    profileCtrl.userSkills = ['Java', 'AngularJs', 'Nodejs']
    profileCtrl.setLimit(0)
    scope.$apply()
    done()
  })
})

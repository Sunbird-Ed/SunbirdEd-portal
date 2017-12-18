'use strict'

describe('Controller: setupController', function () {
  beforeEach(module('playerApp'))
  var
    setupCtrl,
    scope,
    rootScope,
    setupService,
    toasterService,
    deferred
  beforeEach(inject(function ($controller, $rootScope, // eslint-disable-line
    _setupService_,
    _toasterService_,
    _$q_) {
    rootScope = $rootScope
    setupService = _setupService_
    toasterService = _toasterService_
    deferred = _$q_.defer()
    scope = $rootScope.$new()

    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()

    setupCtrl = $controller('setupController', {
      rootScope: rootScope,
      setupService: setupService
    })
  }
  ))
  beforeEach(inject(function ($rootScope, $controller) { // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  it('Should getOrgType function define', function () {
    setupService.getOrgTypes()
    expect(setupService.getOrgTypes).toBeDefined()
  })
  // get org types
  it('should get all org types', function (done) {
    spyOn(setupService, 'getOrgTypes').and.returnValue(deferred.promise)
    spyOn(setupCtrl, 'getOrgTypes').and.callThrough()
    var mockRes = {
      responseCode: 'OK',
      result: {
        response:
                    [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
      }
    }
    deferred.resolve(mockRes)
    setupCtrl.getOrgTypes()
    setupService.getOrgTypes()
    scope.$apply()
    expect(setupCtrl.orgTypes).toEqual([{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }])
    done()
  })
  it('should return client error on get  org types', function (done) {
    spyOn(setupService, 'getOrgTypes').and.returnValue(deferred.promise)
    spyOn(setupCtrl, 'getOrgTypes').and.callThrough()
    var mockClientErr = {
      responseCode: 'CLIENT_ERROR',
      params: { errmsg: 'client error noticed' }
    }
    deferred.resolve(mockClientErr)
    setupCtrl.getOrgTypes()
    setupService.getOrgTypes()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should return server error on get  org types', function (done) {
    spyOn(setupService, 'getOrgTypes').and.returnValue(deferred.promise)
    spyOn(setupCtrl, 'getOrgTypes').and.callThrough()
    var mockServerErr = {}

    deferred.resolve(mockServerErr)
    setupCtrl.getOrgTypes()
    setupService.getOrgTypes()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should open modal', function (done) {
    spyOn($.fn, 'modal').and.callThrough()
    spyOn(setupCtrl, 'openUpdateModal').and.callThrough()
    setupCtrl.openUpdateModal('hello')
    setupCtrl.selectedOrg = {}
    // expect(setupCtrl.selectedOrg.orgType).toEqual('hello');

    done()
  })

  it('Should addOrgType function define', function () {
    setupService.addOrgType()
    expect(setupService.addOrgType).toBeDefined()
  })
  // add org types
  it('should add new  org type', function (done) {
    spyOn(setupService, 'getOrgTypes').and.returnValue(deferred.promise)
    spyOn(setupService, 'addOrgType').and.returnValue(deferred.promise)
    spyOn(setupCtrl, 'getOrgTypes').and.callThrough()
    spyOn(setupCtrl, 'addOrgType').and.callThrough()
    var mockRes = {
      responseCode: 'OK'
    }
    deferred.resolve(mockRes)
    setupCtrl.addOrgType()
    setupService.addOrgType()
    scope.$apply()
    expect(toasterService.success).toHaveBeenCalled()
    expect(setupCtrl.getOrgTypes).toHaveBeenCalled()
    done()
  })
  it('should return client error ', function (done) {
    spyOn(setupService, 'addOrgType').and.returnValue(deferred.promise)
    spyOn(setupCtrl, 'addOrgType').and.callThrough()
    var addFailureRes = {
      responseCode: 'CLIENT_ERROR',
      param: { errmsg: 'client error noticed' }
    }
    deferred.resolve(addFailureRes)
    setupCtrl.addOrgType()
    setupService.addOrgType()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })

  it('should return server error on add org type ', function (done) {
    spyOn(setupCtrl, 'addOrgType').and.callThrough()
    spyOn(setupService, 'addOrgType').and.returnValue(deferred.promise)
    var serverErrr = {}
    deferred.resolve(serverErrr)
    setupCtrl.addOrgType()
    setupService.addOrgType()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('Should updateOrgType function define', function () {
    setupService.updateOrgType()
    expect(setupService.updateOrgType).toBeDefined()
  })
  // update org type
  it('should update  org type', function (done) {
    spyOn(setupCtrl, 'getOrgTypes').and.callThrough()
    spyOn(setupCtrl, 'updateOrgType').and.callThrough()
    spyOn(setupService, 'updateOrgType').and.returnValue(deferred.promise)
    var mockRes = {
      responseCode: 'OK'
    }
    deferred.resolve(mockRes)
    setupCtrl.updateOrgType({ type: 'fb', url: 'abcd' })
    setupService.updateOrgType()
    scope.$apply()
    expect(toasterService.success).toHaveBeenCalled()
    expect(setupCtrl.getOrgTypes).toHaveBeenCalled()
    done()
  })
  it('should return client error  on org type update', function (done) {
    spyOn(setupCtrl, 'updateOrgType').and.callThrough()
    spyOn(setupService, 'updateOrgType').and.returnValue(deferred.promise)
    var updateFailureRes = {
      responseCode: 'CLIENT_ERROR',
      param: { errmsg: 'client error ' }
    }
    deferred.resolve(updateFailureRes)
    setupCtrl.updateOrgType({ type: 'fb' })
    setupService.updateOrgType()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should return server error on org type update', function (done) {
    spyOn(setupCtrl, 'updateOrgType').and.callThrough()
    spyOn(setupService, 'updateOrgType').and.returnValue(deferred.promise)
    var serverError = {}
    deferred.resolve(serverError)
    setupCtrl.updateOrgType({ type: 'fb', url: 'abcd' })
    setupService.updateOrgType()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
})

'use strict';

describe('Controller: bulkUploadController', function () {
    beforeEach(module('playerApp'));
    var bulkUploadCtl;
    var adminService;
    var timeout;
    var state;
    var config;
    var scope;
    var contentService;
    var toasterService;
    var deferred;
    var $state;

    beforeEach(inject(function ($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        });
    }));
    beforeEach(inject(function ($rootScope,
       $controller,
       _adminService_,
       _contentService_,
       _toasterService_,
      _$timeout_,
      _$q_,
      _$state_

          ) {
        adminService = _adminService_;
        contentService = _contentService_;
        toasterService = _toasterService_;
        scope = $rootScope.$new();
        timeout = _$timeout_;
        $state = _$state_;

        deferred = _$q_.defer();
        spyOn(toasterService, 'success').and.callThrough();
        spyOn(toasterService, 'error').and.callThrough();
        bulkUploadCtl = $controller('bulkUploadController', {
            $rootScope: $rootScope,
            $scope: scope,
            adminService: adminService,
            contentService: contentService,
            toasterService: toasterService,
            $state: $state

        });
    }));

    it('should open file Browser for user upload', function (done) {
        spyOn(bulkUploadCtl, 'openImageBrowser').and.callThrough();
        bulkUploadCtl.bulkUsers = {};
        bulkUploadCtl.bulkUsers.provider = 1212;
        bulkUploadCtl.bulkUsers.externalid = 12345;
        bulkUploadCtl.bulkUsers.OrgId = 12121;
        bulkUploadCtl.openImageBrowser('users');
        expect(bulkUploadCtl.isUploadLoader).toBe(true);
        scope.$apply();
        done();
    });
    it('should not open file Browser', function (done) {
        spyOn(bulkUploadCtl, 'openImageBrowser').and.callThrough();
        bulkUploadCtl.bulkUsers = {};
        bulkUploadCtl.openImageBrowser('users');
        timeout.flush(5000);
        expect(bulkUploadCtl.bulkUploadError).toBe(true);
        scope.$apply();
        done();
    });
    it('should open file Browser for organizations upload', function (done) {
        spyOn(bulkUploadCtl, 'openImageBrowser').and.callThrough();
        bulkUploadCtl.openImageBrowser('organizations');
        expect(bulkUploadCtl.isUploadLoader).toBe(true);
        scope.$apply();
        done();
    });

    it('should bulk upload users', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadUsers').and.callThrough();
        spyOn(adminService, 'bulkUserUpload').and.returnValue(deferred.promise);
        bulkUploadCtl.fileToUpload = new FormData();
        bulkUploadCtl.bulkUsers = {};
        bulkUploadCtl.bulkUsers.externalid = 123;
        bulkUploadCtl.bulkUsers.provider = 1212;
        var res = { responseCode: 'OK', result: { processId: 1212, response: 'OK' } };
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadUsers();
        adminService.bulkUserUpload();
        expect(bulkUploadCtl.bulkUsersProcessId).not.toBe(null);
        scope.$apply();
        done();
    });
    it('should return client error for user bulk upload', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadUsers').and.callThrough();
        spyOn(adminService, 'bulkUserUpload').and.returnValue(deferred.promise);
        bulkUploadCtl.fileToUpload = new FormData();
        bulkUploadCtl.bulkUsers = {};
        bulkUploadCtl.bulkUsers.externalid = 123;
        bulkUploadCtl.bulkUsers.provider = 1212;
        var res = { responseCode: 'CLIENT_ERROR' };
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadUsers();
        adminService.bulkUserUpload();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });
    it('should return server error for user bulk upload', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadUsers').and.callThrough();
        spyOn(adminService, 'bulkUserUpload').and.returnValue(deferred.promise);
        bulkUploadCtl.fileToUpload = new FormData();
        bulkUploadCtl.bulkUsers = {};
        bulkUploadCtl.bulkUsers.externalid = 123;
        bulkUploadCtl.bulkUsers.provider = 1212;
        var res = { };
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadUsers();
        adminService.bulkUserUpload();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });

    it('should bulk upload organizations', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadOrganizations').and.callThrough();
        spyOn(adminService, 'bulkOrgrUpload').and.returnValue(deferred.promise);
        var res = { responseCode: 'OK', result: { processId: 1212, response: 'OK' } };
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadOrganizations();
        adminService.bulkOrgrUpload();
        scope.$apply();
        expect(toasterService.success).toHaveBeenCalled();

        done();
    });
    it('should return client error bulk upload organizations', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadOrganizations').and.callThrough();
        spyOn(adminService, 'bulkOrgrUpload').and.returnValue(deferred.promise);
        var res = { responseCode: 'CLIENT_ERROR' };
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadOrganizations();
        adminService.bulkOrgrUpload();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });
    it('should return server error bulk upload organizations', function (done) {
        spyOn(bulkUploadCtl, 'bulkUploadOrganizations').and.callThrough();
        spyOn(adminService, 'bulkOrgrUpload').and.returnValue(deferred.promise);
        var res = {};
        deferred.resolve(res);
        bulkUploadCtl.bulkUploadOrganizations();
        adminService.bulkOrgrUpload();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });

    it('should return status of  bulk upload ', function (done) {
        spyOn(bulkUploadCtl, 'getBulkUloadStatus').and.callThrough();
        spyOn(adminService, 'bulkUploadStatus').and.returnValue(deferred.promise);
        var res = { responseCode: 'OK',
            result: { response: [
                { successResult: [{ createdDate: '12-2-1212' }, { createdDate: '12-3-1912' }],
                    failureResult: [{}, {}],
                    processId: 123 }
            ]
            } };
        deferred.resolve(res);
        bulkUploadCtl.getBulkUloadStatus(12, 'users');
        adminService.bulkUploadStatus();
        scope.$apply();
        // expect(toasterService.success).toHaveBeenCalled();
        done();
    });
    it('should return failure status of  bulk upload ', function (done) {
        spyOn(bulkUploadCtl, 'getBulkUloadStatus').and.callThrough();
        spyOn(adminService, 'bulkUploadStatus').and.returnValue(deferred.promise);
        var res = {};
        deferred.resolve(res);
        bulkUploadCtl.getBulkUloadStatus(12, 'users');
        adminService.bulkUploadStatus();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });
    it('should validate  file ', function (done) {
        spyOn(scope, 'validateFile').and.callThrough();
        var reader = new FileReader();
        spyOn(reader, 'onload').and.callThrough();
        var files = [{ name: 'abc.csv' }];
        bulkUploadCtl.bulkUploadStatus = {};
        scope.validateFile(files, 'users');
        reader.onload();
        scope.$apply();
        expect(toasterService.error).toHaveBeenCalled();
        done();
    });

    it('should validate  file ', function (done) {
        spyOn(bulkUploadCtl, 'closeBulkUploadError').and.callThrough();
        bulkUploadCtl.closeBulkUploadError();
        done();
    });
});

'use strict'
describe('Factory: fileUpload', function() {
    beforeEach(module('playerApp'))
    var fileUploadObj,
        scope,
        rootScope,
        $q,
        deferred,
        timeout,
        annTestData = announcementTestData.composeAnncmnt.fileUploadSuccessData
    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        })
    }))
    beforeEach(inject(function($rootScope, _fileUpload_, _$q_, _$timeout_) {
        rootScope = $rootScope
        scope = $rootScope.$new()
        fileUploadObj = _fileUpload_
        $q = _$q_
        timeout = _$timeout_
        deferred = _$q_.defer()
        this.onFileUploadCancel = function(a, b) {
            return a + b
        }
        this.onFileUploadSuccess = function(a, b, c) {
            return true
        }
    }))
    it('should create fine uploader instance', function() {
        var announcement = new fileUploadObj.createFineUploadInstance({})
        expect(announcement).toBeDefined()
    })
    it('on announcement upload complete', function() {
        var options = {
            uploadSuccess: this.onFileUploadSuccess,
            onCancel: this.onFileUploadCancel
        }
        var composeAnncmntInstance = new fileUploadObj.createFineUploadInstance(options)
        expect(composeAnncmntInstance).toBeDefined()
        var onFileUploadSuccess = new fileUploadObj.onFileUploadSuccess(1, 'swing-846077_960_720.jpg', announcementTestData.composeAnncmnt.fileUploadSuccessData, {
            'type': 'AA',
            'size': 123
        })
        expect(onFileUploadSuccess).toBeDefined()
    })
    it('on announcement upload cancel', function() {
        var options = {
            uploadSuccess: this.onFileUploadSuccess,
            onCancel: this.onFileUploadCancel
        }
        var composeAnncmntInstance = new fileUploadObj.createFineUploadInstance(options)
        expect(composeAnncmntInstance).toBeDefined()
        var onFileUploadCancel = new fileUploadObj.onFileUploadCancel(1, 'swing-846077_960_720.jpg')
        expect(onFileUploadCancel).toBeDefined()
    })
    it('should show error message', function() {
        var showErrorMessage = new fileUploadObj.showErrorMessage('swing-846077_960_720.jpg')
        expect(showErrorMessage).toBeDefined()
    })
})
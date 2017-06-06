'use strict';

describe('Controller:LearnCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));
    var enrolledCoursesSuccessResponse = { 'id': 'sunbird.user.courses', 'ver': '1.0', 'ts': '2017-05-13T10:49:58:600+0530', 'params': { 'resmsgid': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf', 'msgid': null, 'err': null, 'status': 'success', 'errmsg': null }, 'responseCode': 'OK', 'result': { 'courses': [{ 'userId': ' user1', 'courseId': ' course1', 'name': ' course name 1', 'description': ' course description 1', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }, { 'userId': ' user1', 'courseId': ' course2', 'name': ' course name 2', 'description': ' course description 2', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }, { 'userId': ' user1', 'courseId': ' course3', 'name': ' course name 3', 'description': ' course description 3', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }] } };
    var LearnCtrl,
        scope,
        learnService,
        $timeout,
        $q,
        deferred;

    beforeEach(inject(function($controller, $rootScope, _$q_, _learnService_, _$timeout_) {
        scope = $rootScope.$new();
        $q = _$q_;
        deferred = $q.defer();
        learnService = _learnService_;
        $timeout = _$timeout_;
        spyOn(learnService, 'enrolledCourses').and.returnValue(deferred.promise);
        LearnCtrl = $controller('LearnCtrl', {
            $scope: scope
        });
        spyOn(LearnCtrl, 'enrolledCourses').and.callThrough();
    }));

    it('should return enrolled courses', (function(done) {
        deferred.resolve(enrolledCoursesSuccessResponse);
        LearnCtrl.courses();
        learnService.enrolledCourses();
        scope.$apply();
        expect(LearnCtrl.enrolledCourses).toHaveBeenCalled();
        expect(learnService.enrolledCourses).toHaveBeenCalled();
        done();
    }));
    it('should handle failure when response code is not ok', (function(done) {
        deferred.resolve('enrolledCoursesSuccessResponse');
        LearnCtrl.courses();
        learnService.enrolledCourses();
        scope.$apply();
        expect(LearnCtrl.enrolledCourses).toHaveBeenCalled();
        expect(learnService.enrolledCourses).toHaveBeenCalled();
        done();
    }));
    it('should handle api failure ', (function(done) {
        deferred.reject();
        LearnCtrl.courses();
        $timeout.flush(2000);
        scope.$apply();

        expect(LearnCtrl.enrolledCourses).toHaveBeenCalled();
        done();
    }));
});
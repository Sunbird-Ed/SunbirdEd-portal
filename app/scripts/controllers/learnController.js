'use strict';

angular.module('playerApp')
    .controller('LearnCtrl', function(learnService, config, $log, $scope, $sessionStorage) {
        var learn = this;
        var uid = $sessionStorage.token;
        learn.enrolledCourses = learnService.enrolledCourses(uid).then(function(successResponse) {
            $log.info('successResponse enrolled cources', successResponse);
            learn.enrolledCourses = successResponse.result.courses;
        });
    });
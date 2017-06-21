'use strict';

angular.module('playerApp')
    .controller('LearnCtrl', function(learnService, $log, $scope, $sessionStorage, $timeout, $state, $rootScope) {
        var learn = this;
        var uid = $sessionStorage.userId;
        $rootScope.searchResult = [];
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };

        function handleFailedResponse(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = '';
            error.responseCode = errorResponse.responseCode;
            learn.error = error;
            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

        learn.openCourseView = function(courseId, courseType, courseProgress, courseTotal) {
            // courseId = 'do_112265805439688704113';
            var showLectureView = 'no';
            var params = { courseType: courseType, courseId: courseId, lectureView: showLectureView, progress: courseProgress, total: courseTotal };
            $state.go('Toc', params);
        };

        learn.courses = function() {
            $scope.loading = true;

            learnService.enrolledCourses(uid).then(function(successResponse) {
                    $scope.loading = false;
                    if (successResponse && successResponse.responseCode === 'OK') {
                        learn.enrolledCourses = successResponse.result.courses;
                        $rootScope.enrolledCourseIds = [];

                        var isEnrolled = learn.enrolledCourses.forEach(function(course) {
                            $rootScope.enrolledCourseIds.push(course.courseId);
                        });
                    } else {
                        $log.warn('enrolledCourses', successResponse);
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    $log.warn(error);

                    handleFailedResponse(error);
                });
        };
        learn.courses();
        learn.otherSection = function() {
            var req = {
                'request': {
                    'context': {
                        'userId': 'user1'
                    }
                }
            };
            learnService.otherSections(req).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    learn.page = successResponse.result.page.sections;
                } else {
                    $log.warn('enrolledCourses', successResponse);
                    handleFailedResponse(successResponse);
                }
            }).catch(function(error) {
                $log.warn(error);
                handleFailedResponse(error);
            });
        };
        learn.otherSection();
        // learn.page =

        //     [{
        //             'display': {
        //                 'title': {
        //                     'en': 'Popular',
        //                     'hi': 'लोकप्रिय'
        //                 }
        //             },
        //             'count': 2,
        //             'course': [{
        //                     'identifier': 'course1',
        //                     'contentId': 'do_3122025632538951681225',
        //                     'pkgVersion': 1,
        //                     'organization': [
        //                         'org1'
        //                     ],
        //                     'faculty': [
        //                         'faculty1'
        //                     ],
        //                     'tutors': [
        //                         'tutor1'
        //                     ],
        //                     'name': 'Course 1',
        //                     'description': 'Description of course 1',
        //                     'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122025623654973442202/artifact/00642360c44e576a1c5886410ca1ed78_1489570574295.jpeg',
        //                     'language': [
        //                         'English'
        //                     ],
        //                     'gradeLevel': [
        //                         'Grade 1'
        //                     ],
        //                     'subject': [
        //                         'Maths'
        //                     ],
        //                     'tocUrl': '',
        //                     'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725405559_do_3122025632538951681225_2.0.ecar',
        //                     'variants': '{"spine":{"ecarUrl":"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725408214_do_3122025632538951681225_2.0_spine.ecar","size":140939.0}}'
        //                 },
        //                 {
        //                     'identifier': 'course2',
        //                     'contentId': 'do_3122027498453483521235',
        //                     'pkgVersion': 1,
        //                     'organization': [
        //                         'org1'
        //                     ],
        //                     'faculty': [
        //                         'faculty1'
        //                     ],
        //                     'tutors': [
        //                         'tutor1'
        //                     ],
        //                     'name': 'Course 2',
        //                     'description': 'Description of course 2',
        //                     'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027498453483521235/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.thumb.jpeg',
        //                     'language': [
        //                         'English'
        //                     ],
        //                     'gradeLevel': [
        //                         'Grade 1'
        //                     ],
        //                     'subject': [
        //                         'Maths'
        //                     ],
        //                     'tocUrl': '',
        //                     'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496229137_do_3122027498453483521235_1.0.ecar',
        //                     'variants': '{"spine":{"ecarUrl":"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496249327_do_3122027498453483521235_1.0_spine.ecar","size":1931251.0}}',
        //                     'posterImage': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027497444966401234/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.jpeg'
        //                 }
        //             ]
        //         },
        //         {
        //             'display': {
        //                 'title': {
        //                     'en': 'Recommended'
        //                 }
        //             },
        //             'count': 2,
        //             'course': [{
        //                     'identifier': 'course1',
        //                     'contentId': 'do_3122025632538951681225',
        //                     'pkgVersion': 1,
        //                     'organization': [
        //                         'org1'
        //                     ],
        //                     'faculty': [
        //                         'faculty1'
        //                     ],
        //                     'tutors': [
        //                         'tutor1'
        //                     ],
        //                     'name': 'Course 1',
        //                     'description': 'Description of course 1',
        //                     'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122025623654973442202/artifact/00642360c44e576a1c5886410ca1ed78_1489570574295.jpeg',
        //                     'language': [
        //                         'English'
        //                     ],
        //                     'gradeLevel': [
        //                         'Grade 1'
        //                     ],
        //                     'subject': [
        //                         'Maths'
        //                     ],
        //                     'tocUrl': '',
        //                     'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725405559_do_3122025632538951681225_2.0.ecar',
        //                     'variants': '{"spine":{"ecarUrl":"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122025632538951681225/level-1-english-workbook_1489725408214_do_3122025632538951681225_2.0_spine.ecar","size":140939.0}}'
        //                 },
        //                 {
        //                     'identifier': 'course2',
        //                     'contentId': 'do_3122027498453483521235',
        //                     'pkgVersion': 1,
        //                     'organization': [
        //                         'org1'
        //                     ],
        //                     'faculty': [
        //                         'faculty1'
        //                     ],
        //                     'tutors': [
        //                         'tutor1'
        //                     ],
        //                     'name': 'Course 2',
        //                     'description': 'Description of course 2',
        //                     'appIcon': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027498453483521235/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.thumb.jpeg',
        //                     'language': [
        //                         'English'
        //                     ],
        //                     'gradeLevel': [
        //                         'Grade 1'
        //                     ],
        //                     'subject': [
        //                         'Maths'
        //                     ],
        //                     'tocUrl': '',
        //                     'downloadUrl': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496229137_do_3122027498453483521235_1.0.ecar',
        //                     'variants': '{"spine":{"ecarUrl":"https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/ecar_files/do_3122027498453483521235/1st-grade-lessons_1492496249327_do_3122027498453483521235_1.0_spine.ecar","size":1931251.0}}',
        //                     'posterImage': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_3122027497444966401234/artifact/9112e63fd2a3c4383b6d8ece55b8783d_1489593501735.jpeg'
        //                 }
        //             ]
        //         }
        //     ];
    });

'use strict';
angular.module('playerApp')
    .service('learnService', function(httpServiceJava, config, $sessionStorage, $q) {
        function enrolledCourses(uid) {
            var url = config.URL.MOCK_API_BASE + config.URL.COURSE.GET_ENROLLED_COURSES + '/' + uid;
            return httpServiceJava.get(url);
            // var deferred = $q.defer();
            // deferred.resolve({
            //     'id': 'sunbird.user.courses',
            //     'ver': '1.0',
            //     'ts': '2017-05-13T10:49:58:600+0530',
            //     'params': {
            //         'resmsgid': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
            //         'msgid': null,
            //         'err': null,
            //         'status': 'success',
            //         'errmsg': null
            //     },
            //     'responseCode': 'OK',
            //     'result': {
            //         'courses': [{
            //                 'userId': ' user1',
            //                 'courseId': ' course1',
            //                 'name': ' course name 1',
            //                 'description': ' course description 1',
            //                 'enrolledDate': '2017-05-136 10:49:58:600+0530',
            //                 'progress': 10,
            //                 'grade': 'A',
            //                 'active': ' true',
            //                 'delta': {},
            //                 'tocurl': 'CDN URL of the toc',
            //                 'status': '1'
            //             },
            //             {
            //                 'userId': ' user1',
            //                 'courseId': ' course2',
            //                 'name': ' course name 2',
            //                 'description': ' course description 2',
            //                 'enrolledDate': '2017-05-136 10:49:58:600+0530',
            //                 'progress': 10,
            //                 'grade': 'A',
            //                 'active': ' true',
            //                 'delta': {},
            //                 'tocurl': 'CDN URL of the toc',
            //                 'status': '1'
            //             },
            //             {
            //                 'userId': ' user1',
            //                 'courseId': ' course2',
            //                 'name': ' course name 2',
            //                 'description': ' course description 2',
            //                 'enrolledDate': '2017-05-136 10:49:58:600+0530',
            //                 'progress': 10,
            //                 'grade': 'A',
            //                 'active': ' true',
            //                 'delta': {},
            //                 'tocurl': 'CDN URL of the toc',
            //                 'status': '1'
            //             },
            //             {
            //                 'userId': ' user1',
            //                 'courseId': ' course2',
            //                 'name': ' course name 2',
            //                 'description': ' course description 2',
            //                 'enrolledDate': '2017-05-136 10:49:58:600+0530',
            //                 'progress': 10,
            //                 'grade': 'A',
            //                 'active': ' true',
            //                 'delta': {},
            //                 'tocurl': 'CDN URL of the toc',
            //                 'status': '1'
            //             },
            //             {
            //                 'userId': ' user1',
            //                 'courseId': ' course2',
            //                 'name': ' course name 2',
            //                 'description': ' course description 2',
            //                 'enrolledDate': '2017-05-136 10:49:58:600+0530',
            //                 'progress': 10,
            //                 'grade': 'A',
            //                 'active': ' true',
            //                 'delta': {},
            //                 'tocurl': 'CDN URL of the toc',
            //                 'status': '1'
            //             }
            //         ]
            //     }
            // });
            // return deferred.promise;
        }
        return {
            enrolledCourses: enrolledCourses
        };
    });
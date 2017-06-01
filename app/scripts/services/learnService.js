'use strict';
angular.module('playerApp')
    .service('learnService', function(httpServiceJava, config, $sessionStorage, $q) {
        function enrolledCourses(uid) {
            var url = config.URL.USER_BASE + config.URL.COURSE.ENROLLED_COURSES + '/' + uid;
            // return httpServiceJava.get(url, req);
            console.log('url', url);
            var deferred = $q.defer();
            deferred.resolve({
                'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ver': 'v1',
                'ts': '2017-05-27 06:22:29:972+0530',
                'params': {
                    'resmsgid': null,
                    'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'err': null,
                    'status': 'success',
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'courses': [{
                        'dateTime': 1495886160605,
                        'lastReadContentStatus': 1,
                        'enrolledDate': '2017-05-27 05:24:29:079+0530',
                        'addedby': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'delta': 'delta',
                        'active': true,
                        'description': 'course description',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'courseName': 'course name 2',
                        'grade': null,
                        'progress': 0,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0
                    }]
                }

            });
            return deferred.promise;
        }
        return {
            enrolledCourses: enrolledCourses
        };
    });
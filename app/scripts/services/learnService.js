'use strict';
angular.module('playerApp')
    .service('learnService', function(httpServiceJava, config, $sessionStorage, $q) {
        function enrolledCourses(uid) {
            var url = config.URL.MOCK_API_BASE + config.URL.COURSE.GET_ENROLLED_COURSES + '/' + uid;
            // return httpServiceJava.get(url);
            var deferred = $q.defer();
            deferred.resolve({
                'id': 'sunbird.user.courses',
                'ver': '1.0',
                'ts': '2017-05-13T10:49:58:600+0530',
                'params': {
                    'resmsgid': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'msgid': null,
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
                        'grade': '4th',
                        'progress': 100,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0,
                        'noOfLecture': 100
                    }, {
                        'dateTime': 1495886160605,
                        'lastReadContentStatus': 1,
                        'enrolledDate': '2017-05-27 05:24:29:079+0530',
                        'addedby': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'delta': 'delta',
                        'active': true,
                        'description': 'course description',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'courseName': 'course name 2',
                        'grade': 'null',
                        'progress': 20,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0,
                        'noOfLecture': 100
                    }, {
                        'dateTime': 1495886160605,
                        'lastReadContentStatus': 1,
                        'enrolledDate': '2017-05-27 05:24:29:079+0530',
                        'addedby': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'delta': 'delta',
                        'active': true,
                        'description': 'course description',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'courseName': 'course name 2',
                        'grade': '8th',
                        'progress': 61,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0,
                        'noOfLecture': 100
                    }, {
                        'dateTime': 1495886160605,
                        'lastReadContentStatus': 1,
                        'enrolledDate': '2017-05-27 05:24:29:079+0530',
                        'addedby': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'delta': 'delta',
                        'active': true,
                        'description': 'course description',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'courseName': 'course name 2',
                        'grade': 'null',
                        'progress': 20,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0,
                        'noOfLecture': 100
                    }, , {
                        'dateTime': 1495886160605,
                        'lastReadContentStatus': 1,
                        'enrolledDate': '2017-05-27 05:24:29:079+0530',
                        'addedby': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'delta': 'delta',
                        'active': true,
                        'description': 'course description',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'courseName': 'course name 2',
                        'grade': 'null',
                        'progress': 20,
                        'id': '642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88',
                        'lastReadContentId': 'ek step cont-284',
                        'tocUrl': null,
                        'courseId': '0122542310741688321',
                        'status': 0,
                        'noOfLecture': 100
                    }]
                }
            });
            return deferred.promise;
        }

        function otherSections(req) {
            var url = config.URL.MOCK_API_BASE + config.URL.COURSE.GET_LEARN_OTHER_SECTION;
            return httpServiceJava.post(url, req);
        }
        
        return {
            enrolledCourses: enrolledCourses,
            otherSections: otherSections

        };
    });
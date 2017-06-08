angular.module('playerApp')
        .controller('CourseCtrl', function (courseService, $timeout, $rootScope, $sce, $sessionStorage, $location, $stateParams) {
            //$sessionStorage.token="b089688ff791ed98e791d698bd20fd91637fe72eb0842598e3ffeeb8a08a6627";
            var courses = this;
            courses.courseId =$stateParams.courseId;
            
            $rootScope.sideMenuData = [{
                    "icon":"",
                    "name": "COURSE SCHEDULE",
                    "children": [],
                    "link":"/toc/"+courses.courseId+"/no" 
                },
                {
                    "icon":"",
                    "name": "LECTURE VIEW",
                    "children": [],
                    "link":"/toc/"+courses.courseId+"/yes"
                },
                {
                    "icon":"",
                    "name": "NOTES",
                    "children": [],
                    "link":"/note"
                }
            ];
            
            courses.content_res = {
                "id": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf",
                "ver": "v1",
                "ts": "2017-05-27 05:38:13:629+0530",
                "params": {
                    "resmsgid": null,
                    "msgid": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf",
                    "err": null,
                    "status": "success",
                    "errmsg": null
                },
                "responseCode": "OK",
                "result": {
                    "contentList": [{
                            "dateTime": 1495886160595,
                            "lastAccessTime": "2017-01-01 10:58:07:509+0530",
                            "contentId": "ek step cont-284",
                            "viewPosition": "pos101",
                            "completedCount": 0,
                            "userId": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2",
                            "result": "pass",
                            "score": "10",
                            "grade": "B",
                            "lastUpdatedTime": "2017-01-01 05:10:12:507+0530",
                            "id": "ece12e8cf9b6a82e7ff981709685600e47f2af1aa5beb5d98afd63c6e3b1b10a",
                            "viewCount": 4,
                            "contentVersion": null,
                            "courseId": "642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88",
                            "lastCompletedTime": null,
                            "status": 1
                        }]
                }
            };
            courses.res = {
                "id": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf",
                "ver": "v1",
                "ts": "2017-05-27 06:22:29:972+0530",
                "params": {
                    "resmsgid": null,
                    "msgid": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf",
                    "err": null,
                    "status": "success",
                    "errmsg": null
                },
                "responseCode": "OK",
                "result": {
                    "courses": [{
                            "dateTime": 1495886160605,
                            "lastReadContentStatus": 1,
                            "enrolledDate": "2017-05-27 05:24:29:079+0530",
                            "addedby": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2",
                            "delta": "delta",
                            "active": true,
                            "description": "course description",
                            "userId": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2",
                            "courseName": "course name 2",
                            "grade": null,
                            "progress": 0,
                            "id": "642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88",
                            "lastReadContentId": "ek step cont-284",
                            "tocUrl": null,
                            "courseId": "0122542310741688321",
                            "status": 0
                        }]
                }
            };

            courses.getUserCourses = function () {

                if (courses.res != null && courses.res.responseCode === 'OK') {
                    courses.enrolledCourses = courses.res.result.courses;
                    var courseIds = courses.fetchObjectAttributeAsArrayOrObject(courses.enrolledCourses, 'id', false);
                    var req = {
                        "id": "unique API ID",
                        "ts": "2013/10/15 16:16:39",
                        "params": {

                        },
                        "request": {"userId": $sessionStorage.token,
                            "courseIds": courseIds
                        }
                    };


                    courses.enrolledCourseContents = courses.fetchObjectAttributeAsArrayOrObject(courses.content_res.result.contentList, 'courseId', true);

                }
            };
//                courseService.courseSchedule({}).then(function (res){
//                   var res = {"id": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "ver": "v1", "ts": "2017-05-27 06:22:29:972+0530", "params": {"resmsgid": null, "msgid": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "err": null, "status": "success", "errmsg": null}, "responseCode": "OK", "result": {"courses": [{"dateTime": 1495886160605, "lastReadContentStatus": 1, "enrolledDate": "2017-05-27 05:24:29:079+0530", "addedby": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2", "delta": "delta", "active": true, "description": "course description", "userId": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2", "courseName": "course name 2", "grade": null, "progress": 0, "id": "642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88", "lastReadContentId": "ek step cont-284", "tocUrl": null, "courseId": "0122542310741688321", "status": 0}]}};
//                    if (res != null && res.responseCode === 'OK') {
//                        courses.enrolledCourses = res.result.courses;
//                        var courseIds = courses.fetchObjectAttributeAsArrayOrObject(courses.enrolledCourses, 'id', false);
//                        var req = {
//                            "id": "unique API ID",
//                            "ts": "2013/10/15 16:16:39",
//                            "params": {
//
//                            },
//                            "request": {"userId": $sessionStorage.token,
//                                "courseIds": courseIds
//                            }
//                        };
//                        courseService.courseContentState(req).then(function (content_res) {
//                                var content_res = {"id": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "ver": "v1", "ts": "2017-05-27 05:38:13:629+0530", "params": {"resmsgid": null, "msgid": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "err": null, "status": "success", "errmsg": null}, "responseCode": "OK", "result": {"contentList": [{"dateTime": 1495886160595, "lastAccessTime": "2017-01-01 10:58:07:509+0530", "contentId": "ek step cont-284", "viewPosition": "pos101", "completedCount": 0, "userId": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2", "result": "pass", "score": "10", "grade": "B", "lastUpdatedTime": "2017-01-01 05:10:12:507+0530", "id": "ece12e8cf9b6a82e7ff981709685600e47f2af1aa5beb5d98afd63c6e3b1b10a", "viewCount": 4, "contentVersion": null, "courseId": "642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88", "lastCompletedTime": null, "status": 1}]}};
//                            courses.enrolledCourseContents = courses.fetchObjectAttributeAsArrayOrObject(content_res.result.contentList, 'courseId', true);                    
//                        });
//                    }                       
//                });


            courses.showToc = function (course_id) {
                $location.path('/toc/do_11225144311893196816/yes');
            };


            courses.fetchObjectAttributeAsArrayOrObject = function (objArray, objKey, isKeyBasedObj) {
                var attributeArr = (isKeyBasedObj == true) ? {} : [];

                for (var obj in objArray)
                {
                    if (isKeyBasedObj)
                    {
                        attributeArr[objArray[obj][objKey]] = objArray[obj];
                    } else
                    {
                        attributeArr.push(objArray[obj][objKey]);
                    }
                }
                return attributeArr;
            };

            courses.getUserCourses();



        });
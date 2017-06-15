angular.module('playerApp')
    .controller('courseScheduleCtrl', function(courseService, $timeout, $scope, $sce, $rootScope, $sessionStorage, $stateParams, $location, $anchorScroll) {
        var toc = this;
        toc.playList = [];
        toc.playListContent = [];
        toc.loading = false;
        toc.lectureView = $stateParams.lectureView;
        toc.courseId = $stateParams.courseId;
        toc.courseType = $stateParams.courseType;
        $rootScope.courseId = $stateParams.courseId;
        $scope.enableCloseButton = (toc.lectureView === 'yes') ? 'false' : 'true';
        console.log($rootScope.contentDetails);
        toc.showAllNoteList = false;
        toc.nightMode = true;
        $scope.contentPlayer = {
            isContentPlayerEnabled: false

        };
        toc.playItemIndex = undefined;

        toc.getContentStatus = function(contentId) {
            if ($rootScope.contentDetails[contentId] && $rootScope.contentDetails[contentId]['status'] === 1) {
                return 'green';
            } else {
                return '';
            }
        };

        toc.showError = function(message) {

            toc.messageClass = "red";
            toc.showMetaLoader = false;
            toc.message = message;
            $timeout(function() {
                toc.showDimmer = false;
            }, 2000);
        };

        //$scope.contentPlayer.contentData=};
        toc.getCourseToc = function() {

            toc.showMetaLoader = toc.showDimmer = true;
            toc.messageType = "";
            toc.message = "Loading Course schedule, Please wait...";
            courseService.courseHierarchy(toc.courseId).then(function(res) {
                if (res && res.responseCode === "OK") {
                    toc.courseHierachy = res.result.content;
                    $rootScope.courseName = toc.courseHierachy.name;
                    toc.applyAccordion();
                    toc.showMetaLoader = false;
                    toc.showDimmer = false;
                } else {
                    toc.showError("Unable to get course schedule details.");
                }

                $timeout(function() {
                    toc.showMetaLoader = false;
                    toc.showDimmer = false;
                }, 2000);

            }, function(err) {
                toc.showError("Unable to get course schedule details.");
            });
        };

        toc.getCourseToc();
        toc.expandMe = function($event, item) {
            if (item.mimeType !== "application/vnd.ekstep.content-collection") {

                toc.itemIndex = $($event.target).closest('.playlist-content').index('.playlist-content');
                toc.playPlaylistContent($($event.target).closest('.playlist-content').attr('name'), '');
                $location.hash('tocPlayer');
                $anchorScroll();
            }
        };

        toc.checkAndAddToPlaylist = function(item) {
            if (item.mimeType !== "application/vnd.ekstep.content-collection" && toc.playList.indexOf(item.identifier) === -1) {
                // console.log($scope.counter);
                toc.playList.push(item.identifier);
                toc.playListContent.push(item);
            }
        };

        toc.playPlaylistContent = function(contentId, trigger) {
            var curItemIndex = toc.playList.indexOf(contentId);
            toc.playItemIndex = curItemIndex;

            if (trigger === 'prev') {
                toc.itemIndex -= 1;
            } else if (trigger === 'next') {
                toc.itemIndex += 1;
            }
            toc.prevPlaylistItem = (toc.itemIndex - 1) > -1 ? toc.playList[toc.itemIndex - 1] : -1;
            toc.nextPlaylistItem = (toc.itemIndex + 1) <= toc.playList.length ? toc.playList[toc.itemIndex + 1] : -1;
            toc.previousPlayListName = (toc.itemIndex - 1) > -1 ? toc.playListContent[toc.itemIndex - 1].name : "No content to play";
            toc.nextPlayListName = (toc.itemIndex + 1) < toc.playList.length ? toc.playListContent[toc.itemIndex + 1].name : "No content to play";
            if (toc.courseType === "ENROLLED_COURSE") {
                $rootScope.contentId = contentId;
                $scope.contentPlayer.contentData = toc.playListContent[toc.itemIndex];
                $scope.contentPlayer.isContentPlayerEnabled = true;
            }
        };

        toc.getAllChildrenCount = function(index) {
            var childCount = toc.getChildNodeCount(toc.courseHierachy.children[index], 0);
            return childCount;
        }
        toc.getChildNodeCount = function(obj, cnt) {


            if (obj.children == undefined || obj.children.length == 0) {
                return cnt;
            } else {
                cnt += obj.children.length;
                obj.children.forEach(function(c) {
                    var r = toc.getChildNodeCount(c, cnt);
                    cnt = parseInt(r);
                });

            }
            return cnt;

        }

        toc.getContentClass = function(contentMimeType) {
            console.log("contentMimeType", contentMimeType);
            if (contentMimeType == 'application/vnd.ekstep.content-collection') {
                return '';
            } else {
                return 'playlist-content';
            }
        }

        toc.getContentIcon = function(contentMimeType) {
            var contentIcons = {
                "application/pdf": "large file pdf outline icon",
                "image/jpeg": "large file image outline icon",
                "image/jpg": "large file image outline icon",
                "image/png": "large file image outline icon",
                "video/mp4": "large file video outline icon",
                "video/ogg": "large file video outline icon",
                "video/youtube": "large youtube square icon",
                "application/vnd.ekstep.html-archive": "large html5 icon",
                "application/vnd.ekstep.ecml-archive": "large file archive outline icon",
                "application/vnd.ekstep.content-collection": "big book icon"


            };
            return contentIcons[contentMimeType];
        }
        toc.applyAccordion = function() {
            $timeout(function() {
                //if lecture view enabled play first content by default
                if (toc.lectureView == 'yes' && toc.playList.length > 0) {
                    toc.itemIndex = 0;
                    toc.playPlaylistContent(toc.playList[toc.itemIndex], '');
                }
                $('.ui.accordion').accordion({ exclusive: false });
            }, 0);
        }

        //We need to discuss
        toc.content_res = {
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
                    "contentId": "LP_FT_5887573.img",
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
        toc.res = {
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

        toc.getUserCourses = function() {

            if (toc.res != null && toc.res.responseCode === 'OK') {
                toc.enrolledCourses = toc.res.result.courses;
                var courseIds = toc.fetchObjectAttributeAsArrayOrObject(toc.enrolledCourses, 'id', false);
                var req = {
                    "id": "unique API ID",
                    "ts": "2013/10/15 16:16:39",
                    "params": {

                    },
                    "request": {
                        "userId": $sessionStorage.token,
                        "courseIds": courseIds
                    }
                };


                toc.enrolledCourseContents = toc.fetchObjectAttributeAsArrayOrObject(toc.content_res.result.contentList, 'courseId', true);
                $rootScope.contentDetails = toc.fetchObjectAttributeAsArrayOrObject(toc.content_res.result.contentList, 'contentId', true);

            }
        };
        //                courseService.courseSchedule({}).then(function (res){
        //                   var res = {"id": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "ver": "v1", "ts": "2017-05-27 06:22:29:972+0530", "params": {"resmsgid": null, "msgid": "8e27cbf5-e299-43b0-bca7-8347f7e5abcf", "err": null, "status": "success", "errmsg": null}, "responseCode": "OK", "result": {"courses": [{"dateTime": 1495886160605, "lastReadContentStatus": 1, "enrolledDate": "2017-05-27 05:24:29:079+0530", "addedby": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2", "delta": "delta", "active": true, "description": "course description", "userId": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2", "courseName": "course name 2", "grade": null, "progress": 0, "id": "642f1dfa59249f23797ba070bdebbce1c27e0d756699dcd24dba669f86fbad88", "lastReadContentId": "ek step cont-284", "tocUrl": null, "courseId": "0122542310741688321", "status": 0}]}};
        //                    if (res != null && res.responseCode === 'OK') {
        //                        toc.enrolledCourses = res.result.courses;
        //                        var courseIds = toc.fetchObjectAttributeAsArrayOrObject(toc.enrolledCourses, 'id', false);
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
        //                            toc.enrolledCourseContents = toc.fetchObjectAttributeAsArrayOrObject(content_res.result.contentList, 'courseId', true);                    
        //                        });
        //                    }                       
        //                });


        toc.fetchObjectAttributeAsArrayOrObject = function(objArray, objKey, isKeyBasedObj) {
            var attributeArr = (isKeyBasedObj == true) ? {} : [];

            for (var obj in objArray) {
                if (isKeyBasedObj) {
                    attributeArr[objArray[obj][objKey]] = objArray[obj];
                } else {
                    attributeArr.push(objArray[obj][objKey]);
                }
            }
            return attributeArr;
        };

        toc.getUserCourses();
        
        $rootScope.$on("showAllNoteList", function(e, noteListStatus) {
            toc.showAllNoteList = noteListStatus;
        });

    });

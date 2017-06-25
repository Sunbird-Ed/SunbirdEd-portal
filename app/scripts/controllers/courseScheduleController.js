angular.module('playerApp')
        .controller('courseScheduleCtrl', function (courseService, sessionService, $stateParams, $timeout, $scope, $sce, $rootScope, $sessionStorage, $location, $anchorScroll) {
            var toc = this;
            toc.playList = [];
            toc.playListContent = [];
            toc.loading = false;
            toc.courseParams = sessionService.getSessionData('COURSE_PARAMS');
            toc.contentList = [];
            toc.showNoteInLecture = true;
            toc.enrollErrorMessage = '';
            toc.enrollUserToCourse = function (courseId) {
                var req = {
                    request: {
                        courseId: courseId,
                        userId: toc.uid
                    }
                };
                toc.enorllingCourse = true;
                courseService.enrollUserToCourse(req).then(function (successResponse) {
                    toc.enorllingCourse = false;
                    if (successResponse && successResponse.responseCode === 'OK') {
                        //temporary change it later
                        toc.courseType = "ENROLLED_COURSE";
                    } else {
                        toc.enrollErrorMessage = 'Cannot enroll user to course';
                        $timeout(function () {
                            toc.enrollErrorMessage = '';
                        }, 3000);
                    }
                }).catch(function (error) {
                    toc.enrollErrorMessage = 'Cannot enroll user to course';
                });

            }

            toc.resumeCourse = function () {
                if ($location.hash().indexOf('tocPlayer') < 0)
                {
                    //once last played index is given assign it for now zero
                    $('#course-toc').find('.content').first().addClass('active');
                    toc.itemIndex = 0;
                    toc.playPlaylistContent(toc.playList[toc.itemIndex], '');
                } else
                {
                    var currentHash = $location.hash().toString().split("/");
                    toc.itemIndex = parseInt(currentHash[2]);
                    toc.playPlaylistContent(currentHash[1], '');

                }
            }

            toc.getContentStatus = function (contentId) {
                if ($rootScope.contentDetails[contentId] && $rootScope.contentDetails[contentId]['status'] === 1) {
                    return 'green';
                } else {
                    return '';
                }
            };
            toc.scrollToPlayer = function () {
                $location.hash(toc.hashId);
                $timeout(function () {
                    $anchorScroll();
                }, 500);
            }
            toc.showError = function (message) {

                toc.messageClass = "red";
                toc.showMetaLoader = false;
                toc.message = message;
                $timeout(function () {
                    toc.showDimmer = false;
                }, 2000);
            };

            //$scope.contentPlayer.contentData=};
            toc.getCourseToc = function () {

                toc.showMetaLoader = toc.showDimmer = true;
                toc.messageType = "";
                toc.message = "Loading Course schedule, Please wait...";
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        toc.courseHierachy = res.result.content;
                        toc.getAllContentsFromCourse(toc.courseHierachy);
                        $rootScope.courseName = toc.courseHierachy.name;
                        toc.applyAccordion();
                        toc.showMetaLoader = false;
                        toc.showDimmer = false;
                    } else {
                        toc.showError("Unable to get course schedule details.");
                    }

                    $timeout(function () {
                        toc.showMetaLoader = false;
                        toc.showDimmer = false;
                    }, 2000);

                }, function (err) {
                    toc.showError("Unable to get course schedule details.");
                });
            };


            toc.expandMe = function ($event, item) {
                if (item.mimeType !== "application/vnd.ekstep.content-collection") {

                    toc.itemIndex = $($event.target).closest('.playlist-content').index('.playlist-content');
                    toc.playPlaylistContent($($event.target).closest('.playlist-content').attr('name'), '');
                }
            };

            toc.checkAndAddToPlaylist = function (item) {
                if (item.mimeType !== "application/vnd.ekstep.content-collection" && toc.playList.indexOf(item.identifier) === -1) {
                    toc.playList.push(item.identifier);
                    toc.playListContent.push(item);
                }
            };

            toc.playPlaylistContent = function (contentId, trigger) {
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
                toc.hashId = ('tocPlayer/' + contentId + '/' + toc.itemIndex);
                toc.scrollToPlayer();
            };

            toc.getAllChildrenCount = function (index) {
                var childCount = toc.getChildNodeCount(toc.courseHierachy.children[index], 0);
                return childCount;
            }
            toc.getChildNodeCount = function (obj, cnt) {


                if (obj.children == undefined || obj.children.length == 0) {
                    return cnt;
                } else {
                    cnt += obj.children.length;
                    obj.children.forEach(function (c) {
                        var r = toc.getChildNodeCount(c, cnt);
                        cnt = parseInt(r);
                    });

                }
                return cnt;

            }
            toc.getAllContentsFromCourse = function (contentData) {
                if (contentData.mimeType != 'application/vnd.ekstep.content-collection') {
                    toc.playList.push(contentData.identifier);
                    toc.playListContent.push(contentData);
                } else
                {
                    for (var item in contentData.children) {
                        toc.getAllContentsFromCourse(contentData.children[item]);
                    }
                }
                return toc.playList;
            }


            toc.getContentClass = function (contentMimeType) {
                if (contentMimeType == 'application/vnd.ekstep.content-collection') {
                    return '';
                } else {
                    return 'playlist-content';
                }
            }

            toc.getContentIcon = function (contentMimeType) {
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
            toc.applyAccordion = function () {
                $timeout(function () {
                    //if lecture view enabled play first content by default
                    if (toc.lectureView == 'yes' && toc.playList.length > 0) {
                        toc.itemIndex = 0;
                        toc.playPlaylistContent(toc.playList[toc.itemIndex], '');
                    } else
                    {
                        //play my current content
                        toc.resumeCourse();
                    }
                    $('.ui.accordion').accordion({exclusive: false});
                }, 0);
            }


            toc.fetchObjectAttributeAsArrayOrObject = function (objArray, objKey, isKeyBasedObj) {
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
            $scope.$watch('contentPlayer.isContentPlayerEnabled', function (newValue, oldValue) {
                if (oldValue==true && newValue==false) {
                    toc.hashId='';
                    $location.hash(toc.hashId);
                }
            });
            toc.init = function () {
                toc.lectureView = toc.courseParams.lectureView;
                toc.courseId = toc.courseParams.courseId;
                toc.courseType = toc.courseParams.courseType;
                toc.courseProgress = toc.courseParams.progress;
                toc.courseTotal = toc.courseParams.total;
                toc.tocId = toc.courseParams.tocId;
                toc.uid = $sessionStorage.userId;
                //console.log($stateParams);
                $scope.enableCloseButton = (toc.lectureView === 'yes') ? 'false' : 'true';
                //console.log($rootScope.contentDetails);
                toc.nightMode = true;
                $scope.contentPlayer = {
                    isContentPlayerEnabled: false

                };
                toc.playItemIndex = undefined;
                toc.getCourseToc();
            }

            toc.loadData = function () {
                if (toc.courseParams.courseId != $stateParams.courseId) {
//if both courseIds are different call to get course by id API and update data(to be implemented with progress and status params in API side)
                } else
                {
                    toc.init();
                }
            }
            toc.loadData();
        });

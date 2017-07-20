angular.module('playerApp')
        .controller('courseScheduleCtrl', function (config, $compile, courseService, sessionService, $stateParams, $state, $timeout, $scope, $rootScope, $location, $anchorScroll, contentStateService, $window) {
            var toc = this;
            toc.playList = [];
            toc.playListContent = [];
            toc.loading = false;
            toc.courseParams = sessionService.getSessionData('COURSE_PARAMS');
            $scope.contentList = toc.contentList = [];
            toc.showNoteInLecture = true;
            toc.enrollErrorMessage = '';
            toc.fancyTree = [];
            toc.treeKey = 0;
            toc.uid = $rootScope.userId;
            toc.statusClass = {
                0: 'grey',
                1: 'blue',
                2: 'green'
            };
            toc.enrollUserToCourse = function (courseId) {
                var req = {
                    request: {
                        courseId: courseId,
                        userId: toc.uid,
                        courseName: toc.courseHierachy.name,
                        description: toc.courseHierachy.description


                    }
                };

                toc.loader.enrollLoader = true;
                toc.loader.loaderMessage = config.MESSAGES.COURSE.ENROLL.START;
                courseService.enrollUserToCourse(req).then(function (successResponse) {
                    toc.loader.enrollLoader = false;
                    if (successResponse && successResponse.responseCode === 'OK') {
                        $window.location.reload();

                    } else {
                        toc.error.showEnrollError = true;
                        toc.error.message = config.MESSAGES.COURSE.ENROLL.ERROR;
                        $timeout(function () {
                            toc.error.showEnrollError = false;
                        }, 3000);
                    }
                }).catch(function (error) {
                    toc.error.showEnrollError = true;
                    toc.error.message = config.MESSAGES.COURSE.ENROLL.ERROR;
                });

            }

            toc.resumeCourse = function () {
                if ($rootScope.isTocPage) {
                    if ($location.hash().indexOf('tocPlayer') < 0) {
                        //once last played index is given assign it for now zero
                        $('#course-toc').find('.content').first().addClass('active');
                        toc.playPlaylistContent(toc.playList[toc.itemIndex], '');
                    } else {
                        var currentHash = $location.hash().toString().split("/");
                        toc.itemIndex = parseInt(currentHash[2]);
                        toc.playPlaylistContent(currentHash[1], '');

                    }
                } else {
                    var params = sessionService.getSessionData('COURSE_PARAMS');
                    sessionService.setSessionData('COURSE_PARAMS', params);
                    $rootScope.isPlayerOpen = true;
                    $state.go('Toc', params);
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
                toc.loader.showLoader = false;
                toc.error.showError = true;
                toc.error.message = message;
            };

            //$scope.contentPlayer.contentData=};
            toc.getCourseToc = function () {

                toc.loader.showLoader = true;
                toc.loader.loaderMessage = config.MESSAGES.COURSE.TOC.START;
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    if (res && res.responseCode === "OK") {

                        toc.loader.showLoader = false;
                        res.result.content.children = _.sortBy(res.result.content.children, ['index']);
                        toc.getAllContentsFromCourse(res.result.content);
                        if (toc.courseType == "ENROLLED_COURSE") {
                            toc.getContentState();
                        }
                        toc.courseTotal = toc.courseTotal || toc.playList.length;
                        toc.courseParams.lastReadContentId ? toc.itemIndex = toc.playList.indexOf(toc.courseParams.lastReadContentId) : 0;
                        toc.courseHierachy = res.result.content;
                        $rootScope.courseName = toc.courseHierachy.name;
                        $rootScope.isTocPage ? toc.applyAccordion() : toc.courseProgress=0;
                    } else {
                        toc.showError(config.MESSAGES.COURSE.TOC.ERROR);
                    }
                }, function (err) {
                    toc.showError(config.MESSAGES.COURSE.TOC.ERROR);
                });
            };
            toc.getContentState = function () {
                var req = {
                    "request": {
                        "userId": toc.uid,
                        "courseIds": [toc.courseId],
                        "contentIds": toc.playList
                    }
                };
                contentStateService.getContentsState(req, function (content_res) {
                    toc.contentStatusList = toc.fetchObjectAttributeAsArrayOrObject(content_res, "contentId", "status", true);
                    toc.courseProgress = 0;
                    angular.forEach(toc.contentStatusList, function (status, id) {
                        if (id && toc.playList.indexOf(id) >= 0) {
                            toc.contentStatusList[id] = toc.statusClass[status] || toc.statusClass[0];
                            (status == 2) ? toc.courseProgress += 1 : 0;
                        }
                    });
                    if (toc.courseProgress > toc.courseParams.progress || !toc.courseParams.progress) {
                        $timeout(function () {
                            var progPercent = parseInt(toc.courseProgress * 100 / toc.courseTotal);
                            $('#tocProgress').progress({percent: progPercent});
                        }, 100);
                        var curCourse = _.find($rootScope.enrolledCourses, {courseId: toc.courseId});
                        if (curCourse) {
                            $rootScope.enrolledCourseIds[toc.courseId].lastReadContentId = curCourse.lastReadContentId = toc.playList[toc.itemIndex];
                            $rootScope.enrolledCourseIds[toc.courseId].progress = curCourse.progress = toc.courseProgress;
                        }
                    }
                    //update status of content items
                    toc.playList.forEach(function (item, index) {
                        if (index >= 0 && toc.contentStatusList[toc.playList[index]]) {
                            $('#node' + index).find('.icon').removeClass('grey blue green').addClass(toc.contentStatusList[toc.playList[index]]);

                        }
                    });

                });
            };
            toc.expandMe = function (index, item) {
                if (item && item.mimeType !== "application/vnd.ekstep.content-collection") {
                    toc.itemIndex = toc.playList.indexOf(item.identifier);
                    toc.playPlaylistContent(item.identifier, '');
                } else {
                    var accIcon = $(index.target).closest('.title').find('i');
                    toc.updateIcon(accIcon, !$(accIcon).hasClass('plus'));
                }
            };
            toc.updateIcon = function (icon, isPlus) {
                isPlus ? $(icon).addClass('plus').removeClass('minus') : $(icon).addClass('minus').removeClass('plus');
            }
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
                toc.previousPlayListName = (toc.itemIndex - 1) > -1 ? toc.playListContent[toc.itemIndex - 1]['name'] : "No content to play";
                toc.nextPlayListName = (toc.itemIndex + 1) < toc.playList.length ? toc.playListContent[toc.itemIndex + 1]['name'] : "No content to play";
                if (toc.courseType === "ENROLLED_COURSE") {
                    $rootScope.contentId = contentId;
                    $scope.contentPlayer.contentData = toc.playListContent[toc.itemIndex];
                    $scope.contentPlayer.isContentPlayerEnabled = true;
                }
                toc.hashId = ('tocPlayer/' + contentId + '/' + toc.itemIndex);
                toc.scrollToPlayer();
                toc.updateBreadCrumbs();
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
                } else {
                    angular.forEach(contentData.children, function (child, item) {
                        toc.getAllContentsFromCourse(contentData.children[item]);
                    });
                }
                return toc.playList;
            }

            toc.getTreeData = function (contentData, parent) {

                if (contentData.mimeType != 'application/vnd.ekstep.content-collection') {
                    parent.push({
                        title: "<span id='node" + toc.treeKey + "' class='padded'><i class='" + toc.getContentIcon(contentData.mimeType) + " " + (toc.contentStatusList[contentData.identifier] ? toc.contentStatusList[contentData.identifier] : 'grey') + "'></i>" + contentData.name + "</span><button id='resume-button-" + toc.treeKey + "' class='toc-resume-button contentVisibility-hidden blue right floated ui button'>RESUME</button",
                        key: toc.treeKey,
                        data: contentData,
                        icon: false
                    });
                    toc.treeKey += 1;

                } else {
                    parent.push({
                        title: "<span class='courseAccordianDesc'><i class='" + toc.getContentIcon(contentData.mimeType) + "'></i>" + contentData.name + "</span>",
                        key: -1,
                        children: [],
                        icon: false
                    })
                    angular.forEach(contentData.children, function (child, item) {
                        toc.getTreeData(contentData.children[item], parent[parent.length - 1]['children']);
                    });
                }
                return toc.fancyTree;
            }


            toc.getContentClass = function (contentId) {

                var statusClass = {
                    0: 'grey',
                    1: 'blue',
                    2: 'green'
                };
                if (toc.courseType == 'ENROLLED_COURSE') {
                    return statusClass[toc.contentStatusList[contentId] || 0];
                }
                return 0;

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
                    "application/vnd.ekstep.content-collection": "large folder open outline icon grey icon"


                };
                return contentIcons[contentMimeType];
            }
            toc.applyAccordion = function () {

                $timeout(function () {

                    $('.ui.accordion').accordion({
                        exclusive: false
                    });
                    if (toc.courseType == "ENROLLED_COURSE" && toc.playList.length > 0 && toc.lectureView == 'no') {

                        toc.resumeCourse();

                    }
                    var progPercent = parseInt(toc.courseProgress * 100 / toc.courseTotal);
                    $('.toc-resume-button').addClass('contentVisibility-hidden');
                    $('#tocProgress').progress({percent: progPercent});
                }, 100);
            }
            toc.constructTree = function (pos, tocData) {
                toc.fancyTree = [];
                angular.forEach(tocData, function (item, child) {
                    toc.getTreeData(item, toc.fancyTree);
                });
                toc.initializeFancyTree("#FT_" + pos, toc.fancyTree);
            }
            toc.initializeFancyTree = function (id, src) {
                $timeout(function () {
                    $(id).fancytree({
                        checkbox: false,
                        source: src,
                        click: function (event, data) {
                            var nodeData = data.node;
                            if (nodeData.key != -1) {
                                toc.expandMe(nodeData.key, nodeData.data);
                            }
                        },
                        create: function (event, data) {
                            (toc.courseType == 'OTHER_COURSE') ? $(".fancytree-title").addClass('noselect') : '';
                        }
                    });
                    $(".fancytree-container").addClass("fancytree-connectors");
                }, 0);



            }


            toc.fetchObjectAttributeAsArrayOrObject = function (objArray, objKey, valueKey, isKeyBasedObj) {
                var attributeArr = (isKeyBasedObj == true) ? {} : [];

                for (var obj in objArray) {
                    if (objArray[obj] != undefined) {
                        if (isKeyBasedObj) {
                            attributeArr[objArray[obj][objKey]] = valueKey ? objArray[obj][valueKey] : objArray[obj];
                        } else {
                            attributeArr.push(objArray[obj][objKey]);
                        }
                    }
                }
                return attributeArr;
            };
            $scope.$watch('contentPlayer.isContentPlayerEnabled', function (newValue, oldValue) {
                $('.toc-resume-button').addClass('contentVisibility-hidden');
                if (oldValue == true && newValue == false) {
                    toc.hashId = '';
                    $location.hash(toc.hashId);
                    toc.getContentState();
                    $('.fancy-tree-container').each(function () {
                        var treeId = this.id;
                        $(this).fancytree("getTree").visit(function (node) {
                            if (node.key == toc.itemIndex) {
                                $timeout(function () {
                                    if (!$('#' + treeId).closest(".accordion").find('.title').hasClass('active')) {
                                        $('#' + treeId).closest(".accordion").find('.title').trigger('click');
                                    }
                                    node.setActive(false);
                                }, 10);
                                node.setExpanded(true);
                                node.setActive(true);
                                node.setFocus(false);
                                $('#resume-button-' + toc.itemIndex).removeClass('contentVisibility-hidden');

                            } else
                            {
                                node.setActive(false);
                                node.setFocus(false);
                            }
                        });

                    });
                    toc.updateBreadCrumbs();
                }


            });

            //this logic is for breadcrumbs in this page only.dont use for other pages breadcrumbs instead use state route breadcrumbs logic
            toc.updateBreadCrumbs = function () {
                $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Courses', link: 'learn'}, {'name': toc.courseName, 'link': '/toc/' + toc.tocId + '/' + toc.courseId + '/' + toc.lectureView}];
                if ($scope.contentPlayer.isContentPlayerEnabled) {
                    var curContentName = toc.playListContent[toc.itemIndex].name;
                    toc.courseParams.contentName = curContentName;
                    toc.courseParams.contentId = toc.playList[toc.itemIndex];
                    toc.courseParams.contentIndex = toc.itemIndex;
                    var contentCrumb = {name: curContentName, link: ''};
                    sessionService.setSessionData('COURSE_PARAMS', toc.courseParams);
                    $rootScope.breadCrumbsData[3] ? $rootScope.breadCrumbsData[3] = contentCrumb : $rootScope.breadCrumbsData.push(contentCrumb);
                }
            }


            toc.init = function () {
                toc.lectureView = toc.courseParams.lectureView;
                toc.courseId = toc.courseParams.courseId;
                toc.courseType = ($rootScope.enrolledCourseIds[toc.courseId]) ? 'ENROLLED_COURSE' : toc.courseParams.courseType;
                toc.courseProgress = toc.courseParams.progress;
                toc.courseTotal = toc.courseParams.total;
                toc.tocId = toc.courseParams.tocId;
                toc.courseName = toc.courseParams.courseName;
                toc.contentStatusList = {};
                //console.log($stateParams);
                $scope.enableCloseButton = (toc.lectureView === 'yes') ? 'false' : 'true';
                //console.log($rootScope.contentDetails);
                toc.nightMode = true;
                toc.itemIndex = parseInt($stateParams.contentIndex) || 0;
                $scope.contentPlayer = {
                    isContentPlayerEnabled: false

                };
                toc.loader = {
                    showLoader: false,
                    loaderMessage: '',
                    enrollLoader: false
                };
                toc.error = {
                    showError: false,
                    message: '',
                    messageType: 'error',
                    isClose: false,
                    showEnrollError: false
                };
                toc.playItemIndex = undefined;
                toc.getCourseToc();
                contentStateService.init();
            }

            toc.loadData = function () {
                if (toc.courseParams.courseId != $stateParams.courseId) {
                    //if both courseIds are different call to get course by id API and update data(to be implemented with progress and status params in API side)
                } else {
                    toc.init();
                }
            }
        });

'use strict';

angular.module('playerApp')
  .controller('courseScheduleCtrl',
    ['courseService', 'sessionService', '$stateParams', '$state', '$timeout', '$scope', '$rootScope',
        'toasterService', '$location', '$anchorScroll', 'contentStateService', '$window', 'batchService',
        'dataService', 'permissionsService',
        function (courseService, sessionService, $stateParams, $state, $timeout, $scope, $rootScope,
        toasterService, $location, $anchorScroll, contentStateService, $window, batchService, dataService, permissionsService) {
            var toc = this;
            toc.playList = [];
            toc.playListContent = [];
            toc.loading = false;
            toc.courseParams = sessionService.getSessionData('COURSE_PARAMS');
            $scope.contentList = [];
            toc.contentList = [];
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
            toc.showCourseDashboard = false;
            toc.isCourseMentor = false;
            var currentUserRoles = permissionsService.getCurrentUserRoles();
            if(currentUserRoles.indexOf("COURSE_MENTOR") !== -1) {
                toc.isCourseMentor = true;
            }

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
                toc.loader.loaderMessage = $rootScope.errorMessages.Courses.ENROLL.START;
                courseService.enrollUserToCourse(req)
           .then(function (successResponse) {
               toc.loader.enrollLoader = false;
               if (successResponse && successResponse.responseCode === 'OK') {
                   $window.location.reload();
               } else {
                   toc.error.showEnrollError = true;
                   toc.error.message = $rootScope.errorMessages.Courses.ENROLL.ERROR;
                   $timeout(function () {
                       toc.error.showEnrollError = false;
                   }, 3000);
               }
           }).catch(function () {
               toc.error.showEnrollError = true;
               toc.error.message = $rootScope.errorMessages.Courses.ENROLL.ERROR;
           });
            };

            toc.resumeCourse = function () {
                toc.showCourseDashboard = false;
                if ($rootScope.isTocPage && toc.playContent) {
                    if ($location.hash().indexOf('tocPlayer') < 0) {
          // once last played index is given assign it for now zero
                        $('#course-toc').find('.content').first().addClass('active');
                        toc.playPlaylistContent(toc.playList[toc.itemIndex], '');
                    } else {
                        var currentHash = $location.hash().toString().split('/');
                        toc.itemIndex = parseInt(currentHash[2], 10);
                        toc.playPlaylistContent(currentHash[1], '');
                    }
                } else {
                    var params = sessionService.getSessionData('COURSE_PARAMS');
                    sessionService.setSessionData('COURSE_PARAMS', params);
                    $rootScope.isPlayerOpen = true;
                    $state.go('Toc', params);
                }
            };

            toc.scrollToPlayer = function () {
                $location.hash(toc.hashId);
                $timeout(function () {
                    $anchorScroll();
                }, 500);
            };
            toc.showError = function (message) {
                toc.loader.showLoader = false;
                toc.error.showError = true;
                toc.error.message = message;
            };

    // $scope.contentPlayer.contentData=};
            toc.getCourseToc = function () {
                toc.loader = toasterService.loader(''
           , $rootScope.errorMessages.Courses.TOC.START);
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        toc.loader.showLoader = false;
                        res.result.content.children = _.sortBy(
                     res.result.content.children, ['index']);
                        toc.getAllContentsFromCourse(res.result.content);
                        toc.contentCountByType = _.countBy(
                     toc.playListContent, 'mimeType');
                        if (toc.courseType === 'ENROLLED_COURSE') {
                            toc.getContentState();
                        }
                        toc.courseTotal = toc.courseTotal || toc.playList.length;
                        if (toc.courseParams.lastReadContentId) {
                            toc.itemIndex = toc.playList.indexOf(
                         toc.courseParams.lastReadContentId
                        );
                        }

                        toc.courseHierachy = res.result.content;
                        $rootScope.courseName = toc.courseHierachy.name;
                        if ($rootScope.isTocPage) {
                            toc.applyAccordion();
                        }
                    } else {
                        toc.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.Courses.TOC.ERROR);
                    }
                }, function () {
                    toc.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.Courses.TOC.ERROR);
                });
            };
            toc.getContentState = function () {
                var req = {
                    request: {
                        userId: toc.uid,
                        courseIds: [toc.courseId],
                        contentIds: toc.playList
                    }
                };
                contentStateService.getContentsState(req, function (contentRes) {
                    toc.contentStatusList = toc.fetchObjectAttributeAsArrayOrObject(
                 contentRes, 'contentId', 'status', true
                );
                    toc.courseProgress = 0;
                    angular.forEach(toc.contentStatusList, function (status, id) {
                        if (id && toc.playList.indexOf(id) >= 0) {
                            toc.contentStatusList[id] = toc.statusClass[status]
                       || toc.statusClass[0];
                            if (status === 2) {
                                toc.courseProgress += 1;
                            }
                        }
                    });

                    toc.updateCourseProgress();
                });
            };

            toc.updateCourseProgress = function () {
                if (toc.courseProgress >= (toc.courseParams.progress || 0)) {
                    toc.courseProgress = toc.courseProgress || toc.courseParams.progress;
                    $timeout(function () {
                        var progPercent = parseInt(
                         toc.courseProgress * 100 / toc.courseTotal, 10
                        );
                        $('#tocProgress').progress({ percent: progPercent });
                    }, 500);
                    var curCourse = _.find(
                     $rootScope.enrolledCourses, { courseId: toc.courseId }
                    );
                    if (curCourse) {
                        curCourse.lastReadContentId =
                       toc.playList[toc.itemIndex];
                        $rootScope.enrolledCourseIds[toc.courseId]
                       .lastReadContentId = curCourse.lastReadContentId;
                        curCourse.progress = toc.courseProgress;
                        $rootScope.enrolledCourseIds[toc.courseId]
                       .progress = curCourse.progress;
                    }
                }

                        // update status of content items
                toc.playList.forEach(function (item, index) {
                 if (index >= 0 && toc.contentStatusList[toc.playList[index]]) {
                        $('#node' + index).find('img').attr('src',
                            toc.getContentIcon(toc.playListContent[index].mimeType,toc.contentStatusList[toc.playList[index]]));
                    }

                });
            };

            toc.expandMe = function (index, item) {
                if (item && item.mimeType
            && item.mimeType !== 'application/vnd.ekstep.content-collection') {
                    toc.itemIndex = toc.playList.indexOf(item.identifier);
                    if (toc.playContent) {
                        toc.playPlaylistContent(item.identifier, '');
                    }
                } else {
                    var accIcon = $(index.target).closest('.title').find('i');
                    toc.updateIcon(accIcon, !$(accIcon).hasClass('plus'));
                }
            };
            toc.updateIcon = function (icon, isPlus) {
                if (isPlus) {
                    $(icon).addClass('plus').removeClass('minus');
                } else {
                    $(icon).addClass('minus').removeClass('plus');
                }
            };
            toc.checkAndAddToPlaylist = function (item) {
                if (item.mimeType !== 'application/vnd.ekstep.content-collection'
             && toc.playList.indexOf(item.identifier) === -1) {
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
                toc.prevPlaylistItem = (toc.itemIndex - 1) > -1
           ? toc.playList[toc.itemIndex - 1] : -1;
                toc.nextPlaylistItem = (toc.itemIndex + 1) <= toc.playList.length
           ? toc.playList[toc.itemIndex + 1] : -1;
                toc.previousPlayListName = (toc.itemIndex - 1) > -1
           ? toc.playListContent[toc.itemIndex - 1].name : 'No content to play';
                toc.nextPlayListName = (toc.itemIndex + 1) < toc.playList.length
           ? toc.playListContent[toc.itemIndex + 1].name : 'No content to play';
                if (toc.courseType === 'ENROLLED_COURSE' && toc.courseHierachy.status !== 'Flagged') {
                    $rootScope.contentId = contentId;
                    $scope.contentPlayer.contentData = toc.playListContent[
                 toc.itemIndex
                ];
                    $scope.contentPlayer.isContentPlayerEnabled = true;
                }
                toc.hashId = ('tocPlayer/' + contentId + '/' + toc.itemIndex);
                toc.scrollToPlayer();
                toc.updateBreadCrumbs();
            };

            toc.getAllChildrenCount = function (index) {
                var childCount = toc.getChildNodeCount(
             toc.courseHierachy.children[index], 0);
                return childCount;
            };
            toc.getChildNodeCount = function (obj, cnt) {
                if (obj.children === undefined || obj.children.length === 0) {
                    return cnt;
                }
                cnt += obj.children.length;
                obj.children.forEach(function (c) {
                    var r = toc.getChildNodeCount(c, cnt);
                    cnt = parseInt(r, 10);
                });

                return cnt;
            };
            toc.getAllContentsFromCourse = function (contentData) {
                if (contentData.mimeType !==
             'application/vnd.ekstep.content-collection') {
                    toc.playList.push(contentData.identifier);
                    toc.playListContent.push(contentData);
                } else {
                    angular.forEach(contentData.children, function (child, item) {
                        toc.getAllContentsFromCourse(contentData.children[item]);
                    });
                }
                return toc.playList;
            };

                toc.getTreeData = function (contentData, parent) {
                if (contentData.mimeType
            !== 'application/vnd.ekstep.content-collection') {
                    parent.push({
                        title: '<span id="node' + toc.treeKey + '" class="padded">' +
                    '<img src="' + toc.getContentIcon(contentData.mimeType,(toc.contentStatusList[contentData.identifier]
                      ? toc.contentStatusList[contentData.identifier] : ''))
                    + '" class="tocCourseStructureImg">' + contentData.name
                      + '</span><button id="resume-button-'
                      + toc.treeKey
                      + '" class="toc-resume-button contentVisibility-hidden' +
                      ' blue right floated ui small button">RESUME</button',
                        key: toc.treeKey,
                        data: contentData,
                        icon: false
                    });
                    toc.treeKey += 1;
                } else {
                    parent.push({
                        title: '<span class="courseAccordianDesc">'
                   + '<i class="' + toc.getContentIcon(contentData.mimeType)
                   + '"></i>' + contentData.name + '</span>',
                        key: -1,
                        children: [],
                        icon: false
                    });
                    angular.forEach(contentData.children, function (child, item) {
                        toc.getTreeData(contentData.children[item]
                    , parent[parent.length - 1].children);
                    });
                }
                return toc.fancyTree;
            };

          toc.getContentClass = function (contentId) {
                var statusClass = {
                    0: '',
                    1: 'blue',
                    2: 'green'
                };
                if (toc.courseType === 'ENROLLED_COURSE') {
                    return statusClass[toc.contentStatusList[contentId] || 0];
                }
                return 0;
            };

               toc.getContentIcon = function (contentMimeType,stsClass) {
                stsClass=stsClass||'';
                var contentIcons = {
                    'application/pdf': '/images/pdf'+stsClass+'.png',
                    'video/mp4': '/images/video'+stsClass+'.png',
                    'video/webm': '/images/video'+stsClass+'.png',
                    'video/x-youtube':  '/images/video'+stsClass+'.png',
                    'video/youtube':  '/images/video'+stsClass+'.png',
                    'application/vnd.ekstep.html-archive':  '/images/app'+stsClass+'.png',
                    'application/vnd.ekstep.ecml-archive': '/images/app'+stsClass+'.png',
                    'application/epub': '/images/app'+stsClass+'.png',
                    'application/vnd.ekstep.h5p-archive':  '/images/video'+stsClass+'.png',

                    'application/vnd.ekstep.content-collection': 'large folder'
               + ' open outline icon grey icon'

                };
                return contentIcons[contentMimeType];
            };
            toc.applyAccordion = function () {
                $timeout(function () {
                    $('.ui.accordion').accordion({
                        exclusive: false
                    });
                    if (toc.courseType === 'ENROLLED_COURSE' && toc.playList.length > 0
                        && toc.lectureView === 'no' && toc.courseHierachy.status !== 'Flagged') {
                        toc.resumeCourse();
                    }
                    var progPercent = parseInt(
                 toc.courseProgress * 100 / toc.courseTotal, 0
                );
                    $('.toc-resume-button').addClass('contentVisibility-hidden');
                    $('#tocProgress').progress({ percent: progPercent });
                }, 100);
            };
            toc.constructTree = function (pos, tocData) {
                toc.fancyTree = [];
                angular.forEach(tocData, function (item, child) {
                    toc.getTreeData(item, toc.fancyTree);
                });
                toc.initializeFancyTree('#FT_' + pos, toc.fancyTree);
            };
            toc.initializeFancyTree = function (id, src) {
                $timeout(function () {
                    $(id).fancytree({
                        checkbox: false,
                        source: src,
                        click: function (event, data) {
                            var nodeData = data.node;
                            if (nodeData.key !== -1) {
                                toc.expandMe(nodeData.key, nodeData.data);
                            }
                            if (toc.playContent == false) {
                                return false;
                            }
                        },
                        create: function (event, data) {
                            if (toc.courseType === 'OTHER_COURSE') {
                                $('.fancytree-title').addClass('noselect');
                            }
                        }
                    });
                    $('.fancytree-container').addClass('fancytree-connectors');
                    if (toc.playContent == false) {
                        $(id).find('.fancytree-title').addClass('cursor-pointerText');
                    }
                }, 0);
            };

            toc.fetchObjectAttributeAsArrayOrObject
       = function (objArray, objKey, valueKey, isKeyBasedObj) {
           var attributeArr = (isKeyBasedObj === true) ? {} : [];
           for (var obj in objArray) {
               if (objArray[obj] !== undefined) {
                   if (isKeyBasedObj) {
                       attributeArr[objArray[obj][objKey]] = valueKey
                       ? objArray[obj][valueKey] : objArray[obj];
                   } else {
                       attributeArr.push(objArray[obj][objKey]);
                   }
               }
           }
           return attributeArr;
       };
            $scope.$watch('contentPlayer.isContentPlayerEnabled'
       , function (newValue, oldValue) {
           $('.toc-resume-button').addClass('contentVisibility-hidden');
           if (oldValue === true && newValue === false) {
               toc.hashId = '';
               $location.hash(toc.hashId);
               toc.getContentState();
               $('.fancy-tree-container').each(function () {
                   var treeId = this.id;
                   $(this).fancytree('getTree').visit(function (node) {
                       if (node.key === toc.itemIndex.toString()) {
                           $timeout(function () {
                               if (!$('#' + treeId).closest('.accordion')
                                .find('.title').hasClass('active')) {
                                   $('#' + treeId).closest('.accordion')
                                   .find('.title').trigger('click');
                               }
                               node.setActive(false);
                           }, 10);
                           node.setExpanded(true);
                           node.setActive(true);
                           node.setFocus(false);
                           $('#resume-button-' + toc.itemIndex)
                           .removeClass('contentVisibility-hidden');
                       } else {
                           node.setActive(false);
                           node.setFocus(false);
                       }
                   });
               });
               toc.updateBreadCrumbs();
           }
       });

    // this logic is for breadcrumbs in this page only.
    // dont use for other pages breadcrumbs
    // instead use state route breadcrumbs logic
            toc.updateBreadCrumbs = function () {
                $rootScope.breadCrumbsData = [
             { name: 'Home', link: 'home' },
             { name: 'Courses', link: 'learn' },
                    { name: toc.courseName,
                        link: '/course/'
                   + '/' + toc.courseId + '/' + toc.lectureView }];
                if ($scope.contentPlayer.isContentPlayerEnabled) {
                    var curContentName = toc.playListContent[toc.itemIndex].name;
                    toc.courseParams.contentName = curContentName;
                    toc.courseParams.contentId = toc.playList[toc.itemIndex];
                    toc.courseParams.contentIndex = toc.itemIndex;
                    var contentCrumb = { name: curContentName, link: '' };
                    sessionService.setSessionData('COURSE_PARAMS', toc.courseParams);
                    if ($rootScope.breadCrumbsData[3]) {
                        $rootScope.breadCrumbsData[3] = contentCrumb;
                    } else {
                        $rootScope.breadCrumbsData.push(contentCrumb);
                    }
                }
            };

            toc.init = function () {
                toc.lectureView = toc.courseParams.lectureView;
                toc.courseId = toc.courseParams.courseId;
                toc.courseType = ($rootScope.enrolledCourseIds[toc.courseId])
           ? 'ENROLLED_COURSE' : toc.courseParams.courseType;
                toc.courseProgress = toc.courseParams.progress;
                toc.courseTotal = toc.courseParams.total;
                toc.courseName = toc.courseParams.courseName;
                toc.contentStatusList = {};
                $scope.enableCloseButton = (toc.lectureView === 'yes')
            ? 'false' : 'true';
                toc.nightMode = true;
                toc.itemIndex = parseInt($stateParams.contentIndex, 0) || 0;
                toc.playContent = false;
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
                toc.showBatchCardList();
            };

            toc.loadData = function () {
                if (toc.courseParams.courseId !== $stateParams.courseId) {
        // if both courseIds are different call
        // to get course by id API and update data
        // (to be implemented with progress and status params in API side)
                } else {
                    toc.init();
                }
            };

            toc.batchCardShow = true;
            toc.batchDetailsShow = false;
            toc.showBatchCardList = function () {
                var enroledCourses = $rootScope.enrolledCourses;
                var isEnroled = _.find($rootScope.enrolledCourses, function (o) {
                    return o.courseId === toc.courseId;
                });
                if (!_.isUndefined(isEnroled)) {
                    toc.batchCardShow = false;
                    batchService.getBatchDetails({ batchId: isEnroled.batchId }).then(function (response) {
                        if (response && response.responseCode === 'OK' && !_.isEmpty(response.result.response)) {
                            toc.batchDetailsShow = true;
                            toc.selectedBatchInfo = response.result.response;
                            $rootScope.batchHashTagId = response.result.response.hashtagid;
                            toc.selectedParticipants = _.isUndefined(toc.selectedBatchInfo.participant) ? 0 : _.keys(toc.selectedBatchInfo.participant).length;
                            toc.batchStatus = toc.selectedBatchInfo.status;
                            if (toc.batchStatus && toc.batchStatus > 0) {
                                toc.playContent = true;
                                if (toc.batchStatus < 2 && !dataService.getData('contentStateInit') && $rootScope.isTocPage) {
                                    contentStateService.init();
                                    dataService.setData('contentStateInit', true);
                                    dataService.setData('isTrackingEnabled', true);
                                }
                            }
                        }
                    }).catch(function () {
                        toasterService.error($rootScope.errorMessages.BATCH.GET.FAILED);
                    });
                }
            };

            /**
             * @Function initDropdownValue
             * @Description - values - resume course and view course dashboard
             * @return  {[type]}  [description]
             */
            toc.initDropdownValues = function (){
                $('#courseDropdownValues').dropdown();
            };

            // Restore default values onAfterUser leave current state
            $('#courseDropdownValues').dropdown('restore defaults');
        }]);

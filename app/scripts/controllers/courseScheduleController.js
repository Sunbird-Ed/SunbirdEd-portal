angular.module('playerApp')
        .controller('courseScheduleCtrl', function (courseService, $timeout, $scope, $sce, $rootScope, $sessionStorage, $stateParams) {
            var toc = this;
            toc.playList = [];
            toc.playListContent = [];
            toc.loading = false;
            toc.lectureView = $stateParams.lectureView;
            toc.courseId ='do_11225144311893196816';// $stateParams.courseId;
            $scope.enableCloseButton = (toc.lectureView == 'yes') ? 'false' : 'true';
            $rootScope.sideMenuData = [{
                    "icon": "",
                    "name": "COURSE SCHEDULE",
                    "children": [],
                    "link": "/toc/" + toc.courseId + "/no"
                },
                {
                    "icon": "",
                    "name": "LECTURE VIEW",
                    "children": [],
                    "link": "/toc/" + toc.courseId + "/yes"
                },
                {
                    "icon": "",
                    "name": "NOTES",
                    "children": [],
                    "link": "#"
                }
            ];
            $scope.contentPlayer = {
                isContentPlayerEnabled: false,

            };

            toc.showError = function (message) {

                toc.messageClass = "red";
                toc.showMetaLoader = false;
                toc.message = message;
                $timeout(function () {
                    toc.showDimmer = false;
                }, 2000);
            }


            //$scope.contentPlayer.contentData=};
            toc.getCourseToc = function () {

                toc.showMetaLoader = toc.showDimmer = true;
                toc.messageType = "";
                toc.message = "Loading Course schedule, Please wait...";
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        toc.courseHierachy = res.result.content;
                        toc.applyAccordion();
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
            }
            toc.getCourseToc();
            toc.expandMe = function ($event, item) {
                if (item.mimeType != "application/vnd.ekstep.content-collection")
                {
                    toc.itemIndex = $($event.target).closest('.playlist-content').index('.playlist-content');
                    toc.playPlaylistContent($($event.target).closest('.playlist-content').attr('name'), '');

                }
            };

            toc.checkAndAddToPlaylist = function (item) {
                if (item.mimeType != "application/vnd.ekstep.content-collection" && toc.playList.indexOf(item.identifier) == -1)
                {
                    // console.log($scope.counter);
                    toc.playList.push(item.identifier);
                    toc.playListContent.push(item);
                }
            }



            toc.playPlaylistContent = function (contentId, trigger) {

                var curItemIndex = toc.playList.indexOf(contentId);
                if (trigger == 'prev') {
                    toc.itemIndex -= 1;
                } else if (trigger == 'next') {
                    toc.itemIndex += 1;
                }
                toc.prevPlaylistItem = (toc.itemIndex - 1) > -1 ? $('.playlist-content:eq(' + (toc.itemIndex - 1) + ')').attr('name') : -1;
                toc.nextPlaylistItem = (toc.itemIndex + 1) <= toc.playList.length ? $('.playlist-content:eq(' + (toc.itemIndex + 1) + ')').attr('name') : -1;
                $scope.contentPlayer.contentData = toc.playListContent[curItemIndex];
                $scope.contentPlayer.isContentPlayerEnabled = true;
            }

            toc.getAllChildrenCount = function (index) {
                var childCount = toc.getChildNodeCount(toc.courseHierachy.children[index], 0);
                return childCount;
            }
            toc.getChildNodeCount = function (obj, cnt) {


                if (obj.children == undefined || obj.children.length == 0)
                {
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

            toc.getContentClass = function (contentMimeType) {
                if (contentMimeType == 'application/vnd.ekstep.content-collection') {
                    return 'ui two column padded grid';
                } else
                {
                    return 'ui two column padded grid playlist-content';
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
                    }
                    $('.ui.accordion')
                            .accordion({
                                selector: {
                                    trigger: '.title'
                                }
                            });
                }, 0);
            }


        });

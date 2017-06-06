angular.module('playerApp')
        .controller('courseScheduleCtrl', function (courseService, $timeout, $scope, $sce, $sessionStorage, $stateParams) {
            var toc = this;
            toc.playList = [];
            toc.playListContent = [];
            toc.loading = false;
            $scope.contentPlayer = {
                isContentPlayerEnabled: false,

            };
            //$scope.contentPlayer.contentData=};
            toc.getCourseToc = function () {
                toc.courseId = $stateParams.courseId;
                toc.loading = true;
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    toc.loading = false;
                    toc.courseHierachy = res.result.content;
                });
            }
            toc.getCourseToc();
            toc.expandMe = function ($event, item) {

                if (item.mimeType == "application/vnd.ekstep.content-collection")
                {
                    if (!$($event.target).closest("li").find('.toc-list-sub-menu').first().hasClass('active'))
                    {
                        $($event.target).closest("li").find('.toc-list-sub-menu').first().show(200).addClass('active');
                    } else
                    {
                        $($event.target).closest("li").find('.toc-list-sub-menu').first().hide(200).removeClass('active');
                    }
                } else
                {
                    var itemIndex = $($event.target).closest('.playlist-content').index('.playlist-content');

                    toc.playPlaylistContent(itemIndex);

                }
            };

            toc.checkAndAddToPlaylist = function (item) {
                if (item.mimeType != "application/vnd.ekstep.content-collection")
                {
                    // console.log($scope.counter);
                    toc.playList.push(item.identifier);
                    toc.playListContent.push(item);
                    $scope.counter = toc.playList.length - 1;


                }
            }



            toc.playPlaylistContent = function (itemIndex) {
                var curItemIndex = itemIndex;
                toc.prevPlaylistItem = ((curItemIndex - 1) >= 0 ? curItemIndex - 1 : -1);
                console.log(toc.prevPlaylistItem);
                toc.nextPlaylistItem = ((curItemIndex + 1) < toc.playList.length ? curItemIndex + 1 : -1);
                $scope.contentPlayer.contentData = toc.playListContent[curItemIndex];
                $scope.contentPlayer.isContentPlayerEnabled = true;


                $timeout(function () {
//                    $scope.contentPlayer.isContentPlayerEnabled = true;

                }, 0);
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
                    return 'ui two column padded grid block-border-bottom';
                } else
                {
                    return 'ui two column padded grid block-border-bottom playlist-content';
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


        });

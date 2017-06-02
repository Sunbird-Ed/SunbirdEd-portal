angular.module('playerApp')
        .controller('courseScheduleCtrl', function (courseService, $timeout, $scope, $sce, $sessionStorage, $stateParams) {
            var toc = this;
            $scope.contentPlayer = {
                isContentPlayerEnabled: false
            };
            toc.getCourseToc = function () {
                toc.courseId = $stateParams.courseId;
                courseService.courseHierarchy(toc.courseId).then(function (res) {
                    toc.courseHierachy = res.result.content;
                });
            }
            toc.getCourseToc();
            toc.expandMe = function ($event, item) {
               
                if (item.mimeType == "application/vnd.ekstep.content-collection")
                {
                    if (!$($event.target).closest("li").find('.toc-list-sub-menu').first().hasClass('active'))
                    {
                        $($event.target).closest("li").find('.toc-list-sub-menu').first().show(300).addClass('active');
                    } else
                    {
                        $($event.target).closest("li").find('.toc-list-sub-menu').first().hide(300).removeClass('active');
                    }
                } else
                {
                    debugger;
                    $scope.contentPlayer.isContentPlayerEnabled=true;
                    $scope.contentPlayer.contentData = item;
                }
            };
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
            toc.getContentIcon = function (contentMimeType) {
                var contentIcons = {
                    "application/pdf": "file pdf outline icon",
                    "image/jpeg": "file image outline icon",
                    "image/jpg": "file image outline icon",
                    "image/png": "file image outline icon",
                    "video/mp4": "file video outline icon",
                    "video/ogg": "file video outline icon",
                    "video/youtube": "youtube square icon",
                    "application/vnd.ekstep.html-archive": "html5 icon",
                    "application/vnd.ekstep.ecml-archive": "file archive outline icon",
                    "application/vnd.ekstep.content-collection": "ui large book icon"


                };
                return contentIcons[contentMimeType];
            }


        });

'use strict'

angular.module('playerApp')
  .controller('courseScheduleCtrl', ['$rootScope', '$stateParams', 'courseService', 'toasterService',
    '$timeout', 'contentStateService', '$scope', '$location', 'batchService', 'dataService', 'sessionService',
    '$anchorScroll', 'permissionsService', '$state', 'telemetryService',
    function ($rootScope, $stateParams, courseService, toasterService, $timeout, contentStateService,
      $scope, $location, batchService, dataService, sessionService, $anchorScroll, permissionsService,
      $state, telemetryService) {
      var toc = this

      toc.getCourseToc = function () {
        toc.loader = toasterService.loader('', $rootScope.messages.stmsg.m0003)
        courseService.courseHierarchy(toc.courseId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            if (res.result.content.status === 'Live' || res.result.content.status === 'Unlisted' ||
              res.result.content.status === 'Flagged') {
              res.result.content.children = _.sortBy(res.result.content.children, ['index'])
              // fetch all avaliable contents from course data
              toc.courseContents = toc.getCourseContents(res.result.content, [])
              toc.courseTotal = toc.courseContents.length
              toc.version = res.ver
              toc.contentCountByType = _.countBy(toc.courseContents, 'mimeType')
              // if enrolled course then load batch details also after content status
              if (toc.courseType === 'ENROLLED_COURSE') {
                toc.getContentState(function () {
                  toc.courseHierarchy = res.result.content
                  toc.showBatchCardList()
                })
              } else {
                toc.courseHierarchy = res.result.content
              }
            } else {
              toasterService.warning($rootScope.messages.imsg.m0019)
              $state.go('Home')
              return
            }
          } else {
            toasterService.error($rootScope.messages.fmsg.m0003)
          }
          toc.loader.showLoader = false
        }).catch(function () {
          toc.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0003)
        })
      }

      toc.getContentState = function (cb) {
        var req = {
          request: {
            userId: toc.userId,
            courseIds: [toc.courseId],
            contentIds: _.map(toc.courseContents, 'identifier')
          }
        }
        toc.courseProgress = 0
        contentStateService.getContentsState(req, function (contentRes) {
          _.forEach(contentRes, function (content) {
            // object 'contentStatusList' has status of each content
            toc.contentStatusList[content.contentId] = toc.contentStatusClass[content.status] ||
                                    toc.contentStatusClass[0]
            if (content.status === 2) {
              toc.courseProgress += 1
            }
          })
          // go back to called function and proceed
          cb()
        })
      }

      toc.getCourseContents = function (contentData, contentList) {
        if (contentData.mimeType !==
                            'application/vnd.ekstep.content-collection') {
          contentList.push(contentData)
        } else {
          angular.forEach(contentData.children, function (child, item) {
            toc.getCourseContents(contentData.children[item], contentList)
          })
        }
        return contentList
      }

      toc.scrollToPlayer = function () {
        $location.hash(toc.hashId)
        $timeout(function () {
          $anchorScroll('tocPlayer')
        }, 500)
      }

      toc.initTocView = function () {
        $timeout(function () {
          $('.toc-tree-item').fancytree({
            click: function (event, data) {
              if (data.targetType === 'title') {
                data.targetType = 'expander'
                toc.openContent(data.node.key)
              }
            }
          })
          $('.ui.accordion').accordion({
            exclusive: false
          })
          $('.fancytree-container').addClass('fancytree-connectors')

          // open Accordion and collection parent of last played content on close of player
          toc.openRecentCollection()
        }, 100)
      }

      toc.openRecentCollection = function () {
        $timeout(function () {
          if (toc.itemIndex >= 0) {
            $('.fancy-tree-container').each(function () {
              var treeId = this.id
              $(this).fancytree('getTree').visit(function (node) {
                if (node.key === $rootScope.contentId) {
                  $timeout(function () {
                    if (!$('#' + treeId).closest('.accordion')
                      .find('.title').hasClass('active')) {
                      $('#' + treeId).closest('.accordion')
                        .find('.title').trigger('click')
                    }
                    node.setActive(false)
                  }, 10)
                  node.setExpanded(true)
                  node.setActive(true)
                  node.setFocus(false)
                  $('#resume-button-' + toc.itemIndex)
                    .removeClass('contentVisibility-hidden')
                } else {
                  node.setActive(false)
                  node.setFocus(false)
                }
              })
            })
          }
        }, 100)
      }

      toc.getContentIcon = function (contentMimeType, stsClass) {
        stsClass = stsClass || ''
        var contentIcons = {
          'application/pdf': '/common/images/pdf' + stsClass + '.png',
          'video/mp4': '/common/images/video' + stsClass + '.png',
          'video/webm': '/common/images/video' + stsClass + '.png',
          'video/x-youtube': '/common/images/video' + stsClass + '.png',
          'video/youtube': '/common/images/video' + stsClass + '.png',
          'application/vnd.ekstep.html-archive': '/common/images/app' + stsClass + '.png',
          'application/vnd.ekstep.ecml-archive': '/common/images/app' + stsClass + '.png',
          'application/epub': '/common/images/app' + stsClass + '.png',
          'application/vnd.ekstep.h5p-archive': '/common/images/video' + stsClass + '.png',
          'application/vnd.ekstep.content-collection': '/common/images/folder.png'

        }
        return contentIcons[contentMimeType]
      }

      toc.expandAccordion = function ($event) {
        var accIcon = $($event.target).closest('.title').find('i')
        toc.updateAccordionIcon(accIcon, !$(accIcon).hasClass('plus'))
      }

      toc.updateAccordionIcon = function (icon, isPlus) {
        if (isPlus) {
          $(icon).addClass('plus').removeClass('minus')
        } else {
          $(icon).addClass('minus').removeClass('plus')
        }
      }

      toc.updateCourseProgress = function () {
        $timeout(function () {
          var progPercent = parseInt(
            toc.courseProgress * 100 / toc.courseTotal, 10
          )
          $('#tocProgress').progress({
            percent: progPercent
          })
        }, 500)
        var curCourse = _.find(
          $rootScope.enrolledCourses, { courseId: toc.courseId }
        )
        if (curCourse && toc.itemIndex >= 0) {
          curCourse.lastReadContentId =
                                toc.courseContents[toc.itemIndex].identifier
          $rootScope.enrolledCourseIds[toc.courseId]
            .lastReadContentId = curCourse.lastReadContentId
          curCourse.progress = toc.courseProgress
          $rootScope.enrolledCourseIds[toc.courseId]
            .progress = curCourse.progress
        }
      }

      /**
                 * watch the content player status changes and update course progress and breadcrumbs values
                 */
      $scope.$watch('contentPlayer.isContentPlayerEnabled', function (newValue, oldValue) {
        $('.toc-resume-button').addClass('contentVisibility-hidden')
        if (oldValue === true && newValue === false) {
          toc.hashId = ''
          $location.hash(toc.hashId)
          toc.getContentState(function () {
            toc.updateCourseProgress()
          })
          toc.updateBreadCrumbs()
        }
      })

      toc.batchCardShow = true
      toc.batchDetailsShow = false

      toc.showBatchCardList = function () {
        var isEnroled = _.find($rootScope.enrolledCourses, function (o) {
          return o.courseId === toc.courseId
        })
        if (!_.isUndefined(isEnroled)) {
          toc.batchCardShow = false
          batchService.getBatchDetails({
            batchId: isEnroled.batchId
          }).then(function (response) {
            if (response && response.responseCode === 'OK' && !_.isEmpty(response.result.response)) {
              toc.batchDetailsShow = true
              toc.selectedBatchInfo = response.result.response
              $rootScope.batchHashTagId = response.result.response.hashtagid
              toc.selectedParticipants = _.isUndefined(toc.selectedBatchInfo.participant) ? 0
                : _.keys(toc.selectedBatchInfo.participant).length
              toc.batchStatus = toc.selectedBatchInfo.status
              // if batch status is started(1) then only content can be playable
              if (toc.batchStatus && toc.batchStatus > 0 && toc.courseHierarchy.status !== 'Flagged') {
                toc.playContent = true
                // if batch is not completed then content state can be updated
                if (toc.batchStatus < 2 && !dataService.getData('contentStateInit') && $rootScope.isTocPage) {
                  contentStateService.init()
                  dataService.setData('contentStateInit', true)
                  dataService.setData('isTrackingEnabled', true)
                }
                // if current page is course and lecture view is not enabled then resume course from last-read-content
                if ($rootScope.isTocPage && $stateParams.lectureView === 'no') {
                  toc.resumeCourse()
                }
              }
            }
          }).catch(function () {
            toasterService.error($rootScope.messages.fmsg.m0054)
          })
        }
      }

      toc.openContent = function (contentId, trigger) {
        if (toc.playContent === true) {
          // find index of current content from course contents list
          toc.itemIndex = _.findIndex(toc.courseContents, {
            identifier: contentId
          })
          var contentData = toc.courseContents[toc.itemIndex]

          // if content is not collection type then  only its can be played
          if (contentData && contentData.mimeType !== 'application/vnd.ekstep.content-collection') {
            // load details needed for previous and next items in player
            toc.prevPlaylistItem = (toc.itemIndex - 1) > -1
              ? toc.courseContents[toc.itemIndex - 1].identifier : -1
            toc.nextPlaylistItem = (toc.itemIndex + 1) < toc.courseContents.length
              ? toc.courseContents[toc.itemIndex + 1].identifier : -1
            toc.previousPlayListName = (toc.itemIndex - 1) > -1
              ? toc.courseContents[toc.itemIndex - 1].name : 'No content to play'
            toc.nextPlayListName = (toc.itemIndex + 1) < toc.courseContents.length
              ? toc.courseContents[toc.itemIndex + 1].name : 'No content to play'
            $rootScope.contentId = contentId
            $scope.contentPlayer.contentData = contentData
            $scope.contentPlayer.isContentPlayerEnabled = true

            // url hash value which can be used to resume content on page reload
            toc.hashId = ('tocPlayer/' + contentId + '/' + toc.itemIndex)
            // move target focus to player

            // generate telemetry interact event//
            toc.objRollup = [contentId]

            toc.scrollToPlayer()
            toc.updateBreadCrumbs()
          }
        }
      }

      // this logic is for breadcrumbs in this page only.
      // dont use for other pages breadcrumbs
      // instead use state route breadcrumbs logic
      toc.updateBreadCrumbs = function () {
        $rootScope.breadCrumbsData = [{
          name: 'Home',
          link: 'home'
        },
        {
          name: 'Courses',
          link: 'learn'
        },
        {
          name: toc.courseHierarchy.name,
          link: '/course/' +
                                    '/' + toc.courseId + '/' + toc.lectureView
        }
        ]
        if ($scope.contentPlayer.isContentPlayerEnabled) {
          var curContentName = toc.courseContents[toc.itemIndex].name

          // update course params details in state
          toc.courseParams = {}
          toc.courseParams.contentName = curContentName
          toc.courseParams.contentId = $rootScope.contentId
          toc.courseParams.contentIndex = toc.itemIndex
          toc.courseParams.courseId = toc.courseId
          toc.courseParams.lectureView = $stateParams.lectureView
          var contentCrumb = {
            name: curContentName,
            link: ''
          }
          sessionService.setSessionData('COURSE_PARAMS', toc.courseParams)
          // position '3' in breadcrumbs arry points to contentId
          if ($rootScope.breadCrumbsData[3]) {
            $rootScope.breadCrumbsData[3] = contentCrumb
          } else {
            $rootScope.breadCrumbsData.push(contentCrumb)
          }
        }
      }

      toc.resumeCourse = function () {
        toc.showCourseDashboard = false
        if (toc.courseContents.length > 0) {
          // if current page is TOC then load 'contentID' through Url Hash or lastReadContentId value.Else play first content by default
          if ($rootScope.isTocPage) {
            if ($location.hash().indexOf('tocPlayer') < 0) {
              var lastReadContentId = $stateParams.lastReadContentId || toc.courseContents[0].identifier
              toc.openContent(lastReadContentId)
              toc.objRollup = [lastReadContentId]
            } else {
              var currentHash = $location.hash().toString().split('/')
              toc.openContent(currentHash[1])
            }
          } else {
            // else if 'RESUME COURSE' button of course-header is clicked from Notes or other pages goto 'TOC' state and resume player
            var params = sessionService.getSessionData('COURSE_PARAMS')
            sessionService.setSessionData('COURSE_PARAMS', params)
            $state.go('Toc', params)
          }
        }
      }

      toc.init = function () {
        toc.courseId = $stateParams.courseId
        toc.courseType = ($rootScope.enrolledCourseIds[toc.courseId])
          ? 'ENROLLED_COURSE' : 'OTHER_COURSE'
        toc.playContent = false

        toc.contentStatusList = {}// to store status of each content of course by content ID
        toc.contentStatusClass = {
          0: 'grey',
          1: 'blue',
          2: 'green'
        }
        toc.userId = $rootScope.userId
        $scope.contentPlayer = {
          isContentPlayerEnabled: false
        }
        toc.showNoteInLecture = true
        toc.itemIndex = -1
        toc.showCourseDashboard = false
        toc.isCourseMentor = false
        var currentUserRoles = permissionsService.getCurrentUserRoles()
        if (currentUserRoles.indexOf('COURSE_MENTOR') !== -1) {
          toc.isCourseMentor = true
        }
        toc.getCourseToc()
      }

      toc.initDropdownValues = function () {
        $('#courseDropdownValues').dropdown()
      }

      // Restore default values onAfterUser leave current state
      $('#courseDropdownValues').dropdown('restore defaults')

      /* ---telemetry-interact-event-- */
      toc.generateInteractEvent = function (env, objId, objType, objVer, edataId, pageId, objRollup) {
        telemetryService.interactTelemetryData(env, objId, objType, objVer, edataId, pageId, objRollup)
      }
    }
  ])

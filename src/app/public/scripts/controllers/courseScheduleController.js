'use strict'

angular.module('loginApp')
  .controller('courseScheduleCtrl',
  ['contentService', '$stateParams', '$state', '$timeout', '$scope', '$rootScope', 'toasterService',
    '$location', '$window', 'config', function (contentService, $stateParams, $state, $timeout,
            $scope, $rootScope, toasterService, $location, $window, config) {
      var toc = this
      toc.playList = []
      toc.playListContent = []
      toc.loading = false
      toc.courseParams = $stateParams
      $scope.contentList = []
      toc.contentList = []
      toc.showNoteInLecture = true
      toc.enrollErrorMessage = ''
      toc.fancyTree = []
      toc.treeKey = 0
      toc.uid = $rootScope.userId
      toc.statusClass = {
        0: 'grey',
        1: 'blue',
        2: 'green'
      }

      toc.showError = function (message) {
        toc.loader.showLoader = false
        toc.error.showError = true
        toc.error.message = message
      }

      toc.storeCourseDetail = function (courseName, courseId) {
        var params = {
          COURSE_PARAMS: {
            courseType: 'OTHER_COURSE',
            courseId: courseId,
            lectureView: 'yes',
            progress: 0,
            total: toc.courseTotal,
            courseName: courseName,
            lastReadContentId: null }
        }
        $window.sessionStorage.setItem('sbConfig', JSON.stringify(params))
      }

    // $scope.contentPlayer.contentData=};
      toc.getCourseToc = function () {
        toc.loader = toasterService.loader('', $rootScope.messages.stmsg.m0003)
        contentService.courseHierarchy(toc.courseId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            if (config.CONTENT_TYPE.course !== res.result.content.contentType) {
              toasterService.warning('Invalid course access')
              $state.go('Landing')
              return
            }
            $rootScope.titleName = res.result.content.name
            window.localStorage.setItem('redirectUrl', '/course/' + toc.courseId + '/yes')
            toc.loader.showLoader = false
            res.result.content.children = _.sortBy(
                     res.result.content.children, ['index'])
            toc.getAllContentsFromCourse(res.result.content)
            toc.contentCountByType = _.countBy(toc.playListContent, 'mimeType')
            toc.courseTotal = toc.courseTotal || toc.playList.length
            if (toc.courseParams.lastReadContentId) {
              toc.itemIndex = toc.playList.indexOf(toc.courseParams.lastReadContentId
                        )
            }

            toc.courseHierachy = res.result.content
            $rootScope.courseName = toc.courseHierachy.name
            toc.applyAccordion()
            toc.storeCourseDetail($rootScope.courseName, toc.courseId)
          } else {
            toc.loader.showLoader = false
            toasterService.error($rootScope.messages.fmsg.m0003)
            $state.go('Landing')
          }
        }, function () {
          toc.loader.showLoader = false
          toasterService.error($rootScope.messages.fmsg.m0003)
          $state.go('Landing')
        })
      }

      toc.expandMe = function (index, item) {
        if (item && item.mimeType &&
            item.mimeType !== 'application/vnd.ekstep.content-collection'
          ) {
          toc.itemIndex = toc.playList.indexOf(item.identifier)
          toc.playPlaylistContent(item.identifier, '')
        } else {
          var accIcon = $(index.target).closest('.title').find('i')
          toc.updateIcon(accIcon, !$(accIcon).hasClass('plus'))
        }
      }
      toc.updateIcon = function (icon, isPlus) {
        if (isPlus) {
          $(icon).addClass('plus').removeClass('minus')
        } else {
          $(icon).addClass('minus').removeClass('plus')
        }
      }
      toc.checkAndAddToPlaylist = function (item) {
        if (item.mimeType !== 'application/vnd.ekstep.content-collection' &&
             toc.playList.indexOf(item.identifier) === -1) {
          toc.playList.push(item.identifier)
          toc.playListContent.push(item)
        }
      }

      toc.getAllChildrenCount = function (index) {
        var childCount = toc.getChildNodeCount(
             toc.courseHierachy.children[index], 0)
        return childCount
      }
      toc.getChildNodeCount = function (obj, cnt) {
        if (obj.children === undefined || obj.children.length === 0) {
          return cnt
        }
        cnt += obj.children.length
        obj.children.forEach(function (c) {
          var r = toc.getChildNodeCount(c, cnt)
          cnt = parseInt(r, 10)
        })

        return cnt
      }
      toc.getAllContentsFromCourse = function (contentData) {
        if (contentData.mimeType !==
             'application/vnd.ekstep.content-collection') {
          toc.playList.push(contentData.identifier)
          toc.playListContent.push(contentData)
        } else {
          angular.forEach(contentData.children, function (child, item) {
            toc.getAllContentsFromCourse(contentData.children[item])
          })
        }
        return toc.playList
      }

      toc.getTreeData = function (contentData, parent) {
        if (contentData.mimeType !==
            'application/vnd.ekstep.content-collection') {
          parent.push({
            title: '<span id="node' + toc.treeKey + '" class="padded">' +
                    '<img src="' + toc.getContentIcon(contentData.mimeType) +
                    '" class="tocCourseStructureImg">' + contentData.name +
                      '</span><button id="resume-button-' +
                      toc.treeKey +
                      '" class="toc-resume-button contentVisibility-hidden' +
                      ' blue right floated ui small button">RESUME</button',
            key: toc.treeKey,
            data: contentData,
            icon: false
          })
          toc.treeKey += 1
        } else {
          parent.push({
            title: '<span class="courseAccordianDesc">' +
                   '<i class="' + toc.getContentIcon(contentData.mimeType) +
                   '"></i>' + contentData.name + '</span>',
            key: -1,
            children: [],
            icon: false
          })
          angular.forEach(contentData.children, function (child, item) {
            toc.getTreeData(contentData.children[item]
                    , parent[parent.length - 1].children)
          })
        }
        return toc.fancyTree
      }

      toc.getContentClass = function (contentId) {
        var statusClass = {
          0: 'grey',
          1: 'blue',
          2: 'green'
        }
        if (toc.courseType === 'ENROLLED_COURSE') {
          return statusClass[toc.contentStatusList[contentId] || 0]
        }
        return 0
      }

      toc.getContentIcon = function (contentMimeType, stsClass) {
        stsClass = stsClass || ''
        var contentIcons = {
          'application/pdf': '/common/images/pdf' + stsClass + '.png',
          'video/mp4': '/common/images/video' + stsClass + '.png',
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
      toc.applyAccordion = function () {
        $timeout(function () {
          $('.ui.accordion').accordion({
            exclusive: false
          })
          if (toc.courseType === 'ENROLLED_COURSE' && toc.playList.length > 0 &&
                        toc.lectureView === 'no' && toc.courseHierachy.status !== 'Flagged') {
            toc.resumeCourse()
          }
          var progPercent = parseInt(
                 toc.courseProgress * 100 / toc.courseTotal, 0
                )
          $('.toc-resume-button').addClass('contentVisibility-hidden')
          $('#tocProgress').progress({ percent: progPercent })
        }, 100)
      }
      toc.constructTree = function (pos, tocData) {
        toc.fancyTree = []
        angular.forEach(tocData, function (item, child) {
          toc.getTreeData(item, toc.fancyTree)
        })
        toc.initializeFancyTree('#FT_' + pos, toc.fancyTree)
      }
      toc.initializeFancyTree = function (id, src) {
        $timeout(function () {
          $(id).fancytree({
            checkbox: false,
            source: src,
            click: function (event, data) {
              var nodeData = data.node
              if (nodeData.key !== -1) {
                toc.expandMe(nodeData.key, nodeData.data)
              }
            },
            create: function (event, data) {
              if (toc.courseType === 'OTHER_COURSE') {
                $('.fancytree-title').addClass('noselect')
              }
            }
          })
          $('.fancytree-container').addClass('fancytree-connectors')
        }, 0)
      }

      toc.fetchObjectAttributeAsArrayOrObject = function (objArray, objKey, valueKey, isKeyBasedObj) {
        var attributeArr = (isKeyBasedObj === true) ? {} : []
        for (var obj in objArray) {
          if (objArray[obj] !== undefined) {
            if (isKeyBasedObj) {
              attributeArr[objArray[obj][objKey]] = valueKey ? objArray[obj][valueKey] : objArray[obj]
            } else {
              attributeArr.push(objArray[obj][objKey])
            }
          }
        }
        return attributeArr
      }
      $scope.$watch('contentPlayer.isContentPlayerEnabled', function (newValue, oldValue) {
        $('.toc-resume-button').addClass('contentVisibility-hidden')
        if (oldValue === true && newValue === false) {
          toc.hashId = ''
          $location.hash(toc.hashId)
          toc.getContentState()
          $('.fancy-tree-container').each(function () {
            var treeId = this.id
            $(this).fancytree('getTree').visit(function (node) {
              if (node.key === toc.itemIndex.toString()) {
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
          toc.updateBreadCrumbs()
        }
      })

    // this logic is for breadcrumbs in this page only.
    // dont use for other pages breadcrumbs
    // instead use state route breadcrumbs logic
      toc.updateBreadCrumbs = function () {
        $rootScope.breadCrumbsData = [
             { name: 'Home', link: 'home' },
             { name: 'Courses', link: 'learn' },
          { name: toc.courseName,
            link: '/toc/' +
                   '/' + toc.courseId + '/' + toc.lectureView }]
        if ($scope.contentPlayer.isContentPlayerEnabled) {
          var curContentName = toc.playListContent[toc.itemIndex].name
          toc.courseParams.contentName = curContentName
          toc.courseParams.contentId = toc.playList[toc.itemIndex]
          toc.courseParams.contentIndex = toc.itemIndex
          var contentCrumb = { name: curContentName, link: '' }
          sessionService.setSessionData('COURSE_PARAMS', toc.courseParams)
          if ($rootScope.breadCrumbsData[3]) {
            $rootScope.breadCrumbsData[3] = contentCrumb
          } else {
            $rootScope.breadCrumbsData.push(contentCrumb)
          }
        }
      }

      toc.init = function () {
        toc.lectureView = toc.courseParams.lectureView
        toc.courseId = toc.courseParams.courseId
        toc.courseTotal = toc.courseParams.total
        toc.courseName = toc.courseParams.courseName
        toc.contentStatusList = {}
        $scope.enableCloseButton = (toc.lectureView === 'yes')
            ? 'false' : 'true'
        toc.nightMode = true
        toc.itemIndex = parseInt($stateParams.contentIndex, 0) || 0
        $scope.contentPlayer = {
          isContentPlayerEnabled: false

        }
        toc.loader = {
          showLoader: false,
          loaderMessage: '',
          enrollLoader: false
        }
        toc.error = {
          showError: false,
          message: '',
          messageType: 'error',
          isClose: false,
          showEnrollError: false
        }
        toc.playItemIndex = undefined
        toc.getCourseToc()
      }

      toc.loadData = function () {
        if (toc.courseParams.courseId !== $stateParams.courseId) {
        // if both courseIds are different call
        // to get course by id API and update data
        // (to be implemented with progress and status params in API side)
        } else {
          toc.init()
        }
      }
    }])

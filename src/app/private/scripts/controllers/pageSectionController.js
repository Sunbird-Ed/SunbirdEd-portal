'use strict'

angular.module('playerApp')
  .controller('pageSectionCtrl', ['pageSectionService', '$scope',
    '$state', 'config', 'sessionService', '$rootScope', 'toasterService', 'telemetryService',
    function (pageSectionService, $scope, $state, config, sessionService, $rootScope,
      toasterService, telemetryService) {
      var section = this
      section.pageTypeUrls = { resource: 'Resource',
        course: 'Course' }
      section.playContent = function (item) {
        $rootScope.contentType = item.contentType
        $rootScope.search.searchKeyword = ''
        var params = { content: item,
          contentName: item.name,
          contentId: item.identifier }
        $state.go('Player', params)
        telemetryService.interactTelemetryData($scope.type, item.identifier, item.contentType,
          $rootScope.version, $scope.type, $scope.type + '-read')
        telemetryService.startTelemetryData($scope.type, item.identifier, item.contentType,
          $rootScope.version, item.contentType, $scope.type + '-read', 'play')
      }

      section.openCourseView = function (course) {
        $rootScope.search.searchKeyword = ''
        var courseId = course.courseId || course.identifier
        var courseType = ($rootScope.enrolledCourseIds[courseId] >= 0)
          ? 'ENROLLED_COURSE' : 'OTHER_COURSE'
        var showLectureView = 'no'
        if ($rootScope.enrolledCourseIds[courseId]) {
          showLectureView = 'no'
        } else {
          showLectureView = 'yes'
        }
        var params = { courseType: courseType,
          courseId: course.courseId || course.identifier,
          lectureView: showLectureView,
          progress: course.progress,
          total: course.total,
          courseRecordId: course.id,
          courseName: course.courseName || course.name }
        sessionService.setSessionData('COURSE_PARAMS', params)
        $state.go('Toc', params)
        telemetryService.interactTelemetryData($scope.type, courseId, courseType, $rootScope.version,
          $scope.type, $scope.type + '-read')
        telemetryService.startTelemetryData($scope.type, courseId, courseType,
          $rootScope.version, courseType, $scope.type + '-read', 'play')
      }

      section.sections = function () {
        section.error = {}
        section.loader = toasterService.loader(''
          , $rootScope.messages.stmsg.m0053)
        if ($rootScope.search === undefined) {
          $rootScope.search = {}
        }
        if ($rootScope.search && $rootScope.search.sortBy) {
          delete $rootScope.search.sortBy.null
        }
        var request = {
          request: {
            source: 'web',
            name: section.pageTypeUrls[$scope.type],
            filters: $rootScope.search.filters || {},
            sort_by: $rootScope.search.sortBy || {}
          }
        }
        pageSectionService.getPageData(config.URL.PAGE_PREFIX, request)
          .then(function (successResponse) {
            // telemetry INTERACT event
            var itemType = $scope.type // eslint-disable-line no-unused-vars
            var url = '/learn' // eslint-disable-line no-unused-vars
            var env = 'course' // eslint-disable-line no-unused-vars
            telemetryService.setConfigData('env', 'course')
            telemetryService.setConfigData('message', 'Content read')
            if ($scope.type === 'resource') {
              itemType = 'library'
              url = '/resources'
              env = 'library'
              telemetryService.setConfigData('env', 'library')
            }

            if (successResponse && successResponse.responseCode === 'OK') {
              var resourceRes = successResponse.result.response.sections
              $rootScope.version = successResponse.ver
              section.page = []
              // first group the data based on group field
              var pageData = {}
              for (var i in resourceRes) {
                var sectionArr = resourceRes[i]
                if (sectionArr.contents &&
                        sectionArr.contents.length > 0) {
                  pageData[sectionArr.group] =
                          pageData[sectionArr.group] || {}
                  pageData[sectionArr.group][sectionArr.index] =
                           sectionArr
                }
              }
              // Now merge all contents of
              // other indexes in each group to its first index contents
              Object.keys(pageData).forEach(function (key) {
                for (var index = 1;
                  index <= Object.keys(pageData[key]).length;
                  index += 1) {
                  if (index === 1) {
                    section.page[key - 1] = pageData[key][index]
                  } else {
                    Array.prototype.push.apply(
                      section.page[key - 1].contents,
                      pageData[key][index].contents, section.page[key - 1].id)
                  }
                }
              })

              /* telemetryService.impressionTelemetryData(env, successResponse.identifier, itemType,
                $rootScope.version, 'scroll', itemType + '-read', url, '',$scope.inviewLogs) */
              section.loader.showLoader = false
              if (section.page.length === 0) {
                section.error = showErrorMessage(true,
                  $rootScope.messages.stmsg.m0006,
                  $rootScope.messages.stmsg.m0008, $rootScope.messages.stmsg.m0007)
              }
            } else {
              section.loader.showLoader = false
              section.error = showErrorMessage(true,
                $rootScope.messages.fmsg.m0004,
                $rootScope.messages.emsg.m0002)
            }
          }).catch(function () {
            section.loader.showLoader = false
            section.error = showErrorMessage(true,
              $rootScope.messages.fmsg.m0004,
              $rootScope.messages.emsg.m0002)
          })
      }

      /**
             * This function called when api failed,
             * and its show failed response for 2 sec.
             * @param {String} message
             */
      function showErrorMessage (isClose, message, messageType, messageText) {
        var error = {}
        error.showError = true
        error.isClose = isClose
        error.message = message
        error.messageType = messageType
        if (messageText) {
          error.messageText = messageText
        }
        return error
      }
      section.sections()
      var initSearchHandler = $rootScope.$on('initPageSearch', function (event, args) {
        section.sections()
      })
      var initSearchHandlerForDynamicSearchPage = $rootScope.$on('initPageSearchFromDynamicPage',
        function (event, args) {
          $rootScope.search.filters = args.FilterData
          $rootScope.search.sortBy = args.sortByData
          section.sections()
        })

      $scope.$on('$destroy', function () {
        initSearchHandler()
        initSearchHandlerForDynamicSearchPage()
      })

      // telemetry visit spec
      var inviewLogs = []
      $rootScope.lineInView = function (index, inview, item, section, pageSectionId) {
        var obj = _.filter(inviewLogs, function (o) {
          return o.objid === item.identifier
        })
        console.log('@@@@--------@@@', $rootScope.visitData)
        var visiblity = angular.element('#' + pageSectionId + '_' + item.identifier).attr('aria-hidden')
        if (inview === true && obj.length === 0 && visiblity === 'false') {
          inviewLogs.push({
            objid: item.identifier,
            objtype: item.contentType || 'course',
            section: section,
            index: index
          })
        }
        if ($rootScope.visitData !== undefined && item.contentType === 'Course') {
          // inviewLogs.concat($rootScope.visitData)
          inviewLogs = _.union(inviewLogs, $rootScope.visitData)
        }
        console.log('----------', inviewLogs)
        telemetryService.setVisitData(inviewLogs)
      }
    }])

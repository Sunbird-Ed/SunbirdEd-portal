'use strict'

angular.module('playerApp')
  .controller('pageSectionCtrl', ['pageSectionService', '$scope',
    '$state', 'config', 'sessionService', '$rootScope', 'toasterService', 'telemetryService',
    function (pageSectionService, $scope,
      $state, config, sessionService, $rootScope, toasterService, telemetryService) {
      var section = this
      section.pageTypeUrls = { resource: 'Resource',
        course: 'Course' }
      section.playContent = function (item) {
        $rootScope.search.searchKeyword = ''
        var params = { content: item,
          contentName: item.name,
          contentId: item.identifier }
        $state.go('Player', params)
        section.generateInteractEvent('library', 'library-read', item.identifier)
        section.generateStartEvent(item.identifier)
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
        section.generateInteractEvent($scope.type, $scope.type+'-read', courseId)
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

            //telemetry INTERACT event
            var itemType = $scope.type
            var visits = ''
            var url = '/learn'
            var env = 'course'
            telemetryService.setConfigData('env','course');
            telemetryService.setConfigData('message','Content read');
            if($scope.type == 'resource'){
               itemType = 'library'
               url = '/resources'
               env = 'library'
               telemetryService.setConfigData('env','library');
            }

            if (successResponse && successResponse.responseCode === 'OK') {
              var resourceRes = successResponse.result.response.sections
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
                      pageData[key][index].contents)
                  }
                }
              })

              section.loader.showLoader = false
              section.generateImressionEvent(itemType, itemType+'-read', url, env)
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
             * This function call to generate telemetry
             * on click of Course, Library.
             */
      section.generateInteractEvent = function(edataId, pageId, courseId){
        var contextData = {
          env : $scope.type,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objRollup = ''
        if(courseId!=''){
          objRollup = ['course', courseId]
        }

        var objectData = {
          id: courseId,
          type:edataId,
          ver:'1.0',
          rollup:telemetryService.getRollUpData(objRollup)
        }

        var data = {
          edata:telemetryService.interactEventData('CLICK', '', edataId, pageId),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.interact(data)
      }

      /**
             * This function call to generate Imression
             * telemetry event
             */
      section.generateImressionEvent = function(itemType, pageId, uri, env){
              var contextData = {
                env : env,
                rollup: telemetryService.getRollUpData($rootScope.organisationIds)
              }

              var objectData = {
                id: '',
                type:itemType,
                ver:'1.0',
                rollup:''
              }

              var data = {
                edata:telemetryService.impressionEventData('view', 'scroll', pageId, uri),
                context: telemetryService.getContextData(contextData),
                object: telemetryService.getObjectData(objectData),
                tags: $rootScope.organisationIds
              }
              telemetryService.impression(data)
      }

      // telemetry start event data
      section.generateStartEvent = function (id) {
            var contextData = {
              env : 'library',
              rollup: telemetryService.getRollUpData($rootScope.organisationIds)
            }
            var objRollup = ['library', id]
            var objectData = {
              id: id,
              type:'library',
              ver:'1.0',
              rollup:telemetryService.getRollUpData(objRollup)
            }
            var data = {
              edata:telemetryService.startEventData('library', 'library-read', 'play'),
              contentId : id,
              contentVer: '1.0',
              context: telemetryService.getContextData(contextData),
              object: telemetryService.getObjectData(objectData),
              tags: $rootScope.organisationIds
            }
          telemetryService.start(data)
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
      $scope.$on('$destroy', function () {
        initSearchHandler()
      })

    }])

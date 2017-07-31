'use strict';

angular.module('playerApp')
  .controller('pageSectionCtrl', function (pageSectionService, $scope,
    $state, config, sessionService, $rootScope,toasterService) {
      var section = this;
      section.pageTypeUrls = { resource: config.URL.RESOURCE.GET,
          course: config.URL.COURSE.GET_LEARN_OTHER_SECTION };
      section.playContent = function (item) {
          var params = { content: item,
              contentName: item.name,
              contentId: item.identifier };
          $state.go('Player', params);
      };

      section.openCourseView = function (course) {
          var courseId = course.courseId || course.identifier;
          var courseType = ($rootScope.enrolledCourseIds[courseId] >= 0)
           ? 'ENROLLED_COURSE' : 'OTHER_COURSE';
          var showLectureView = 'no';
          if ($rootScope.enrolledCourseIds[courseId]) {
              showLectureView = 'no';
          } else {
              showLectureView = 'yes';
          }
          var params = { courseType: courseType,
              courseId: course.courseId || course.identifier,
              lectureView: showLectureView,
              progress: course.progress,
              total: course.total,
              courseRecordId: course.id,
              courseName: course.courseName || course.name };
          sessionService.setSessionData('COURSE_PARAMS', params);
          $state.go('Toc', params);
      };

      section.sections = function () {
          section.error = {};
          section.loader=toasterService.loader(''
           ,$rootScope.errorMessages.RESOURCE.PAGE.START);
          if ($rootScope.search === undefined) {
              $rootScope.search = {};
          }
          var request = {
              request: {
                  source: 'web',
                  name: section.pageTypeUrls[$scope.type],
                  filters: $rootScope.search.filters || {},
                  sort_by: $rootScope.search.sortBy || {}
              }
          };
          pageSectionService.getPageData(config.URL.PAGE_PREFIX, request)
          .then(function (successResponse) {
              if (successResponse && successResponse.responseCode === 'OK') {
                  var resourceRes = successResponse.result.response.sections;
                  section.page = [];
          // first group the data based on group field
                  var pageData = {};
                  for (var i in resourceRes) {
                      var sectionArr = resourceRes[i];
                      if (sectionArr.contents
                        && sectionArr.contents.length > 0) {
                          pageData[sectionArr.group] =
                          pageData[sectionArr.group] || {};
                          pageData[sectionArr.group][sectionArr.index]
                           = sectionArr;
                      }
                  }
          // Now merge all contents of
          // other indexes in each group to its first index contents
                  Object.keys(pageData).forEach(function (key) {
                      for (var index = 1;
                        index <= Object.keys(pageData[key]).length;
                         index += 1) {
                          if (index === 1) {
                              section.page[key - 1] = pageData[key][index];
                          } else {
                              Array.prototype.push.apply(
                                  section.page[key - 1].contents,
                                   pageData[key][index].contents);
                          }
                      }
                  });

                  section.loader.showLoader = false;
                  if (section.page.length === 0) {
                      toasterService.error(
                         $rootScope.errorMessages.SEARCH.DATA.NO_CONTENT);
                  }
              } else {
                  section.loader.showLoader = false;
                 toasterService.error(
                         $rootScope.errorMessages.RESOURCE.PAGE.FAILED);
              }
          }).catch(function () {
              section.loader.showLoader = false;
             toasterService.error(
                         $rootScope.errorMessages.RESOURCE.PAGE.FAILED);
          });
      };
      section.sections();
      $rootScope.$on('initPageSearch', function (event, args) {
          section.sections();
      });
  });

/**
 * name: pageSectionController.js
 * author: Anuj Gupta
 * Date: 02-11-2017
 */

'use strict'
describe('pageSectionCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope, pageSectionService, scope, deferred, sectionCtrl
  var getPageDataSuccessResponse = {
    'id': 'api.page.assemble',
    'ver': 'v1',
    'ts': '2017-11-09 11:16:26:174+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'e184742d-3138-4276-a9dd-d52707e2d96b',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'name': 'Resource',
        'id': '0122838911932661768',
        'sections': [
          {
            'display': '{"name":{"en":"Popular Story","hi":"????????"}}',
            'alt': null,
            'description': null,
            'index': 1,
            'sectionDataType': 'content',
            'imgUrl': null,
            'contents': [
              {
                'subject': 'Maths',
                'channel': '505c7c48ac6dc1edc9b08f21db5a571d',
                'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123208084832829441775/1.-real-numbers_1505061829985_do_2123208084832829441775_1.0.ecar',
                'language': [
                  'English'
                ],
                'mimeType': 'video/x-youtube',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123208084832829441775/1.-real-numbers_1505061830045_do_2123208084832829441775_1.0_spine.ecar',
                    'size': 988
                  }
                },
                'objectType': 'Content',
                'gradeLevel': [
                  'Grade 9'
                ],
                'collections': [
                  'do_2123386094466580481116',
                  'do_2123413369921290241279',
                  'do_2123413507299000321282',
                  'do_212342895774195712124',
                  'do_212342957264543744132',
                  'do_2123475540275036161110',
                  'do_2123475784152350721122',
                  'do_2123476228829511681136',
                  'do_2123498024883732481119',
                  'do_2123560428659261441187',
                  'do_2123560514927902721192',
                  'do_2123561670630850561226',
                  'do_2123567152009216001249',
                  'do_2123603961289195521431',
                  'do_2123604360380497921457',
                  'do_2123695230337269761516',
                  'do_2123695740724346881553'
                ],
                'appId': 'sunbird_portal',
                'me_totalRatings': 0,
                'contentEncoding': 'identity',
                'artifactUrl': 'https://www.youtube.com/embed/https://www.youtube.com/embed/dJkwElt-mfM?autoplay=1&enablejsapi=1',
                'contentType': 'Story',
                'identifier': 'do_2123208084832829441775',
                'lastUpdatedBy': 'f24442ca-8d5e-4672-8885-493fe0b39067',
                'audience': [
                  'Learner'
                ],
                'visibility': 'Default',
                'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f',
                'mediaType': 'content',
                'ageGroup': [
                  'Other'
                ],
                'osId': 'org.ekstep.quiz.app',
                'graph_id': 'domain',
                'nodeType': 'DATA_NODE',
                'lastPublishedBy': 'f24442ca-8d5e-4672-8885-493fe0b39067',
                'size': 988,
                'lastPublishedOn': '2017-09-10T16:43:49.985+0000',
                'IL_FUNC_OBJECT_TYPE': 'Content',
                'name': '1. Real Numbers',
                'status': 'Live',
                'code': 'org.sunbird.DAkYuw',
                'description': 'Representation Real number on the Number line through Successive magnification EM',
                'lastFlaggedOn': '2017-11-09T06:49:00.473+0000',
                'medium': 'English',
                'idealScreenSize': 'normal',
                'flaggedBy': [
                  'Amit Kumar',
                  'Amit singh',
                  'Mentor First User',
                  'ntptest102'
                ],
                'createdOn': '2017-08-29T11:09:01.806+0000',
                'me_totalSideloads': 0,
                'me_totalComments': 0,
                'contentDisposition': 'online',
                'lastUpdatedOn': '2017-11-09T06:49:00.482+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2017-09-10T16:43:50.241+0000',
                'me_totalDownloads': 2,
                'IL_SYS_NODE_TYPE': 'DATA_NODE',
                'os': [
                  'All'
                ],
                'flagReasons': [
                  'Inappropriate content',
                  'Other'
                ],
                'es_metadata_id': 'do_2123208084832829441775',
                'pkgVersion': 1,
                'versionKey': '1510210140482',
                'idealScreenDensity': 'hdpi',
                'lastSubmittedOn': '2017-09-10T16:46:04.022+0000',
                'me_averageRating': 0,
                'createdBy': '98e09d6e-b95b-4832-bfab-421e63d36aa7',
                'compatibilityLevel': 4,
                'IL_UNIQUE_ID': 'do_2123208084832829441775',
                'node_id': 62781,
                'resourceType': 'Story'
              },
              {
                'code': 'org.sunbird.NI4YPL',
                'subject': 'Maths',
                'channel': 'in.ekstep',
                'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123208084840939521776/13-probability_1505061846255_do_2123208084840939521776_1.0.ecar',
                'description': 'Probability Part 6 EM Useful for Grade 10 class with eGrade 10ample',
                'language': [
                  'English'
                ],
                'medium': 'English',
                'mimeType': 'video/x-youtube',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123208084840939521776/13-probability_1505061846326_do_2123208084840939521776_1.0_spine.ecar',
                    'size': 985
                  }
                },
                'idealScreenSize': 'normal',
                'createdOn': '2017-08-29T11:09:01.905+0000',
                'objectType': 'Content',
                'gradeLevel': [
                  'Grade 10'
                ],
                'collections': [
                  'do_2123356325121228801400'
                ],
                'contentDisposition': 'online',
                'lastUpdatedOn': '2017-09-10T16:46:22.228+0000',
                'contentEncoding': 'identity',
                'artifactUrl': 'https://www.youtube.com/embed/https://www.youtube.com/embed/sDKNjRmnVOg?autoplay=1&enablejsapi=1',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2017-09-10T16:44:06.443+0000',
                'contentType': 'Story',
                'identifier': 'do_2123208084840939521776',
                'lastUpdatedBy': 'f24442ca-8d5e-4672-8885-493fe0b39067',
                'audience': [
                  'Learner'
                ],
                'IL_SYS_NODE_TYPE': 'DATA_NODE',
                'visibility': 'Default',
                'os': [
                  'All'
                ],
                'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f',
                'es_metadata_id': 'do_2123208084840939521776',
                'mediaType': 'content',
                'ageGroup': [
                  'Other'
                ],
                'osId': 'org.ekstep.quiz.app',
                'graph_id': 'domain',
                'nodeType': 'DATA_NODE',
                'lastPublishedBy': 'f24442ca-8d5e-4672-8885-493fe0b39067',
                'pkgVersion': 1,
                'versionKey': '1505061846443',
                'idealScreenDensity': 'hdpi',
                'lastSubmittedOn': '2017-09-10T16:46:20.723+0000',
                'size': 985,
                'lastPublishedOn': '2017-09-10T16:44:06.255+0000',
                'createdBy': '98e09d6e-b95b-4832-bfab-421e63d36aa7',
                'compatibilityLevel': 4,
                'IL_FUNC_OBJECT_TYPE': 'Content',
                'name': '13 PROBABILITY',
                'IL_UNIQUE_ID': 'do_2123208084840939521776',
                'status': 'Live',
                'node_id': 62782
              }
            ],
            'searchQuery': '{"request":{"query":"","filters":{"language":["English"],"contentType":["Story"]}}}',
            'name': 'Popular Story',
            'id': '01228383384379392023',
            'group': 2
          }
        ]
      }
    }
  }

  beforeEach(inject(function ($rootScope, _$q_, $controller, _pageSectionService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    deferred = _$q_.defer()
    pageSectionService = _pageSectionService_
    $rootScope.enrolledCourseIds = ['sdfsfsdfsdfsdfsdf']
    sectionCtrl = new $controller('pageSectionCtrl', {$scope: scope, $rootScope: rootScope})
  }))

  it('Should called get enrolled courses', function () {
    spyOn(pageSectionService, 'getPageData').and.callThrough()
    pageSectionService.getPageData('31231123112-1231232')
    expect(pageSectionService.getPageData).toBeDefined()
  })

  it('should get called play content', function () {
    spyOn(sectionCtrl, 'playContent').and.callThrough()
    sectionCtrl.playContent({identifier: 'id', name: 'name'})
    expect(sectionCtrl.playContent).toBeDefined()
  })

  it('should open course view', function (done) {
    spyOn(sectionCtrl, 'openCourseView').and.callThrough()
    rootScope.enrolledCourseIds = {courseId: 'id'}
    sectionCtrl.openCourseView({identifier: 'id', name: 'name', courseId: 'id'})
    expect(sectionCtrl.openCourseView).toBeDefined()
    done()
  })

  it('should open course view with no lecture view', function () {
    spyOn(sectionCtrl, 'openCourseView').and.callThrough()
    rootScope.enrolledCourseIds = {courseId: 'id'}
    sectionCtrl.openCourseView({identifier: 'id', name: 'name', courseId: 'id'})
    expect(sectionCtrl.openCourseView).toBeDefined()
  })

  it('should get enrolled course', function (done) {
    spyOn(pageSectionService, 'getPageData').and.returnValue(deferred.promise)
    deferred.resolve(getPageDataSuccessResponse)
    spyOn(sectionCtrl, 'sections').and.callThrough()
    sectionCtrl.sections()
    scope.$apply()
    var response = pageSectionService.getPageData('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('should not get enrolled course', function (done) {
    spyOn(pageSectionService, 'getPageData').and.returnValue(deferred.promise)
    deferred.resolve({response: {}})
    spyOn(sectionCtrl, 'sections').and.callThrough()
    sectionCtrl.sections()
    scope.$apply()
    var response = pageSectionService.getPageData('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('should not get enrolled course', function (done) {
    spyOn(pageSectionService, 'getPageData').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(sectionCtrl, 'sections').and.callThrough()
    sectionCtrl.sections()
    done()
  })

  it('Should called lineInview method', function () {
    var item = {
      identifier: 'do_211321312312313132',
      contentType: 'Course'
    }
    rootScope.visitData = [{objId: 'do_2331245645656788', objtype: 'Course', section: 'my course'}]
    spyOn(rootScope, 'lineInView').and.callThrough()
    rootScope.lineInView(5, true, item, 'my course')
    scope.$apply()
    expect(rootScope.lineInView).toBeDefined()
  })
})

/**
 * name: announcementDetailsDirective.js
 * author: Nitesh Kesarkar
 * Date: 31-10-2017
 */

'use strict'

describe('Directive: announcementDetailsDirective', function () {
    // load the main module
  beforeEach(module('playerApp'))

  var element, ctrl, compile, templateCache, scope

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    var templateHtml = '<div class="ui warning message tweleve wide column" ng-hide="announcementDetails.title"> <div class="header"> Oops announcement details not found! </div>Please try again..</div><div ng-show="announcementDetails.title"><div class="header cardsHeading padding-top-10" ng-show="announcementDetails.title">{{announcementDetails.title}}</div><div ng-show="announcementDetails.links"> <div class="padding-top-7 tweleve wide column"> <div ng-repeat="link in announcementDetails.links track by $index"> <p><a href="{{link}}" target="_blank">{{link | limitTo:70}}<span ng-show="link.length > 70" class="announcementBlueText">...</span></a> </p></div></div></div><div class="item borderBottom" ng-repeat="attachment in announcementDetails.attachments track by $index"> <div class="middle aligned content"> <div class="ui float-ContentRight"> <a href="{{attachment.downloadURL}}" target="_blank" class="ui primary basic button announcementButton"> <span class="announcementButtonText">{{$root.frmelmnts.btn.anncmntdtlsview}}</span> </a> </div></div></div></div>'
    $templateCache.put('views/announcement/announcementDetails.html', templateHtml)
    compile = $compile
    templateCache = $templateCache
  }))

  // Test if directive shows correctly after passing the valid announcement object
  it('Should show announcement details', function () {
    scope.announcementDetails = {'title': 'Exam dates announced for CBSE and state board exams'}
    element = compile('<announcement-details-directive announcement-details="announcementDetails"></announcement-details-directive>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Exam dates announced for CBSE and state board exams')
  })

  // Test if directive shows error message after passing the invalid/blank announcement object
  it('Should show error message', function () {
    scope.announcementDetails = {}
    element = compile('<announcement-details-directive announcement-details="announcementDetails"></announcement-details-directive>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Oops announcement details not found!')
  })
  /*
  // Test if announcement's weblinks are clickable and opens the clicked weblink in new tab
  it('Should open the weblink in new tab', function () {
    scope.announcementDetails = {'links': ['https://diksha.gov.in/#documents'], 'title': 'Exam dates announced for CBSE and state board exams'}
    element = compile('<announcement-details-directive announcement-details="announcementDetails"></announcement-details-directive>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Announcement')
  })

  // Test if announcement's attachements's view buttons are clickable and opens the clicked attachement in new tab
  it('Should open the attachement in new tab', function () {
    scope.announcementDetails = {'title': 'Exam dates announced for CBSE and state board exams', 'attachments': [{'title': 'Circular A1.pdf', 'downloadURL': 'https://linktoattachment.com', 'mimetype': 'application/pdf'}]}
    element = compile('<announcement-details-directive announcement-details="announcementDetails"></announcement-details-directive>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Announcement')
  })
  */
})

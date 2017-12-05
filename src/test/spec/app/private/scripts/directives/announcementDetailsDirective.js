/**
 * name: announcementDetailsDirective.js
 * author: Nitesh Kesarkar
 * Date: 31-10-2017
 */
'use strict'
describe('Directive: announcementDetailsDirective', function () {
    // load the main module
  beforeEach(module('playerApp'))
  var element, compile, templateCache, scope, templateHtml
  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    templateHtml = '<div class="ui warning message tweleve wide column" ng-if="!announcementDetails.details.title"> <div class="header"> Oops announcement details not found! </div>Please try again..</div><div ng-if="announcementDetails.details.title"><div class="header cardsHeading padding-top-10" ng-if="announcementDetails.details.title">{{announcementDetails.details.title}}</div><div ng-if="announcementDetails.links"> <div class="padding-top-7 tweleve wide column"> <div ng-repeat="link in announcementDetails.links track by $index"> <p><a href="{{link}}" target="_blank">{{link | limitTo:70}}<span ng-if="link.length > 70" class="announcementBlueText">...</span></a> </p></div></div></div><div class="item borderBottom" ng-repeat="attachment in announcementDetails.attachments track by $index"> <div class="middle aligned content"> <div class="ui float-ContentRight"> <a href="{{attachment.downloadURL}}" target="_blank" class="ui primary basic button announcementButton"> <span class="announcementButtonText">{{$root.frmelmnts.btn.anncmntdtlsview}}</span> </a> </div></div></div></div>'
    $templateCache.put('views/announcement/announcementDetailsTemplate.html', templateHtml)
    compile = $compile
    element = compile('<announcement-details-directive announcement-details="announcementDetails"></announcement-details-directive>')(scope)
    templateCache = $templateCache
  }))
    // Test if directive shows correctly after passing the valid announcement object
  it('Should show announcement details', function () {
    scope.announcementDetails = announcementTestData.announcementDetails.annValidObj
    scope.$digest()
    expect(element.text()).toContain('Title')
  })
    // Test if directive shows error message after passing the invalid/blank announcement object
  it('Should show error message', function () {
    scope.announcementDetails = announcementTestData.announcementDetails.annBlankObj
    scope.$digest()
    expect(element.text()).toContain('Oops announcement details not found!')
  })
    // Test if directive do not shows Weblinks label if announcement does not have weblinks
  it('Should not show weblinks', function () {
    scope.announcementDetails = announcementTestData.announcementDetails.annObjWithEmptyWeblinks
    scope.$digest()
    expect(element.text()).not.toContain('Weblinks')
  })
    // Test if directive do not shows Attachments label if announcement does not have attachments
  it('Should not show attachments', function () {
    scope.announcementDetails = announcementTestData.announcementDetails.annObjWithEmptyAttachments
    scope.$digest()
    expect(element.text()).not.toContain('Attachments')
  })
})

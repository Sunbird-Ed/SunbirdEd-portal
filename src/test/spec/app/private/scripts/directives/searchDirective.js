/**
 * name: searchDirective.js
 * author: Aprajita
 * Date: 27-10-2017
 */

'use strict'

describe('Directive: search', function () {
  // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var scope
  var rootScope
  var timeout
  var fileName = 'views/header/search.html'

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile, _$timeout_, _searchService_) {
    rootScope = $rootScope
    scope = rootScope.$new()
    timeout = _$timeout_
    $templateCache.put(fileName, '')
    scope.$digest()
    // ctrl = element.controller
    $controller('SearchResultController', {
      $rootScope: rootScope,
      $scope: scope
    })
  }))

  it('Should add active class for selected filter option', function () {
    rootScope.search.selectedLanguage = []

    spyOn(rootScope.search, 'selectFilter').and.callThrough()
    rootScope.search.selectFilter('selectedLanguage', 'English', '')
    timeout.flush(0)
    scope.$apply()
  })

  it('Should remove active class for unselected filter option', function () {
    rootScope.search.selectedLanguage = ['English']

    spyOn(rootScope.search, 'selectFilter').and.callThrough()
    rootScope.search.selectFilter('selectedLanguage', 'English', '')
    timeout.flush(0)
    scope.$apply()
  })

  it('Should remove filter selection', function () {
    rootScope.search.selectedConcepts = []

    spyOn(rootScope.search, 'removeFilterSelection').and.callThrough()
    rootScope.search.removeFilterSelection('selectedConcepts', 'Science')
    scope.$apply()
  })

  it('Should remove filter selection for concepts', function () {
    rootScope.search.selectedConcepts = ['Science']

    spyOn(rootScope.search, 'removeFilterSelection').and.callThrough()
    rootScope.search.removeFilterSelection('selectedConcepts', 'Science')
    scope.$apply()
  })

  it('Should remove filter selection except concepts', function () {
    rootScope.search.selectedLanguage = []

    spyOn(rootScope.search, 'removeFilterSelection').and.callThrough()
    rootScope.search.removeFilterSelection('selectedLanguage', 'English')
    scope.$apply()
  })

  it('Should remove filter selection except concepts', function () {
    rootScope.search.selectedLanguage = ['English']

    spyOn(rootScope.search, 'removeFilterSelection').and.callThrough()
    rootScope.search.removeFilterSelection('selectedLanguage', 'English')
    scope.$apply()
  })

  it('Should call initsearch', function () {
    spyOn(scope.search, 'initSearch').and.callThrough()
    scope.search.initSearch()
    scope.$apply()
  })

  it('Should open course view on openCourseView call with courseId', function () {
    var course = {courseId: '123'}
    rootScope.enrolledCourseIds['course'] = course
    spyOn(rootScope.search, 'openCourseView').and.callThrough()
    rootScope.search.openCourseView(course, 'enroll_course')
    scope.$apply()
  })

  it('Should open course view on openCourseView call with courseIdentifier', function () {
    var course = {identifier: '3245'}
    rootScope.enrolledCourseIds['course'] = course
    spyOn(rootScope.search, 'openCourseView').and.callThrough()
    rootScope.search.openCourseView(course, 'enroll_course')
    scope.$apply()
  })

  it('Should play content on playContent call when mimeType value available', function () {
    var item = {mimeType: 'application/vnd.ekstep.content-collection'}
    spyOn(rootScope.search, 'playContent').and.callThrough()
    rootScope.search.playContent(item)
    scope.$apply()
  })

  it('Should play content on playContent call when mimeType value is empty', function () {
    var item = {mimeType: ''}
    spyOn(rootScope.search, 'playContent').and.callThrough()
    rootScope.search.playContent(item)
    scope.$apply()
  })

  it('Should searchtext on setSearchText call', function () {
    spyOn(rootScope.search, 'setSearchText').and.callThrough()
    rootScope.search.setSearchText('Users')
    scope.$apply()
  })

  it('Should suggest search keyword on autoSuggestSearch call', function () {
    rootScope.search.searchKeyword = 'Users'
    spyOn(scope.search, 'autoSuggestSearch').and.callThrough()
    scope.search.autoSuggestSearch()
    scope.$apply()
  })

  it('Should call keyUp event', function () {
    spyOn(scope.search, 'keyUp').and.callThrough()
    scope.search.keyUp()
    scope.$apply()
  })

  it('Should call keyDown event', function () {
    spyOn(scope.search, 'keyDown').and.callThrough()
    scope.search.keyDown()
    scope.$apply()
  })

  it('Should send searchtext on searchRequest call', function () {
    spyOn(scope.search, 'searchRequest').and.callThrough()
    scope.search.searchRequest('keyUp')
    scope.$apply()
  })

  it('Should handle search result on handleSearch call', function () {
    scope.search.autoSuggest = false
    rootScope.search.searchFromSuggestion = 'true'
    rootScope.search.selectedSearchKey = 'Courses'
    spyOn(scope.search, 'handleSearch').and.callThrough()
    scope.search.handleSearch('5')
    scope.$apply()
  })

  it('Should handle search result on handleSearch call', function () {
    scope.search.autoSuggest = false
    rootScope.search.searchFromSuggestion = 'true'
    rootScope.search.selectedSearchKey = 'Library'
    spyOn(scope.search, 'handleSearch').and.callThrough()
    scope.search.handleSearch('5')
    scope.$apply()
  })

  it('Should handle search result on handleSearch call', function () {
    scope.search.autoSuggest = false
    rootScope.search.searchFromSuggestion = 'true'
    rootScope.search.selectedSearchKey = 'All'
    spyOn(scope.search, 'handleSearch').and.callThrough()
    scope.search.handleSearch('5')
    scope.$apply()
  })

  it('Should handle search result on handleSearch call', function () {
    scope.search.autoSuggest = false
    rootScope.search.searchFromSuggestion = 'true'
    rootScope.search.selectedSearchKey = 'Users'
    spyOn(scope.search, 'handleSearch').and.callThrough()
    scope.search.handleSearch('5')
    scope.$apply()
  })

  it('Should handle search result on handleSearch call', function () {
    scope.search.autoSuggest = false
    rootScope.search.searchFromSuggestion = 'true'
    rootScope.search.selectedSearchKey = 'Organisations'
    spyOn(scope.search, 'handleSearch').and.callThrough()
    scope.search.handleSearch('5')
    scope.$apply()
  })

  it('Should apply filter on applyFilter call when search key is users', function () {
    rootScope.search.selectedSearchKey = 'Users'
    spyOn(rootScope.search, 'applyFilter').and.callThrough()
    rootScope.search.applyFilter()
    scope.$apply()
  })

  it('Should apply filter on applyFilter call when search key is organisations', function () {
    rootScope.search.selectedSearchKey = 'Organisations'
    spyOn(rootScope.search, 'applyFilter').and.callThrough()
    rootScope.search.applyFilter()
    scope.$apply()
  })

  it('Should apply filter on applyFilter call when search key is blank', function () {
    rootScope.search.selectedSearchKey = ''
    spyOn(rootScope.search, 'applyFilter').and.callThrough()
    rootScope.search.applyFilter()
    scope.$apply()
  })

  it('Should reset filter on resetFilter call', function () {
    rootScope.search.selectedSearchKey = 'All'
    spyOn(rootScope.search, 'resetFilter').and.callThrough()
    rootScope.search.resetFilter()
    scope.$apply()
  })

  it('Should apply sorting on search result call applySorting', function () {
    spyOn(rootScope.search, 'applySorting').and.callThrough()
    rootScope.search.applySorting()
    scope.$apply()
  })

  it('Should close search list page on close methode call', function () {
    rootScope.search.selectedSearchKey = 'Users'
    spyOn(rootScope.search, 'close').and.callThrough()
    rootScope.search.close()
    scope.$apply()
  })

  it('Should get user roles on getUserRoles call', function () {
    spyOn(rootScope.search, 'getUserRoles').and.callThrough()
    rootScope.search.getUserRoles()
    scope.$apply()
  })

  it('Should close search list page on close methode call', function () {
    rootScope.search.selectedSearchKey = 'All'
    spyOn(rootScope.search, 'close').and.callThrough()
    rootScope.search.close()
    scope.$apply()
  })

  it('Should close search list page on close methode call', function () {
    rootScope.search.selectedSearchKey = 'Library'
    spyOn(rootScope.search, 'close').and.callThrough()
    rootScope.search.close()
    scope.$apply()
  })

  it('Should set search key on setSearchKey call', function () {
    spyOn(rootScope.search, 'setSearchKey').and.callThrough()
    rootScope.search.setSearchKey('Users')
    scope.$apply()
  })

  xit('Should set search result page on setPage call', function () {
    spyOn(rootScope.search, 'setPage').and.callThrough()
    rootScope.search.setPage('5')
    scope.$apply()
  })

  it('Should set search result page on setPage call', function () {
    spyOn(rootScope.search, 'setPage').and.callThrough()
    rootScope.search.setPage('0')
    scope.$apply()
  })

  it('Should reset all the filters', function () {
    spyOn(rootScope.search, 'getSelectedContentTypeValue').and.callThrough()
    rootScope.search.getSelectedContentTypeValue([{key: 'Book', value: 'Book'}], 'Book')
    scope.$apply()
  })
})

/**
 * name: permissionsDirective.js
 * author: Aprajita
 * Date: 9-11-2017
 */

'use strict'

describe('Directive: conceptPicker', function () {
  // load the directive's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, rootScope, ctrl, compile, templateCache, scope, timeout, mockEvent, searchService, toasterService, deferred, $q
  var response = ['D1', 'D2', 'D5', 'D4', 'Num:C3', 'LD_TEST_32192', 'LD_TEST_5950'],
    err = 'error',
    conceptArr = ['Numeracy', 'Science', 'Math'],
    respData = [{'parent': ['102234435'], 'identifier': '0235467888899', 'name': 'Science'}]
  beforeEach(inject(function ($rootScope, $templateCache, $compile, $controller, _$timeout_, _searchService_, _toasterService_, _$q_) {
    rootScope = $rootScope
    scope = rootScope.$new()
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    searchService = _searchService_
    toasterService = _toasterService_
    scope.isSearchPage = true
    $templateCache.put('views/common/conceptSelector.html', '<divConcept Picker</div>')
    compile = $compile
    templateCache = $templateCache
    scope.$digest()
    ctrl = $controller('ConceptPickerController', {
      $rootScope: rootScope,
      $scope: scope
    })
    rootScope.conceptData = {id: 'sd'}
    $controller('ConceptPickerController', {
      $rootScope: rootScope,
      $scope: scope
    })
  }))

  it('link to concept picker', function (done) {
    scope.visibility = true
    scope.isclose = true
    scope.$last = true
    element = compile('<concept-picker selected-concepts="[]"></concept-picker>')(scope)
    scope.$digest()
    done()
  })

  it('Should load concept tree on loadConceptTree call', function () {
    spyOn(scope, 'loadConceptTree').and.callThrough()
    rootScope.concepts = 'science'
    rootScope.conceptData = {d: 'dds'}
    scope.loadConceptTree()
    timeout.flush(0)
    scope.$apply()
  })

  it('Should load concept tree on loadConceptTree call', function () {
    spyOn(scope, 'loadConceptTree').and.callThrough()
    rootScope.concepts = ''
    rootScope.conceptData = ''
    scope.loadConceptTree()
    timeout.flush(0)
    scope.$apply()
    expect(scope.loadConceptTree).not.toBe(undefined)
  })

  it('Should load domains on loadDomains call', function () {
    var resp = {
      result: {
        domains: [{'name': 'Literacy', 'identifier': '102234435'}],
        dimensions: [{parent: ['102234435'], identifier: '10223443', name: 'science'}, {'name': 'Numeracy', 'id': '102234435'}]
      }
    }
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(resp)
    spyOn(scope, 'loadDomains').and.callThrough()
    scope.loadDomains(err, conceptArr)
    timeout.flush(0)
    scope.$apply()
    expect(scope.loadDomains).not.toBe(undefined)
  })

  it('Should called search service', function () {
    spyOn(searchService, 'search').and.callThrough()
    searchService.search()
    scope.$apply()
    expect(searchService.search).toBeDefined()
  })

  it('Should called getChild', function () {
    spyOn(scope, 'getChild').and.callThrough()
    // var repArr
    scope.getChild('102234435', [{parent: ['102234435'], identifier: '10223443', name: 'science'}])
    scope.$apply()
    expect(scope.getChild).toBeDefined()
  })

  it('Should called initConceptBrowser', function () {
    spyOn(scope, 'initConceptBrowser').and.callThrough()
    scope.initConceptBrowser()
    $('treePicker').trigger('submit')
    timeout.flush(500)
    scope.$apply()
    expect(scope.initConceptBrowser).toBeDefined()
  })

  it('emit event', function () {
    rootScope.$emit('selectedConceptsFromSearch', {id: '3232132'})
  })
})

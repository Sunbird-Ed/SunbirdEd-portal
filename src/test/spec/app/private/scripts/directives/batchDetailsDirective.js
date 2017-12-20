/**
 * name: permissionsDirective.js
 * author: Aprajita
 * Date: 10-11-2017
 */

'use strict'

describe('Directive: batchDetails', function () {
  // load the directive's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, ctrl, compile, templateCache, scope, timeout, batch, rootScope

  beforeEach(inject(function ($rootScope, $templateCache, $compile, $controller) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    scope.batchInfo = ''
    ctrl = $controller('BatchController', {$scope: scope, $element: null})
    $templateCache.put('views/batch/batchDetails.html', '<div>batch details</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('link to batch details', function (done) {
    scope.batchInfo = true
    element = compile('<batch-details batchInfo="true"></batch-details>')(rootScope)
    var manualCompiledElement = angular.element(templateCache.get('views/batch/batchDetails.html'))
    scope.$digest()
    rootScope.$broadcast('batchDetails', {name: 'test batch'})
    done()
  })

  it('should on', function () {
    scope.visibility = true
    scope.isclose = true
    scope.batchInfo = true
    rootScope.$broadcast('batchDetails', {})
    // scope.$apply()
    // expect(scope.$on).not.toBe(undefined)
  })
})

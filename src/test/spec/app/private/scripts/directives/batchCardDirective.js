/**
 * name: permissionsDirective.js
 * author: Aprajita
 * Date: 10-11-2017
 */

'use strict'

describe('Directive: batchCard', function () {
  // load the directive's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, ctrl, compile, templateCache, scope, timeout

  beforeEach(inject(function ($rootScope, $templateCache, $compile, $controller) {
    scope = $rootScope.$new()
    scope.batchInfo = ''
    ctrl = $controller('BatchController', {$scope: scope, $element: null})
    $templateCache.put('views/batch/batchCard.html', '<div>batchcard</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('link to batch card', function (done) {
    scope.visibility = true
    scope.isclose = true
    scope.batchInfo = true
    element = compile('<batch-card ng-show="toc.batchCardShow" showbatchcard="true" coursecreatedby="toc.courseHierarchy.createdBy"></batch-card>')(scope)
    scope.$digest()
    done()
  })
})

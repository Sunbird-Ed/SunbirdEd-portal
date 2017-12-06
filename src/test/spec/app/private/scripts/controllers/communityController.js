/**
 * name: communityController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: CommunityController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var communityController

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    communityController = $controller('CommunityController')
  }))

  it('show detail should be false', function () {
    	expect(communityController.showDetail).toBe(false)
  })
})

'use strict'

describe('Filter: dateWithMDY', function () {
  // load the filter's module
  beforeEach(module('playerApp'))

  // initialize a new instance of the filter before each test
  var dateWithMDY
  beforeEach(inject(function ($filter) {
    dateWithMDY = $filter('dateFilterWithMDY')
  }))

  it('should return the input date in mdy format"', function () {
    var date = '2017-05-24T05:01:29.036+0000'
    expect(dateWithMDY(date)).toBe('May 24th 2017')
  })
})

describe('Filter: dateXTimeAgo', function () {
  // load the filter's module
  beforeEach(module('playerApp'))

  // initialize a new instance of the filter before each test
  var dateXTimeAgo
  beforeEach(inject(function ($filter) {
    dateXTimeAgo = $filter('dateFilterXTimeAgo')
  }))

  it('should return the input date in x time ago format"', function () {
    var date = '2017-05-24T05:01:29.036+0000'
    expect(dateXTimeAgo(date)).toBeDefined()
  })
})

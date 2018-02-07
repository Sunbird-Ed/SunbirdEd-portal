'use strict'

describe('Service: dataSourceUtils', function () {
  beforeEach(module('playerApp'))

  var dataSourceUtils, scope, $q, deferred, config   // eslint-disable-line
  var testData = dashboardDataSourceTestData.dataSourceUtils // eslint-disable-line
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _dataSourceUtils_, _$q_, _config_) { // eslint-disable-line
    scope = $rootScope.$new()
    dataSourceUtils = _dataSourceUtils_
    $q = _$q_
    config = _config_
    deferred = _$q_.defer()
  }))

  describe('Test data source utils', function () {
    it('should return zero seconds', function () {
      var numericRes = {'value': 12}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).not.toBe(null)
    })

    it('should return value in a min', function () {
      var numericRes = {'value': 120}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('2.00 min(s)')
    })

    it('should return value in a hour', function () {
      var numericRes = {'value': 3601}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('1.00 hour(s)')
    })

    it('should construct valid download report url', function () {
      var progressUrl, req, response, apiUrl
      progressUrl = config.URL.DASHBOARD.COURSE_PROGRESS
      req = {'identifier': 'do_123', 'timePeriod': '5w'}
      spyOn(dataSourceUtils, 'constructDownloadReportUrl').and.callThrough()
      response = dataSourceUtils.constructDownloadReportUrl(req, 'COURSE_PROGRESS')
      apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + progressUrl + '/' +
      req.identifier + '/export?period=' + req.timePeriod + '&format=csv'
      scope.$apply()
      expect(dataSourceUtils.constructDownloadReportUrl).toBeDefined()
      expect(response).toEqual(apiUrl)
    })

    it('should construct invalid download report url', function () {
      var progressUrl, req, response, apiUrl
      progressUrl = config.URL.DASHBOARD.COURSE_PROGRESS
      req = {'courseIdentifier': 'do_123', 'timePeriod': '5w'}
      spyOn(dataSourceUtils, 'constructDownloadReportUrl').and.callThrough()
      response = dataSourceUtils.constructDownloadReportUrl(req, 'COURSE_PROGRESS')
      apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + progressUrl + '/' + 'do_123' +
      '/export?period=' + req.timePeriod + '&format=csv'
      scope.$apply()
      expect(dataSourceUtils.constructDownloadReportUrl).toBeDefined()
      expect(response === apiUrl).toBe(false)
    })

    it('should construct valid api url', function () {
      var progressUrl, req, response, apiUrl
      progressUrl = config.URL.DASHBOARD.COURSE_PROGRESS
      req = {'identifier': 'do_123', 'timePeriod': '5w'}
      spyOn(dataSourceUtils, 'constructApiUrl').and.callThrough()
      response = dataSourceUtils.constructApiUrl(req, 'COURSE_PROGRESS')
      apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + progressUrl + '/' +
      req.identifier + '?period=' + req.timePeriod
      scope.$apply()
      expect(dataSourceUtils.constructApiUrl).toBeDefined()
      expect(response).toEqual(apiUrl)
    })

    it('should construct invalid api url', function () {
      var progressUrl, req, response, apiUrl
      progressUrl = config.URL.DASHBOARD.COURSE_PROGRESS
      req = {'courseIdentifier': 'do_123', 'timePeriod': '5w'}
      spyOn(dataSourceUtils, 'constructApiUrl').and.callThrough()
      response = dataSourceUtils.constructApiUrl(req, 'COURSE_PROGRESS')
      apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + progressUrl + '/' +
      'do_123' + '?period=' + req.timePeriod
      scope.$apply()
      expect(dataSourceUtils.constructApiUrl).toBeDefined()
      expect(response === apiUrl).toBe(false)
    })
  })
})

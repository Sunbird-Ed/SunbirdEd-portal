var request = require('request')
var server = require('../../../app/server.js')
var base_url = 'http://localhost:3000/'

describe('Default page reponse', function () {
  describe('GET /', function () {
    it('should return status code 200', function (done) {
      request.get(base_url, function (error, response, body) {
        expect(response.statusCode).toBe(200)
        done()
      })
    })
  })
})

describe('Tenant info', function () {
  describe('GET /v1/tenant/info', function () {
    it('should return error response without tenant id', function (done) {
      request.get(base_url + 'v1/tenant/info', function (error, response, body) {
        expect(response.statusCode).toBe(404)
        done()
      })
    })
  })
  describe('GET /v1/tenant/info:id', function () {
    it('should return success response with tenant as sunbird', function (done) {
      request.get(base_url + 'v1/tenant/info/sunbird', function (error, response, body) {
        expect(response.statusCode).toBe(200)
        done()
      })
    })
  })
})

// below method used to close server once all the specs are executed
var _finishCallback = jasmine.Runner.prototype.finishCallback
jasmine.Runner.prototype.finishCallback = function () {
  _finishCallback.bind(this)()
  server.close()
}

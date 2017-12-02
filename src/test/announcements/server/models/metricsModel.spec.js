let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  metricsModel = require('../../../../app/helpers/announcement/model/MetricsModel.js'),
  Joi = require('joi')

describe('Metrics Model', () => {
  describe('validateApi Method', () => {
    it('Should not throw an error, When valid object is passed.', (done) => {
      let requestObj = {
        request: {
          announcementId: '432-43-242',
          channel: 'web'
        }
      }
      let validation = metricsModel.validateApi(requestObj)
      expect(validation.isValid).to.be.equal(true)
      done()
    })

    it('Should throw an error, When invalid object is passed', (done) => {
      let requestObj = {
        id: '432-43-42',
        announcementid: ''
      }
      let validation = metricsModel.validateApi(requestObj)
      expect(validation.isValid).to.be.equal(false)
      done()
    })
  })
  describe('validateModel Method ', () => {
    it('Should not throw an error,When valid object is passed', (done) => {
      let requestObj = {
        id: '123-534-543',
        userid: '423-423-4-423',
        announcementid: '4324-423-432-423-432',
        activity: 'test-activity',
        channel: 'web',
        createddate: '12-1-28'
      }
      let validation = metricsModel.validateModel(requestObj)
      expect(validation.isValid).to.be.equal(true)
      expect(validation.error).to.be.equal(undefined)
      done()
    })
    it('Should throw an error, When invalid object is passed', (done) => {
      let requestObj = {}
      let validation = metricsModel.validateModel(requestObj)
      expect(validation.isValid).to.be.equal(false)
      expect(validation.error).to.not.equal(undefined)
      done()
    })
  })

  describe('getModelSubSchema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = metricsModel.getModelSubSchema('userid')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = metricsModel.getModelSubSchema('userid-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
  describe('getAPiSubSchema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = metricsModel.getApiSubSchema('request.announcementId')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = metricsModel.getApiSubSchema('sourceId-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
})

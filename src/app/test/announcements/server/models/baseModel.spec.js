let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  BaseModel = require('../../../../app/helpers/announcement/model/BaseModel.js'),
  Joi = require('joi')

describe('Base Metrics Model', () => {
  let modelSchema = Joi.object().keys({
    request: Joi.object().keys({
      announcementId: Joi.string().required(),
      channel: Joi.string().required()
    }).required()
  })
  let apiSchema = Joi.object().keys({
    request: Joi.object().keys({
      channel: Joi.string().required()
    }).required()
  })
  let baseClass = new BaseModel(modelSchema, apiSchema)
  describe('validate Method', () => {
    it('Should not throw an error, When valid object and schema is passed.', (done) => {
      let requestObj = {
        request: {
          channel: 'web'
        }
      }

      let validation = baseClass.validate(requestObj, apiSchema)
      expect(validation.isValid).to.be.equal(true)
      done()
    })

    it('Should throw an error, When invalid object and valid schema is passed', (done) => {
      let requestObj = {
        request: {
          channel: 123
        }
      }

      let validation = baseClass.validate(requestObj, apiSchema)
      expect(validation.isValid).to.be.equal(false)
      done()
    })
  })

  describe('modelSubschema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = baseClass.modelSubSchema('request.announcementId')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = baseClass.modelSubSchema('userid-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
  describe('apiSubschema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = baseClass.apiSubSchema('request.channel')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = baseClass.apiSubSchema('sourceId-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
})

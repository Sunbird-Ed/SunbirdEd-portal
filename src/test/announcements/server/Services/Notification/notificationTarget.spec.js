let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  NotificationTarget = require('../../../../../app/helpers/announcement/services/notification/notificationTarget.js'),
  Joi = require('joi')

describe('Notification Target', () => {
  describe('Validate Schema', (done) => {
    it('Should not throw an error, When valid object is passed.', (done) => {
      let targetObj = {geo: {ids: ['1235-3454']}}
      let target = new NotificationTarget({target: targetObj})
      let targetValidation = target.validate()
      expect(targetValidation.isValid).to.be.equal(true)
      done()
    })

    it('Should throw an error, When invalid object is passed', (done) => {
      let target = new NotificationTarget({target: {}})
      let targetValidation = target.validate()
      expect(targetValidation.isValid).to.be.equal(false)
      done()
    })
  })
})

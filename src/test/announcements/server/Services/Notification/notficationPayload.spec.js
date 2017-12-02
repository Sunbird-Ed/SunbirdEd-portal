let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  NotificationSerivce = require('../../../../../app/helpers/announcement/services/notification/notificationService.js'),
  NotificationPayload = require('../../../../../app/helpers/announcement/services/notification/notificationPayload.js'),
  NotificationTarget = require('../../../../../app/helpers/announcement/services/notification/notificationTarget.js'),
  Joi = require('joi')

describe('Notification Payload', () => {
  describe('Validate Schema', () => {
    it('Should not throw an error, When valid object is passed.', (done) => {
      let payload = new NotificationPayload({
        'msgid': '43432-43-432',
        'title': 'Test-Announcement',
        'msg': 'Test-Message',
        'icon': '',
        'time': '',
        'validity': '-1',
        'actionid': '1',
        'actiondata': '',
        'dispbehavior': 'stack'
      })
      let payloadValidation = payload.validate()
      expect(payloadValidation.isValid).to.be.equal(true)
      done()
    })

    it('Should throw an error, When invalid object is passed', (done) => {
      let payload = new NotificationPayload({
        'msg': 'Test-Message',
        'icon': '',
        'validity': '-1',
        'actionid': '1',
        'actiondata': '',
        'dispbehavior': 'stack'
      })
      let payloadValidation = payload.validate()
      expect(payloadValidation.isValid).to.be.equal(false)
      done()
    })
  })
})

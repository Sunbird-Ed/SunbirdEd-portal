let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  NotificationSerivce = require('../../../../../app/helpers/announcement/services/notification/notificationService.js'),
  NotificationPayload = require('../../../../../app/helpers/announcement/services/notification/notificationPayload.js'),
  NotificationTarget = require('../../../../../app/helpers/announcement/services/notification/notificationTarget.js'),
  Joi = require('joi')

describe('Notification Service', () => {
  let services
  let target
  let payload
  before(() => {
    payload = new NotificationPayload({
      'msgid': '43432-43-432',
      'title': 'Test-Announcement',
      'msg': 'Test-Message',
      'icon': '',
      'validity': '-1',
      'actionid': '1',
      'actiondata': '',
      'dispbehavior': 'stack'
    })
    target = new NotificationTarget({
      'geo': {
        'ids': ['0123668622585610242', '0123668627050987529']
      }
    })
    service = new NotificationSerivce()
  })

  describe('Send Method', () => {
    it('Should send a notificaton', (done) => {
      service.send(target, payload)
        .then((data) => {
          expect(data).to.be.equal(true)
        })
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      done()
    })

    it('Should throw an error, when there is no instance of payload and target', () => {
      service.send(undefined, undefined)
        .then((data) => {
          expect(data).to.be.equal(false)
        })
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
        })
    })
  })
})

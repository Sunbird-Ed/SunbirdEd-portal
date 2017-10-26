let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../../app/server.js')
let sinon = require('sinon')
let announcementController = require('../../app/helpers/announcement/controller.js')

const expect = chai.expect
chai.use(chaiHttp)
const HOST = 'http://localhost:3000/api/plugin/announcement'

describe('Announcement routing service', function () {
  describe('/create API', function () {
    it('should call announcement controller create method', function (done) {
      let controllerSpy = sinon.spy(announcementController, 'create')
      let createRequest = {
        'request': {
          sourceId: 'district-org',
          createdBy: 'sunil',
          title: 'monthly status',
          type: 'announcement',
          description: 'some description',
          links: ['http://path-to-document'],
          target: ['teacher-orgs']
        }
      }
      chai.request(HOST)
        .post('/create')
        .send(createRequest)
        .end(function (err, res) {
          expect(controllerSpy.calledOnce).to.be.true
          done()
        })
    })
  })

  describe('/get/:id API', function () {
    it('should call announcement controller getAnnouncementById method', function (done) {
      let controllerSpy = sinon.spy(announcementController, 'getAnnouncementById')
      chai.request(HOST)
        .get('/get/234234')
        .end(function (err, res) {
          expect(controllerSpy.calledOnce).to.be.true
          done()
        })
    })
  })
})

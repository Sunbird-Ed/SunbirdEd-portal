let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../../../app/server.js')
let sinon = require('sinon')
let announcementController = require('../../../app/helpers/announcement/controller.js')

const expect = chai.expect
chai.use(chaiHttp)
const HOST = 'http://localhost:3000/api/announcement/v1'

describe('Announcement routing service', () => {
  describe('/create route', () => {
    it('should send SUCCESS response when valid request', (done) => {
      let createRequest = {'request': {sourceId: 'district-org', createdBy: 'sunil', title: 'monthly status', type: 'announcement', description: 'some description', links: ['http://path-to-document'], target: ['teacher-orgs'] } }
      let controllerStub = sinon.stub(announcementController, 'create')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({ data: 'announcement created' })
      }))

      chai.request(HOST)
        .post('/create')
        .send(createRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.announcement.create')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.eql('OK')
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body.result).to.eql({ data: 'announcement created' })

          announcementController.create.restore()
          done()
        })
    })

    it('should send ERROR response when bad request', (done) => {
      let createRequest = {'request': {sourceId: 'district-org', createdBy: 'sunil', title: 'monthly status', type: 'announcement', description: 'some description', links: ['http://path-to-document'], target: ['teacher-orgs'] } }
      let controllerStub = sinon.stub(announcementController, 'create')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'invalid request' })
      }))

      chai.request(HOST)
        .post('/create')
        .send(createRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.announcement.create')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.responseCode).to.eql('CLIENT_ERROR')
          expect(res).to.have.status(400)
          expect(res.body.params.errmsg).to.eql('invalid request')

          announcementController.create.restore()
          done()
        })
    })
  })

  describe('/get/:id route', () => {
    it('should send SUCCESS response when request is valid', (done) => {
      let responseData = { data: {'announcementId': '2344-1234-1234-12312', 'sourceId': 'some-organisation-id', 'createdBy': 'Creator1', 'createdOn': '2017-10-24', 'type': 'announcement', 'links': ['https://linksToOtheresources.com'], 'title': 'Monthy Status', 'description': 'some description', 'target': ['teachers'], 'attachments': [{'title': 'circular.pdf', 'downloadURL': 'https://linktoattachment', 'mimetype': 'application/pdf'} ] } }
      let controllerStub = sinon.stub(announcementController, 'getAnnouncementById')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve(responseData)
      }))

      chai.request(HOST)
        .get('/get/2344-1234-1234-12312')
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.announcement.get.id')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.eql('OK')
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql(responseData)

          announcementController.getAnnouncementById.restore()
          done()
        })
    })

    it('should send ERROR response when ID does not exist', (done) => {
      let controllerStub = sinon.stub(announcementController, 'getAnnouncementById')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'record does not exist!'})
      }))

      chai.request(HOST)
        .get('/get/2344-1234-1234-12312')
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.announcement.get.id')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.eql('record does not exist!')
          expect(res.body.responseCode).to.eql('CLIENT_ERROR')
          expect(res).to.have.status(400)
          expect(res.body.result).to.eql({})

          announcementController.getAnnouncementById.restore()
          done()
        })
    })
  })
})

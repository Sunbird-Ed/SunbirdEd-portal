let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../../app/server.js')
let sinon = require('sinon')
let ThreadController = require('../../app/helpers/discussion/threadController.js')
let threadModel = require('../../app/helpers/discussion/models/threadModel.js')
let replyModel = require('../../app/helpers/discussion/models/replyModel.js')
let actionsModel = require('../../app/helpers/discussion/models/actionsModel.js')

let ThreadService = require('../../app/helpers/discussion/services/threadService.js')
let threadController = new ThreadController({
  threadModel: threadModel,
  replyModel: replyModel,
  actionsModel: actionsModel
})

threadController.threadService = new ThreadService(null)
const expect = chai.expect
chai.use(chaiHttp)
const HOST = 'http://localhost:3000/discussions/v1'
let threads = {
  'threads': [{
    'id': 2181267,
    'author': {
      'userName': 'sunil1as990',
      'name': 'Sunil'
    },
    'body': 'test 62310112-1260-4c9b-a928-e2ec6837ab6d 6ce998fd-564a-486d-b221-9d52ce3ef166',
    'title': 'Discussion test data a55c669a-3a37-4d4a-a713-7b61276674c4',
    'createdDate': '2018-03-13T06:37:03.222Z',
    'repliesCount': 0,
    'voteCount': 0,
    'seen': true,
    'archived': false,
    'locked': false
  }]
}
describe('Discussion routing service', () => {
  describe('/list route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'getThreads')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve(threads)
      }))
    })
    afterEach(() => {
      ThreadController.prototype.getThreads.restore()
    })
    it('should send SUCCESS response when valid request', (done) => {
      let listRequest = {
        'request': {
          'contextId': '01245108888897126415',
          'type': 'qna'
        }
      }

      chai.request(HOST)
        .post('/list')
        .send(listRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.list-threads')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql(threads)
          done()
        })
    })
  })

  describe('/thread/create route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'createThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'id': 2181269
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.createThread.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      let createRequest = {
        request: {
          'title': 'discussion test data info',
          'body': 'test description info',
          'contextId': '01245108888897126415',
          'type': 'qna',
          'contextType': 'batch',
          'config': {
            'upVote': true,
            'downVote': true,
            'acceptAnswer': true,
            'flag': true
          }
        }
      }

      chai.request(HOST)
        .post('/thread/create')
        .send(createRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.create-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'id': 2181269
          })
          done()
        })
    })
  })
  describe('/thread/create failed route', () => {
    let createRequest = {

    }
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'createThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        throw {
          status: 400,
          message: [{
            field: 'request',
            description: 'request is required'
          }]
        }
      }))
    })
    afterEach(() => {
      ThreadController.prototype.createThread.restore()
    })
    it('should send ERROR response when request is invalid', (done) => {
      chai.request(HOST)
        .post('/thread/create')
        .send(createRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.create-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg.length).to.greaterThan(0)
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body.result).to.eql({})
          done()
        })
    })
  })

  describe('/thread/:id route', () => {
    let responseData = {
      'thread': {
        'id': 2181267,
        'author': {
          'userName': 'sunil1as990',
          'name': 'Sunil'
        },
        'body': 'test 62310112-1260-4c9b-a928-e2ec6837ab6d 6ce998fd-564a-486d-b221-9d52ce3ef166',
        'title': 'Discussion test data a55c669a-3a37-4d4a-a713-7b61276674c4',
        'createdDate': '2018-03-13T06:37:03.222Z',
        'repliesCount': 0,
        'voteCount': 0,
        'read': true,
        'posters': [{
          'userId': 2080060,
          'userName': 'sunil1as990'
        }],
        'replies': [],
        'actions': {
          'flag': 0,
          'downVote': -1
        },
        'descId': 2181359,
        'archived': false,
        'locked': false,
        'config': {
          'upVote': true,
          'downVote': true,
          'acceptAnswer': true,
          'flag': true
        }
      }
    }

    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'getThreadById')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve(responseData)
      }))
    })
    afterEach(() => {
      ThreadController.prototype.getThreadById.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      chai.request(HOST)
        .get('/thread/2181267')
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.get-thread-by-id')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.eql('OK')
          expect(res).to.have.status(200)
          expect(res.body.result.thread.id).to.eql(2181267)
          done()
        })
    })
  })
  describe('/thread/:id failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'getThreadById')
      controllerStub.returns(new Promise((resolve, reject) => {
        throw {
          status: 404,
          message: 'Not Found'
        }
      }))
    })
    afterEach(() => {
      ThreadController.prototype.getThreadById.restore()
    })
    it('should send Error response when request is invalid', (done) => {
      chai.request(HOST)
        .get('/thread/21812677')
        .end((err, res) => {
          console.log(res.body)
          expect(res.body.id).to.eql('api.plugin.discussions.get-thread-by-id')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('Not Found')
          expect(res.body.responseCode).to.eql('NOT_FOUND')
          expect(res).to.have.status(404)
          expect(res.body.result).to.eql({})
          done()
        })
    })
  })
  describe('/thread/reply route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'replyThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          replyId: 123456
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.replyThread.restore()
    })
    it('should create reply and send SUCCESS response with reply id when valid request', (done) => {
      let replyRequest = {
        'request': {
          'threadId': '2181267',
          'body': 'test body info data'
        }
      }

      chai.request(HOST)
        .post('/thread/reply')
        .send(replyRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.reply-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            replyId: 123456
          })
          done()
        })
    })
  })
  describe('/thread/reply error route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'replyThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({})
      }))
    })
    afterEach(() => {
      ThreadController.prototype.replyThread.restore()
    })
    it('should send appropriate ERROR for Invalid request', (done) => {
      let replyRequest = {
        'threadId': '2181267',
        'body': 'test body info data'
      }
      chai.request(HOST)
        .post('/thread/reply')
        .send(replyRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.reply-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).not.to.equal('')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).not.to.have.status(200)
          expect(res.body.result).to.eql({})
          done()
        })
    })
  })
  describe('/thread/vote route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'voteThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.voteThread.restore()
    })
    it('should vote thread and send SUCCESS response when valid request', (done) => {
      let voteRequest = {
        'postId': '2181267',
        'value': 'up'
      }

      chai.request(HOST)
        .post('/thread/vote')
        .send(voteRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.vote-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/vote failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'voteThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          status: 403,
          message: 'Not Authorised'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.voteThread.restore()
    })
    it('should send appropriate ERROR for Invalid request', (done) => {
      let voteRequest = {
        'postId': '2181267',
        'value': 'up'
      }
      chai.request(HOST)
        .post('/thread/vote')
        .send(voteRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.vote-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).not.to.equal('')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).not.to.have.status(200)
          expect(res.body.result).to.eql({})
          done()
        })
    })
  })

  describe('/thread/flag route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'flagThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.flagThread.restore()
    })
    it('should flag thread and send SUCCESS response when valid request', (done) => {
      let flagRequest = {
        'postId': '2181267'
      }

      chai.request(HOST)
        .post('/thread/flag')
        .send(flagRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.flag-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/flag failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'flagThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          status: 403,
          message: 'Not Authorised'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.flagThread.restore()
    })
    it('should send appropriate ERROR for Invalid request', (done) => {
      let flagRequest = {
        'postId': '2181267'
      }

      chai.request(HOST)
        .post('/thread/flag')
        .send(flagRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.flag-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).not.to.equal('')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).not.to.have.status(200)
          expect(res.body.result).to.eql({})
          done()
        })
    })
  })
  describe('/thread/edit route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'editThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.editThread.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      let editRequest = {
        request: {
          'title': 'discussion test data info',
          'body': 'test description info',
          'threadId': '2181257',
          'descId': '2181990'
        }
      }

      chai.request(HOST)
        .put('/thread/edit')
        .send(editRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.edit-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/edit failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'editThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          'status': 403,
          'message': 'This action requires moderation rights'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.editThread.restore()
    })
    it('should send ERROR response when request is invalid', (done) => {
      let editRequest = {
        'title': 'discussion test data info',
        'body': 'test description info',
        'threadId': '2181257',
        'descId': '2181990'
      }

      chai.request(HOST)
        .put('/thread/edit')
        .send(editRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.edit-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('This action requires moderation rights')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body.result).not.to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/reply/edit route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'editReply')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.editReply.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      let editRequest = {
        'body': 'test description info',
        'postId': '2181990'
      }

      chai.request(HOST)
        .put('/reply/edit')
        .send(editRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.edit-reply')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/reply/edit failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'editReply')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          'status': 403,
          'message': 'This action requires moderation rights'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.editReply.restore()
    })
    it('should send ERROR response when request is invalid', (done) => {
      let editRequest = {
        'body': 'test description info',
        'postId': '2181990'
      }

      chai.request(HOST)
        .put('/reply/edit')
        .send(editRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.edit-reply')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('This action requires moderation rights')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body.result).not.to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/archive route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'archiveThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.archiveThread.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      let archiveRequest = {
        'threadId': '2181990'
      }

      chai.request(HOST)
        .delete('/thread/archive')
        .send(archiveRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.archive-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/archive failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'archiveThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          'status': 403,
          'message': 'This action requires moderation rights'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.archiveThread.restore()
    })
    it('should send ERROR response when request is invalid', (done) => {
      let archiveRequest = {
        'threadId': '2181990'
      }

      chai.request(HOST)
        .delete('/thread/archive')
        .send(archiveRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.archive-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('This action requires moderation rights')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body.result).not.to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/lock route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'lockThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.lockThread.restore()
    })
    it('should send SUCCESS response when request is valid', (done) => {
      let lockRequest = {
        'threadId': '2181990'
      }

      chai.request(HOST)
        .delete('/thread/lock')
        .send(lockRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.lock-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/lock failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'lockThread')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          'status': 403,
          'message': 'This action requires moderation rights'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.lockThread.restore()
    })
    it('should send ERROR response when request is invalid', (done) => {
      let lockRequest = {
        'threadId': '2181990'
      }

      chai.request(HOST)
        .delete('/thread/lock')
        .send(lockRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.lock-thread')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('This action requires moderation rights')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body.result).not.to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/markanswer route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'markAsAnswer')
      controllerStub.returns(new Promise((resolve, reject) => {
        resolve({
          'status': 'done'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.markAsAnswer.restore()
    })
    it('should mark answer  and send SUCCESS response when valid request', (done) => {
      let markAnswerRequest = {
        'postId': '2181267'
      }

      chai.request(HOST)
        .post('/thread/markanswer')
        .send(markAnswerRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.mark-answer')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('successful')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).to.equal('')
          expect(res.body.responseCode).to.equal('OK')
          // expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.result).to.eql({
            'status': 'done'
          })
          done()
        })
    })
  })
  describe('/thread/markanswer failed route', () => {
    beforeEach(() => {
      let controllerStub = sinon.stub(ThreadController.prototype, 'markAsAnswer')
      controllerStub.returns(new Promise((resolve, reject) => {
        reject({
          status: 403,
          message: 'Not Authorised'
        })
      }))
    })
    afterEach(() => {
      ThreadController.prototype.markAsAnswer.restore()
    })
    it('should send appropriate ERROR for Invalid request', (done) => {
      let markAnswerRequest = {
        'postId': '2181267'
      }

      chai.request(HOST)
        .post('/thread/markanswer')
        .send(markAnswerRequest)
        .end((err, res) => {
          expect(res.body.id).to.eql('api.plugin.discussions.mark-answer')
          expect(res.body.ver).to.be.eql('1.0')
          expect(res.body.ts).to.be.a('string')
          expect(res.body.params.resmsgid).to.be.a('string')
          expect(res.body.params.msgid).to.be.a('null')
          expect(res.body.params.status).to.equal('failed')
          expect(res.body.params.err).to.equal('')
          expect(res.body.params.errmsg).not.to.equal('')
          expect(res.body.responseCode).to.equal('CLIENT_ERROR')
          // expect(err).to.be.null
          expect(res).not.to.have.status(200)
          expect(res.body.result).to.eql({})

          done()
        })
    })
  })
})

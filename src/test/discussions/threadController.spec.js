let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes')
let ThreadController = require('../../app/helpers/discussion/threadController.js')
let ThreadService = require('../../app/helpers/discussion/services/threadService.js')
let threadModel = require('../../app/helpers/discussion/models/threadModel.js')
let replyModel = require('../../app/helpers/discussion/models/replyModel.js')
let actionsModel = require('../../app/helpers/discussion/models/actionsModel.js')
let testData = require('./discussionTestData')
let headers = {
  'x-authenticated-user-token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiI1Yjk5N2RiNy03MGIyLTRhMjMtYTIyNi05OGU2NTdjYzAyYTgiLCJleHAiOjE1MjE0NDQzNTksIm5iZiI6MCwiaWF0IjoxNTIxNDQzNzU5LCJpc3MiOiJodHRwczovL2Rldi5vcGVuLXN1bmJpcmQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhZG1pbi1jbGkiLCJzdWIiOiIxNTllOTNkMS1kYTBjLTQyMzEtYmU5NC1lNzViMGMyMjZkN2MiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI5MmU1NWMxOC0yZWQ0LTQ1OTItOWViOS03MTMzNjQ3NzhiYzUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6IlN1bmlsIFBhbmRpdGgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzdW5pbDFhczk5MCIsImdpdmVuX25hbWUiOiJTdW5pbCIsImZhbWlseV9uYW1lIjoiUGFuZGl0aCIsImVtYWlsIjoic3VuaWwuc2x2cHNoc25AZ21haWwuY29tIn0.ESovX_KVGpjGsaJFk8JmCdlqGJXLJGKV2UF9iWgAIoy5fmtSWTDE10-TKWN0EdvekS7QbjC6WDcaAD9pWTm9TFUhR-qx6QowO6h4ssyNzY0JTrcT9bKY29lOegRNG4hyjhNcGFgldCahQ4M8wJM4fgamlSAel8kM3c1bH-PKdw6e1v0csWrW75iPRs33TmiEcSPBK0kbtzowTas6_0vWXW51e3TVPUQur4rFp0hXopgLa8OkE1LnmRsrqnsTjYDwMgp5LZ6a4H_z2CfdBkAPF7CbP7UhK7tgeLR0doZJVcZBPvlavvQkSJ-H_cXR0gIXcUuJGtZcGvlzHpyRYVvgwg'
}
let userProfile = testData.userProfile
let threads = testData.threadsList
let threadDetails = testData.threadDetails
chai.use(chaiHttp)

let threadController = new ThreadController({
  threadModel: threadModel,
  replyModel: replyModel,
  actionsModel: actionsModel
})
threadController.threadService = new ThreadService(null)
let newThreadId = 123456
let getTokenStub
let getUserProfileStub

describe('thread controller', () => {
  beforeEach(() => {
    getTokenStub = sinon.stub(threadController.userService, 'getToken')
    getUserProfileStub = sinon.stub(threadController.userService, 'getUserProfile')
    getTokenStub.returns(new Promise((resolve, reject) => {
      resolve(headers['x-authenticated-user-token'])
    }))
    getUserProfileStub.returns(new Promise((resolve, reject) => {
      resolve(userProfile)
    }))
  })

  afterEach(() => {
    threadController.userService.getToken.restore()
    threadController.userService.getUserProfile.restore()
  })

  let CreateThreadStub = null

  describe('create method', () => {
    beforeEach(() => {
      CreateThreadStub = sinon.stub(threadController.threadService, 'createThread')
      CreateThreadStub.returns(new Promise((resolve, reject) => {
        resolve(newThreadId)
      }))
    })

    afterEach(() => {
      threadController.threadService.createThread.restore()
    })
    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {
          request: {}
        },
        headers: headers
      }

      return threadController.createThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should create thread if user exist and data is valid', (done) => {
      let validRequest = {
        'body': {
          'request': {
            'title': 'discussion test data test',
            'body': 'testsample body for data test info',
            'contextId': '01245108888897126415',
            'contextType': 'batch',
            'type': 'qna',
            'config': {
              'upVote': true,
              'downVote': true,
              'acceptAnswer': true,
              'flag': true
            }
          }
        }
      }

      threadController.createThread(validRequest)
        .then((data) => {
          expect(data).to.eql({
            id: newThreadId
          })
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('edit thread method', () => {
    beforeEach(() => {
      let editThreadStub = sinon.stub(threadController.threadService, 'editThread')
      editThreadStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.editThread.restore()
    })

    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }
      return threadController.editThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should edit thread if user exist and data is valid', (done) => {
      let validRequest = {
        'body': {
          'request': {
            'title': 'discussion test data info',
            'body': 'test description info',
            'threadId': '2181257',
            'descId': '2181990'
          }
        }
      }
      threadController.editThread(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })

  describe('list method', () => {
    beforeEach(() => {
      let getThreadsListStub = sinon.stub(threadController.threadService, 'getThreadsList')
      getThreadsListStub.returns(new Promise((resolve, reject) => {
        resolve(threads)
      }))
    })
    afterEach(() => {
      threadController.threadService.getThreadsList.restore()
    })
    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {}
      }

      return threadController.getThreads(requestWithEmptyObject)
        .then((data) => {

        })
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should return threads when request structure is valid', (done) => {
      // Invalid request 1
      let requestList = {
        body: {
          'request': {
            'contextId': '01245108888897126415',
            'type': 'qna'
          }
        }
      }
      threadController.getThreads(requestList)
        .then((data) => {
          expect(data.threads).to.eql(threads)
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('getbyid method', () => {
    beforeEach(() => {
      let getThreadByIdStub = sinon.stub(threadController.threadService, 'getThreadById')
      getThreadByIdStub.returns(new Promise((resolve, reject) => {
        resolve(threadDetails)
      }))
    })
    afterEach(() => {
      threadController.threadService.getThreadById.restore()
    })
    it('should return thread details when thread id param is present', (done) => {
      // Invalid request 1
      let requestByIdObj = {
        params: {
          'id': '2181269'
        }
      }
      threadController.getThreadById(requestByIdObj)
        .then((data) => {
          expect(data.thread['id']).to.eql(threadDetails['id'])
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('reply thread method', () => {
    beforeEach(() => {
      let replyThreadStub = sinon.stub(threadController.threadService, 'replyThread')
      replyThreadStub.returns(new Promise((resolve, reject) => {
        resolve(newThreadId)
      }))
    })
    afterEach(() => {
      threadController.threadService.replyThread.restore()
    })

    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {
          request: {}
        },
        headers: headers
      }
      return threadController.replyThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should add reply to thread if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          'request': {
            'threadId': '2181269',
            'body': 'test body info datasss sssss'
          }
        }
      }

      threadController.replyThread(validRequest)
        .then((data) => {
          expect(data.id).to.eql(newThreadId)
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('vote thread method', () => {
    beforeEach(() => {
      let voteThreadStub = sinon.stub(threadController.threadService, 'voteThread')
      voteThreadStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.voteThread.restore()
    })

    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }
      return threadController.voteThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should vote thread if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          'request': {
            'postId': '2181267',
            'value': 'up'
          }
        }
      }
      threadController.voteThread(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('flag thread method', () => {
    beforeEach(() => {
      let flagThreadStub = sinon.stub(threadController.threadService, 'flagThread')
      flagThreadStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.flagThread.restore()
    })
    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }

      return threadController.flagThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should flag thread if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          'request': {
            'postId': '2181267'
          }
        }
      }

      threadController.flagThread(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('archive thread method', () => {
    beforeEach(() => {
      let archiveThreadStub = sinon.stub(threadController.threadService, 'archiveThread')
      archiveThreadStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.archiveThread.restore()
    })
    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }

      return threadController.archiveThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should archive thread if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          'request': {
            'threadId': '2181267'
          }
        }
      }

      threadController.archiveThread(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('lock thread method', () => {
    beforeEach(() => {
      let lockThreadStub = sinon.stub(threadController.threadService, 'lockThread')
      lockThreadStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.lockThread.restore()
    })
    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }

      return threadController.lockThread(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should lock thread if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          'request': {
            'threadId': '2181267'
          }
        }
      }

      threadController.lockThread(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })

  describe('edit reply method', () => {
    beforeEach(() => {
      let editReplyStub = sinon.stub(threadController.threadService, 'editReply')
      editReplyStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.editReply.restore()
    })

    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }

      return threadController.editReply(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should edit reply if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          request: {
            'body': 'test description info',
            'postId': '2181257'
          }
        }
      }

      threadController.editReply(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('mark answer method', () => {
    beforeEach(() => {
      let markAsAnswerStub = sinon.stub(threadController.threadService, 'markAsAnswer')
      markAsAnswerStub.returns(new Promise((resolve, reject) => {
        resolve('done')
      }))
    })

    afterEach(() => {
      threadController.threadService.markAsAnswer.restore()
    })

    it('should throw errors when request structure is invalid', () => {
      // Invalid request 1
      let requestWithEmptyObject = {
        body: {},
        headers: headers
      }

      return threadController.markAsAnswer(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.message.length).to.greaterThan(0)
        })
    })
    it('should mark post as answer if user exist and data is valid', (done) => {
      let validRequest = {
        body: {
          request: {
            'postId': '2181267'
          }
        }
      }

      threadController.markAsAnswer(validRequest)
        .then((data) => {
          expect(data.status).to.eql('done')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
})

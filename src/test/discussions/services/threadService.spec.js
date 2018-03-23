let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes')
let async = require('asyncawait/async')
let testData = require('../discussionTestData')
let DiscouseAdapter = require('../../../app/helpers/discussion/services/adapters/discourseAdapter.js')
let GroupService = require('../../../app/helpers/discussion/services/groupService.js')
let ThreadService = require('../../../app/helpers/discussion/services/threadService.js')
let threadService = new ThreadService(new DiscouseAdapter({}))
threadService.groupService = new GroupService()
let userProfile = testData.userProfile
let newThreadId = 123456
let groupId = 'de3ccc5f-9fe0-467a-86f7-7ba176db5990'
let threadData = {
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
let threadDetails = {
  'id': 2181269,
  'author': {
    'userName': 'sunil1as990',
    'name': 'Sunil'
  },
  'body': 'test 5aae22e2-a785-4485-a301-6aa32470c085 ff75b3fd-bf9c-4324-b8f0-7706ec36e4de',
  'title': 'Discussion test data 90a847e9-199a-4bbf-8a88-e568c45f7bd6',
  'createdDate': '2018-03-13T06:38:53.998Z',
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
  'descId': 2181361,
  'archived': false,
  'locked': false,
  'config': {
    'upVote': true,
    'downVote': true,
    'acceptAnswer': true,
    'flag': true
  }
}
let userData = {
  userName: userProfile.userName,
  firstName: userProfile.firstName,
  email: userProfile.email,
  userId: userProfile.userId
}
let editThreadData = {
  'threadId': '2181257',
  'title': 'test title topic edededededededed',
  'body': 'to description for jj test ededededed',
  'descId': '2181335'
}
let editReplyData = {
  'postId': '2181257',
  'body': 'to description for jj test wdededexxx'
}
let replyData = {
  'id': 2181299,
  'username': 'sunil1as990'
}
let threadsList = [{
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
describe('thread service', () => {
  let getOrCreateGroupStub = sinon.stub(threadService.groupService, 'getOrCreateGroup')
  getOrCreateGroupStub.returns(new Promise((resolve, reject) => {
    resolve(groupId)
  }))
  let getThreadConfigStub = sinon.stub(threadService.groupService, 'getThreadConfig')
  getThreadConfigStub.returns(new Promise((resolve, reject) => {
    resolve({
      'upVote': true,
      'downVote': true,
      'acceptAnswer': true,
      'flag': true
    })
  }))
  let createThreadStub = sinon.stub(threadService.discussionAdapter, 'createThread')
  createThreadStub.returns(new Promise((resolve, reject) => {
    resolve(newThreadId)
  }))
  let addThreadConfigStub = sinon.stub(threadService.groupService, 'addThreadConfig')
  addThreadConfigStub.returns(new Promise((resolve, reject) => {
    resolve(true)
  }))
  let checkModerationAccessStub = sinon.stub(threadService.groupService, 'checkModerationAccess')
  checkModerationAccessStub.returns(new Promise((resolve, reject) => {
    resolve(true)
  }))
  let grantModerationStub = sinon.stub(threadService.discussionAdapter, 'grantModeration')
  grantModerationStub.returns(new Promise((resolve, reject) => {
    resolve(true)
  }))
  let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
  editThreadStub.returns(new Promise((resolve, reject) => {
    resolve('done')
  }))
  let editReplyStub = sinon.stub(threadService.discussionAdapter, 'editReply')
  editReplyStub.returns(new Promise((resolve, reject) => {
    resolve('done')
  }))
  let revokeModerationStub = sinon.stub(threadService.discussionAdapter, 'revokeModeration')
  revokeModerationStub.returns(new Promise((resolve, reject) => {
    resolve(true)
  }))
  let getReplyByIdStub = sinon.stub(threadService.discussionAdapter, 'getReplyById')
  getReplyByIdStub.returns(new Promise((resolve, reject) => {
    resolve({replyData})
  }))
  let moderationActionStub = sinon.stub(threadService.discussionAdapter, 'moderationAction')
  moderationActionStub.returns(new Promise((resolve, reject) => {
    resolve('done')
  }))
  let replyThreadStub = sinon.stub(threadService.discussionAdapter, 'replyThread')
  replyThreadStub.returns(new Promise((resolve, reject) => {
    resolve(2181299)
  }))

  let getThreadsListStub = sinon.stub(threadService.discussionAdapter, 'getThreadsList')
  getThreadsListStub.returns(new Promise((resolve, reject) => {
    resolve(threadsList)
  }))
  let getThreadByIdStub = sinon.stub(threadService.discussionAdapter, 'getThreadById')
  getThreadByIdStub.returns(new Promise((resolve, reject) => {
    resolve(threadDetails)
  }))

  beforeEach(() => {

  })
  afterEach(() => {

  })
  describe('create thread service method', () => {
    it('should give success response if thread created successfully by adapter', async(() => {
      try {
        return threadService.createThread(threadData, userData)
          .then((data) => {
            expect(data).to.eql(newThreadId)
            getOrCreateGroupStub.restore()
            createThreadStub.restore()
            addThreadConfigStub.restore()
          }, (error) => {
            console.log('err ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give valid error response if thread is not created by adapter', async(() => {
      try {
        let getOrCreateGroupStub = sinon.stub(threadService.groupService, 'getOrCreateGroup')
        getOrCreateGroupStub.returns(new Promise((resolve, reject) => {
          resolve(undefined)
        }))
        return threadService.createThread(threadData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            getOrCreateGroupStub.restore()
            createThreadStub.restore()
            addThreadConfigStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('edit thread service method', () => {
    it('should give success response if thread edited successfully by adapter', async(() => {
      try {
        return threadService.editThread(editThreadData, userData)
          .then((data) => {
            expect(data).to.eql('done')
            checkModerationAccessStub.restore()
            grantModerationStub.restore()
            editThreadStub.restore()
            editReplyStub.restore()
            revokeModerationStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give valid error response if thread is not edited by adapter', async(() => {
      try {
        // let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
        editThreadStub.returns(new Promise((resolve, reject) => {
          reject({
            message: 'Error in editing thread',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        }))
        return threadService.editThread(editThreadData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            checkModerationAccessStub.restore()
            grantModerationStub.restore()
            editThreadStub.restore()
            editReplyStub.restore()
            revokeModerationStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('edit reply service method', () => {
    it('should give success response if reply edited successfully by adapter', async(() => {
      try {
        return threadService.editReply(editReplyData, userData)
          .then((data) => {
            expect(data).to.eql('done')
            getReplyByIdStub.restore()
            checkModerationAccessStub.restore()
            grantModerationStub.restore()
            editReplyStub.restore()
            revokeModerationStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give valid error response if reply is not edited by adapter', async(() => {
      try {
        // let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
        editReplyStub.returns(new Promise((resolve, reject) => {
          reject({
            message: 'Error in editing reply',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        }))
        return threadService.editReply(editReplyData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            getReplyByIdStub.restore()
            checkModerationAccessStub.restore()
            grantModerationStub.restore()
            editReplyStub.restore()
            revokeModerationStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('check moderation access service method', () => {
    it('should give true response if moderation access is allowed', async(() => {
      try {
        return threadService.checkModerationAccess(editReplyData, userData)
          .then((data) => {
            expect(data.access).to.eql(true)
            checkModerationAccessStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give false response if moderation access is not allowed', async(() => {
      try {
        // let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
        checkModerationAccessStub.returns(new Promise((resolve, reject) => {
          resolve(false)
        }))
        return threadService.checkModerationAccess(editReplyData, userData)
          .then((data) => {
            expect(data.access).to.eql(false)
            checkModerationAccessStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('archive thread  service method', () => {
    it('should give true response if archive response is success', async(() => {
      try {
        let moderationData = {threadId: editThreadData.threadId}
        return threadService.archiveThread(moderationData, userData)
          .then((data) => {
            expect(data).to.eql('done')
            moderationActionStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give error response if archive response is error', async(() => {
      try {
        let moderationData = {threadId: editThreadData.threadId}
        // let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
        moderationActionStub.returns(new Promise((resolve, reject) => {
          reject({status: 403, message: 'This action requires moderation rights'})
        }))
        return threadService.archiveThread(moderationData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(403)
            checkModerationAccessStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('lock thread  service method', () => {
    it('should give true response if lock response is success', async(() => {
      try {
        let moderationData = {threadId: editThreadData.threadId}
        return threadService.lockThread(moderationData, userData)
          .then((data) => {
            expect(data).to.eql('done')
            moderationActionStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give error response if lock response is error', async(() => {
      try {
        let moderationData = {threadId: editThreadData.threadId}
        // let editThreadStub = sinon.stub(threadService.discussionAdapter, 'editThread')
        moderationActionStub.returns(new Promise((resolve, reject) => {
          reject({status: 500, message: 'Error occured.Try again'})
        }))
        return threadService.lockThread(moderationData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            checkModerationAccessStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('reply thread  service method', () => {
    it('should give true response if reply response is success', async(() => {
      try {
        return threadService.replyThread(replyData, userData)
          .then((data) => {
            expect(data).to.eql(replyData.id)
            replyThreadStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give error response if reply response is error', async(() => {
      try {
        replyThreadStub.returns(new Promise((resolve, reject) => {
          reject({status: 500, message: 'Error occured.Try again'})
        }))
        return threadService.replyThread(replyData, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            replyThreadStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('list thread  service method', () => {
    it('should give true response if thread list is returned', async(() => {
      try {
        return threadService.getThreadsList({
          'contextId': '01245108888897126412',
          'type': 'qna'
        }, userData)
          .then((data) => {
            expect(data.length).to.eql(threadsList.length)
            getThreadsListStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give error response if list response is error', async(() => {
      try {
        getThreadsListStub.returns(new Promise((resolve, reject) => {
          reject({status: 500, message: 'Error occured.Try again'})
        }))
        return threadService.getThreadsList({
          'contextId': '01245108888897126412',
          'type': 'qna'
        }, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            getThreadsListStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
  describe('thread details service method', () => {
    it('should give true response if thread details is returned', async(() => {
      try {
        return threadService.getThreadById(2181269, userData)
          .then((data) => {
            expect(data.id).to.eql(threadDetails.id)
            getThreadByIdStub.restore()
          }, (error) => {
            console.log('errs ', error)
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
    it('should give error response if thread details response is error', async(() => {
      try {
        getThreadByIdStub.returns(new Promise((resolve, reject) => {
          reject({status: 500, message: 'Error occured.Try again'})
        }))
        return threadService.getThreadById(2181269, userData)
          .then((data) => {

          }, (error) => {
            expect(error.status).to.eql(500)
            getThreadByIdStub.restore()
          })
          .catch((error) => {
            console.log('err ', error)
          })
      } catch (error) {
        console.log('async catched: ', error)
      }
    }))
  })
})

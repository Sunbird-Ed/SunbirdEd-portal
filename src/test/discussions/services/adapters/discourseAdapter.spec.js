let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes')
let async = require('asyncawait/async')
let testData = require('../../discussionTestData')
let DiscourseAdapter = require('../../../../app/helpers/discussion/services/adapters/discourseAdapter.js')
let httpWrapper = require('../../../../app/helpers/discussion/services/httpWrapper.js')
let discourseAdapter = new DiscourseAdapter({})
discourseAdapter.httpService = httpWrapper

let userProfile = testData.userProfile
describe('discourse adapter', () => {
  describe('grantModeration adapter success method', () => {
    before(function () {
      let getUserByUserNameStub = sinon.stub(discourseAdapter, 'getUserByUserName')
      getUserByUserNameStub.returns(new Promise((resolve, reject) => {
        resolve(testData.discourseUserProfile)
      }))
      let httpStub = sinon.stub(discourseAdapter.httpService, 'call')
      let moderatorProfile = testData.discourseUserProfile
      moderatorProfile.moderator = true
      httpStub.returns(new Promise((resolve, reject) => {
        resolve({
          body: JSON.stringify({
            'admin_user': moderatorProfile
          })
        })
      }))
    })
    after(function () {
      discourseAdapter.httpService.call.restore()
      discourseAdapter.getUserByUserName.restore()
    })
    let userName = userProfile.userName
    it('should grant moderation and returns success response for valid discourse success reponse', async(() => {
      return discourseAdapter.grantModeration(userName)
        .then((data) => {
          expect(data).to.equal(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }))
  })
  describe('grantModeration adapter error method', () => {
    before(function () {
      let getUserByUserNameStub = sinon.stub(discourseAdapter, 'getUserByUserName')
      getUserByUserNameStub.returns(new Promise((resolve, reject) => {
        resolve(testData.discourseUserProfile)
      }))
      let httpStub = sinon.stub(discourseAdapter.httpService, 'call')
      let moderatorProfile = testData.discourseUserProfile
      moderatorProfile.moderator = true
      httpStub.returns(new Promise((resolve, reject) => {
        reject({
          status: HttpStatus.FORBIDDEN,
          message: 'you are not allowed to do this action'
        })
      }))
    })
    after(function () {
      discourseAdapter.httpService.call.restore()
      discourseAdapter.getUserByUserName.restore()
    })
    let userName = userProfile.userName
    it('should return appropriate error response for discourse error reponse', async(() => {
      return discourseAdapter.grantModeration(userName)
        .then((data) => {

        })
        .catch((error) => {
          expect(error.status).to.equal(HttpStatus.FORBIDDEN)
        })
    }))
  })
  describe('revokeModeration adapter success method', () => {
    before(function () {
      let getUserByUserNameStub = sinon.stub(discourseAdapter, 'getUserByUserName')
      getUserByUserNameStub.returns(new Promise((resolve, reject) => {
        resolve(testData.discourseUserProfile)
      }))
      let httpStub = sinon.stub(discourseAdapter.httpService, 'call')
      let moderatorProfile = testData.discourseUserProfile
      moderatorProfile.moderator = true
      httpStub.returns(new Promise((resolve, reject) => {
        resolve({
          body: JSON.stringify({
            'admin_user': moderatorProfile
          })
        })
      }))
    })
    after(function () {
      discourseAdapter.httpService.call.restore()
      discourseAdapter.getUserByUserName.restore()
    })
    let userName = userProfile.userName
    it('should revoke moderation and returns success response for valid discourse success reponse', async(() => {
      return discourseAdapter.revokeModeration(userName)
        .then((data) => {
          expect(data).to.equal(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }))
  })
  describe('revokeModeration adapter error method', () => {
    before(function () {
      let getUserByUserNameStub = sinon.stub(discourseAdapter, 'getUserByUserName')
      getUserByUserNameStub.returns(new Promise((resolve, reject) => {
        resolve(testData.discourseUserProfile)
      }))
      let httpStub = sinon.stub(discourseAdapter.httpService, 'call')
      let moderatorProfile = testData.discourseUserProfile
      moderatorProfile.moderator = true
      httpStub.returns(new Promise((resolve, reject) => {
        reject({
          status: HttpStatus.FORBIDDEN,
          message: 'you are not allowed to do this action'
        })
      }))
    })
    after(function () {
      discourseAdapter.httpService.call.restore()
      discourseAdapter.getUserByUserName.restore()
    })
    let userName = userProfile.userName
    it('should return appropriate error response for discourse error reponse', async(() => {
      return discourseAdapter.revokeModeration(userName)
        .then((data) => {

        })
        .catch((error) => {
          expect(error.status).to.equal(HttpStatus.FORBIDDEN)
        })
    }))
  })
})

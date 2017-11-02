let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes'),
  announcementController = require('../../app/helpers/announcement/controller.js')

chai.use(chaiHttp)

describe('Announcement controller', () => {
  describe('create method', () => {
    it('should throw errors when request structure is invalid', () => {
      let ObjectStoreCreateObjectStub = sinon.stub(announcementController.objectStoreRest, 'createObject')
      ObjectStoreCreateObjectStub.returns(new Promise((resolve, reject) => {
        resolve({ data: {} })
      }))

      let ObjectStoreFindObjectStub = sinon.stub(announcementController.objectStoreRest, 'findObject')
      ObjectStoreFindObjectStub.returns(new Promise((resolve, reject) => {
        resolve({ data: {} })
      }))

      // Invalid request 1
      let requestWithEmptyObject = {}
      announcementController.create(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.statusCode).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.msg).to.eql([{ field: 'request', description: '"request" is required' }])
        })

      // Invalid request 2
      let requestWithRequestEmptyObject = { 'request': {} }
      announcementController.create(requestWithRequestEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.statusCode).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.msg).to.eql([{
            'field': 'request',
            'description': '"sourceId" is required'
          },
          {
            'field': 'request',
            'description': '"createdBy" is required'
          },
          {
            'field': 'request',
            'description': '"title" is required'
          },
          {
            'field': 'request',
            'description': '"type" is required'
          },
          {
            'field': 'request',
            'description': '"description" is required'
          },
          {
            'field': 'request',
            'description': '"target" is required'
          }
          ])
        })

      announcementController.objectStoreRest.createObject.restore()
      announcementController.objectStoreRest.findObject.restore()
    })

    xit('should create announcement if user exist and user has create access', (done) => {
      let newAnnouncement = { data: { 'announcementid': '1231-321-231-23-123' } }
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }
      let userAccessObj = { data: { 'hasCreateAccess': true } }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userAccessObj)
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(data).to.eql(newAnnouncement)
          announcementController.__getUserPermissions.restore()
          announcementController.__createAnnouncement.restore()
          done()
        })
        .catch((error) => {})
    })

    xit('should not create announcement if user does not exist', (done) => {
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'user does not exist!' })
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'user does not exist!', statusCode: HttpStatus.BAD_REQUEST })
          announcementController.__getUserPermissions.restore()
          done()
        })
    })

    xit('should not create announcement if user has no create access', (done) => {
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }
      let userAccessObj = { data: { 'hasCreateAccess': false } }

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userAccessObj)
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'user does not have create access', statusCode: HttpStatus.BAD_REQUEST })
          announcementController.__getUserPermissions.restore()
          done()
        })
    })

    it('should throw error when it fails to create an announcement', (done) => {
      let announcementErrorObj = { msg: 'unable to create announcement' }
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }
      let userAccessObj = { data: { 'hasCreateAccess': true } }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        reject(announcementErrorObj)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userAccessObj)
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'unable to process the request!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          announcementController.__getUserPermissions.restore()
          announcementController.__createAnnouncement.restore()
          done()
        })
    })

    it('should create notification on creating an announcement', (done) => {
      let newAnnouncement = { data: { 'id': '1231-321-231-23-123' } }
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }
      let userAccessObj = { data: { 'hasCreateAccess': true } }
      let announcementNotification = { data: { 'notificationId': '1323-123-12123-123' } }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userAccessObj)
      }))

      let createAnnouncementNotificationStub = sinon.stub(announcementController, '__createAnnouncementNotification')
      createAnnouncementNotificationStub.returns(new Promise((resolve, reject) => {
        resolve(announcementNotification)
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(createAnnouncementNotificationStub.called).to.be.true
          expect(data).to.eql({ announcement: newAnnouncement.data })
          announcementController.__getUserPermissions.restore()
          announcementController.__createAnnouncement.restore()
          announcementController.__createAnnouncementNotification.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should create announcement even if notification fails', (done) => {
      let newAnnouncement = { data: { 'id': '1231-321-231-23-123' } }
      let validRequest = { 'request': { 'sourceId': '123131-13213-123123-1231', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }
      let userAccessObj = { data: { 'hasCreateAccess': true } }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserPermissions')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userAccessObj)
      }))

      let createAnnouncementNotificationStub = sinon.stub(announcementController, '__createAnnouncementNotification')
      createAnnouncementNotificationStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'unable to send notification' })
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(createAnnouncementNotificationStub.called).to.be.true
          expect(data).to.eql({ announcement: newAnnouncement.data })
          announcementController.__getUserPermissions.restore()
          announcementController.__createAnnouncement.restore()
          announcementController.__createAnnouncementNotification.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
})

let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes'),
  announcementController = require('../../../app/helpers/announcement/controller.js')

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
      let requestWithEmptyObject = {body: {}}
      announcementController.create(requestWithEmptyObject)
        .then((data) => {})
        .catch((error) => {
          expect(error.statusCode).to.be.equal(HttpStatus.BAD_REQUEST)
          expect(error.msg).to.eql([{ field: 'request', description: '"request" is required' }])
        })

      // Invalid request 2
      let requestWithRequestEmptyObject = { body: { 'request': {} } }
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

    it('should create announcement if user exist and user has create access', (done) => {
      let newAnnouncement = { data: { 'id': '1231-321-231-23-123' } }
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfile = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC', 'ANNOUNCEMENT_SENDER'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userProfile)
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(data).to.eql({ announcement: newAnnouncement.data })
          announcementController.__getUserProfile.restore()
          announcementController.__createAnnouncement.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should not create announcement if user does not exist', (done) => {
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfile = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC', 'ANNOUNCEMENT_SENDER'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }
      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        reject('USER_NOT_FOUND')
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'user not found', statusCode: HttpStatus.BAD_REQUEST })
          announcementController.__getUserProfile.restore()
          done()
        })
    })

    it('should not create announcement if user has no create access', (done) => {
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfileWithNoAccess = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userProfileWithNoAccess)
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'user has no create access', statusCode: HttpStatus.BAD_REQUEST })
          announcementController.__getUserProfile.restore()
          done()
        })
    })

    it('should throw error when it fails to create an announcement', (done) => {
      let announcementErrorObj = { msg: 'unable to create announcement' }
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfile = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC', 'ANNOUNCEMENT_SENDER'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }
      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        reject(announcementErrorObj)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userProfile)
      }))

      announcementController.create(validRequest)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'unable to process the request!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          announcementController.__getUserProfile.restore()
          announcementController.__createAnnouncement.restore()
          done()
        })
    })

    it('should create notification on creating an announcement', (done) => {
      let newAnnouncement = { data: { 'id': '1231-321-231-23-123' } }
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfile = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC', 'ANNOUNCEMENT_SENDER'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }
      let announcementNotification = { data: { 'notificationId': '1323-123-12123-123' } }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userProfile)
      }))

      let createAnnouncementNotificationStub = sinon.stub(announcementController, '__createAnnouncementNotification')
      createAnnouncementNotificationStub.returns(new Promise((resolve, reject) => {
        resolve(announcementNotification)
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(createAnnouncementNotificationStub.called).to.be.true
          expect(data).to.eql({ announcement: newAnnouncement.data })
          announcementController.__getUserProfile.restore()
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
      let validRequest = { 'body': { 'request': { 'sourceId': '0123673908687093760', 'createdBy': 'superuser', 'type': 'adads', 'links': ['asdad'], 'title': 'some', 'description': 'adsads', 'target': { 'tech-org': 'list of teachers' } } }, headers: { 'x-authenticated-user-token': '12312-31-23-123-1-23-12-3-123-123-132' } }
      let userProfile = {'lastName': 'Davanam', 'webPages': [], 'tcStatus': null, 'education': [], 'gender': null, 'regOrgId': null, 'subject': [], 'roles': ['PUBLIC'], 'language': [], 'updatedDate': null, 'skills': [], 'isDeleted': null, 'organisations': [{'orgJoinDate': '2017-11-03 06:42:58:943+0000', 'organisationId': '0123673908687093760', 'approvalDate': '2017-11-03 06:42:58:943+0000', 'isDeleted': false, 'addedByName': 'bD+oZDoya/tnM46jNhdcHf7UFB/BMXS2ybiIigE+CN++qb9RHUhiUtMmV82GhVrPnDnaR8OS9gSY\nhMxfj5lHMaZ5e4X7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==', 'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'roles': ['PUBLIC', 'ANNOUNCEMENT_SENDER'], 'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'isRejected': false, 'id': '0123673998477230080', 'isApproved': true, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} ], 'provider': null, 'id': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'tempPassword': null, 'rootOrg': {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, 'identifier': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'thumbnail': null, 'updatedBy': null, 'address': [{'country': 'USA', 'updatedBy': null, 'city': 'Bangalore', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560103', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:022+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '212 winding hill dr', 'addressLine2': 'Frazer town', 'id': '0123673973836840961', 'state': 'Karnataka'}, {'country': 'India', 'updatedBy': null, 'city': 'Bangalore1', 'updatedDate': null, 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'zipcode': '560135', 'addType': 'permanent', 'createdDate': '2017-11-03 06:39:16:014+0000', 'isDeleted': null, 'createdBy': '', 'addressLine1': '2121 winding hill dr', 'addressLine2': 'Frazer town1', 'id': '0123673908379566080', 'state': 'Karnataka1'} ], 'jobProfile': [], 'profileSummary': null, 'tcUpdatedDate': null, 'avatar': null, 'rootOrgId': 'ORG_001', 'firstName': 'Manju', 'lastLoginTime': null, 'createdDate': '2017-11-03 06:39:15:980+0000', 'createdBy': '', 'dob': null, 'grade': [], 'currentLoginTime': null, 'location': 'location', 'status': 1 }

      let createAnnouncementStub = sinon.stub(announcementController, '__createAnnouncement')
      createAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(newAnnouncement)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__getUserProfile')
      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(userProfile)
      }))

      let createAnnouncementNotificationStub = sinon.stub(announcementController, '__createAnnouncementNotification')
      createAnnouncementNotificationStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'unable to send notification' })
      }))

      announcementController.create(validRequest)
        .then((data) => {
          expect(createAnnouncementNotificationStub.called).to.be.true
          expect(data).to.eql({ announcement: newAnnouncement.data })
          announcementController.__getUserProfile.restore()
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

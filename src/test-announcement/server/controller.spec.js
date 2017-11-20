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
  describe('get announcement by id method', () => {
    it('should return valid response when valid id is passed', (done) => {
      let requestObj = { params: { 'id': '7d5eeeb0-ca99-11e7-b233-afb0dae949ba' } }
      let responseObj = {'id': 'api.plugin.announcement.get.id', 'ver': '1.0', 'ts': '2017-11-17 14:51:27:507+0000', 'params': {'resmsgid': 'ca2d5e30-cba6-11e7-870c-1f5ac17ac302', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'sourceid': '0123673689120112640', 'createddate': '2017-11-16 12:13:44:028+0530', 'details': {'description': 'Test description for announcement 3', 'from': 'test user', 'title': 'Test title for announcement 3', 'type': 'Circular'}, 'links': ['http://yahoo.com'], 'id': '7d5eeeb0-ca99-11e7-b233-afb0dae949ba', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529'] } }, 'status': 'active'} }
      let findObjectStub = sinon.stub(announcementController, '__getAnnouncementById')
      findObjectStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.getAnnouncementById(responseObj)
        .then((data) => {
          expect(findObjectStub.called).to.be.true
          expect(data).to.eql(responseObj)
          announcementController.__getAnnouncementById.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
    it('should throw an error for invalid request id', (done) => {
      let requestObj = { params: { 'id': 'undefined' } }
      let responseObj = {'id': 'api.plugin.announcement.cancel.id', 'ver': '1.0', 'ts': '2017-11-20 08:17:24:702+0000', 'params': {'resmsgid': '3d34dfe0-cdcb-11e7-90ff-353befb372b7', 'msgid': null, 'status': 'failed', 'err': '', 'errmsg': 'UNAUTHORIZE_USER'}, 'responseCode': 'CLIENT_ERROR', 'result': {} }
      let findObjectStub = sinon.stub(announcementController, '__getAnnouncementById')
      findObjectStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))
      announcementController.getAnnouncementById(responseObj)
        .then((data) => {
          expect(findObjectStub.called).to.be.true
          expect(data).to.eql(responseObj)
          expect(data.result).to.not.have.property('status')
          expect(data).to.be.an('object')
          expect(data.params.errmsg).to.eql('UNAUTHORIZE_USER')
          announcementController.__getAnnouncementById.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('Cancel announcement by id', () => {
    it('should cancel the announcement if the user have a permission to cancel', (done) => {
      let requestObj = {'request': {'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'announcenmentid': '6c208ec0-c863-11e7-8175-573a15bbe3f0'} }
      let responseObj = {'id': 'api.plugin.announcement.cancel.id', 'ver': '1.0', 'ts': '2017-11-20 07:57:17:315+0000', 'params': {'resmsgid': '6d8c3d30-cdc8-11e7-90ff-353befb372b7', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'status': 'cancelled'} }

      let cancelAnnouncementStub = sinon.stub(announcementController, 'cancelAnnouncementById')
      cancelAnnouncementStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.cancelAnnouncementById(responseObj)
        .then((data) => {
          expect(cancelAnnouncementStub.called).to.be.true
          expect(data).to.eql(responseObj)
          announcementController.cancelAnnouncementById.restore()
          expect(responseObj.result.status).to.eql('cancelled')
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should cancel the announcement if the user have a permission', (done) => {
      let requestObj = {'request': {'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'announcenmentid': '6c208ec0-c863-11e7-8175-573a15bbe3f0'} }
      let responseObj = {'id': 'api.plugin.announcement.cancel.id', 'ver': '1.0', 'ts': '2017-11-20 07:57:17:315+0000', 'params': {'resmsgid': '6d8c3d30-cdc8-11e7-90ff-353befb372b7', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'status': 'cancelled'} }
      let announcementDetails = {'id': 'api.plugin.announcement.get.id', 'ver': '1.0', 'ts': '2017-11-17 14:51:27:507+0000', 'params': {'resmsgid': 'ca2d5e30-cba6-11e7-870c-1f5ac17ac302', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'sourceid': '0123673689120112640', 'createddate': '2017-11-16 12:13:44:028+0530', 'details': {'description': 'Test description for announcement 3', 'from': 'test user', 'title': 'Test title for announcement 3', 'type': 'Circular'}, 'links': ['http://yahoo.com'], 'id': '7d5eeeb0-ca99-11e7-b233-afb0dae949ba', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529'] } }, 'status': 'active'} }

      let cancelAnnouncementByIdStub = sinon.stub(announcementController, 'cancelAnnouncementById')
      cancelAnnouncementByIdStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      let checkUserPermissionsStub = sinon.stub(announcementController, '__checkPermission')

      checkUserPermissionsStub.returns(new Promise((resolve, reject) => {
        resolve(announcementDetails)
      }))

      announcementController.cancelAnnouncementById(requestObj)
        .then((data) => {
          expect(cancelAnnouncementByIdStub.called).to.be.true
          expect(data.result.status).to.eql('cancelled')
          announcementController.__checkPermission.restore()
          announcementController.cancelAnnouncementById.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
  })
  describe('get definitation', () => {
    it('should return the announcement types', (done) => {
      let requestObj = {'request': {'rootorgid': 'ORG_001', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'definitions': ['announcementtypes'] } }
      let responseObj = {'id': 'api.plugin.announcement.definitions', 'ver': '1.0', 'ts': '2017-11-20 09:20:17:412+0000', 'params': {'resmsgid': '05eabc40-cdd4-11e7-a5bf-459261107158', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'announcementtypes': {'count': 3, 'content': [{'createddate': '2017-11-07 13:10:04:797+0530', 'name': 'Circular', 'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a', 'rootorgid': 'ORG_001', 'status': 'active'}, {'createddate': '2017-11-07 13:10:04:797+0530', 'name': 'Order', 'id': '9b20d8f4-c5db-11e7-abc4-cec278b6b50a', 'rootorgid': 'ORG_001', 'status': 'active'}, {'createddate': '2017-11-07 13:10:04:797+0530', 'name': 'News', 'id': '9b20d7f0-c5db-11e7-abc4-cec278b6b50a', 'rootorgid': 'ORG_001', 'status': 'active'} ] } } }

      let getDefinitatinStub = sinon.stub(announcementController, 'getDefinitions')
      getDefinitatinStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.getDefinitions(requestObj)
        .then((data) => {
          expect(getDefinitatinStub.called).to.be.true
          expect(data.result).to.have.property('announcementtypes')
          announcementController.getDefinitions.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return the announcement senderlist', (done) => {
      let requestObj = {'request': {'rootorgid': 'ORG_001', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'definitions': ['senderlist'] } }
      let responseObj = {'id': 'api.plugin.announcement.definitions', 'ver': '1.0', 'ts': '2017-11-20 09:26:29:033+0000', 'params': {'resmsgid': 'e36bc0a0-cdd4-11e7-a5bf-459261107158', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'senderlist': {'159e93d1-da0c-4231-be94-e75b0c226d7c': 'Sunil Pandith'} } }

      let getDefinitatinStub = sinon.stub(announcementController, 'getDefinitions')
      getDefinitatinStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.getDefinitions(requestObj)
        .then((data) => {
          expect(getDefinitatinStub.called).to.be.true
          expect(data.result).to.have.property('senderlist')
          announcementController.getDefinitions.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should throw error for invalid requestObj', (done) => {
      let requestObj = {'body': {'request': {'rootorgid': 'ORG_001', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c'} } }
      announcementController.getDefinitions(requestObj)
        .then((data) => {
          expect(data.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR)
        })
        .catch((error) => {
        })
      done()
    })
  })
  describe('user Outbox', () => {
    let getUserOutboxStub
    before(function () {
      getUserOutboxStub = sinon.stub(announcementController, 'getUserOutbox')
      respondeObj = {'id': 'api.plugin.announcement.create', 'ver': '1.0', 'ts': '2017-11-20 12:06:32:766+0000', 'params': {'resmsgid': '3fb0f5e0-cdeb-11e7-a5bf-459261107158', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'announcement': {'id': '3fa695a0-cdeb-11e7-a5bf-459261107158'} } }
    })

    after(function () {
      announcementController.getUserOutbox.restore()
    })
    it('should return the valid response object', (done) => {
      let requestObj = {'request': {'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} }
      let responseObj = {'id': 'api.plugin.announcement.user.outbox', 'ver': '1.0', 'ts': '2017-11-20 09:57:22:831+0000', 'params': {'resmsgid': '345ee100-cdd9-11e7-90ff-353befb372b7', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'count': 2, 'announcements': {'count': 339, 'content': [{'sourceid': 'ORG_001', 'attachments': ['{"name":"1503670688265.jpg","mimetype":"image/jpeg","size":"8 KB","link":"https://sunbirddev.blob.core.windows.net/attachments/announcement/File-012379379393880064118"}'], 'createddate': '2017-11-20 15:27:19:488+0530', 'details': {'description': 'test', 'from': 'test', 'title': 'test-logu-nov-21-2', 'type': 'Order'}, 'links': ['https://google.com'], 'id': '326078f0-cdd9-11e7-a247-43a19aebaffd', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529', '01236686178285977611'] } }, 'status': 'active'}] } } }

      getUserOutboxStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.getUserOutbox(requestObj)
          .then((data) => {
            expect(getUserOutbox.called).to.be.true
            expect(data.result).to.have.property('announcements')
          })
          .catch((err) => {})
      done()
    })

    it('Should throw an error for invalid response', (done) => {
      let requestObj = {'request': {'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a'} }
      responseObj = undefined
      getUserOutboxStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))
      announcementController.getUserOutbox(requestObj)
          .then((data) => {
            expect(getUserOutboxStub.called).to.be.true
            expect(data.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          })
          .catch((err) => {})
      done()
    })
  })

  describe('Read announcement method', () => {
    it('should return the valid responseObj', (done) => {
      let requestObj = {'request': {'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696afff', 'announcementId': 'e138-45e9-bed2-a0db5eb9696a', 'channel': 'web'} }
      let responseObj = {'id': 'api.plugin.announcement.read', 'ver': '1.0', 'ts': '2017-11-20 12:49:52:821+0000', 'params': {'resmsgid': '4d71de50-cdf1-11e7-90ff-353befb372b7', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''}, 'responseCode': 'OK', 'result': {'msg': 'Entry exists', 'statusCode': 200 } }

      let readStub = sinon.stub(announcementController, 'read')
      readStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.read(requestObj)
        .then((data) => {
          expect(readStub.called).to.be.true
          expect(data.result.statusCode).to.be.equal(200)
          expect(data.result.msg).to.be.equal('Entry exists')
          announcementController.read.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })
    it('Should throw an error for invalid response', () => {
      let requestObj = {'request': {'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696afff', 'announcementId': 'e138-45e9-bed2-a0db5eb9696a', 'channel': 'web'} }
      let respondeObj = {}

      let readStub = sinon.stub(announcementController, 'read')
      readStub.returns(new Promise((resolve, reject) => {
        resolve(responseObj)
      }))

      announcementController.read(requestObj)
        .then((data) => {
          expect(readStub.called).to.be.true
          expect(data).to.be.equal(undefined)
        })
        .catch((error) => {
          console.log(error)
          done()
        })
    })
  })
})

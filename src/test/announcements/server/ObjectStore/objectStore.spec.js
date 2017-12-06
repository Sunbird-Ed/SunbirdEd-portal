let chai = require('chai'),
  expect = chai.expect,
  ObjectStore = require('../../../../app/helpers/announcement/ObjectStore/ObjectStore.js'),
  announcementModel = require('../../../../app/helpers/announcement/model/AnnouncementModel.js'),
  httpService = require('../../../../app/helpers/announcement/services/httpWrapper.js')

describe('ObjectStore', () => {
  before(() => {
    objectStore = new ObjectStore(announcementModel, httpService)
  })

  describe('createObject', () => {
    it('should throw error when abtract method is called', () => {
      objectStore.createObject()
        .then((data) => {

        })
        .catch((error) => {
          expect(error).to.eql('cannot call abstract method')
        })
    })
  })

  describe('findObject', () => {
    it('should throw error when abtract method is called', () => {
      objectStore.findObject()
        .then((data) => {

        })
        .catch((error) => {
          expect(error).to.eql('cannot call abstract method')
        })
    })
  })

  describe('updateObjectById', () => {
    it('should throw error when abtract method is called', () => {
      objectStore.updateObjectById()
        .then((data) => {

        })
        .catch((error) => {
          expect(error).to.eql('cannot call abstract method')
        })
    })
  })

  describe('deleteObjectById', () => {
    it('should throw error when abtract method is called', () => {
      objectStore.deleteObjectById()
        .then((data) => {

        })
        .catch((error) => {
          expect(error).to.eql('cannot call abstract method')
        })
    })
  })

  describe('getObjectById', () => {
    it('should throw error when abtract method is called', () => {
      objectStore.getObjectById()
        .then((data) => {

        })
        .catch((error) => {
          expect(error).to.eql('cannot call abstract method')
        })
    })
  })
})

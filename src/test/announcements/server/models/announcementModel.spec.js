let chai = require('chai'),
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  expect = chai.expect,
  announcementModel = require('../../../../app/helpers/announcement/model/AnnouncementModel.js'),
  Joi = require('joi')

describe('Announcement Model', () => {
  describe('validateAPI Method', () => {
    it('Should not throw an error, When valid object is passed.', (done) => {
      let requestObj = {
        'request': {
          'sourceId': '0123673689120112640',
          'type': 'Circular',
          'links': ['http://yahoo.com'],
          'title': 'Test title for announcement 3',
          'description': 'Test description for announcement 3',
          'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529'] } },
          'from': 'test user'
        }
      }
      let validation = announcementModel.validateApi(requestObj)
      expect(validation.isValid).to.be.equal(true)
      done()
    })

    it('Should throw an error, When invalid object is passed', (done) => {
      let requestObj = {
        'request': {'sourceId': '0123673689120112640', 'type': 'Circular', 'links': ''}
      }
      let validation = announcementModel.validateApi(requestObj)
      expect(validation.isValid).to.be.equal(false)
      done()
    })
  })
  describe('validateModel Method ', () => {
    it('Should not throw an error,When valid object is passed', (done) => {
      let requestObj = {
        id: '3243-43-432-534543',
        userid: '432-432-432-423432-342', // part of primary key
        sourceid: '423432-423-324-432', // part of primary key
        createddate: '12-12-2015', // part of primary key
        details: { key: {} }, // any key/value with string links: ['www.facebook.com'],
        attachments: ['www.test.pdf'],
        target: { geo: { ids: [] } }, // TODO: add validation for target format status: 'active',
        sentcount: 1,
        priority: '1',
        expiry: '12-12-17',
        updateddate: '12-12-14'
      }
      let validation = announcementModel.validateModel(requestObj)
      expect(validation.isValid).to.be.equal(true)
      expect(validation.error).to.be.equal(undefined)
      done()
    })
    it('Should throw an error, When invalid object is passed', (done) => {
      let requestObj = {
        id: '3243-43-432-534543',
        userid: '432-432-432-423432-342',
        sourceid: '423432-423-324-432',
        createddate: '12-12-2015',
        details: {key: {} },
        links: {}, // Invalid object ie. it should be of type array.
        attachments: ['www.test.pdf'],
        target: {geo: {ids: [] } }, // TODO: add validation for target format
        status: '',
        sentcount: 1,
        priority: '1',
        expiry: '',
        updateddate: ''
      }
      let validation = announcementModel.validateModel(requestObj)
      expect(validation.isValid).to.be.equal(false)
      expect(validation.error).to.not.equal(undefined)

      done()
    })
  })

  describe('getModelSubSchema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = announcementModel.getModelSubSchema('userid')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = announcementModel.getModelSubSchema('userid-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
  describe('getAPiSubSchema Method', () => {
    it('Should return the schema, When valid key is passed', (done) => {
      let validation = announcementModel.getApiSubSchema('request.sourceId')
      expect(validation).to.not.equal(undefined)
      done()
    })
    it('Should not return schema, When invalid key is passed', (done) => {
      let validation = announcementModel.getApiSubSchema('sourceId-test')
      expect(validation).to.equal(undefined)
      done()
    })
  })
})

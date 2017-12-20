let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  ObjectStoreRest = require('../../../../app/helpers/announcement/ObjectStore/ObjectStoreRest.js'),
  announcementModel = require('../../../../app/helpers/announcement/model/AnnouncementModel.js'),
  httpService = require('../../../../app/helpers/announcement/services/httpWrapper.js'),
  HttpStatus = require('http-status-codes')

Joi = require('joi'),

describe('ObjectStoreRest', () => {
  let announcementStore
  before(() => {
    announcementStore = new ObjectStoreRest({
      model: announcementModel,
      service: httpService
    })
  })

  describe('CreateObject Method', () => {
    it('should create object and return data on success', (done) => {
      let query = {
        values: {
          'id': '324-432-432-43-234-324',
          'sourceid': '0123673689120112640',
          'createddate': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
          'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'details': {
            'title': 'Test-Title',
            'type': 'type1',
            'description': 'description',
            'from': 'Manju'
          },
          'target': {
            geo: {
              ids: []
            }
          },
          'links': ['www.ekstep.in'],
          'status': 'active',
          'attachments': ['https://sample.pdf']
        }
      }
      let queryResult = [{
        'column1': 'value1',
        'column2': 'value2',
        'column3': 'value3'
      }, {
        'column1': 'value1',
        'column2': 'value2',
        'column3': 'value3'
      }]
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        resolve({
          body: {
            result: {
              response: {
                content: queryResult,
                count: 2,
                statuCode: 'SUCCESS'
              }
            }
          }
        })
      }))
      announcementStore.createObject(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(data.data.response.statuCode).to.eql('SUCCESS')
          httpService.call.restore()
          done()
        })
        .catch((error) => {})
    })
    it('should return error when query causes failure', (done) => {
      let query = {}
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        reject({
          message: 'INTERNAL_SERVER_ERROR',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }))
      announcementStore.createObject(query)
        .then((data) => {})
        .catch((error) => {
          expect(error instanceof Error).to.eql(true)
          expect(error.status).to.eql(HttpStatus.BAD_REQUEST)
          httpService.call.restore()
          done()
        })
    })
  })

  describe('FindObject Method', () => {
    it('Should find object and return data on success', (done) => {
      let query = {
        'filters': {
          'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf'
        },
        'entityName': 'announcement',
        'limit': 10,
        'sort_by': 'desc'
      }
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        resolve({
          body: {
            result: {
              response: {
                content: {
                  'data': {
                    'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'userid': '8e27cbf5-e299-43b0-bca7',
                    'sourceid': 'sourceId',
                    'details': {
                      'filename': 'name'
                    },
                    'links': ['asd', 'asdf'],
                    'attachments': ['kjaslkdlk'],
                    'sentcount': 1,
                    'identifier': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf'
                  }
                },
                count: 2
              }
            }
          }
        })
      }))
      announcementStore.findObject(query)
        .then((data) => {
          expect(data.data.count).to.eql(2)
          expect(data).to.be.an('object')
          httpService.call.restore()
          done()
        })
        .catch((error) => {})
    })
    it('Should throw an error , When invalid query is passed', (done) => {
      let query = {}
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        reject({
          message: 'INTERNAL_SERVER_ERROR',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }))
      announcementStore.findObject(query)
        .then((data) => {})
        .catch((error) => {
          expect(error.status).to.eql(HttpStatus.INTERNAL_SERVER_ERROR)
          httpService.call.restore()
          done()
        })
    })
    it('Should return empty object, When response count is less than zero', (done) => {
      let query = {
        'filters': {
          'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf'
        },
        'entityName': 'announcement',
        'limit': 10,
        'sort_by': 'desc'
      }
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        resolve({
          body: {
            result: {
              response: {
                content: {},
                count: 0
              }
            }
          }
        })
      }))
      announcementStore.findObject(query)
        .then((data) => {
          expect(data.data).to.be.an('array').that.is.empty
          httpService.call.restore()

          done()
        })
        .catch((error) => {})
    })
  })

  describe('UpdateObject Method', () => {
    it('Should update the object, When valid query is passed', (done) => {
      let query = {
        values: {
          id: 'c17ae6d0-d67e-11e7-9fb8-0da59cda0b8a',
          status: 'Cancelled'
        }
      }
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        resolve({
          body: {
            'result': {
              'response': 'SUCCESS'
            }
          }
        })
      }))
      announcementStore.updateObjectById(query).then((data) => {
        expect(data.data.body.result.response).to.eql('SUCCESS')
        expect(data.data.body.result).to.be.an('object')
        httpService.call.restore()
        done()
      }).catch((error) => {

      })
    })
    it('Should throw an error,When ivalid query is passed', (done) => {
      let query = {
        values: {
          id: '32-543-43-543-543-534'
        },
        status: 'Cancelled'
      }
      let httpServiceStub = sinon.stub(httpService, 'call').returns(new Promise((resolve, reject) => {
        reject({
          message: 'Invalid request',
          status: HttpStatus.BAD_REQUEST
        })
      }))
      announcementStore.updateObjectById(query).then((data) => {}).catch((error) => {
        expect(error instanceof Error).to.eql(true)
        expect(error.status).to.eql(HttpStatus.BAD_REQUEST)
        done()
      })
    })
  })
})

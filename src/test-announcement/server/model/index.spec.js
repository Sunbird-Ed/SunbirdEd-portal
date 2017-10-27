let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  HttpStatus = require('http-status-codes'),
  ObjectStore = require('../../../app/helpers/announcement/model'),
  Joi = require('joi')

describe('Object Store', () => {
  before(() => {
    ObjectStore.TableModelMapping.TEST_MODEL = Joi.object().keys({
      coulmn1: Joi.string().required(),
      coulmn2: Joi.string().required(),
      coulmn3: Joi.string().required(),
      coulmn4: Joi.string(),
      coulmn5: Joi.string(),
      coulmn6: Joi.string()
    })
  })

  describe('createObject method', () => {
    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      ObjectStore.createObject(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid request!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      ObjectStore.createObject(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'values required!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', values: {} }
      ObjectStore.createObject(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: [{ field: 'coulmn1', description: '"coulmn1" is required' }, { field: 'coulmn2', description: '"coulmn2" is required' }, { field: 'coulmn3', description: '"coulmn3" is required' }], status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { values: {} }
      ObjectStore.createObject(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid request!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', values: {} }
      ObjectStore.createObject(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid request!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', values: { 'invalid_column1': 'data1', 'invalid_column2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      ObjectStore.createObject(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: [{ field: 'coulmn1', description: '"coulmn1" is required' }, { field: 'coulmn2', description: '"coulmn2" is required' }, { field: 'invalid_column1', description: '"invalid_column1" is not allowed' }, { field: 'invalid_column2', description: '"invalid_column2" is not allowed' }], status: 'error' })
        })
    })

    it('should call sunbird web service and return data on success', () => {
      let httpServiceStub = sinon.stub(ObjectStore, '__httpService')
      httpServiceStub.returns(new Promise((resolve, reject) => {
        resolve({ data: {}, status: 'created' })
      }))

      let query = { table: 'TEST_MODEL', values: { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      ObjectStore.createObject(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(data).to.eql({ data: {}, status: 'created' })
        })
        .catch((error) => {})

      ObjectStore.__httpService.restore()
    })

    it('should call the sunbird database API and return error on failure', (done) => {
    	let httpServiceStub = sinon.stub(ObjectStore, '__httpService')
      httpServiceStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'unable to create object', status: 'error' })
      }))

      let query = { table: 'TEST_MODEL', values: { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      ObjectStore.createObject(query)
        .then((data) => {})
        .catch((error) => {
          expect(httpServiceStub.called).to.be.true
          expect(error).to.eql({ msg: 'unable to create object', status: 'error' })
          done()
        })

      ObjectStore.__httpService.restore()
    })
  })
})

let chai = require('chai'),
  chaiHttp = require('chai-http'),
  sinon = require('sinon'),
  expect = chai.expect,
  ObjectStoreRest = require('../../../app/helpers/announcement/ObjectStore/ObjectStoreRest.js'),
  Joi = require('joi'),
  objectStoreRest

const TEST_MODEL = Joi.object().keys({
  coulmn1: Joi.string().required(),
  coulmn2: Joi.string().required(),
  coulmn3: Joi.string().required(),
  coulmn4: Joi.string(),
  coulmn5: Joi.string(),
  coulmn6: Joi.string()
})

describe('ObjectStoreRest', () => {
  before(() => {
    let tableModelMapping = { 'TEST_MODEL': TEST_MODEL }
    let modelConstant = { 'TEST_MODEL': 'TEST_MODEL' }
    objectStoreRest = new ObjectStoreRest(tableModelMapping, modelConstant)
  })

  describe('createObject method', () => {
    it('should create object and return data on success', (done) => {
      let columnData = { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' }
      let query = { table: 'TEST_MODEL', values: columnData }
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        resolve({ body: { result: columnData }})
      }))

      let validateCreateObjectStub = sinon.stub(objectStoreRest, 'validateCreateObject').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      objectStoreRest.createObject(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(validateCreateObjectStub.called).to.be.true
          expect(data).to.eql({ data: columnData, status: 'created' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateCreateObject.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return error when query causes unexpected failure', (done) => {
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        reject({ msg: 'unable to create object', status: 'error' })
      }))

      let validateCreateObjectStub = sinon.stub(objectStoreRest, 'validateCreateObject').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', values: { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      objectStoreRest.createObject(query)
        .then((data) => {})
        .catch((error) => {
          expect(httpServiceStub.called).to.be.true
          expect(error).to.eql({ msg: 'unable to create object', status: 'error' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateCreateObject.restore()
          done()
        })
    })
  })

  describe('findObject method', () => {
    it('should find object and return data on success', (done) => {
      let queryResult = [{ 'column1': 'value1', 'column2': 'value2', 'column3': 'value3' }, { 'column1': 'value1', 'column2': 'value2', 'column3': 'value3' }]
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        resolve({ body: { result: { response: { content: queryResult, count: 2 }}}})
      }))

      let validateFindObjectStub = sinon.stub(objectStoreRest, 'validateFindObject').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', query: { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      objectStoreRest.findObject(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(data).to.eql({ data: queryResult, status: 'success' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateFindObject.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return error when query cause unexpected failure', (done) => {
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        reject()
      }))

      let validateFindObjectStub = sinon.stub(objectStoreRest, 'validateFindObject').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', query: { 'coulmn1': 'data1' } }
      objectStoreRest.findObject(query)
        .then((data) => {})
        .catch((error) => {
          expect(httpServiceStub.called).to.be.true
          expect(error).to.eql({ msg: 'unable to find object', status: 'error' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateFindObject.restore()
          done()
        })
    })
  })

  describe('getObjectById method', () => {
    it('should get object and return data on success', (done) => {
      let queryResult = { 'column1': 'value1', 'column2': 'value2', 'column3': 'value3' }
      let findObjectStub = sinon.stub(objectStoreRest, 'findObject').returns(new Promise((resolve, reject) => {
        resolve(queryResult)
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-132123-123' }
      objectStoreRest.getObjectById(query)
        .then((data) => {
          expect(findObjectStub.called).to.be.true
          expect(data).to.eql(queryResult)
          objectStoreRest.findObject.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return error when query cause unexpected failure', (done) => {
      let findObjectStub = sinon.stub(objectStoreRest, 'findObject')
      findObjectStub.returns(new Promise((resolve, reject) => {
        reject({ msg: 'unable to query!', status: 'error' })
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-132123-123' }
      objectStoreRest.getObjectById(query)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'unable to query!', status: 'error' })
          objectStoreRest.findObject.restore()
          done()
        })
    })
  })
  describe('updateObjectById method', () => {
    it('should update object and return data on success', (done) => {
      let queryResult = [{ 'column1': 'value1', 'column2': 'value2', 'column3': 'value3' }, { 'column1': 'value1', 'column2': 'value2', 'column3': 'value3' }]
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        resolve(queryResult)
      }))

      let validateUpdateObjectByIdStub = sinon.stub(objectStoreRest, 'validateUpdateObjectById').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-123132-123123', data: { 'coulmn1': 'data1', 'coulmn2': 'data2', 'coulmn3': 'data3', 'coulmn4': 'data4', 'coulmn5': 'data5' } }
      objectStoreRest.updateObjectById(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(validateUpdateObjectByIdStub.called).to.be.true
          expect(data).to.eql({ data: queryResult, status: 'updated' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateUpdateObjectById.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return error when query cause unexpected failure', (done) => {
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        reject()
      }))

      let validateUpdateObjectByIdStub = sinon.stub(objectStoreRest, 'validateUpdateObjectById').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-123132-123123', data: { 'coulmn1': 'data1' } }
      objectStoreRest.updateObjectById(query)
        .then((data) => {})
        .catch((error) => {
          expect(httpServiceStub.called).to.be.true
          expect(validateUpdateObjectByIdStub.called).to.be.true
          expect(error).to.eql({ msg: 'unable to update object', status: 'error' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateUpdateObjectById.restore()
          done()
        })
    })
  })

  describe('deleteObjectById method', () => {
    it('should delete object and return success', (done) => {
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        resolve()
      }))

      let validateDeleteObjectByIdStub = sinon.stub(objectStoreRest, 'validateDeleteObjectById').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-123132-123123' }
      objectStoreRest.deleteObjectById(query)
        .then((data) => {
          expect(httpServiceStub.called).to.be.true
          expect(validateDeleteObjectByIdStub.called).to.be.true
          expect(data).to.eql({ status: 'deleted' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateDeleteObjectById.restore()
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should return error when query cause unexpected failure', (done) => {
      let httpServiceStub = sinon.stub(objectStoreRest, 'httpService').returns(new Promise((resolve, reject) => {
        reject()
      }))

      let validateDeleteObjectByIdStub = sinon.stub(objectStoreRest, 'validateDeleteObjectById').returns(new Promise((resolve, reject) => {
        resolve(true)
      }))

      let query = { table: 'TEST_MODEL', id: '123123-123123-123132-123123' }
      objectStoreRest.deleteObjectById(query)
        .then((data) => {})
        .catch((error) => {
          expect(httpServiceStub.called).to.be.true
          expect(validateDeleteObjectByIdStub.called).to.be.true
          expect(error).to.eql({ msg: 'unable to delete object', status: 'error' })
          objectStoreRest.httpService.restore()
          objectStoreRest.validateDeleteObjectById.restore()
          done()
        })
    })
  })
})

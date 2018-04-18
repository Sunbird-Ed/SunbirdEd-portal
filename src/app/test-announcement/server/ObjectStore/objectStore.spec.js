let chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect,
  ObjectStore = require('../../../app/helpers/announcement/ObjectStore/ObjectStore.js'),
  Joi = require('joi'),
  objectStore

const TEST_MODEL = Joi.object().keys({
  column1: Joi.string().required(),
  column2: Joi.string().required(),
  column3: Joi.string().required(),
  column4: Joi.string(),
  column5: Joi.string(),
  column6: Joi.string()
})

describe('ObjectStore', () => {
  before(() => {
    let tableModelMapping = { 'TEST_MODEL': TEST_MODEL }
    let modelConstant = { 'TEST_MODEL': 'TEST_MODEL' }
    objectStore = new ObjectStore(tableModelMapping, modelConstant)
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

  describe('validateCreateObject method', () => {
    it('should return TRUE when request is valid', (done) => {
      let validQuery = { table: 'TEST_MODEL', values: { 'column1': 'data1', 'column2': 'data2', 'column3': 'data3', 'column4': 'data4', 'column5': 'data5', 'column6': 'data6' } }
      objectStore.validateCreateObject(validQuery)
        .then((isValid) => {
          expect(isValid).to.be.true
          done()
        })
        .catch((error) => {})
    })

    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      objectStore.validateCreateObject(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      objectStore.validateCreateObject(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'values required!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', values: {} }
      objectStore.validateCreateObject(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: [{ field: 'column1', description: '"column1" is required' }, { field: 'column2', description: '"column2" is required' }, { field: 'column3', description: '"column3" is required' }], status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { values: {} }
      objectStore.validateCreateObject(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', values: {} }
      objectStore.validateCreateObject(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', values: { 'invalid_column1': 'data1', 'invalid_column2': 'data2', 'column3': 'data3', 'column4': 'data4', 'column5': 'data5' } }
      objectStore.validateCreateObject(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: [{ field: 'column1', description: '"column1" is required' }, { field: 'column2', description: '"column2" is required' }, { field: 'invalid_column1', description: '"invalid_column1" is not allowed' }, { field: 'invalid_column2', description: '"invalid_column2" is not allowed' }], status: 'error' })
        })
    })
  })

  describe('validateFindObject method', () => {
    it('should return TRUE when request is valid', (done) => {
      let validQuery = { table: 'TEST_MODEL', query: { 'column1': 'data1' } }
      objectStore.validateFindObject(validQuery)
        .then((isValid) => {
          expect(isValid).to.be.true
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      objectStore.validateFindObject(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      objectStore.validateFindObject(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid query!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', query: {} }
      objectStore.validateFindObject(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid query fields!', status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { query: {} }
      objectStore.validateFindObject(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', query: {} }
      objectStore.validateFindObject(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', query: { 'column1': 'data1', 'invalid_column1': 'invalid_data' } }
      objectStore.validateFindObject(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid query fields!', status: 'error' })
        })
    })
  })

  describe('validateUpdateObjectById method', () => {
    it('should return TRUE when request is valid', (done) => {
      let validQuery = { table: 'TEST_MODEL', id: '12312-132123-123123-132132', data: { 'column1': 'some value' } }
      objectStore.validateUpdateObjectById(validQuery)
        .then((isValid) => {
          expect(isValid).to.be.true
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      objectStore.validateUpdateObjectById(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      objectStore.validateUpdateObjectById(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'invalid query!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', data: {} }
      objectStore.validateUpdateObjectById(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { data: {} }
      objectStore.validateUpdateObjectById(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', data: {} }
      objectStore.validateUpdateObjectById(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', data: { 'column1': 'data1', 'invalid_column1': 'invalid_data' } }
      objectStore.validateUpdateObjectById(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 7
      let invalidQuery7 = { table: 'TEST_MODEL', data: { 'column1': 'data1', 'invalid_column1': 'invalid_data' }, id: 1233 }
      objectStore.validateUpdateObjectById(invalidQuery7)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })
    })
  })

  describe('validateDeleteObjectById method', () => {
    it('should return TRUE when request is valid', (done) => {
      let validQuery = { table: 'TEST_MODEL', id: '12312-132123-123123-132132' }
      objectStore.validateDeleteObjectById(validQuery)
        .then((isValid) => {
          expect(isValid).to.be.true
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      objectStore.validateDeleteObjectById(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      objectStore.validateDeleteObjectById(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', id: undefined }
      objectStore.validateDeleteObjectById(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { id: '13123-123123-123123-123123' }
      objectStore.validateDeleteObjectById(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', id: '23424-24234-24234-234234' }
      objectStore.validateDeleteObjectById(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', id: 1233 }
      objectStore.validateDeleteObjectById(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })
    })
  })

  describe('validateGetObjectById method', () => {
    it('should return TRUE when request is valid', (done) => {
      let validQuery = { table: 'TEST_MODEL', id: '12312-132123-123123-132132' }
      objectStore.validateGetObjectById(validQuery)
        .then((isValid) => {
          expect(isValid).to.be.true
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    })

    it('should throw errors when request is invalid', () => {
      // Invalid Query 1
      let invalidQuery1 = {}
      objectStore.validateGetObjectById(invalidQuery1)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 2
      let invalidQuery2 = { table: 'TEST_MODEL' }
      objectStore.validateGetObjectById(invalidQuery2)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 3
      let invalidQuery3 = { table: 'TEST_MODEL', id: undefined }
      objectStore.validateGetObjectById(invalidQuery3)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })

      // Invalid Query 4
      let invalidQuery4 = { id: '13123-123123-123123-123123' }
      objectStore.validateGetObjectById(invalidQuery4)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 5
      let invalidQuery5 = { table: 'invalid_model', id: '23424-24234-24234-234234' }
      objectStore.validateGetObjectById(invalidQuery5)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'table not found!', status: 'error' })
        })

      // Invalid Query 6
      let invalidQuery6 = { table: 'TEST_MODEL', id: 1233 }
      objectStore.validateGetObjectById(invalidQuery6)
        .then((data) => {})
        .catch((error) => {
          expect(error).to.eql({ msg: 'Id should be of type string!', status: 'error' })
        })
    })
  })
})

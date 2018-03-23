/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

const _ = require('lodash')
let Joi = require('joi')
/**
     * Which is used schema validation any child schema can overide.
     */
class Model {
  constructor (modelSchema, apiSchema) {
    /**
     * @property {Object}  - Model schema object by default it's empty, Child class should define the strucutre of modelSchema object.
     */
    this.modelSchema = modelSchema

    /**
     * @property {Object}  - Api schema object by default it's empty, Child class should define the strucutre of apiSchema object.
     */
    this.apiSchema = apiSchema
  }
  /**
     * It validates the object based on the respective schema
     * @param  {Object} object - The object which is need to be validate.
     * @param  {Object} schema - Defined schema which defines the structure or format of object.
     * @return {object}        - Example: 1) Success Validation: {isValid:true, object:{}}
     *                                2) Failure validation: {isValid:false, error:"string", object:{}}
     */
  validate (object = {}, schema = {}) {
    let validation = Joi.validate(object, schema, {
      abortEarly: true
    })
    if (validation.error != null) {
      let messages = []
      _.forEach(validation.error.details, (error, index) => {
        messages.push({
          field: error.path[0],
          description: error.message
        })
      })
      return {
        error: messages,
        isValid: false,
        object: object
      }
    }
    return {
      isValid: true,
      object: object
    }
  }

  /**
   * Which is used to get the modelSubSchema
   * @param {string} property - Name of property, Using this property we can get the modelSubschema object from the modelSchema
   */
  modelSubSchema (property) {
    return Joi.reach(this.modelSchema, property)
  }

  /**
   * Which is used to get the apiSubSchema.
   * @param {string} property - Name of the property, Using this we can get the apiSubschema object from the apiSchema
   */
  apiSubSchema (property) {
    return Joi.reach(this.apiSchema, property)
  }
}
module.exports = Model

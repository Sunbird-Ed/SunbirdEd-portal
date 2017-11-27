let BaseModel = require('./BaseModel.js')
let Joi = require('joi')

/**
 * Which is used to validate the Metrics object.
 */
class MetricsModel extends BaseModel {
  constructor () {
    super()
    /**
     * @property {} modelSchema - Defines the structure of model object.
     */
    this.modelSchema = Joi.object().keys({
      id: Joi.string().required(),
      userid: Joi.string().required(),
      announcementid: Joi.string().required(),
      activity: Joi.string().required(),
      channel: Joi.string(),
      createddate: Joi.string().required()
    })
    /**
     * @property {} apiSchema - Defines the structure of api request object.
     * @type {[type]}
     */
    this.apiSchema = Joi.object().keys({
      request: Joi.object().keys({
        userId: Joi.string().required(),
        announcementId: Joi.string().required(),
        channel: Joi.string().required()
      }).required()
    }), {
      abortEarly: false
    }
  }
    /**
     * Which is used to validate the api request object structure based on the `this.apiSchema`
     * @param  {object} obj - request object
     * @return {object}
     */
  validateApi (obj) {
    return this.validate(obj, this.apiSchema)
  }
    /**
     * Which is used to validate the model object structure based on the `this.modelSchma`
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
  validateModel (obj) {
    return this.validate(obj, this.modelSchema)
  }

  /**
   * Which is used to get the model subschema
   * @param  {string} key
   */
  getModelSubSchema (property) {
    return this.ModelSubSchema(property)
  }

  /**
   * Which is used to get the api subschema
   * @param  {string} key
   */
  getApiSubSchema (property) {
    return this.ApiSubSchema(property)
  }
}
module.exports = new MetricsModel()

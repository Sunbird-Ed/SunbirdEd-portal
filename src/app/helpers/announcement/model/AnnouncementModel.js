/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

let BaseModel = require('./BaseModel.js')
let Joi = require('joi')
/**
 * Modelschema which is used to validate the model request object
 */
let modelSchema = Joi.object().keys({
  id: Joi.string().required(),
  userid: Joi.string().required(), // part of primary key
  sourceid: Joi.string().required(), // part of primary key
  createddate: Joi.string().required(), // part of primary key
  details: Joi.object().min(1), // any key/value with string
  links: Joi.array().items(Joi.string()),
  attachments: Joi.array().max(20).items(Joi.string()),
  target: Joi.object().min(1).required(), // TODO: add validation for target format
  status: Joi.string(),
  sentcount: Joi.number(),
  priority: Joi.string(),
  expiry: Joi.string(),
  updateddate: Joi.string()
})
/**
 * Apischema object which is used to validate the api request object
 */
let apiSchema = Joi.object().keys({
  request: Joi.object().keys({
    sourceId: Joi.string().required(),
    title: Joi.string().required(),
    from: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().min(0).max(1200).allow('').optional(),
    target: Joi.object().min(1).required(),
    links: Joi.array().items(Joi.string()),
    attachments: Joi.array().max(20).items(Joi.object().keys({
      name: Joi.string().required(),
      mimetype: Joi.string().required(),
      size: Joi.string().required(),
      link: Joi.string().required()
    }))
  }).required()
})

/**
 * Announcement create model validation
 * @extends BaseModel
 */
class AnnouncementModel extends BaseModel {
  constructor (modelSchema = {}, apiSchema = {}) {
    super(modelSchema, apiSchema)

    this.table = 'announcement'
    /**
     * Defined schema which is used to validate the model object structure.
     */
    this.modelSchema = modelSchema
    /**
     * Defined schema which is used to validate the api request object structure.
     */
    this.apiSchema = apiSchema
  }
  /**
   * Which is used to validate the api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateApi (obj) {
    return this.validate(obj, this.apiSchema)
  }
  /**
   * Which is used to validat the model object.
   * @param  {object} obj - Model request object.
   * @return {object}
   */
  validateModel (obj) {
    return this.validate(obj, this.modelSchema)
  }

  /**
   * Which is used to get the model subschema
   * @param  {string} key
   */
  getModelSubSchema (property) {
    return this.modelSubSchema(property)
  }

  /**
   * Which is used to get the api subschema
   * @param  {string} key
   */
  getApiSubSchema (property) {
    return this.apiSubSchema(property)
  }
}
module.exports = new AnnouncementModel(modelSchema, apiSchema)

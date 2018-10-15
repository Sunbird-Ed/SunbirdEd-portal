/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let BaseModel = require('./BaseModel.js')
let Joi = require('joi')
/**
 * Modelschema which is used to validate the model request object
 */
let modelSchema = Joi.object().keys({
  id: Joi.number(),
  author: Joi.object(),
  body: Joi.string().required(),
  title: Joi.string().required(),
  createdDate: Joi.string(),
  repliesCount: Joi.number().min(0),
  voteCount: Joi.number().min(0),
  read: Joi.boolean(),
  posters: Joi.array().items(Joi.object()),
  replies: Joi.array().items(Joi.object()),
  actions: Joi.object(),
  descId: Joi.number(),
  archived: Joi.boolean(),
  locked: Joi.boolean(),
  config: Joi.object()
})
/**
 * Apischema object which is used to validate the api request object
 */
let apiSchema = Joi.object().keys({
  request: Joi.object().keys({
    title: Joi.string().required(),
    contextType: Joi.string().required(),
    contextId: Joi.string().required(),
    body: Joi.string().min(15).max(1200).required(),
    type: Joi.string().required(),
    config: Joi.object().required()
  }).required()
})
/*
 * Apischema object which is used to validate the edit thread api request object
 */
let editThreadApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().min(15).max(1200).required(),
    threadId: Joi.string().required(),
    descId: Joi.string().required()
  }).required()
})

/*
 * Apischema object which is used to validate the list thread api request object
 */
let listThreadApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    contextId: Joi.string().required(),
    type: Joi.string().required(),
    keyword: Joi.string()
  }).required()
})

/**
 * Announcement create model validation
 * @extends BaseModel
 */
class ThreadModel extends BaseModel {
  constructor (modelSchema = {}, apiSchema = {}) {
    super(modelSchema, apiSchema)

    /**
     * Defined schema which is used to validate the model object structure.
     */
    this.modelSchema = modelSchema
    /**
     * Defined schemas which is used to validate the api request object structure.
     */
    this.apiSchema = apiSchema

    this.editThreadApiSchema = editThreadApiSchema

    this.listThreadApiSchema = listThreadApiSchema
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
   * Which is used to validate the edit api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateEditThreadApi (obj) {
    return this.validate(obj, this.editThreadApiSchema)
  }

  /**
   * Which is used to validate the list api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateListThreadApi (obj) {
    return this.validate(obj, this.listThreadApiSchema)
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
module.exports = new ThreadModel(modelSchema, apiSchema)

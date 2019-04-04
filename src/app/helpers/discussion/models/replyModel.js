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
  createdDate: Joi.string(),
  read: Joi.boolean(),
  actions: Joi.object(),
  acceptedAnswer: Joi.boolean()
})
/**
 * Apischema object which is used to validate the reply api request object
 */
let replyThreadApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    threadId: Joi.number().required(),
    body: Joi.string().min(15).max(1200).required(),
    replyPostNumber:Joi.number()
  }).required()
})
/*
 * Apischema object which is used to validate the edit thread api request object
 */
let editReplyApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    body: Joi.string().min(15).max(1200).required(),
    postId: Joi.string().required()
  }).required()
})
/*
 * Apischema object which is used to validate the edit thread api request object
 */
let markAnswerApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    postId: Joi.string().required(),
    undo: Joi.boolean()
  }).required()
})

/**
 * Announcement create model validation
 * @extends BaseModel
 */
class ReplyModel extends BaseModel {
  constructor (modelSchema = {}, apiSchema = {}) {
    super(modelSchema, apiSchema)

    /**
     * Defined schema which is used to validate the model object structure.
     */
    this.modelSchema = modelSchema
    /**
     * Defined schemas which is used to validate the api request object structure.
     */
    this.replyThreadApiSchema = replyThreadApiSchema

    this.editReplyApiSchema = editReplyApiSchema
    this.markAnswerApiSchema = markAnswerApiSchema
  }
  /**
   * Which is used to validate the api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validatereplyThreadApi (obj) {
    return this.validate(obj, this.replyThreadApiSchema)
  }

  /**
   * Which is used to validate the edit api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateeditReplyApi (obj) {
    return this.validate(obj, this.editReplyApiSchema)
  }

  /**
   * Which is used to validate the mark answer api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validatemarkAnswerApi (obj) {
    return this.validate(obj, this.markAnswerApiSchema)
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
module.exports = new ReplyModel(modelSchema, replyThreadApiSchema)

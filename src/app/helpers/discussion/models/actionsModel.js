/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let BaseModel = require('./BaseModel.js')
let Joi = require('joi')
/**
 * Modelschema which is used to validate the model request object
 */
let modelSchema = Joi.object().keys({})

/*
 * Apischema object which is used to validate the archive thread api request object
 */
let archiveThreadApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    threadId: Joi.string().required()
  }).required()
})

/*
 * Apischema object which is used to validate the lock thread api request object
 */
let lockThreadApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    threadId: Joi.string().required()
  }).required()
})

/*
 * Apischema object which is used to validate the vote api request object
 */
let voteApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    postId: Joi.string().required(),
    value: Joi.string().required(),
    undo: Joi.boolean()
  }).required()
})

/*
* Apischema object which is used to validate the flag api request object
*/
let flagApiSchema = Joi.object().keys({
  request: Joi.object().keys({
    postId: Joi.string().required(),
    undo: Joi.boolean()
  }).required()
})

/**
 * Announcement create model validation
 * @extends BaseModel
 */
class ActionsModel extends BaseModel {
  constructor (modelSchema = {}, apiSchema = {}) {
    super(modelSchema, apiSchema)

    /**
     * Defined schema which is used to validate the model object structure.
     */
    this.modelSchema = modelSchema
    /**
     * Defined schemas which is used to validate the api request object structure.
     */
    this.archiveThreadApiSchema = archiveThreadApiSchema
    this.lockThreadApiSchema = lockThreadApiSchema
    this.voteApiSchema = voteApiSchema
    this.flagApiSchema = flagApiSchema
  }
  /**
   * Which is used to validate the archive thread api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateArchiveThreadApi (obj) {
    return this.validate(obj, this.archiveThreadApiSchema)
  }

  /**
   * Which is used to validate the lock thread api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateLockThreadApi (obj) {
    return this.validate(obj, this.lockThreadApiSchema)
  }

  /**
   * Which is used to validate the vote api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateVoteApi (obj) {
    return this.validate(obj, this.voteApiSchema)
  }

  /**
   * Which is used to validate the flag api request object.
   * @param  {object} obj - Request object
   * @return {object}
   */
  validateFlagApi (obj) {
    return this.validate(obj, this.flagApiSchema)
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
module.exports = new ActionsModel(modelSchema)

/**
 * @authro Manjunath Davanam <manjunathd@ilimi.in>
 */

let Joi = require('joi')
const _ = require('lodash')

class NotificationTarget {
  /**
     * Create a notifcation target object
     * Callers of the constructor can invoke as follows:
     *
     * let target = new NotificationTarget({geo:{ids:['432-5435-6566']}})
     */
  constructor ({
    target
  } = {}) {
    /**
     * @property {object} target - Notification receiver object, Example: {geo:{ids:['432-5435-6566']}}.
     */
    this.target = target

    /**
     *  @property {function} target      schema - Which is used to validat the target object structure.
     */
    this.schema = Joi.object().min(1)
  }

  /**
     * Which is used to validate the schema
     * @return {object} - It returns the wheather schema structure is valid or not.
     * Examples:
     * 1) ErrorCase: {error:"target must be object", isValid:'false', target: this}
     * 2) SuccessCase: {isValid:true, target: this}
     */
  validate () {
    let validation = Joi.validate(this, this.schema, {
      abortEarly: false
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
        target: this
      }
    }
    return {
      isValid: true,
      target: this
    }
  }

  /**
     * Which used to get the target identifiers list.
     * @return {array} - List of target identifiers.
     */
  getIds () {
    var targetIds = []
    if (this.target) {
      _.forIn(this.target, (value, key) => {
        if (_.isObject(value)) {
          _.forEach(value.ids, (v, k) => {
            targetIds.push(v)
          })
        }
      })
    }
    return targetIds
  }
}
module.exports = NotificationTarget

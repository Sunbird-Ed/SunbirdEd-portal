let Joi = require('joi')
const _ = require('lodash')

class notificationTarget {
  constructor (target) {
    this.target = target
  }
  /**
   * Used to get the target object
   * @return {object} target object
   */
  get () {
    let status = this.__validate(this.target)
    return status
  }
  /**
   * Used to validate the target object structure
   * @param  {object} target  Example: {geo:{ids:["343564-534534-643","53634-63424-324"]},org:{ids:["443255-5436"]}}
   * @return {object}
   */
  __validate (target) {
    let validation = Joi.validate(target, Joi.object().min(1), {
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
        target: target
      }
    }
    return {
      isValid: true,
      target: target
    }
  }
}
module.exports = notificationTarget

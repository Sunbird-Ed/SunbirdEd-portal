let Joi = require('joi')
const _ = require('lodash')
let _defaultDateFormat = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo')

class notificationPayload {
  constructor (payload) {
    this.msgid = payload.msgid
    this.title = payload.title
    this.msg = payload.msg
    this.icon = payload.icon
    this.time = payload.time || _defaultDateFormat
    this.validity = payload.validity
    this.actionid = payload.actionid
    this.actiondata = payload.actiondata
    this.dispbehavior = payload.dispbehavior
  }

    /**
     * Used to retrive the payload object
     * If the payload is valid structure then it will returns the payload object else it will return the null
     */

  get () {
    let payload = this.__create()
    let status = this.__validate(payload)
    return status
  }

  __create () {
    let payloadObj = new Object()
    payloadObj.msgid = this.msgid
    payloadObj.title = this.title
    payloadObj.msg = this.msg
    payloadObj.icon = this.icon
    payloadObj.time = this.time
    payloadObj.validity = this.validity
    payloadObj.actionid = this.actionid
    payloadObj.actiondata = this.actiondata
    payloadObj.dispbehavior = this.dispbehavior
    return payloadObj
  }
    /**
     * Used to validate the playload strucutre
     * @return {boolean} If the playload is in valid structure then it will returns the true else false
     */
  __validate (payload) {
    let validation = Joi.validate(payload, Joi.object().keys({
      'msgid': Joi.string().required(),
      'title': Joi.string().required(),
      'msg': Joi.string().empty(''),
      'icon': Joi.string().empty(''),
      'time': Joi.string().required(),
      'validity': Joi.number(),
      'actionid': Joi.number(),
      'actiondata': Joi.string().empty(''),
      'dispbehavior': Joi.string().empty('')
    }), {
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
        payload: payload
      }
    }
    return {
      isValid: true,
      payload: payload
    }
  }
}
module.exports = notificationPayload

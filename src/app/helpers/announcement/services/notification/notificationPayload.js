let Joi = require('joi')
const _ = require('lodash')
let dateFormat = require('dateformat')

/**
 * @type {timestamp} DEFAULT_DATE_FORMAT - Date format as follows: `yyyy-mm-dd HH:MM:ss:lo`
 */
const DEFAULT_DATE_FORMAT = dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:sso", true)

/**
 * Class representes the payload for the notification service
 * Callers of the constructor can invoke as follows:

 * let payload = new NotificationPayload({msgid:"324-545-54",title:"Test", msg:"About Notification", icon:"", validity:"600", actionid:"4435",actiondata:"Some info",disbehavior:"opt"})
 */
class NotificationPayload {
  constructor ({msgid, title, msg, icon, time, validity, actionid, actiondata, dispbehavior } = {}) {
    /**
     * @property {string} msgid - a unqiue id for the notification message.
     */
    this.msgid = msgid

    /**
     * @property {string} title - the title to be displayed on a notification.
     */
    this.title = title

    /**
     * @property {string} msg - the message in the body of the notification.
     */
    this.msg = msg

    /**
     * @property {string} icon - a filepath? for an icon to display in the notification.
     */
    this.icon = icon

    /**
     * @property {timestamp} time - the time when to show the notification, format is: <format>
     */
    this.time = time || DEFAULT_DATE_FORMAT

    /**
     * @property {timestamp} validity - the time till when the notification is valid. null
     *                                  if the notification never expires.
     */
    this.validity = validity

    /**
     * @property {string} actionid - the id of the action to perform when clicking on this
     *                               notification.
     */
    this.actionid = actionid

    /**
     * @property {string} actiondata - data to pass to the action handler.
     */
    this.actiondata = actiondata

    /**
     * @property {string} disbehavior - the behaviour when displaying, either "<option>" or "<opt>".
     */
    this.dispbehavior = dispbehavior

    /**
     *                schema - Schema validation, Which is used to validate the payload object strucutre.
     */
    this.schema = Joi.object().keys({
      'msgid': Joi.string().required(),
      'title': Joi.string().required(),
      'msg': Joi.string().empty(''),
      'icon': Joi.string().empty(''),
      'time': Joi.string().required(),
      'validity': Joi.number(),
      'actionid': Joi.number(),
      'actiondata': Joi.object().keys({
            announcementId: Joi.string().required()
        }).required(),
      'dispbehavior': Joi.string().empty('')
    }).unknown()
  }

  /**
     * Used to validate the playload strucutre
     * @return {boolean} If the playload is in valid structure then it will returns the true else false
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
        payload: this
      }
    }
    return {
      isValid: true,
      payload: this
    }
  }

  getPayload() {
    return {
        "msgid": this.msgid,
        "title": this.title,
        "msg": this.msg,
        "time": this.time,
        "validity": this.validity,
        "actionid": this.actionid,
        "actiondata": this.actiondata,
        "icon": this.icon,
        "dispbehavior": this.dispbehavior
    }
  }
}
module.exports = NotificationPayload

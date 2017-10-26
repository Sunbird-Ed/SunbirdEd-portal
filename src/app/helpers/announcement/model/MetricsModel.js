let Joi = require('joi')

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  userid: Joi.string().required(),
  announcementid: Joi.string().required(),
  activity: Joi.string().required(),
  channel: Joi.string(),
  createddate: Joi.string().required()
})

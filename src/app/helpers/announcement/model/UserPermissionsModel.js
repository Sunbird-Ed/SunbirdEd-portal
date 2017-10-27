let Joi = require('joi')

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  userid: Joi.string().required(),
  rootorgid: Joi.string().required(),
  permissions: Joi.object().pattern(/\w/, Joi.string().required()),
  status: Joi.string(),
  createddate: Joi.string()
})

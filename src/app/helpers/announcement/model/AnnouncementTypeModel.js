let Joi = require('joi')

module.exports = Joi.object().keys({
  rootorgid: Joi.string().required(),
  sourceid: Joi.string().required(),
  createddate: Joi.string().required(),
  typename: Joi.string().required(),
  status: Joi.string()
})

let Joi = require('joi')

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  file: Joi.string().required(),
  filename: Joi.string().required(),
  mimetype: Joi.string().required(),
  createddate: Joi.string().required(),
  status: Joi.string(),
  createdby: Joi.string()
})

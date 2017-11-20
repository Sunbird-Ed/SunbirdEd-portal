let Joi = require('joi')

module.exports = Joi.object().keys({
  id: Joi.string().required(),
  userid: Joi.string().required(), // part of primary key
  sourceid: Joi.string().required(), // part of primary key
  createddate: Joi.string().required(), // part of primary key
  details: Joi.object().min(1), // any key/value with string
  links: Joi.array().items(Joi.string()),
  attachments: Joi.array().items(Joi.string()),
  target: Joi.object().min(1).required(), // TODO: add validation for target format
  status: Joi.string(),
  sentcount: Joi.number(),
  priority: Joi.string(),
  expiry: Joi.string(),
  updateddate: Joi.string()
})

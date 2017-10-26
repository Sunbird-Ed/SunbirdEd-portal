let Joi = require('joi')

module.exports = Joi.object().keys({
	id: Joi.string().required(),		
	sourceid: Joi.string().required(),
	createddate: Joi.string().required(),
	typename: Joi.string().required(), 	
	status: Joi.string()	
})